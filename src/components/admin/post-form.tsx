"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { createPostAction, updatePostAction } from "@/features/posts/actions/post-actions";
import type { ArticleDetail } from "@/features/posts/types/post";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import { calculateReadingTimeMinutes } from "@/lib/markdown/reading-time";

const postEditorSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  slug: z
    .string()
    .min(3, "Informe um slug com pelo menos 3 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
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

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();
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
      const toastId = toast.info(post ? "Atualizando post..." : "Criando post...");
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">Título</label>
          <input
            id="title"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("title", {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                if (!post) {
                  form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
          {form.formState.errors.title ? <p className="text-sm text-red-600">{form.formState.errors.title.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("slug")}
          />
          {form.formState.errors.slug ? <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição</label>
          <textarea
            id="description"
            rows={3}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("description")}
          />
          {form.formState.errors.description ? <p className="text-sm text-red-600">{form.formState.errors.description.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="contentMarkdown" className="text-sm font-medium">Conteúdo Markdown</label>
          <textarea
            id="contentMarkdown"
            rows={16}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("contentMarkdown")}
          />
          {form.formState.errors.contentMarkdown ? <p className="text-sm text-red-600">{form.formState.errors.contentMarkdown.message}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="grid gap-2">
            <label htmlFor="categoryId" className="text-sm font-medium">Categoria</label>
            <select
              id="categoryId"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("categoryId")}
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}{category.isActive ? "" : " (inativa)"}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="tagIds" className="text-sm font-medium">Tags</label>
            <select
              id="tagIds"
              multiple
              className="min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("tagIds")}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}{tag.isActive ? "" : " (inativa)"}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">Use Ctrl/Command para selecionar mais de uma tag.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[180px_160px]">
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
              id="status"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("status")}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <label className="flex items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-800">
            <input type="checkbox" className="size-4" {...form.register("isFeatured")} />
            Destaque
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar post"}
        </Button>
      </div>
    </form>
  );
}
