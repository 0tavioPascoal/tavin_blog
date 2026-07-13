import { articleRowSchema } from "@/features/posts/schemas/post-schema";
import type { ArticleDetail, ArticleSummary } from "@/features/posts/types/post";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import type { Database } from "@/types/supabase";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ArticleSummaryRow = Omit<ArticleRow, "content_markdown">;
const articleSummaryRowSchema = articleRowSchema.omit({ content_markdown: true });

export function mapArticleRowToSummary(
  row: ArticleSummaryRow,
  category: CategorySummary | null,
  tags: TagSummary[],
): ArticleSummary {
  const article = articleSummaryRowSchema.parse(row);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    publishedAt: article.published_at,
    status: article.status,
    category,
    tags,
    readingTimeMinutes: article.reading_time_minutes,
    isFeatured: article.is_featured,
  };
}

export function mapArticleRowToDetail(
  row: ArticleRow,
  category: CategorySummary | null,
  tags: TagSummary[],
): ArticleDetail {
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
    category,
    tags,
    readingTimeMinutes: article.reading_time_minutes,
    isFeatured: article.is_featured,
  };
}
