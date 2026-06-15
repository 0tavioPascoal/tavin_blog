import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";

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
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-md shadow-slate-200/70 dark:shadow-black/20 lg:p-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <FolderKanban className="size-6" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Projetos
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-card-foreground md:text-5xl">
          Soluções que conectam negócio, tecnologia e qualidade.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Uma seleção de aplicações, plataformas e estudos construídos com foco
          em problemas reais, organização técnica e entrega de valor.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="mt-8 grid gap-5">
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