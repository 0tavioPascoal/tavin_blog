"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/repositories/auth-repository";
import { postFormSchema } from "@/features/posts/schemas/post-schema";
import { createArticle, updateArticle } from "@/features/posts/repositories/posts-repository";
import type { ArticleMutationInput } from "@/features/posts/types/post";

export type PostActionState = {
  ok: boolean;
  message: string;
};

async function requireAdmin(): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para gerenciar posts.");
  }
}

function toMutationInput(input: unknown): ArticleMutationInput {
  return postFormSchema.parse(input);
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

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");

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

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slugToRevalidate}`);
  revalidatePath("/admin/posts");

  return {
    ok: true,
    message: "Post atualizado com sucesso.",
  };
}

export async function redirectToPostsAdmin(): Promise<void> {
  redirect("/admin/posts");
}
