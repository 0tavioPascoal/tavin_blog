import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos e estudos técnicos de Otávio Pascoal.",
};

const PROJECTS_PER_PAGE = 6;

type ProjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    page?: string;
  }>;
};

function buildProjectsUrl(params: {
  q?: string;
  tag?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const queryString = searchParams.toString();

  return queryString ? `/projetos?${queryString}` : "/projetos";
}

function normalizePage(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { q, tag, page } = await searchParams;

  const [projects, tags] = await Promise.all([
    listPublishedProjects(),
    listActiveTags(),
  ]);

  const searchTerm = q?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = searchTerm
      ? [
          project.title,
          project.description,
          ...project.tags.map((projectTag) => projectTag.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesTag = activeTagSlug
      ? project.tags.some((projectTag) => projectTag.slug === activeTagSlug)
      : true;

    return matchesSearch && matchesTag;
  });

  const currentPage = normalizePage(page);
  const totalPages = Math.max(
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE),
    1,
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = filteredProjects.slice(
    (safeCurrentPage - 1) * PROJECTS_PER_PAGE,
    safeCurrentPage * PROJECTS_PER_PAGE,
  );

  const hasFilters = Boolean(searchTerm || activeTagSlug);

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Projetos
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore os projetos
          </h1>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:p-5">
        <form>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              name="q"
              defaultValue={searchTerm}
              placeholder="Buscar por título, descrição ou tag..."
              className="h-12 w-full rounded-xl border border-slate-300/70 bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:hover:border-slate-700"
            />
          </div>

          {activeTagSlug ? (
            <input type="hidden" name="tag" value={activeTagSlug} />
          ) : null}
        </form>

        {tags.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((currentTag) => {
                const active = activeTagSlug === currentTag.slug;

                return (
                  <TagBadge
                    key={currentTag.id}
                    href={buildProjectsUrl({
                      q: searchTerm,
                      tag: active ? undefined : currentTag.slug,
                    })}
                    name={active ? `${currentTag.name} ×` : currentTag.name}
                    colorHex={currentTag.colorHex}
                    active={active}
                    className="h-8 px-3 text-[11px]"
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length} resultado
          {filteredProjects.length === 1 ? "" : "s"} encontrado
          {filteredProjects.length === 1 ? "" : "s"}
          {totalPages > 1 ? (
            <>
              {" "}
              · página {safeCurrentPage} de {totalPages}
            </>
          ) : null}
        </p>

        {hasFilters ? (
          <Link
            href="/projetos"
            className="w-fit text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Limpar filtros
          </Link>
        ) : null}
      </div>

      {paginatedProjects.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={buildProjectsUrl({
                  q: searchTerm,
                  tag: activeTagSlug,
                  page: safeCurrentPage - 1,
                })}
                aria-disabled={safeCurrentPage === 1}
                className={cn(
                  "inline-flex h-10 items-center rounded-xl border border-slate-300/70 bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400",
                  safeCurrentPage === 1 && "pointer-events-none opacity-50",
                )}
              >
                Anterior
              </Link>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const active = safeCurrentPage === pageNumber;

                return (
                  <Link
                    key={pageNumber}
                    href={buildProjectsUrl({
                      q: searchTerm,
                      tag: activeTagSlug,
                      page: pageNumber,
                    })}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl border text-sm font-semibold shadow-sm transition",
                      active
                        ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                        : "border-slate-300/70 bg-card text-foreground hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400",
                    )}
                  >
                    {pageNumber}
                  </Link>
                );
              })}

              <Link
                href={buildProjectsUrl({
                  q: searchTerm,
                  tag: activeTagSlug,
                  page: safeCurrentPage + 1,
                })}
                aria-disabled={safeCurrentPage === totalPages}
                className={cn(
                  "inline-flex h-10 items-center rounded-xl border border-slate-300/70 bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400",
                  safeCurrentPage === totalPages &&
                    "pointer-events-none opacity-50",
                )}
              >
                Próxima
              </Link>
            </nav>
          ) : null}
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={
              hasFilters
                ? "Nenhum projeto encontrado"
                : "Nenhum projeto publicado"
            }
            description={
              hasFilters
                ? "Tente buscar por outro termo ou limpar os filtros."
                : "Publique projetos pelo admin para alimentar esta página."
            }
          />
        </div>
      )}
    </section>
  );
}
