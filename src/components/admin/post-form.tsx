"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  ArrowLeft,
  Bookmark,
  Clock3,
  Eye,
  FileText,
  Folder,
  Hash,
  ImagePlus,
  PencilLine,
  Save,
  Settings2,
  Star,
  Tags,
  Type,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import type { CategorySummary } from "@/features/categories/types/category";
import {
  createPostAction,
  updatePostAction,
  uploadPostImageAction,
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
type EditorMode = "write" | "preview";

type PostFormProps = {
  post?: ArticleDetail;
  categories: CategorySummary[];
  tags: TagSummary[];
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-300/80 bg-background text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600";

const MarkdownPreview = dynamic(
  () =>
    import("@/components/admin/admin-markdown-preview").then(
      (module) => module.AdminMarkdownPreview,
    ),
  {
    loading: () => (
      <div className="flex min-h-128 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-muted/35 px-4 text-center text-sm text-muted-foreground dark:border-slate-800">
        Carregando preview...
      </div>
    ),
  },
);

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
      {message}
    </p>
  );
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

  const [editorMode, setEditorMode] = useState<EditorMode>("write");
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

  const contentMarkdownPreview =
    useWatch({
      control: form.control,
      name: "contentMarkdown",
    }) ?? "";

  const selectedTagIds =
    useWatch({
      control: form.control,
      name: "tagIds",
    }) ?? [];

  const readingTimeMinutes = useMemo(
    () => calculateReadingTimeMinutes(contentMarkdownPreview),
    [contentMarkdownPreview],
  );

  const wordCount = useMemo(() => {
    const normalized = contentMarkdownPreview
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`~[\]()!-]/g, " ")
      .trim();

    return normalized ? normalized.split(/\s+/).length : 0;
  }, [contentMarkdownPreview]);

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
      <div className="grid gap-6">
        <div className="grid min-w-0 gap-6">
          <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
            <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <FileText className="size-4" aria-hidden="true" />
              </span>

              <div>
                <h2 className="text-base font-bold text-foreground">
                  Informações do artigo
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Defina o título, a URL e o resumo usado nos cards e mecanismos
                  de busca.
                </p>
              </div>
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
                    className={`${inputClassName} pl-10 pr-3`}
                    {...form.register("title", {
                      onChange: (
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        if (!post) {
                          form.setValue("slug", slugify(event.target.value), {
                            shouldDirty: true,
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
                    className={`${inputClassName} pl-10 pr-3 font-mono`}
                    {...form.register("slug")}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  A URL pública será gerada a partir deste identificador.
                </p>

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
                  <AlignLeft className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />

                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Resumo curto que aparece nos cards e no SEO do artigo."
                    className="w-full resize-y rounded-xl border border-slate-300/80 bg-background py-3 pl-10 pr-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                    {...form.register("description")}
                  />
                </div>

                <FieldError
                  message={form.formState.errors.description?.message}
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-300/70 bg-card shadow-sm dark:border-slate-800">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <PencilLine className="size-4" aria-hidden="true" />
                </span>

                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Editor Markdown
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Escreva, envie imagens e revise o resultado renderizado.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="grid grid-cols-2 rounded-xl border border-border bg-muted/45 p-1">
                  <button
                    type="button"
                    aria-pressed={editorMode === "write"}
                    onClick={() => setEditorMode("write")}
                    className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                      editorMode === "write"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <PencilLine className="size-4" />
                    Escrever
                  </button>

                  <button
                    type="button"
                    aria-pressed={editorMode === "preview"}
                    onClick={() => setEditorMode("preview")}
                    className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                      editorMode === "preview"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <Eye className="size-4" />
                    Preview
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageButtonClick}
                  disabled={isUploadingImage}
                  className="h-11 rounded-xl"
                >
                  <ImagePlus className="size-4" />
                  {isUploadingImage ? "Enviando..." : "Enviar imagem"}
                </Button>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="border-b border-border bg-muted/25 px-5 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-blue-600 dark:text-blue-400" />
                  {readingTimeMinutes} min de leitura
                </span>

                <span>{wordCount} palavras</span>

                <span>{contentMarkdownPreview.length} caracteres</span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {editorMode === "write" ? (
                <textarea
                  id="contentMarkdown"
                  rows={22}
                  placeholder={`# Título do artigo\n\nEscreva seu conteúdo em Markdown...`}
                  className="min-h-136 w-full resize-y rounded-xl border border-slate-300/80 bg-background px-4 py-4 font-mono text-sm leading-7 text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...contentMarkdownField}
                  ref={(element) => {
                    contentMarkdownField.ref(element);
                    markdownTextareaRef.current = element;
                  }}
                />
              ) : (
                <div className="min-h-136 w-full overflow-hidden rounded-xl border border-slate-300/80 bg-background px-5 py-6 shadow-sm dark:border-slate-700 sm:px-7">
                  {contentMarkdownPreview.trim().length > 0 ? (
                    <MarkdownPreview content={contentMarkdownPreview} />
                  ) : (
                    <div className="flex min-h-120 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground">
                      O preview do Markdown aparecerá aqui.
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3">
                <FieldError
                  message={form.formState.errors.contentMarkdown?.message}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Settings2 className="size-4" aria-hidden="true" />
              </span>

              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Publicação
                </h2>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  Status, categoria e destaque.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
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
                    className={`${inputClassName} pl-10 pr-3`}
                    {...form.register("status")}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

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
                    className={`${inputClassName} pl-10 pr-3`}
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

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-3.5 transition hover:border-blue-300 hover:bg-blue-50/60 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Star className="size-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      Artigo em destaque
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      Exibir na página inicial.
                    </span>
                  </span>
                </span>

                <input
                  type="checkbox"
                  className="size-4 shrink-0 accent-blue-600"
                  {...form.register("isFeatured")}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Tags className="size-4" aria-hidden="true" />
                </span>

                <div>
                  <h2 className="text-sm font-bold text-foreground">Tags</h2>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    Relacione tecnologias e temas.
                  </p>
                </div>
              </div>

              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-50 px-2 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {selectedTagIds.length}
              </span>
            </div>

            {tags.length > 0 ? (
              <div className="grid max-h-88 gap-2 overflow-y-auto pr-1">
                {tags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);

                  return (
                    <label
                      key={tag.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        selected
                          ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                          : "border-border bg-background text-muted-foreground hover:border-blue-300 hover:bg-blue-50/50 hover:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={tag.id}
                        className="size-4 shrink-0 accent-blue-600"
                        {...form.register("tagIds")}
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {tag.name}
                      </span>

                      {!tag.isActive ? (
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                          Inativa
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma tag cadastrada.
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Revise as informações antes de salvar ou publicar o artigo.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-11 w-full rounded-xl px-5 sm:w-auto"
            disabled={isPending}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
            disabled={isPending || isUploadingImage}
          >
            <Save className="size-4" />
            {isPending ? "Salvando..." : "Salvar post"}
          </Button>
        </div>
      </div>
    </form>
  );
}