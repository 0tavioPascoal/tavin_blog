import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { ArticleDetail, ArticleMutationInput, ArticleSummary } from "@/features/posts/types/post";
import { mapArticleRowToDetail, mapArticleRowToSummary } from "@/features/posts/utils/mappers";

type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];

function toInsert(input: ArticleMutationInput): ArticleInsert {
  const now = new Date().toISOString();

  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    published_at: input.status === "published" ? now : null,
    updated_at: now,
    status: input.status,
    tags: input.tags,
    reading_time_minutes: input.readingTimeMinutes,
    is_featured: input.isFeatured,
  };
}

function toUpdate(input: ArticleMutationInput, currentPublishedAt: string | null): ArticleUpdate {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    published_at: input.status === "published" ? currentPublishedAt ?? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    status: input.status,
    tags: input.tags,
    reading_time_minutes: input.readingTimeMinutes,
    is_featured: input.isFeatured,
  };
}

export async function listPublishedArticles(): Promise<ArticleSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os artigos: ${error.message}`);
  }

  return data.map(mapArticleRowToSummary);
}

export async function listFeaturedArticles(limit = 3): Promise<ArticleSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Não foi possível carregar os destaques: ${error.message}`);
  }

  return data.map(mapArticleRowToSummary);
}

export async function listAllArticlesForAdmin(): Promise<ArticleSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar posts do admin: ${error.message}`);
  }

  return data.map(mapArticleRowToSummary);
}

export async function getPublishedArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar o artigo: ${error.message}`);
  }

  return data ? mapArticleRowToDetail(data) : null;
}

export async function getArticleByIdForAdmin(id: string): Promise<ArticleDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar o post: ${error.message}`);
  }

  return data ? mapArticleRowToDetail(data) : null;
}

export async function createArticle(input: ArticleMutationInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(toInsert(input))
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar o post: ${error.message}`);
  }

  return data.id;
}

export async function updateArticle(id: string, input: ArticleMutationInput): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const current = await getArticleByIdForAdmin(id);
  const { error } = await supabase
    .from("articles")
    .update(toUpdate(input, current?.publishedAt ?? null))
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar o post: ${error.message}`);
  }
}
