"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bookmark,
  Folder,
  Hash,
  ImagePlus,
  Save,
  Star,
  Text,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import type { CategorySummary } from "@/features/categories/types/category";
import {
  createPostAction,
  uploadPostImageAction,
  updatePostAction,
} from "@/features/posts/actions/post-actions";
import type { ArticleDetail } from "@/features/posts/types/post";
import type { TagSummary } from "@/features/tags/types/tag";
import { calculateReadingTimeMinutes } from "@/lib/markdown/reading-time";

const postEditorSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  slug: z
    .string()
    .min(3, "Informe um slug com pelo menos 3 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens.",
    ),
  description: z.string().min(10, "Informe uma descrição mais completa."),
  contentMarkdown: z.string().min(20, "O artigo precisa de conteúdo."),
  status: z.enum(["draft", "published"]),
  categoryId: z.string(),
  tagIds: z.array(z.string()),
  isFeatured: z.boolean(),
});

type PostEditorValues = z.infer<typeof postEditorSchema>;

type PostFormProps = {
  post?: ArticleDetail;
  categories: CategorySummary[];
  tags: TagSummary[];
};

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function insertMarkdownAtCursor(
  currentValue: string,
  markdown: string,
  selectionStart?: number,
  selectionEnd?: number,
) {
  const start = selectionStart ?? currentValue.length;
  const end = selectionEnd ?? start;
  const before = currentValue.slice(0, start);
  const after = currentValue.slice(end);
  const leading = before.length > 0 && !before.endsWith("\n") ? "\n\n" : "";
  const trailing = after.length > 0 && !after.startsWith("\n") ? "\n\n" : "";
  const insertion = `${leading}${markdown}${trailing}`;

  return {
    nextValue: `${before}${insertion}${after}`,
    cursorPosition: before.length + insertion.length,
  };
}

export function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();
  const [isUploadingImage, startImageUploadTransition] = useTransition();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const markdownTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<PostEditorValues>({
    resolver: zodResolver(postEditorSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      description: post?.description ?? "",
      contentMarkdown: post?.contentMarkdown ?? "",
      status: post?.status ?? "draft",
      categoryId: post?.category?.id ?? "",
      tagIds: post?.tags.map((tag) => tag.id) ?? [],
      isFeatured: post?.isFeatured ?? false,
    },
  });
  const contentMarkdownField = form.register("contentMarkdown");

  function onSubmit(values: PostEditorValues) {
    const actionInput = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      contentMarkdown: values.contentMarkdown,
      status: values.status,
      categoryId: values.categoryId || null,
      tagIds: values.tagIds,
      readingTimeMinutes: calculateReadingTimeMinutes(values.contentMarkdown),
      isFeatured: values.isFeatured,
    };

    startTransition(async () => {
      const toastId = toast.info(
        post ? "Atualizando post..." : "Criando post...",
      );

      const result = post
        ? await updatePostAction(post.id, actionInput)
        : await createPostAction(actionInput);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/admin/posts");
        router.refresh();
      }
    });
  }

  function handleImageButtonClick() {
    imageInputRef.current?.click();
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!file) {
      return;
    }

    startImageUploadTransition(async () => {
      const toastId = toast.info("Enviando imagem...");
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadPostImageAction(formData);
      toast.handleActionResult(toastId, result);

      if (!result.ok || !result.markdown) {
        return;
      }

      const textarea = markdownTextareaRef.current;
      const currentValue = form.getValues("contentMarkdown");
      const { nextValue, cursorPosition } = insertMarkdownAtCursor(
        currentValue,
        result.markdown,
        textarea?.selectionStart,
        textarea?.selectionEnd,
      );

      form.setValue("contentMarkdown", nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      });

      requestAnimationFrame(() => {
        markdownTextareaRef.current?.focus();
        markdownTextareaRef.current?.setSelectionRange(
          cursorPosition,
          cursorPosition,
        );
      });
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-3xl border border-slate-300 bg-card p-6 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações do artigo
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Configure título, slug, resumo, conteúdo, publicação e organização do
            artigo.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-foreground"
            >
              Título
            </label>

            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="title"
                placeholder="Ex: Entendendo Service Lifetimes no .NET"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("title", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (!post) {
                      form.setValue("slug", slugify(event.target.value), {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
              />
            </div>

            <FieldError message={form.formState.errors.title?.message} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="slug"
              className="text-sm font-semibold text-foreground"
            >
              Slug
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="slug"
                placeholder="entendendo-service-lifetimes-dotnet"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("slug")}
              />
            </div>

            <FieldError message={form.formState.errors.slug?.message} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-foreground"
            >
              Descrição
            </label>

            <div className="relative">
              <Text className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />

              <textarea
                id="description"
                rows={3}
                placeholder="Resumo curto que aparece nos cards e no SEO do artigo."
                className="w-full rounded-xl border border-slate-400/70 bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>

            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="grid gap-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="contentMarkdown"
                className="text-sm font-semibold text-foreground"
              >
                Conteúdo Markdown
              </label>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleImageButtonClick}
                disabled={isPending || isUploadingImage}
                className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
              >
                <ImagePlus className="size-4" />
                {isUploadingImage ? "Enviando..." : "Imagem"}
              </Button>
            </div>

            <textarea
              id="contentMarkdown"
              rows={18}
              placeholder={`# Título do artigo\n\nEscreva seu conteúdo em Markdown...`}
              className="min-h-112 rounded-xl border border-slate-400/70 bg-card px-4 py-3 font-mono text-sm leading-6 text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
              {...contentMarkdownField}
              ref={(element) => {
                contentMarkdownField.ref(element);
                markdownTextareaRef.current = element;
              }}
            />

            <FieldError
              message={form.formState.errors.contentMarkdown?.message}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <label
                  htmlFor="categoryId"
                  className="text-sm font-semibold text-foreground"
                >
                  Categoria
                </label>

                <div className="relative">
                  <Folder className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <select
                    id="categoryId"
                    className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                    {...form.register("categoryId")}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                        {category.isActive ? "" : " (inativa)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-semibold text-foreground"
                >
                  Status
                </label>

                <div className="relative">
                  <Bookmark className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <select
                    id="status"
                    className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                    {...form.register("status")}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                    <Star className="size-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      Artigo em destaque
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Exibir como destaque na página do blog.
                    </span>
                  </span>
                </span>

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                  {...form.register("isFeatured")}
                />
              </label>
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">Tags</span>

              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
                {tags.length > 0 ? (
                  <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                      >
                        <input
                          type="checkbox"
                          value={tag.id}
                          className="size-4 accent-blue-600"
                          {...form.register("tagIds")}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {tag.name}
                        </span>

                        {!tag.isActive ? (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Inativa
                          </span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma tag cadastrada.
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Selecione uma ou mais tags para relacionar ao artigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 rounded-xl border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:bg-slate-900"
          disabled={isPending}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Button
          type="submit"
          className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar post"}
        </Button>
      </div>
    </form>
  );
}
