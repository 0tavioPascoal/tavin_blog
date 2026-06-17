"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { createTag, deleteTag, updateTag } from "@/features/tags/repositories/tags-repository";
import { tagFormSchema } from "@/features/tags/schemas/tag-schema";
import type { TagMutationInput } from "@/features/tags/types/tag";

export type TagActionState = {
  ok: boolean;
  message: string;
};

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar tags.");
  }
}

function toMutationInput(input: unknown): TagMutationInput {
  return tagFormSchema.parse(input);
}

function revalidateTagPaths(slugs: Array<string | null | undefined> = []): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/tag/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/tags");

  uniqueSlugs(slugs).forEach((slug) => {
    revalidatePath(`/blog/tag/${slug}`);
  });
}

function uniqueSlugs(slugs: Array<string | null | undefined>): string[] {
  return Array.from(new Set(slugs.filter((slug): slug is string => Boolean(slug))));
}

export async function createTagAction(input: unknown): Promise<TagActionState> {
  try {
    await requireAdmin();
    const tagInput = toMutationInput(input);
    await createTag(tagInput);
    revalidateTagPaths([tagInput.slug]);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar a tag.",
    };
  }

  return {
    ok: true,
    message: "Tag criada com sucesso.",
  };
}

export async function updateTagAction(id: string, input: unknown): Promise<TagActionState> {
  try {
    await requireAdmin();
    const tagInput = toMutationInput(input);
    const { previousSlug } = await updateTag(id, tagInput);
    revalidateTagPaths([previousSlug, tagInput.slug]);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar a tag.",
    };
  }

  return {
    ok: true,
    message: "Tag atualizada com sucesso.",
  };
}

export async function deleteTagAction(id: string): Promise<TagActionState> {
  try {
    await requireAdmin();
    await deleteTag(id);
    revalidateTagPaths();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível remover a tag.",
    };
  }

  return {
    ok: true,
    message: "Tag removida com sucesso.",
  };
}
