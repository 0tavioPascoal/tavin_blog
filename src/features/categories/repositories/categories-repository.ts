import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CategoryDetail, CategoryMutationInput, CategorySummary } from "@/features/categories/types/category";
import { mapCategoryRowToDetail, mapCategoryRowToSummary } from "@/features/categories/utils/mappers";
import type { Database } from "@/types/supabase";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

function normalizeDescription(description: string): string | null {
  const trimmed = description.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toInsert(input: CategoryMutationInput): CategoryInsert {
  const now = new Date().toISOString();

  return {
    name: input.name,
    slug: input.slug,
    description: normalizeDescription(input.description),
    sort_order: input.sortOrder,
    is_active: input.isActive,
    created_at: now,
    updated_at: now,
  };
}

function toUpdate(input: CategoryMutationInput): CategoryUpdate {
  return {
    name: input.name,
    slug: input.slug,
    description: normalizeDescription(input.description),
    sort_order: input.sortOrder,
    is_active: input.isActive,
    updated_at: new Date().toISOString(),
  };
}

export async function listActiveCategories(): Promise<CategorySummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar categorias: ${error.message}`);
  }

  return data.map(mapCategoryRowToSummary);
}

export async function listAllCategoriesForAdmin(): Promise<CategorySummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar categorias do admin: ${error.message}`);
  }

  return data.map(mapCategoryRowToSummary);
}

export const getCategoryBySlug = cache(async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar a categoria: ${error.message}`);
  }

  return data ? mapCategoryRowToDetail(data) : null;
});

export async function getCategoryByIdForAdmin(id: string): Promise<CategoryDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar a categoria: ${error.message}`);
  }

  return data ? mapCategoryRowToDetail(data) : null;
}

export async function createCategory(input: CategoryMutationInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(toInsert(input))
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar a categoria: ${error.message}`);
  }

  return data.id;
}

export async function updateCategory(
  id: string,
  input: CategoryMutationInput,
): Promise<{ previousSlug: string | null }> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data: current, error: currentError } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (currentError) {
    throw new Error(`Não foi possível carregar a categoria: ${currentError.message}`);
  }

  const { error } = await supabase
    .from("categories")
    .update(toUpdate(input))
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar a categoria: ${error.message}`);
  }

  return {
    previousSlug: current?.slug ?? null,
  };
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível remover a categoria: ${error.message}`);
  }
}
