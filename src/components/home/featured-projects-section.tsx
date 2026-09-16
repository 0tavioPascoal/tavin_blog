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
      <div className="flex flex-col gap-4">
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
          className="group inline-flex h-9 w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Ver todos os projetos
          <ArrowRight
            className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs lg:mt-0">
        <div className="divide-y divide-border/70">
          {projects.map((project) => (
            <div key={project.id} className="p-1">
              <ProjectCard project={project} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
