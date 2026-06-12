"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { categoryFormSchema } from "@/features/categories/schemas/category-schema";
import { createCategory, deleteCategory, updateCategory } from "@/features/categories/repositories/categories-repository";
import type { CategoryMutationInput } from "@/features/categories/types/category";

export type CategoryActionState = {
  ok: boolean;
  message: string;
};

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar categorias.");
  }
}

function toMutationInput(input: unknown): CategoryMutationInput {
  return categoryFormSchema.parse(input);
}

function revalidateCategoryPaths(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/categoria/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/categories");

  if (slug) {
    revalidatePath(`/blog/categoria/${slug}`);
  }
}

export async function createCategoryAction(input: unknown): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    const categoryInput = toMutationInput(input);
    await createCategory(categoryInput);
    revalidateCategoryPaths(categoryInput.slug);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar a categoria.",
    };
  }

  return {
    ok: true,
    message: "Categoria criada com sucesso.",
  };
}

export async function updateCategoryAction(id: string, input: unknown): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    const categoryInput = toMutationInput(input);
    await updateCategory(id, categoryInput);
    revalidateCategoryPaths(categoryInput.slug);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar a categoria.",
    };
  }

  return {
    ok: true,
    message: "Categoria atualizada com sucesso.",
  };
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    await deleteCategory(id);
    revalidateCategoryPaths();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível remover a categoria.",
    };
  }

  return {
    ok: true,
    message: "Categoria removida com sucesso.",
  };
}
