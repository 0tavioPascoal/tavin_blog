import { projectRowSchema } from "@/features/projects/schemas/project-schema";
import type { ProjectDetail, ProjectSummary } from "@/features/projects/types/project";
import type { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export function mapProjectRowToSummary(row: ProjectRow): ProjectSummary {
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
    tags: project.tags,
    isFeatured: project.is_featured,
    sortOrder: project.sort_order,
    updatedAt: project.updated_at,
  };
}

export function mapProjectRowToDetail(row: ProjectRow): ProjectDetail {
  const project = projectRowSchema.parse(row);

  return {
    ...mapProjectRowToSummary(project),
    contentMarkdown: project.content_markdown,
    createdAt: project.created_at,
  };
}
