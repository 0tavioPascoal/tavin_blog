import {
  Blocks,
  ChartNoAxesCombined,
  DatabaseZap,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ProjectSummary } from "@/features/projects/types/project";

type ProjectCardProps = {
  project: ProjectSummary;
  compact?: boolean;
};

const iconMap: Record<string, LucideIcon> = {
  blocks: Blocks,
  chart: ChartNoAxesCombined,
  database: DatabaseZap,
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const Icon = iconMap[project.iconName] ?? Blocks;
  const primaryHref =
    project.demoUrl ?? project.repositoryUrl ?? `/projetos#${project.slug}`;
  const isExternal = primaryHref.startsWith("http");
  const visibleTags = project.tags.slice(0, 4);
  const hiddenTagsCount = Math.max(project.tags.length - visibleTags.length, 0);

  if (compact) {
    return (
      <Link
        id={project.slug}
        href={primaryHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
          <Icon className="size-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate font-semibold text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {project.title}
            </h4>
            {isExternal ? (
              <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {project.description}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 transition-colors duration-150 hover:border-blue-500/50 hover:shadow-xs sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
          <Icon className="size-4" aria-hidden="true" />
        </span>

        {project.isFeatured ? (
          <span className="inline-flex h-6 items-center rounded-full border border-blue-200 bg-blue-50 px-2 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            Destaque
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 font-sans text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
        {project.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {/* Tags / Stack */}
      <div className="mt-auto pt-5">
        {visibleTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3.5">
            {visibleTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                colorHex={tag.colorHex}
                className="h-6 px-2 text-[10px] shadow-none"
              />
            ))}

            {hiddenTagsCount > 0 ? (
              <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2 text-[10px] font-bold text-muted-foreground">
                +{hiddenTagsCount}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="border-t border-border/70 pt-3.5" />
        )}

        {/* Ações */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Ver projeto</span>
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          ) : (
            <span className="inline-flex min-h-9 items-center text-xs font-medium text-muted-foreground">
              <span>Projeto técnico</span>
            </span>
          )}

          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Repositório do projeto ${project.title}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FaGithub className="size-3.5" aria-hidden="true" />
              <span>Código</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
