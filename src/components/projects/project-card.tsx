import {
  ArrowRight,
  Blocks,
  ChartNoAxesCombined,
  DatabaseZap,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ProjectSummary } from "@/features/projects/types/project";
import { cn } from "@/lib/utils";

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
  const href =
    project.demoUrl ?? project.repositoryUrl ?? `/projetos#${project.slug}`;
  const isExternal = href.startsWith("http");
  const visibleTags = project.tags.slice(0, 3);
  const hiddenTagsCount = Math.max(project.tags.length - visibleTags.length, 0);

  return (
    <Link
      id={project.slug}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex transition-all",
        compact
          ? "gap-3 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
          : "h-full min-h-0 flex-col rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:min-h-60 sm:p-5",
      )}
    >
      {compact ? (
        <>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Icon className="size-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-start justify-between gap-3">
              <span className="line-clamp-1 font-semibold text-foreground">
                {project.title}
              </span>

              <ExternalLink className="mt-0.5 size-4 shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>

            <span className="mt-1 block line-clamp-2 text-sm leading-5 text-muted-foreground">
              {project.description}
            </span>
          </span>
        </>
      ) : (
        <>
          <div className="flex min-h-7 flex-wrap items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <Icon className="size-4" />
            </span>

            {visibleTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                colorHex={tag.colorHex}
                className="px-2 py-0.5 text-[10px] leading-4"
              />
            ))}

            {hiddenTagsCount > 0 ? (
              <span className="inline-flex rounded-full border border-slate-300 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:border-slate-800">
                +{hiddenTagsCount}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {project.title}
          </h3>

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>

          <div
            className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-border pt-4 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
              Ver projeto
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>

            {isExternal ? (
              <span className="inline-flex items-center gap-1.5">
                Abre em nova aba
                <ExternalLink className="size-3.5" />
              </span>
            ) : null}
          </div>
        </>
      )}
    </Link>
  );
}
