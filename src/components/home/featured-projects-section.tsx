import { ArrowRight, FolderKanban } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectSummary } from "@/features/projects/types/project";

type FeaturedProjectsSectionProps = {
  projects: ProjectSummary[];
};

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-projects-title"
      className="lg:row-span-2 lg:grid lg:grid-rows-subgrid"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
            <FolderKanban className="size-4" aria-hidden="true" />
            Portfólio técnico
          </div>

          <h2
            id="featured-projects-title"
            className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Projetos em destaque
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Aplicações, estudos e soluções construídas com foco em arquitetura,
            qualidade e experiência de uso.
          </p>
        </div>

        <Link
          href="/projetos"
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-muted-foreground transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 dark:focus-visible:ring-offset-slate-950"
        >
          Ver todos os projetos
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-300/70 bg-card shadow-sm dark:border-slate-800 lg:mt-0">
        <div className="divide-y divide-slate-300/70 dark:divide-slate-800">
          {projects.map((project) => (
            <div
              key={project.id}
              className="transition-colors hover:bg-muted/35"
            >
              <ProjectCard project={project} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
