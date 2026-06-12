import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { ProjectDetail, ProjectMutationInput, ProjectSummary } from "@/features/projects/types/project";
import { mapProjectRowToDetail, mapProjectRowToSummary } from "@/features/projects/utils/mappers";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

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
    tags: input.tags,
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
    tags: input.tags,
    is_featured: input.isFeatured,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
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

  return data.map(mapProjectRowToSummary);
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

  return data.map(mapProjectRowToSummary);
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

  return data.map(mapProjectRowToSummary);
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

  return data ? mapProjectRowToDetail(data) : null;
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
}
