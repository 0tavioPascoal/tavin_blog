import {
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
  const href = project.demoUrl ?? project.repositoryUrl ?? `/projetos#${project.slug}`;
  const isExternal = href.startsWith("http");

  return (
    <Link
      id={project.slug}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(
        "group flex transition-all",
        compact
          ? "gap-3 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
          : "gap-4 rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
          compact ? "size-9 rounded-lg" : "size-10 rounded-xl",
        )}
      >
        <Icon className={compact ? "size-4" : "size-5"} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "line-clamp-1 font-semibold text-foreground",
              !compact && "text-lg",
            )}
          >
            {project.title}
          </span>

          <ExternalLink className="mt-0.5 size-4 shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        <span
          className={cn(
            "mt-1 block text-sm text-muted-foreground",
            compact ? "line-clamp-2 leading-5" : "leading-6",
          )}
        >
          {project.description}
        </span>

        {!compact && project.tags.length > 0 ? (
          <span className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} colorHex={tag.colorHex} />
            ))}
          </span>
        ) : null}
      </span>
    </Link>
  );
}