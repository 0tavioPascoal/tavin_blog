import { articleRowSchema } from "@/features/posts/schemas/post-schema";
import type { ArticleDetail, ArticleSummary } from "@/features/posts/types/post";
import type { Database } from "@/types/supabase";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export function mapArticleRowToSummary(row: ArticleRow): ArticleSummary {
  const article = articleRowSchema.parse(row);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    publishedAt: article.published_at,
    status: article.status,
    tags: article.tags,
    readingTimeMinutes: article.reading_time_minutes,
    isFeatured: article.is_featured,
  };
}

export function mapArticleRowToDetail(row: ArticleRow): ArticleDetail {
  const article = articleRowSchema.parse(row);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    contentMarkdown: article.content_markdown,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    status: article.status,
    tags: article.tags,
    readingTimeMinutes: article.reading_time_minutes,
    isFeatured: article.is_featured,
  };
}
