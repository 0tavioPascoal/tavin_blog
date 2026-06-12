import { ExternalLink } from "lucide-react";
import Link from "next/link";

import type { Project } from "@/features/projects/types/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <Link
      id={project.id}
      href={project.href}
      className="group flex gap-4 border-l border-slate-200 py-4 pl-5 transition hover:border-blue-500 dark:border-slate-800"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="font-semibold text-slate-950 dark:text-white">{project.title}</span>
          <ExternalLink className="size-4 shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-400">
          {project.description}
        </span>
      </span>
    </Link>
  );
}
