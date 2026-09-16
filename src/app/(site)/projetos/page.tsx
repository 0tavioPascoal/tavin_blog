import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos pessoais, acadêmicos e experiências técnicas desenvolvidos por Otávio Pascoal.",
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

  return (
    <PageContainer as="main">
      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Portfólio técnico"
        title="Projetos"
        description="Aplicações, estudos técnicos e experimentos construídos com foco em arquitetura, qualidade e experiência de uso."
      />

      {/* Barra de Busca e Filtros de Tecnologia */}
      <section className="mt-8 space-y-6">
        {/* Campo de Busca */}
        <form className="flex w-full items-center gap-2 sm:gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              name="q"
              defaultValue={searchTerm}
              placeholder="Buscar projetos por nome, descrição ou tecnologia..."
              aria-label="Buscar projetos"
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-border/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {activeTagSlug ? (
            <input type="hidden" name="tag" value={activeTagSlug} />
          ) : null}

          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Buscar
          </button>
        </form>

        {/* Filtro por Tags de Tecnologia */}
        {tags.length > 0 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
            <span className="mr-1 shrink-0 text-xs font-medium text-muted-foreground">
              Tecnologias:
            </span>
            {tags.slice(0, 16).map((currentTag) => {
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
                  className="h-9 shrink-0 px-3 text-[10px] shadow-none"
                />
              );
            })}
          </div>
        ) : null}

        {/* Resumo e Limpar Filtros */}
        <div className="flex items-center justify-between gap-4 border-t border-border/80 pt-4 text-xs text-muted-foreground">
          <p>
            {filteredProjects.length} projeto
            {filteredProjects.length === 1 ? "" : "s"} encontrado
            {filteredProjects.length === 1 ? "" : "s"}
            {totalPages > 1
              ? ` · página ${safeCurrentPage} de ${totalPages}`
              : ""}
          </p>

          {hasFilters ? (
            <Link
              href="/projetos"
              className="shrink-0 rounded-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400"
            >
              Limpar filtros
            </Link>
          ) : null}
        </div>
      </section>

      {/* Grid de Projetos */}
      <section aria-label="Lista de projetos" className="mt-8">
        {paginatedProjects.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProjects.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Paginação Padronizada */}
            {totalPages > 1 ? (
              <nav
                aria-label="Paginação de projetos"
                className="mt-12 flex items-center justify-center gap-2 border-t border-border/80 pt-8"
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
                    "inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    safeCurrentPage === 1 && "pointer-events-none opacity-40",
                  )}
                >
                  <ChevronLeft className="size-4" />
                  <span>Anterior</span>
                </Link>

                <span className="px-2 text-xs font-semibold text-muted-foreground sm:hidden">
                  {safeCurrentPage}/{totalPages}
                </span>

                <div className="hidden items-center gap-1 sm:flex">
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
                          "inline-flex size-11 items-center justify-center rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          active
                            ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                            : "border-border bg-card text-foreground hover:bg-muted",
                        )}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={buildProjectsUrl({
                    q: searchTerm,
                    tag: activeTagSlug,
                    page: safeCurrentPage + 1,
                  })}
                  aria-disabled={safeCurrentPage === totalPages}
                  aria-label="Próxima página"
                  className={cn(
                    "inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    safeCurrentPage === totalPages &&
                      "pointer-events-none opacity-40",
                  )}
                >
                  <span>Próxima</span>
                  <ChevronRight className="size-4" />
                </Link>
              </nav>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="Nenhum projeto encontrado"
            description="Tente buscar por outro termo ou remova os filtros aplicados."
            action={
              <Link
                href="/projetos"
                className="inline-flex h-11 items-center rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Limpar filtros
              </Link>
            }
          />
        )}
      </section>
    </PageContainer>
  );
}
