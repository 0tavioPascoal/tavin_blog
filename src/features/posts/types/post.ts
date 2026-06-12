import type { ArticleStatus } from "@/types/supabase";

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string | null;
  status: ArticleStatus;
  tags: string[];
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
  tags: string[];
  readingTimeMinutes: number;
  isFeatured: boolean;
};
