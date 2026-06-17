import { projectRowSchema } from "@/features/projects/schemas/project-schema";
import type { ProjectDetail, ProjectSummary } from "@/features/projects/types/project";
import type { TagSummary } from "@/features/tags/types/tag";
import type { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export function mapProjectRowToSummary(row: ProjectRow, tags: TagSummary[] = []): ProjectSummary {
  const project = projectRowSchema.parse(row);

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    repositoryUrl: project.repository_url,
    demoUrl: project.demo_url,
    coverImageUrl: project.cover_image_url,
    iconName: project.icon_name,
    status: project.status,
    tags,
    isFeatured: project.is_featured,
    sortOrder: project.sort_order,
    updatedAt: project.updated_at,
  };
}

export function mapProjectRowToDetail(row: ProjectRow, tags: TagSummary[] = []): ProjectDetail {
  const project = projectRowSchema.parse(row);

  return {
    ...mapProjectRowToSummary(project, tags),
    contentMarkdown: project.content_markdown,
    createdAt: project.created_at,
  };
}
