import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { ProjectDetail, ProjectMutationInput, ProjectSummary } from "@/features/projects/types/project";
import { mapProjectRowToDetail, mapProjectRowToSummary } from "@/features/projects/utils/mappers";
import type { TagSummary } from "@/features/tags/types/tag";
import { mapTagRowToSummary } from "@/features/tags/utils/mappers";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
type ProjectTagInsert = Database["public"]["Tables"]["project_tags"]["Insert"];

type ProjectRelations = {
  tagsByProjectId: Map<string, TagSummary[]>;
};

function toInsert(input: ProjectMutationInput): ProjectInsert {
  const now = new Date().toISOString();

  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    repository_url: input.repositoryUrl,
    demo_url: input.demoUrl,
    cover_image_url: input.coverImageUrl,
    icon_name: input.iconName,
    status: input.status,
    tags: [],
    is_featured: input.isFeatured,
    sort_order: input.sortOrder,
    updated_at: now,
  };
}

function toUpdate(input: ProjectMutationInput): ProjectUpdate {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    content_markdown: input.contentMarkdown,
    repository_url: input.repositoryUrl,
    demo_url: input.demoUrl,
    cover_image_url: input.coverImageUrl,
    icon_name: input.iconName,
    status: input.status,
    tags: [],
    is_featured: input.isFeatured,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

async function loadProjectRelations(
  supabase: SupabaseClient,
  projects: ProjectRow[],
  includeInactiveTags: boolean,
): Promise<ProjectRelations> {
  const projectIds = projects.map((project) => project.id);
  const tagsByProjectId = new Map<string, TagSummary[]>();

  if (projectIds.length === 0) {
    return { tagsByProjectId };
  }

  const { data: relationRows, error: relationError } = await supabase
    .from("project_tags")
    .select("*")
    .in("project_id", projectIds);

  if (relationError) {
    throw new Error(`Não foi possível carregar tags dos projetos: ${relationError.message}`);
  }

  const tagIds = uniqueStrings(relationRows.map((relation) => relation.tag_id));

  if (tagIds.length === 0) {
    return { tagsByProjectId };
  }

  let tagQuery = supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  if (!includeInactiveTags) {
    tagQuery = tagQuery.eq("is_active", true);
  }

  const { data: tagRows, error: tagError } = await tagQuery.order("name", { ascending: true });

  if (tagError) {
    throw new Error(`Não foi possível carregar tags dos projetos: ${tagError.message}`);
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

    const currentTags = tagsByProjectId.get(relation.project_id) ?? [];
    tagsByProjectId.set(relation.project_id, [...currentTags, tag]);
  });

  return { tagsByProjectId };
}

async function hydrateProjectSummaries(
  supabase: SupabaseClient,
  projects: ProjectRow[],
  includeInactiveTags: boolean,
): Promise<ProjectSummary[]> {
  const relations = await loadProjectRelations(supabase, projects, includeInactiveTags);

  return projects.map((project) =>
    mapProjectRowToSummary(project, relations.tagsByProjectId.get(project.id) ?? []),
  );
}

async function hydrateProjectDetail(
  supabase: SupabaseClient,
  project: ProjectRow,
  includeInactiveTags: boolean,
): Promise<ProjectDetail> {
  const relations = await loadProjectRelations(supabase, [project], includeInactiveTags);

  return mapProjectRowToDetail(project, relations.tagsByProjectId.get(project.id) ?? []);
}

async function replaceProjectTags(
  supabase: SupabaseClient,
  projectId: string,
  tagIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("project_tags")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    throw new Error(`Não foi possível atualizar tags do projeto: ${deleteError.message}`);
  }

  const uniqueTagIds = uniqueStrings(tagIds);

  if (uniqueTagIds.length === 0) {
    return;
  }

  const insertRows: ProjectTagInsert[] = uniqueTagIds.map((tagId) => ({
    project_id: projectId,
    tag_id: tagId,
  }));

  const { error: insertError } = await supabase
    .from("project_tags")
    .insert(insertRows);

  if (insertError) {
    throw new Error(`Não foi possível salvar tags do projeto: ${insertError.message}`);
  }
}

export async function listPublishedProjects(): Promise<ProjectSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os projetos: ${error.message}`);
  }

  return hydrateProjectSummaries(supabase, data, false);
}

export async function listFeaturedProjects(limit = 3): Promise<ProjectSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Não foi possível carregar projetos em destaque: ${error.message}`);
  }

  return hydrateProjectSummaries(supabase, data, false);
}

export async function listAllProjectsForAdmin(): Promise<ProjectSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar projetos do admin: ${error.message}`);
  }

  return hydrateProjectSummaries(supabase, data, true);
}

export async function getProjectByIdForAdmin(id: string): Promise<ProjectDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar o projeto: ${error.message}`);
  }

  return data ? hydrateProjectDetail(supabase, data, true) : null;
}

export async function createProject(input: ProjectMutationInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(toInsert(input))
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar o projeto: ${error.message}`);
  }

  await replaceProjectTags(supabase, data.id, input.tagIds);

  return data.id;
}

export async function updateProject(id: string, input: ProjectMutationInput): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("projects")
    .update(toUpdate(input))
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar o projeto: ${error.message}`);
  }

  await replaceProjectTags(supabase, id, input.tagIds);
}
