import "server-only";

import {
  claimCampaignDelivery,
  ensureCampaignDeliveries,
  listCampaignDeliveries,
  listRetryableCampaignDeliveries,
  markCampaignDeliveryFailed,
  markCampaignDeliverySent,
} from "@/features/newsletter/repositories/newsletter-campaign-delivery-repository";
import {
  claimCampaign,
  getOrCreateCampaign,
  markCampaignFailed,
  markCampaignSending,
  markCampaignSent,
} from "@/features/newsletter/repositories/newsletter-campaign-repository";
import { listSubscribedNewsletterSubscribers } from "@/features/newsletter/repositories/newsletter-subscriber-repository";
import { GmailSmtpProvider } from "@/features/newsletter/services/gmail-smtp-provider";
import { createNewsletterUnsubscribeUrl } from "@/features/newsletter/services/newsletter-unsubscribe-token";
import { createArticlePublishedEmail } from "@/features/newsletter/templates/article-published-email";
import type {
  ArticleCampaignResult,
  NewsletterCampaignDelivery,
  NewsletterEmailProvider,
} from "@/features/newsletter/types/newsletter";
import { getArticleByIdForAdmin } from "@/features/posts/repositories/posts-repository";
import { getNewsletterDeliveryConfig } from "@/lib/env";

function sanitizeError(error: unknown): string {
  const fallback = "Falha desconhecida ao enviar newsletter.";
  if (!(error instanceof Error)) return fallback;

  return error.message
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email removido]")
    .slice(0, 500) || fallback;
}

async function sendDelivery(
  delivery: NewsletterCampaignDelivery,
  provider: NewsletterEmailProvider,
  article: NonNullable<Awaited<ReturnType<typeof getArticleByIdForAdmin>>>,
): Promise<void> {
  const claimed = await claimCampaignDelivery(delivery);
  if (!claimed) return;

  try {
    const unsubscribeUrl = createNewsletterUnsubscribeUrl(delivery.subscriberId);
    const email = createArticlePublishedEmail(article, unsubscribeUrl);
    const result = await provider.send({
      to: delivery.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    await markCampaignDeliverySent(delivery.id, result.providerMessageId);
  } catch (error) {
    await markCampaignDeliveryFailed(delivery.id, sanitizeError(error));
    console.error("[newsletter] delivery failed", {
      articleId: article.id,
      deliveryId: delivery.id,
      status: "failed",
    });
  }
}

export async function sendArticlePublishedCampaign(
  articleId: string,
): Promise<ArticleCampaignResult> {
  let campaignId: string | null = null;

  try {
    const campaign = await getOrCreateCampaign(articleId);
    campaignId = campaign.id;

    if (campaign.status === "sent") return { status: "already-sent" };
    if (campaign.status === "sending") return { status: "already-sent" };

    const claimed = await claimCampaign(campaign);
    if (!claimed) return { status: "already-sent" };

    const article = await getArticleByIdForAdmin(articleId);
    if (!article || article.status !== "published") {
      throw new Error("Artigo publicado não encontrado para criar a campanha.");
    }

    const deliveryConfig = getNewsletterDeliveryConfig();
    if (!deliveryConfig) {
      throw new Error("A configuração de entrega da newsletter está incompleta.");
    }

    const subscribers = await listSubscribedNewsletterSubscribers();
    if (
      subscribers.length >
      deliveryConfig.NEWSLETTER_MAX_RECIPIENTS_PER_CAMPAIGN
    ) {
      throw new Error(
        `A campanha possui ${subscribers.length} destinatários e excede o limite de segurança configurado.`,
      );
    }

    await ensureCampaignDeliveries(campaign.id, subscribers);
    await markCampaignSending(campaign.id);

    const provider = new GmailSmtpProvider();
    const eligibleSubscriberIds = new Set(
      subscribers.map((subscriber) => subscriber.id),
    );
    const deliveries = (await listRetryableCampaignDeliveries(campaign.id)).filter(
      (delivery) => eligibleSubscriberIds.has(delivery.subscriberId),
    );
    for (const delivery of deliveries) {
      await sendDelivery(delivery, provider, article);
    }

    const finalDeliveries = await listCampaignDeliveries(campaign.id);
    const relevantDeliveries = finalDeliveries.filter(
      (delivery) =>
        delivery.status === "sent" ||
        eligibleSubscriberIds.has(delivery.subscriberId),
    );
    const failedCount = relevantDeliveries.filter(
      (delivery) => delivery.status !== "sent",
    ).length;
    if (failedCount > 0) {
      const message = `${failedCount} de ${relevantDeliveries.length} destinatários falharam.`;
      await markCampaignFailed(campaign.id, message);
      return { status: "failed", message };
    }

    await markCampaignSent(campaign.id);
    return { status: "sent" };
  } catch (error) {
    const message = sanitizeError(error);
    if (campaignId) await markCampaignFailed(campaignId, message);
    console.error("[newsletter] campaign failed", {
      articleId,
      campaignId,
      status: "failed",
    });
    return { status: "failed", message };
  }
}
