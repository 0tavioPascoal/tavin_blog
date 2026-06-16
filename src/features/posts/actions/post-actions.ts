"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { postFormSchema } from "@/features/posts/schemas/post-schema";
import { createArticle, updateArticle } from "@/features/posts/repositories/posts-repository";
import type { ArticleMutationInput } from "@/features/posts/types/post";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PostActionState = {
  ok: boolean;
  message: string;
};

export type PostImageUploadActionState = PostActionState & {
  url?: string;
  markdown?: string;
};

const articleImagesBucket = "article-images";
const maxImageSizeBytes = 5 * 1024 * 1024;
const imageContentTypes = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar posts.");
  }
}

function toMutationInput(input: unknown): ArticleMutationInput {
  return postFormSchema.parse(input);
}

function getImageExtension(contentType: string): string | null {
  return imageContentTypes[contentType as keyof typeof imageContentTypes] ?? null;
}

function sanitizeImageAlt(value: string): string {
  const withoutExtension = value.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || "imagem";
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

export async function uploadPostImageAction(formData: FormData): Promise<PostImageUploadActionState> {
  try {
    await requireAdmin();

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      throw new Error("Supabase não está configurado.");
    }

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      throw new Error("Selecione uma imagem para enviar.");
    }

    if (image.size > maxImageSizeBytes) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const extension = getImageExtension(image.type);

    if (!extension) {
      throw new Error("Use uma imagem PNG, JPG, WEBP ou GIF.");
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const path = `articles/${year}/${month}/${randomUUID()}.${extension}`;
    const bytes = await image.arrayBuffer();

    const { error } = await supabase.storage
      .from(articleImagesBucket)
      .upload(path, bytes, {
        contentType: image.type,
        upsert: false,
      });

    if (error) {
      throw new Error(error.message || "Não foi possível enviar a imagem.");
    }

    const { data } = supabase.storage.from(articleImagesBucket).getPublicUrl(path);
    const alt = sanitizeImageAlt(image.name);
    const markdown = `![${alt}](${data.publicUrl})`;

    return {
      ok: true,
      message: "Imagem enviada e inserida no Markdown.",
      url: data.publicUrl,
      markdown,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível enviar a imagem.",
    };
  }
}

export async function redirectToPostsAdmin(): Promise<void> {
  redirect("/admin/posts");
}
