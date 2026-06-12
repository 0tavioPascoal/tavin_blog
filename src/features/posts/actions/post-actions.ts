"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { postFormSchema } from "@/features/posts/schemas/post-schema";
import { createArticle, updateArticle } from "@/features/posts/repositories/posts-repository";
import type { ArticleMutationInput } from "@/features/posts/types/post";

export type PostActionState = {
  ok: boolean;
  message: string;
};

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar posts.");
  }
}

function toMutationInput(input: unknown): ArticleMutationInput {
  return postFormSchema.parse(input);
}

function revalidatePostPaths(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/categoria/[slug]", "page");
  revalidatePath("/blog/tag/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/posts");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function createPostAction(input: unknown): Promise<PostActionState> {
  try {
    await requireAdmin();
    const postInput = toMutationInput(input);
    await createArticle(postInput);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar o post.",
    };
  }

  revalidatePostPaths();

  return {
    ok: true,
    message: "Post criado com sucesso.",
  };
}

export async function updatePostAction(id: string, input: unknown): Promise<PostActionState> {
  let slugToRevalidate = "";

  try {
    await requireAdmin();
    const postInput = toMutationInput(input);
    slugToRevalidate = postInput.slug;
    await updateArticle(id, postInput);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar o post.",
    };
  }

  revalidatePostPaths(slugToRevalidate);

  return {
    ok: true,
    message: "Post atualizado com sucesso.",
  };
}

export async function redirectToPostsAdmin(): Promise<void> {
  redirect("/admin/posts");
}
