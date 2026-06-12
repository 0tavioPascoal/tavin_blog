import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos e estudos técnicos de Otávio Pascoal.",
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Projetos</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
        Soluções que conectam negócio, tecnologia e qualidade
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        Uma seleção de produtos, plataformas e estudos construídos com foco em problemas reais.
      </p>
      {projects.length > 0 ? (
        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white p-4 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState title="Nenhum projeto publicado" description="Publique projetos pelo admin para alimentar esta página." />
        </div>
      )}
    </section>
  );
}
