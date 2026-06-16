import type { Metadata } from "next";
import { FolderKanban, Sparkles } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos e estudos técnicos de Otávio Pascoal.",
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();

  return (
    <section className="w-full px-6 py-12 sm:px-10 lg:px-[7vw]">
      <div className="relative overflow-hidden rounded-3xl border border-slate-300/70 bg-card p-8 shadow-sm dark:border-slate-800 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

        <div className="relative max-w-4xl">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <FolderKanban className="size-6" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Projetos
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Soluções que conectam negócio, tecnologia e qualidade.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Uma seleção de aplicações, plataformas e estudos construídos com
            foco em problemas reais, organização técnica e entrega de valor.
          </p>

          {projects.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                {projects.length}{" "}
                {projects.length === 1
                  ? "projeto publicado"
                  : "projetos publicados"}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Nenhum projeto publicado"
            description="Publique projetos pelo admin para alimentar esta página."
          />
        </div>
      )}
    </section>
  );
}