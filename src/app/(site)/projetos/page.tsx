import type { Metadata } from "next";
import { FolderKanban, Sparkles } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos e estudos técnicos de Otávio Pascoal.",
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <PageHero
        eyebrow="Projetos"
        title="Soluções que conectam negócio, tecnologia e qualidade."
        icon={FolderKanban}
        description={
          <p>
            Uma seleção de aplicações, plataformas e estudos construídos com
            foco em problemas reais, organização técnica e entrega de valor.
          </p>
        }
        meta={
          projects.length > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
              {projects.length}{" "}
              {projects.length === 1
                ? "projeto publicado"
                : "projetos publicados"}
            </span>
          ) : null
        }
      />

      {projects.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:mt-10 xl:grid-cols-3">
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
