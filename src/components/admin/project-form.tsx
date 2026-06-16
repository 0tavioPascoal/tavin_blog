"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { createProjectAction, updateProjectAction } from "@/features/projects/actions/project-actions";
import { projectFormSchema } from "@/features/projects/schemas/project-schema";
import type { ProjectDetail } from "@/features/projects/types/project";
import type { TagSummary } from "@/features/tags/types/tag";

const projectEditorSchema = projectFormSchema;

type ProjectEditorValues = z.infer<typeof projectEditorSchema>;

type ProjectFormProps = {
  project?: ProjectDetail;
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

export function ProjectForm({ project, tags }: ProjectFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProjectEditorValues>({
    resolver: zodResolver(projectEditorSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      contentMarkdown: project?.contentMarkdown ?? "",
      repositoryUrl: project?.repositoryUrl ?? "",
      demoUrl: project?.demoUrl ?? "",
      coverImageUrl: project?.coverImageUrl ?? "",
      iconName: project?.iconName === "chart" || project?.iconName === "database" ? project.iconName : "blocks",
      status: project?.status ?? "draft",
      tagIds: project?.tags.map((tag) => tag.id) ?? [],
      isFeatured: project?.isFeatured ?? false,
      sortOrder: project?.sortOrder ?? 0,
    },
  });

  function onSubmit(values: ProjectEditorValues) {
    const actionInput = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      contentMarkdown: values.contentMarkdown,
      repositoryUrl: values.repositoryUrl,
      demoUrl: values.demoUrl,
      coverImageUrl: values.coverImageUrl,
      iconName: values.iconName,
      status: values.status,
      tagIds: values.tagIds,
      isFeatured: values.isFeatured,
      sortOrder: values.sortOrder,
    };

    startTransition(async () => {
      const toastId = toast.info(project ? "Atualizando projeto..." : "Criando projeto...");
      const result = project
        ? await updateProjectAction(project.id, actionInput)
        : await createProjectAction(actionInput);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/admin/projects");
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
                if (!project) {
                  form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
          {form.formState.errors.title ? <p className="text-sm text-red-600">{form.formState.errors.title.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input id="slug" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("slug")} />
          {form.formState.errors.slug ? <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição</label>
          <textarea id="description" rows={3} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("description")} />
          {form.formState.errors.description ? <p className="text-sm text-red-600">{form.formState.errors.description.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="contentMarkdown" className="text-sm font-medium">Conteúdo Markdown</label>
          <textarea id="contentMarkdown" rows={10} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("contentMarkdown")} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <label htmlFor="repositoryUrl" className="text-sm font-medium">URL do repositório</label>
            <input id="repositoryUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("repositoryUrl")} />
            {form.formState.errors.repositoryUrl ? <p className="text-sm text-red-600">{form.formState.errors.repositoryUrl.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="demoUrl" className="text-sm font-medium">URL demo</label>
            <input id="demoUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("demoUrl")} />
            {form.formState.errors.demoUrl ? <p className="text-sm text-red-600">{form.formState.errors.demoUrl.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="coverImageUrl" className="text-sm font-medium">URL da capa</label>
            <input id="coverImageUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("coverImageUrl")} />
            {form.formState.errors.coverImageUrl ? <p className="text-sm text-red-600">{form.formState.errors.coverImageUrl.message}</p> : null}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_160px_160px_120px]">
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
          <div className="grid gap-2">
            <label htmlFor="iconName" className="text-sm font-medium">Ícone</label>
            <select id="iconName" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("iconName")}>
              <option value="blocks">Blocos</option>
              <option value="chart">Gráfico</option>
              <option value="database">Banco</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select id="status" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("status")}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="sortOrder" className="text-sm font-medium">Ordem</label>
            <input id="sortOrder" type="number" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("sortOrder", { valueAsNumber: true })} />
          </div>
        </div>
        <label className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-800">
          <input type="checkbox" className="size-4" {...form.register("isFeatured")} />
          Destaque na home
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar projeto"}
        </Button>
      </div>
    </form>
  );
}
