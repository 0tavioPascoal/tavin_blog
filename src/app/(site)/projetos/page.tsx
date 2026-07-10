import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Search,
  SlidersHorizontal,
  Tags,
  X,
} from "lucide-react";

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

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { q, tag, page } = await searchParams;

  const [projects, tags] = await Promise.all([
    listPublishedProjects(),
    listActiveTags(),
  ]);

  const searchTerm = q?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";

  const filteredProjects = projects.filter((project) => {
    const searchableContent = [
      project.title,
      project.description,
      ...project.tags.map((projectTag) => projectTag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch = searchTerm
      ? searchableContent.includes(searchTerm.toLocaleLowerCase("pt-BR"))
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

  const activeTag = tags.find(
    (currentTag) => currentTag.slug === activeTagSlug,
  );

  return (
    <main className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-[7vw] lg:py-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-8 shadow-sm dark:border-slate-800 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
              <FolderKanban className="size-3.5" />
              Portfólio técnico
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Projetos que transformam ideias em soluções reais.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Aplicações, estudos técnicos e experimentos construídos com foco
              em arquitetura, produto, qualidade e experiência de uso.
            </p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
            <div className="flex items-center gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                <FolderKanban className="size-5" />
              </span>

              <div>
                <strong className="block text-2xl font-bold tracking-tight text-foreground">
                  {projects.length}
                </strong>

                <span className="text-sm font-medium text-muted-foreground">
                  {projects.length === 1
                    ? "projeto publicado"
                    : "projetos publicados"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-300/70 bg-card p-3 shadow-sm dark:border-slate-800 sm:p-4">
        <form className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="project-search" className="sr-only">
            Buscar projetos
          </label>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="project-search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Busque por título, descrição ou tecnologia..."
              className="h-12 w-full rounded-xl border border-transparent bg-muted/55 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 hover:bg-muted focus:border-blue-500 focus:bg-background focus:ring-4 focus:ring-blue-500/10 dark:bg-slate-900/70 dark:hover:bg-slate-900"
            />
          </div>

          {activeTagSlug ? (
            <input type="hidden" name="tag" value={activeTagSlug} />
          ) : null}

          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
          >
            <Search className="size-4" />
            Buscar projetos
          </button>
        </form>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        {tags.length > 0 ? (
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="h-64 overflow-y-auto rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Explorar</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Filtre por tecnologia
                  </p>
                </div>

                <SlidersHorizontal className="size-4 text-muted-foreground" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Tags className="size-4 text-blue-600 dark:text-blue-400" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                    Tecnologias e temas
                  </p>
                </div>

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
                        className="h-8 px-3 text-[11px] shadow-none"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <section className="min-w-0" aria-labelledby="projects-title">
          {tags.length > 0 ? (
            <details className="group mb-5 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-slate-300/70 bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-800 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-400" />
                  Filtrar projetos

                  {activeTagSlug ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      1
                    </span>
                  ) : null}
                </span>

                <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-2 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:p-5">
                <div className="flex items-center gap-2">
                  <Tags className="size-4 text-blue-600 dark:text-blue-400" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                    Tecnologias e temas
                  </p>
                </div>

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
                        className="h-8 px-3 text-[11px] shadow-none"
                      />
                    );
                  })}
                </div>
              </div>
            </details>
          ) : null}

          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Resultados
              </p>

              <h2
                id="projects-title"
                className="mt-1 text-2xl font-bold tracking-tight text-foreground"
              >
                {hasFilters ? "Projetos encontrados" : "Todos os projetos"}
              </h2>

              <p className="mt-1.5 text-sm text-muted-foreground">
                {filteredProjects.length} resultado
                {filteredProjects.length === 1 ? "" : "s"}
                {totalPages > 1
                  ? ` · página ${safeCurrentPage} de ${totalPages}`
                  : ""}
              </p>
            </div>

            {hasFilters ? (
              <Link
                href="/projetos"
                className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-muted-foreground transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <X className="size-3.5" />
                Limpar filtros
              </Link>
            ) : null}
          </div>

          {hasFilters ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {searchTerm ? (
                <Link
                  href={buildProjectsUrl({
                    tag: activeTagSlug,
                  })}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 text-xs font-semibold text-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
                >
                  Busca: “{searchTerm}”
                  <X className="size-3" />
                </Link>
              ) : null}

              {activeTag ? (
                <Link
                  href={buildProjectsUrl({
                    q: searchTerm,
                  })}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
                >
                  Tag: {activeTag.name}
                  <X className="size-3" />
                </Link>
              ) : null}
            </div>
          ) : null}

          {paginatedProjects.length > 0 ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {paginatedProjects.map((project) => (
                  <div key={project.id} className="h-full *:h-full">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>

              {totalPages > 1 ? (
                <nav
                  aria-label="Paginação de projetos"
                  className="mt-9 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-7"
                >
                  <Link
                    href={buildProjectsUrl({
                      q: searchTerm,
                      tag: activeTagSlug,
                      page: safeCurrentPage - 1,
                    })}
                    aria-disabled={safeCurrentPage === 1}
                    aria-label="Página anterior"
                    className={cn(
                      "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300/70 bg-card px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400 sm:px-4",
                      safeCurrentPage === 1 &&
                        "pointer-events-none opacity-40",
                    )}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Anterior</span>
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
                            ? "border-blue-600 bg-blue-600 text-white shadow-blue-600/20"
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
                    aria-label="Próxima página"
                    className={cn(
                      "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300/70 bg-card px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400 sm:px-4",
                      safeCurrentPage === totalPages &&
                        "pointer-events-none opacity-40",
                    )}
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300/80 bg-card p-4 dark:border-slate-800">
              <EmptyState
                title={
                  hasFilters
                    ? "Nenhum projeto encontrado"
                    : "Nenhum projeto publicado"
                }
                description={
                  hasFilters
                    ? "Tente buscar por outro termo ou remova o filtro aplicado."
                    : "Publique projetos pelo admin para alimentar esta página."
                }
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}