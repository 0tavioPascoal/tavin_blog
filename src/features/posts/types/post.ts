import type { ArticleStatus } from "@/types/supabase";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string | null;
  status: ArticleStatus;
  category: CategorySummary | null;
  tags: TagSummary[];
  readingTimeMinutes: number;
  isFeatured: boolean;
};

export type ArticleDetail = ArticleSummary & {
  contentMarkdown: string;
  updatedAt: string;
};

export type ArticleMutationInput = {
  title: string;
  slug: string;
  description: string;
  contentMarkdown: string;
  status: ArticleStatus;
  categoryId: string | null;
  tagIds: string[];
  readingTimeMinutes: number;
  isFeatured: boolean;
};
