"use server";

import { randomUUID } from "crypto";
import { revalidatePath, updateTag as expireCacheTag } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { postFormSchema } from "@/features/posts/schemas/post-schema";
import { createArticle, updateArticle } from "@/features/posts/repositories/posts-repository";
import type { ArticleMutationInput } from "@/features/posts/types/post";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

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

type SupportedImageContentType = keyof typeof imageContentTypes;

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

function detectImageContentType(bytes: ArrayBuffer): SupportedImageContentType | null {
  const signature = new Uint8Array(bytes.slice(0, 12));

  const isPng =
    signature[0] === 0x89 &&
    signature[1] === 0x50 &&
    signature[2] === 0x4e &&
    signature[3] === 0x47 &&
    signature[4] === 0x0d &&
    signature[5] === 0x0a &&
    signature[6] === 0x1a &&
    signature[7] === 0x0a;

  if (isPng) {
    return "image/png";
  }

  if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
    return "image/jpeg";
  }

  const header = String.fromCharCode(...signature);

  if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) {
    return "image/gif";
  }

  if (header.startsWith("RIFF") && header.slice(8, 12) === "WEBP") {
    return "image/webp";
  }

  return null;
}

function sanitizeImageAlt(value: string): string {
  const withoutExtension = value.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || "imagem";
}

function revalidatePostPaths(slugs: string[] = []): void {
  expireCacheTag("posts");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/categoria/[slug]", "page");
  revalidatePath("/blog/tag/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/posts");

  uniqueSlugs(slugs).forEach((slug) => {
    revalidatePath(`/blog/${slug}`);
  });
}

function uniqueSlugs(slugs: Array<string | null | undefined>): string[] {
  return Array.from(new Set(slugs.filter((slug): slug is string => Boolean(slug))));
}

export async function createPostAction(input: unknown): Promise<PostActionState> {
  let slugsToRevalidate: string[] = [];

  try {
    await requireAdmin();
    const postInput = toMutationInput(input);
    slugsToRevalidate = [postInput.slug];
    await createArticle(postInput);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar o post.",
    };
  }

  revalidatePostPaths(slugsToRevalidate);

  return {
    ok: true,
    message: "Post criado com sucesso.",
  };
}

export async function updatePostAction(id: string, input: unknown): Promise<PostActionState> {
  let slugsToRevalidate: string[] = [];

  try {
    await requireAdmin();
    const postInput = toMutationInput(input);
    const { previousSlug } = await updateArticle(id, postInput);
    slugsToRevalidate = [previousSlug, postInput.slug].filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar o post.",
    };
  }

  revalidatePostPaths(slugsToRevalidate);

  return {
    ok: true,
    message: "Post atualizado com sucesso.",
  };
}

export async function uploadPostImageAction(formData: FormData): Promise<PostImageUploadActionState> {
  try {
    await requireAdmin();
    const user = await getCurrentAdminUser();
    if (!user) throw new Error("Você precisa estar autenticado como administrador.");
    await enforceRateLimit({ scope: "admin-upload", identifier: user.id, maxAttempts: 20, windowSeconds: 60 * 60 });

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

    if (!getImageExtension(image.type)) {
      throw new Error("Use uma imagem PNG, JPG, WEBP ou GIF.");
    }

    const bytes = await image.arrayBuffer();
    const detectedContentType = detectImageContentType(bytes);

    if (!detectedContentType || detectedContentType !== image.type) {
      throw new Error("O arquivo enviado não corresponde a uma imagem válida.");
    }

    const extension = getImageExtension(detectedContentType);

    if (!extension) {
      throw new Error("Use uma imagem PNG, JPG, WEBP ou GIF.");
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const path = `articles/${year}/${month}/${randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(articleImagesBucket)
      .upload(path, bytes, {
        contentType: detectedContentType,
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
