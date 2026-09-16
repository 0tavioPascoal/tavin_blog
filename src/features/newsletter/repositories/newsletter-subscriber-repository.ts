import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { NewsletterSubscriberStatus } from "@/types/supabase";
import type { NewsletterSubscriber } from "@/features/newsletter/types/newsletter";

function mapSubscriber(row: {
  id: string; email: string; status: NewsletterSubscriberStatus;
  source: string | null;
  subscribed_at: string; unsubscribed_at: string | null;
  created_at: string; updated_at: string;
}): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    source: row.source,
    subscribedAt: row.subscribed_at,
    unsubscribedAt: row.unsubscribed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getClient() {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase administrativo não está configurado.");
  return client;
}

export async function findSubscriberByEmail(email: string) {
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw new Error(`Não foi possível consultar a inscrição: ${error.message}`);
  return data ? mapSubscriber(data) : null;
}

export async function createSubscriber(email: string, source: string) {
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .insert({ email, source, status: "subscribed" })
    .select("*")
    .single();
  if (error) {
    const existing = await findSubscriberByEmail(email);
    if (existing) return existing;
    throw new Error(`Não foi possível registrar a inscrição: ${error.message}`);
  }
  return mapSubscriber(data);
}

export async function reactivateSubscriber(id: string, source: string) {
  const now = new Date().toISOString();
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .update({
      status: "subscribed",
      source,
      subscribed_at: now,
      unsubscribed_at: null,
      updated_at: now,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(`Não foi possível reativar a inscrição: ${error.message}`);
  return mapSubscriber(data);
}

export async function updateSubscriberStatusByEmail(
  email: string,
  status: NewsletterSubscriberStatus,
) {
  const current = await findSubscriberByEmail(email.trim().toLowerCase());
  if (!current) return;
  if (current.status === "complained" && status !== "complained") return;
  if (current.status === "bounced" && status === "unsubscribed") return;

  const terminal = status !== "subscribed";
  const { error } = await getClient()
    .from("newsletter_subscribers")
    .update({
      status,
      unsubscribed_at: terminal ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.id);
  if (error) throw new Error(`Não foi possível atualizar o inscrito: ${error.message}`);
}

export async function listNewsletterSubscribers() {
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  if (error) throw new Error(`Não foi possível listar inscritos: ${error.message}`);
  return data.map(mapSubscriber);
}

export async function listSubscribedNewsletterSubscribers() {
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .select("*")
    .eq("status", "subscribed")
    .order("subscribed_at", { ascending: true });
  if (error) throw new Error(`Não foi possível listar inscritos ativos: ${error.message}`);
  return data.map(mapSubscriber);
}

export async function unsubscribeSubscriberById(id: string): Promise<boolean> {
  const now = new Date().toISOString();
  const { data, error } = await getClient()
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: now,
      updated_at: now,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Não foi possível cancelar a inscrição: ${error.message}`);
  return Boolean(data);
}
