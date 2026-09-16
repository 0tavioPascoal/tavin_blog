import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ArticleEmailCampaignStatus } from "@/types/supabase";
import type { ArticleEmailCampaign } from "@/features/newsletter/types/newsletter";

function mapCampaign(row: {
  id: string; post_id: string; status: ArticleEmailCampaignStatus;
  created_at: string; updated_at: string; sent_at: string | null;
  last_error: string | null;
}): ArticleEmailCampaign {
  return {
    id: row.id, postId: row.post_id, status: row.status,
    createdAt: row.created_at, updatedAt: row.updated_at,
    sentAt: row.sent_at, lastError: row.last_error,
  };
}

function getClient() {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase administrativo não está configurado.");
  return client;
}

export async function findCampaignByPostId(postId: string) {
  const { data, error } = await getClient().from("article_email_campaigns")
    .select("*").eq("post_id", postId).maybeSingle();
  if (error) throw new Error(`Não foi possível consultar a campanha: ${error.message}`);
  return data ? mapCampaign(data) : null;
}

export async function getOrCreateCampaign(postId: string) {
  const existing = await findCampaignByPostId(postId);
  if (existing) return existing;
  const { data, error } = await getClient().from("article_email_campaigns")
    .insert({ post_id: postId, status: "pending" }).select("*").single();
  if (error) {
    const raced = await findCampaignByPostId(postId);
    if (raced) return raced;
    throw new Error(`Não foi possível criar a campanha: ${error.message}`);
  }
  return mapCampaign(data);
}

export async function claimCampaign(campaign: ArticleEmailCampaign) {
  if (!(["pending", "failed"] as ArticleEmailCampaignStatus[]).includes(campaign.status)) return false;
  const claimedAt = new Date().toISOString();
  const { data, error } = await getClient().from("article_email_campaigns")
    .update({ last_error: null, updated_at: claimedAt })
    .eq("id", campaign.id)
    .eq("status", campaign.status)
    .eq("updated_at", campaign.updatedAt)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Não foi possível iniciar a campanha: ${error.message}`);
  return Boolean(data);
}

export async function markCampaignSending(id: string) {
  const { error } = await getClient().from("article_email_campaigns")
    .update({ status: "sending", last_error: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Não foi possível iniciar a campanha: ${error.message}`);
}

export async function markCampaignSent(id: string) {
  const now = new Date().toISOString();
  const { error } = await getClient().from("article_email_campaigns")
    .update({ status: "sent", sent_at: now, last_error: null, updated_at: now }).eq("id", id);
  if (error) throw new Error(`Não foi possível concluir a campanha: ${error.message}`);
}

export async function markCampaignFailed(id: string, errorMessage: string) {
  const { error } = await getClient().from("article_email_campaigns")
    .update({ status: "failed", last_error: errorMessage.slice(0, 2000), updated_at: new Date().toISOString() }).eq("id", id);
  if (error) console.error("[newsletter] failed to persist campaign error", { campaignId: id });
}

export async function listArticleEmailCampaigns() {
  const { data, error } = await getClient().from("article_email_campaigns")
    .select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Não foi possível listar campanhas: ${error.message}`);
  return data.map(mapCampaign);
}
