import type {
  ArticleEmailCampaignStatus,
  NewsletterSubscriberStatus,
} from "@/types/supabase";

export type NewsletterSource = "article" | "articles-page" | "footer" | "header";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  status: NewsletterSubscriberStatus;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleEmailCampaign = {
  id: string;
  postId: string;
  status: ArticleEmailCampaignStatus;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  lastError: string | null;
};

export type NewsletterDeliveryStatus = "pending" | "sending" | "sent" | "failed";

export type NewsletterCampaignDelivery = {
  id: string;
  campaignId: string;
  subscriberId: string;
  email: string;
  status: NewsletterDeliveryStatus;
  providerMessageId: string | null;
  attempts: number;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type NewsletterSendResult = {
  providerMessageId: string | null;
};

export interface NewsletterEmailProvider {
  send(message: NewsletterEmailMessage): Promise<NewsletterSendResult>;
}

export type ArticleCampaignResult =
  | { status: "sent" }
  | { status: "already-sent" }
  | { status: "failed"; message: string };

export type NewsletterActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: { email?: string[] };
};
