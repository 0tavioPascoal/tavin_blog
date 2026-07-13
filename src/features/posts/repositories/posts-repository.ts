import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { CategorySummary } from "@/features/categories/types/category";
import { mapCategoryRowToSummary } from "@/features/categories/utils/mappers";
import type { ArticleDetail, ArticleMutationInput, ArticleSummary } from "@/features/posts/types/post";
import { mapArticleRowToDetail, mapArticleRowToSummary } from "@/features/posts/utils/mappers";
import type { TagSummary } from "@/features/tags/types/tag";
import { mapTagRowToSummary } from "@/features/tags/utils/mappers";
import type { Database } from "@/types/supabase";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ArticleSummaryRow = Omit<ArticleRow, "content_markdown">;
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
type ArticleTagInsert = Database["public"]["Tables"]["article_tags"]["Insert"];

type ArticleRelations = {
  categoriesById: Map<string, CategorySummary>;
  tagsByArticleId: Map<string, TagSummary[]>;
};

export type ArticleFilterResult = {
  articles: ArticleSummary[];
};

function toInsert(input: ArticleMutationInput): ArticleInsert {
  const now = new Date().toISOString();

  return {
    category_id: input.categoryId,
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    published_at: input.status === "published" ? now : null,
    updated_at: now,
    status: input.status,
    tags: [],
    reading_time_minutes: input.readingTimeMinutes,
    is_featured: input.isFeatured,
  };
}

function toUpdate(input: ArticleMutationInput, currentPublishedAt: string | null): ArticleUpdate {
  return {
    category_id: input.categoryId,
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    published_at: input.status === "published" ? currentPublishedAt ?? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    status: input.status,
    tags: [],
    reading_time_minutes: input.readingTimeMinutes,
    is_featured: input.isFeatured,
  };
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

async function loadArticleRelations(
  supabase: SupabaseClient,
  articles: Array<Pick<ArticleRow, "id" | "category_id">>,
  includeInactiveTaxonomy: boolean,
): Promise<ArticleRelations> {
  const articleIds = articles.map((article) => article.id);
  const categoryIds = uniqueStrings(
    articles
      .map((article) => article.category_id)
      .filter((categoryId): categoryId is string => Boolean(categoryId)),
  );

  const categoriesById = new Map<string, CategorySummary>();
  const tagsByArticleId = new Map<string, TagSummary[]>();

  if (categoryIds.length > 0) {
    let query = supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds);

    if (!includeInactiveTaxonomy) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Não foi possível carregar categorias dos artigos: ${error.message}`);
    }

    data.map(mapCategoryRowToSummary).forEach((category) => {
      categoriesById.set(category.id, category);
    });
  }

  if (articleIds.length === 0) {
    return { categoriesById, tagsByArticleId };
  }

  const { data: relationRows, error: relationError } = await supabase
    .from("article_tags")
    .select("*")
    .in("article_id", articleIds);

  if (relationError) {
    throw new Error(`Não foi possível carregar tags dos artigos: ${relationError.message}`);
  }

  const tagIds = uniqueStrings(relationRows.map((relation) => relation.tag_id));

  if (tagIds.length === 0) {
    return { categoriesById, tagsByArticleId };
  }

  let tagQuery = supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  if (!includeInactiveTaxonomy) {
    tagQuery = tagQuery.eq("is_active", true);
  }

  const { data: tagRows, error: tagError } = await tagQuery.order("name", { ascending: true });

  if (tagError) {
    throw new Error(`Não foi possível carregar tags: ${tagError.message}`);
  }

  const tagsById = new Map<string, TagSummary>();
  tagRows.map(mapTagRowToSummary).forEach((tag) => {
    tagsById.set(tag.id, tag);
  });

  relationRows.forEach((relation) => {
    const tag = tagsById.get(relation.tag_id);

    if (!tag) {
      return;
    }

    const currentTags = tagsByArticleId.get(relation.article_id) ?? [];
    tagsByArticleId.set(relation.article_id, [...currentTags, tag]);
  });

  return { categoriesById, tagsByArticleId };
}

async function hydrateArticleSummaries(
  supabase: SupabaseClient,
  articles: ArticleSummaryRow[],
  includeInactiveTaxonomy: boolean,
): Promise<ArticleSummary[]> {
  const relations = await loadArticleRelations(supabase, articles, includeInactiveTaxonomy);

  return articles.map((article) =>
    mapArticleRowToSummary(
      article,
      article.category_id ? relations.categoriesById.get(article.category_id) ?? null : null,
      relations.tagsByArticleId.get(article.id) ?? [],
    ),
  );
}

async function hydrateArticleDetail(
  supabase: SupabaseClient,
  article: ArticleRow,
  includeInactiveTaxonomy: boolean,
): Promise<ArticleDetail> {
  const relations = await loadArticleRelations(supabase, [article], includeInactiveTaxonomy);

  return mapArticleRowToDetail(
    article,
    article.category_id ? relations.categoriesById.get(article.category_id) ?? null : null,
    relations.tagsByArticleId.get(article.id) ?? [],
  );
}

async function replaceArticleTags(
  supabase: SupabaseClient,
  articleId: string,
  tagIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("article_tags")
    .delete()
    .eq("article_id", articleId);

  if (deleteError) {
    throw new Error(`Não foi possível atualizar tags do post: ${deleteError.message}`);
  }

  const uniqueTagIds = uniqueStrings(tagIds);

  if (uniqueTagIds.length === 0) {
    return;
  }

  const insertRows: ArticleTagInsert[] = uniqueTagIds.map((tagId) => ({
    article_id: articleId,
    tag_id: tagId,
  }));

  const { error: insertError } = await supabase
    .from("article_tags")
    .insert(insertRows);

  if (insertError) {
    throw new Error(`Não foi possível salvar tags do post: ${insertError.message}`);
  }
}

async function listPublishedArticlesUncached(): Promise<ArticleSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, category_id, title, slug, description, published_at, updated_at, status, tags, reading_time_minutes, is_featured")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os artigos: ${error.message}`);
  }

  return hydrateArticleSummaries(supabase, data, false);
}

export const listPublishedArticles = unstable_cache(listPublishedArticlesUncached, ["published-articles"], { tags: ["posts", "taxonomy"], revalidate: 3600 });

async function listFeaturedArticlesUncached(limit = 3): Promise<ArticleSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, category_id, title, slug, description, published_at, updated_at, status, tags, reading_time_minutes, is_featured")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Não foi possível carregar os destaques: ${error.message}`);
  }

  return hydrateArticleSummaries(supabase, data, false);
}

export const listFeaturedArticles = unstable_cache(listFeaturedArticlesUncached, ["featured-articles"], { tags: ["posts", "taxonomy"], revalidate: 3600 });

async function listPublishedArticlesByCategoryIdUncached(categoryId: string): Promise<ArticleSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, category_id, title, slug, description, published_at, updated_at, status, tags, reading_time_minutes, is_featured")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar artigos da categoria: ${error.message}`);
  }

  return hydrateArticleSummaries(supabase, data, false);
}

export const listPublishedArticlesByCategoryId = unstable_cache(listPublishedArticlesByCategoryIdUncached, ["articles-by-category"], { tags: ["posts", "taxonomy"], revalidate: 3600 });

async function listPublishedArticlesByTagIdUncached(tagId: string): Promise<ArticleSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data: relationRows, error: relationError } = await supabase
    .from("article_tags")
    .select("article_id, tag_id")
    .eq("tag_id", tagId);

  if (relationError) {
    throw new Error(`Não foi possível carregar relações da tag: ${relationError.message}`);
  }

  const articleIds = uniqueStrings(relationRows.map((relation) => relation.article_id));

  if (articleIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, category_id, title, slug, description, published_at, updated_at, status, tags, reading_time_minutes, is_featured")
    .eq("status", "published")
    .in("id", articleIds)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar artigos da tag: ${error.message}`);
  }

  return hydrateArticleSummaries(supabase, data, false);
}

export const listPublishedArticlesByTagId = unstable_cache(listPublishedArticlesByTagIdUncached, ["articles-by-tag"], { tags: ["posts", "taxonomy"], revalidate: 3600 });

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

  return hydrateArticleSummaries(supabase, data, true);
}

const getPublishedArticleBySlugCached = unstable_cache(async function getPublishedArticleBySlugCached(
  slug: string,
): Promise<ArticleDetail | null> {
  const supabase = createSupabasePublicClient();

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

  return data ? hydrateArticleDetail(supabase, data, false) : null;
}, ["published-article-by-slug"], { tags: ["posts", "taxonomy"], revalidate: 3600 });

export const getPublishedArticleBySlug = cache(getPublishedArticleBySlugCached);

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

  return data ? hydrateArticleDetail(supabase, data, true) : null;
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

  await replaceArticleTags(supabase, data.id, input.tagIds);

  return data.id;
}

export async function updateArticle(
  id: string,
  input: ArticleMutationInput,
): Promise<{ previousSlug: string | null }> {
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

  await replaceArticleTags(supabase, id, input.tagIds);

  return {
    previousSlug: current?.slug ?? null,
  };
}
