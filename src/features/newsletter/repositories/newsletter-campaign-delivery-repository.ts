import "server-only";

import type {
  NewsletterCampaignDelivery,
  NewsletterSubscriber,
} from "@/features/newsletter/types/newsletter";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DeliveryRow = {
  id: string;
  campaign_id: string;
  subscriber_id: string;
  email: string;
  status: NewsletterCampaignDelivery["status"];
  provider_message_id: string | null;
  attempts: number;
  last_error: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapDelivery(row: DeliveryRow): NewsletterCampaignDelivery {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    subscriberId: row.subscriber_id,
    email: row.email,
    status: row.status,
    providerMessageId: row.provider_message_id,
    attempts: row.attempts,
    lastError: row.last_error,
    sentAt: row.sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getClient() {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase administrativo não está configurado.");
  return client;
}

export async function ensureCampaignDeliveries(
  campaignId: string,
  subscribers: NewsletterSubscriber[],
): Promise<void> {
  if (subscribers.length === 0) return;

  const rows = subscribers.map((subscriber) => ({
    campaign_id: campaignId,
    subscriber_id: subscriber.id,
    email: subscriber.email,
    status: "pending" as const,
  }));
  const { error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .upsert(rows, {
      onConflict: "campaign_id,subscriber_id",
      ignoreDuplicates: true,
    });
  if (error) throw new Error(`Não foi possível preparar as entregas: ${error.message}`);
}

export async function listCampaignDeliveries(
  campaignId: string,
): Promise<NewsletterCampaignDelivery[]> {
  const { data, error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Não foi possível consultar as entregas: ${error.message}`);
  return data.map(mapDelivery);
}

export async function listRetryableCampaignDeliveries(
  campaignId: string,
): Promise<NewsletterCampaignDelivery[]> {
  const { data, error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .select("*")
    .eq("campaign_id", campaignId)
    .in("status", ["pending", "failed"])
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Não foi possível consultar entregas pendentes: ${error.message}`);
  return data.map(mapDelivery);
}

export async function claimCampaignDelivery(
  delivery: NewsletterCampaignDelivery,
): Promise<boolean> {
  if (delivery.status !== "pending" && delivery.status !== "failed") return false;
  const { data, error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .update({
      status: "sending",
      attempts: delivery.attempts + 1,
      last_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", delivery.id)
    .eq("status", delivery.status)
    .eq("updated_at", delivery.updatedAt)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Não foi possível iniciar a entrega: ${error.message}`);
  return Boolean(data);
}

export async function markCampaignDeliverySent(
  id: string,
  providerMessageId: string | null,
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .update({
      status: "sent",
      provider_message_id: providerMessageId,
      last_error: null,
      sent_at: now,
      updated_at: now,
    })
    .eq("id", id);
  if (error) throw new Error(`Não foi possível concluir a entrega: ${error.message}`);
}

export async function markCampaignDeliveryFailed(
  id: string,
  errorMessage: string,
): Promise<void> {
  const { error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .update({
      status: "failed",
      last_error: errorMessage.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.error("[newsletter] failed to persist delivery error", { deliveryId: id });
  }
}

export async function getCampaignDeliveryStats(): Promise<
  Map<string, { total: number; sent: number; failed: number }>
> {
  const { data, error } = await getClient()
    .from("newsletter_campaign_deliveries")
    .select("campaign_id,status");
  if (error) throw new Error(`Não foi possível resumir as entregas: ${error.message}`);

  const stats = new Map<string, { total: number; sent: number; failed: number }>();
  for (const delivery of data) {
    const current = stats.get(delivery.campaign_id) ?? {
      total: 0,
      sent: 0,
      failed: 0,
    };
    current.total += 1;
    if (delivery.status === "sent") current.sent += 1;
    if (delivery.status === "failed") current.failed += 1;
    stats.set(delivery.campaign_id, current);
  }
  return stats;
}
