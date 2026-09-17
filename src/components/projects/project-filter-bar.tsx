"use client";

import { Check, ChevronDown, Grid2X2, List, Search, X } from "lucide-react";
import Link from "next/link";
import { Popover } from "radix-ui";

import type { TagSummary } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";

export type ProjectView = "list" | "grid";

type ProjectFilterBarProps = {
  tags: TagSummary[];
  searchTerm: string;
  activeTagSlug: string;
  view: ProjectView;
  resultCount: number;
};

type ProjectsUrlParams = {
  q?: string;
  tag?: string;
  view?: ProjectView;
};

export function buildProjectsUrl(params: ProjectsUrlParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.view) searchParams.set("view", params.view);

  const queryString = searchParams.toString();
  return queryString ? `/projetos?${queryString}` : "/projetos";
}

export function ProjectFilterBar({ tags, searchTerm, activeTagSlug, view, resultCount }: ProjectFilterBarProps) {
  const activeTag = tags.find((tag) => tag.slug === activeTagSlug);
  const sharedParams = {
    q: searchTerm || undefined,
    tag: activeTagSlug || undefined,
    view,
  } satisfies ProjectsUrlParams;
  const hasFilters = Boolean(searchTerm || activeTagSlug);

  return (
    <section aria-label="Busca e filtros de projetos" className="mt-8">
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto_auto]">
        <form className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="project-search" className="sr-only">Buscar projetos</label>
          <input
            id="project-search"
            name="q"
            type="search"
            defaultValue={searchTerm}
            placeholder="Buscar projetos por nome, descrição ou tecnologia..."
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {activeTagSlug ? <input type="hidden" name="tag" value={activeTagSlug} /> : null}
          <input type="hidden" name="view" value={view} />
          <button type="submit" aria-label="Buscar projetos" className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Search className="size-4" aria-hidden="true" />
          </button>
        </form>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-11 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-40",
                activeTag ? "border-primary/50 bg-primary/5 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="truncate">{activeTag?.name ?? "Tecnologia"}</span>
              <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="start" sideOffset={8} collisionPadding={16} className="z-60 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none">
              <Popover.Close asChild>
                <Link href={buildProjectsUrl({ ...sharedParams, tag: undefined })} className="flex min-h-9 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Todas as tecnologias
                  {!activeTag ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
                </Link>
              </Popover.Close>
              {tags.map((tag) => (
                <Popover.Close key={tag.id} asChild>
                  <Link href={buildProjectsUrl({ ...sharedParams, tag: tag.slug })} aria-current={tag.slug === activeTagSlug ? "page" : undefined} className="flex min-h-9 items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="truncate">{tag.name}</span>
                    {tag.slug === activeTagSlug ? <Check className="size-4 shrink-0 text-primary" aria-hidden="true" /> : null}
                  </Link>
                </Popover.Close>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <div role="group" className="flex h-11 items-center rounded-lg border border-border bg-card p-1" aria-label="Visualização dos projetos">
          {(["list", "grid"] as const).map((option) => {
            const Icon = option === "list" ? List : Grid2X2;
            const label = option === "list" ? "Lista" : "Grade";
            return (
              <Link
                key={option}
                href={buildProjectsUrl({ ...sharedParams, view: option })}
                aria-label={`Visualizar projetos como ${option === "list" ? "lista" : "grade"}`}
                aria-current={view === option ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-none",
                  view === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeTag ? (
            <Link href={buildProjectsUrl({ ...sharedParams, tag: undefined })} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {activeTag.name}<X className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
          {searchTerm ? (
            <Link href={buildProjectsUrl({ ...sharedParams, q: undefined })} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Busca: “{searchTerm}”<X className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
          {hasFilters ? (
            <Link href={buildProjectsUrl({ view })} className="rounded-sm text-xs font-semibold text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400">Limpar filtros</Link>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {resultCount} projeto{resultCount === 1 ? "" : "s"}{hasFilters ? " encontrado" : ""}{hasFilters && resultCount !== 1 ? "s" : ""}
        </p>
      </div>
    </section>
  );
}
