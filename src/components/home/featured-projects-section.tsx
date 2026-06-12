import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProjectSummary } from "@/features/projects/types/project";

type FeaturedProjectsSectionProps = {
  projects: ProjectSummary[];
};

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <section>
      <SectionHeading
        title="Projetos em Destaque"
        action={
          <Link href="/projetos" className="inline-flex items-center gap-1 text-sm font-medium text-blue-700">
            Ver todos os projetos
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
