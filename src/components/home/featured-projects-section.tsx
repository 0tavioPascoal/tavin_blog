import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProjectSummary } from "@/features/projects/types/project";

type FeaturedProjectsSectionProps = {
  projects: ProjectSummary[];
};

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  return (
    <section>
      <SectionHeading
        title="Projetos em Destaque"
        action={
          <Link
            href="/projetos"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver todos os projetos
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="mt-5 divide-y divide-border">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} compact />
        ))}
      </div>
    </section>
  );
}