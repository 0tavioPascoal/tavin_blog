import type { ProjectStatus } from "@/types/supabase";

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  repositoryUrl: string | null;
  demoUrl: string | null;
  coverImageUrl: string | null;
  iconName: string;
  status: ProjectStatus;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  contentMarkdown: string | null;
  createdAt: string;
};

export type ProjectMutationInput = {
  title: string;
  slug: string;
  description: string;
  contentMarkdown: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  coverImageUrl: string | null;
  iconName: string;
  status: ProjectStatus;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
};
