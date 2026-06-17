"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Blocks,
  Bookmark,
  ExternalLink,
  Hash,
  ImageIcon,
  LinkIcon,
  ListOrdered,
  Save,
  Star,
  Text,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import {
  createProjectAction,
  updateProjectAction,
} from "@/features/projects/actions/project-actions";
import { projectFormSchema } from "@/features/projects/schemas/project-schema";
import type { ProjectDetail } from "@/features/projects/types/project";
import type { TagSummary } from "@/features/tags/types/tag";

const projectEditorSchema = projectFormSchema;

type ProjectEditorValues = z.infer<typeof projectEditorSchema>;

type ProjectFormProps = {
  project?: ProjectDetail;
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
      iconName:
        project?.iconName === "chart" || project?.iconName === "database"
          ? project.iconName
          : "blocks",
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
      const toastId = toast.info(
        project ? "Atualizando projeto..." : "Criando projeto...",
      );

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
      <section className="rounded-2xl border border-slate-300 bg-card p-4 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20 sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações do projeto
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Configure dados principais, links, tecnologias, status e destaque do
            projeto no portfólio.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Título
            </label>

            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="title"
                placeholder="RH Analyzer"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("title", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (!project) {
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
            <label htmlFor="slug" className="text-sm font-semibold text-foreground">
              Slug
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="slug"
                placeholder="rh-analyzer"
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
                placeholder="Resumo curto que aparece nos cards do portfólio."
                className="w-full rounded-xl border border-slate-400/70 bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>

            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="contentMarkdown"
              className="text-sm font-semibold text-foreground"
            >
              Conteúdo Markdown
            </label>

            <textarea
              id="contentMarkdown"
              rows={12}
              placeholder={`# Sobre o projeto\n\nDescreva objetivo, arquitetura, tecnologias e aprendizados...`}
              className="min-h-72 rounded-xl border border-slate-400/70 bg-card px-4 py-3 font-mono text-sm leading-6 text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
              {...form.register("contentMarkdown")}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="grid gap-2">
              <label
                htmlFor="repositoryUrl"
                className="text-sm font-semibold text-foreground"
              >
                URL do repositório
              </label>

              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="repositoryUrl"
                  placeholder="https://github.com/..."
                  className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("repositoryUrl")}
                />
              </div>

              <FieldError message={form.formState.errors.repositoryUrl?.message} />
            </div>

            <div className="grid gap-2">
              <label htmlFor="demoUrl" className="text-sm font-semibold text-foreground">
                URL demo
              </label>

              <div className="relative">
                <ExternalLink className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="demoUrl"
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("demoUrl")}
                />
              </div>

              <FieldError message={form.formState.errors.demoUrl?.message} />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="coverImageUrl"
                className="text-sm font-semibold text-foreground"
              >
                URL da capa
              </label>

              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="coverImageUrl"
                  placeholder="/images/projeto.png"
                  className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("coverImageUrl")}
                />
              </div>

              <FieldError message={form.formState.errors.coverImageUrl?.message} />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">
                Tecnologias
              </span>

              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
                {tags.length > 0 ? (
                  <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
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
                Selecione as tecnologias relacionadas ao projeto.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="iconName"
                    className="text-sm font-semibold text-foreground"
                  >
                    Ícone
                  </label>

                  <div className="relative">
                    <Blocks className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <select
                      id="iconName"
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                      {...form.register("iconName")}
                    >
                      <option value="blocks">Blocos</option>
                      <option value="chart">Gráfico</option>
                      <option value="database">Banco</option>
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
              </div>

              <div className="grid items-stretch gap-5 md:grid-cols-[180px_1fr]">
                <div className="grid gap-2">
                  <label
                    htmlFor="sortOrder"
                    className="text-sm font-semibold text-foreground"
                  >
                    Ordem
                  </label>

                  <div className="relative">
                    <ListOrdered className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="sortOrder"
                      type="number"
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600 md:h-20 md:rounded-2xl"
                      {...form.register("sortOrder", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Destaque
                  </span>

                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                        <Star className="size-4" />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          Destaque na home
                        </span>

                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Exibir entre os projetos principais.
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 w-full rounded-xl border-slate-300 bg-white px-5 sm:w-auto text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:bg-slate-900"
          disabled={isPending}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-blue-600 px-5 sm:w-auto text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar projeto"}
        </Button>
      </div>
    </form>
  );
}
