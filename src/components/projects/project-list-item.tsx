import {
  ArrowRight,
  Blocks,
  ChartNoAxesCombined,
  DatabaseZap,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ProjectSummary } from "@/features/projects/types/project";

type ProjectListItemProps = {
  project: ProjectSummary;
};

const iconMap: Record<string, LucideIcon> = {
  blocks: Blocks,
  chart: ChartNoAxesCombined,
  database: DatabaseZap,
};

export function ProjectListItem({ project }: ProjectListItemProps) {
  const Icon = iconMap[project.iconName] ?? Blocks;
  const visibleTags = project.tags.slice(0, 3);
  const hiddenTagsCount = Math.max(project.tags.length - visibleTags.length, 0);
  const primaryUrl = project.demoUrl ?? project.repositoryUrl;
  const primaryLabel = project.demoUrl ? "Ver projeto" : "Ver código";
  const showRepositoryAction = Boolean(project.demoUrl && project.repositoryUrl);

  return (
    <article className="group border-b border-border/80 py-5 first:pt-0 sm:py-6">
      <div className="rounded-lg px-2 py-2 transition-colors group-hover:bg-muted/35 sm:px-3">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <Icon className="size-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-xl">
              {project.title}
            </h3>

            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {project.description}
            </p>

            {project.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
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
            ) : null}

            {primaryUrl || showRepositoryAction ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                {primaryUrl ? (
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${primaryLabel}: ${project.title} (nova aba)`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:text-blue-600 dark:hover:text-blue-400 dark:group-hover:text-blue-400"
                  >
                    {primaryLabel}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                ) : null}

                {showRepositoryAction ? (
                  <a
                    href={project.repositoryUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Código do projeto ${project.title} (nova aba)`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <FaGithub className="size-3.5" aria-hidden="true" />
                    Código
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
