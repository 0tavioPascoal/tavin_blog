import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { TagDetail, TagMutationInput, TagSummary } from "@/features/tags/types/tag";
import { mapTagRowToDetail, mapTagRowToSummary } from "@/features/tags/utils/mappers";
import type { Database } from "@/types/supabase";

type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];

function normalizeDescription(description: string): string | null {
  const trimmed = description.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toInsert(input: TagMutationInput): TagInsert {
  const now = new Date().toISOString();

  return {
    name: input.name,
    slug: input.slug,
    description: normalizeDescription(input.description),
    color_hex: input.colorHex,
    is_active: input.isActive,
    created_at: now,
    updated_at: now,
  };
}

function toUpdate(input: TagMutationInput): TagUpdate {
  return {
    name: input.name,
    slug: input.slug,
    description: normalizeDescription(input.description),
    color_hex: input.colorHex,
    is_active: input.isActive,
    updated_at: new Date().toISOString(),
  };
}

async function listActiveTagsUncached(): Promise<TagSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar tags: ${error.message}`);
  }

  return data.map(mapTagRowToSummary);
}

export const listActiveTags = unstable_cache(listActiveTagsUncached, ["active-tags"], { tags: ["taxonomy"], revalidate: 3600 });

export async function listAllTagsForAdmin(): Promise<TagSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar tags do admin: ${error.message}`);
  }

  return data.map(mapTagRowToSummary);
}

const getTagBySlugCached = unstable_cache(async function getTagBySlugCached(
  slug: string,
): Promise<TagDetail | null> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar a tag: ${error.message}`);
  }

  return data ? mapTagRowToDetail(data) : null;
}, ["tag-by-slug"], { tags: ["taxonomy"], revalidate: 3600 });

export const getTagBySlug = cache(getTagBySlugCached);

export async function getTagByIdForAdmin(id: string): Promise<TagDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar a tag: ${error.message}`);
  }

  return data ? mapTagRowToDetail(data) : null;
}

export async function createTag(input: TagMutationInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("tags")
    .insert(toInsert(input))
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar a tag: ${error.message}`);
  }

  return data.id;
}

export async function updateTag(
  id: string,
  input: TagMutationInput,
): Promise<{ previousSlug: string | null }> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data: current, error: currentError } = await supabase
    .from("tags")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (currentError) {
    throw new Error(`Não foi possível carregar a tag: ${currentError.message}`);
  }

  const { error } = await supabase
    .from("tags")
    .update(toUpdate(input))
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar a tag: ${error.message}`);
  }

  return {
    previousSlug: current?.slug ?? null,
  };
}

export async function deleteTag(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível remover a tag: ${error.message}`);
  }
}
