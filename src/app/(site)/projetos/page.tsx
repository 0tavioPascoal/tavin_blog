import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import { ProjectListItem } from "@/components/projects/project-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedProjects } from "@/features/projects/repositories/projects-repository";
import type { ProjectSummary } from "@/features/projects/types/project";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos pessoais, acadêmicos e experiências técnicas desenvolvidos por Otávio Pascoal.",
};

type ProjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    view?: string;
    page?: string;
  }>;
};

type ProjectListSectionProps = {
  title: string;
  titleId: string;
  projects: ProjectSummary[];
};

function ProjectListSection({ title, titleId, projects }: ProjectListSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby={titleId}>
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2
          id={titleId}
          className="text-sm font-bold uppercase tracking-[0.12em] text-foreground sm:text-base"
        >
          {title}
        </h2>
        <p className="shrink-0 pb-0.5 text-xs text-muted-foreground">
          {projects.length} projeto{projects.length === 1 ? "" : "s"}
        </p>
      </header>
      <div>
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { q, tag, view: requestedView } = await searchParams;
  const projects = await listPublishedProjects();
  const searchTerm = q?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";
  const view = requestedView === "grid" ? "grid" : "list";
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase("pt-BR");

  const tagMap = new Map(
    projects.flatMap((project) => project.tags).map((projectTag) => [projectTag.id, projectTag]),
  );
  const tags = Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const filteredProjects = projects.filter((project) => {
    const searchableContent = [
      project.title,
      project.description,
      ...project.tags.map((projectTag) => projectTag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch = normalizedSearchTerm
      ? searchableContent.includes(normalizedSearchTerm)
      : true;
    const matchesTag = activeTagSlug
      ? project.tags.some((projectTag) => projectTag.slug === activeTagSlug)
      : true;

    return matchesSearch && matchesTag;
  });

  const featuredProjects = filteredProjects.filter((project) => project.isFeatured).slice(0, 3);
  const featuredIds = new Set(featuredProjects.map((project) => project.id));
  const remainingProjects = filteredProjects.filter((project) => !featuredIds.has(project.id));
  const hasFilters = Boolean(searchTerm || activeTagSlug);
  const hasResults = filteredProjects.length > 0;

  return (
    <PageContainer as="main" size="wide" className="max-w-7xl">
      <PageHeader
        eyebrow="Portfólio técnico"
        title="Projetos"
        description="Aplicações, estudos técnicos e experimentos construídos com foco em arquitetura, qualidade e experiência de uso."
      />

      <ProjectFilterBar
        tags={tags}
        searchTerm={searchTerm}
        activeTagSlug={activeTagSlug}
        view={view}
        resultCount={filteredProjects.length}
      />

      {!hasResults ? (
        <section aria-label="Resultado da busca" className="mt-10">
          <EmptyState
            title={hasFilters ? "Nenhum projeto encontrado" : "Nenhum projeto publicado"}
            description={
              hasFilters
                ? "Tente buscar por outro termo ou remova os filtros aplicados."
                : "Novos projetos aparecerão aqui assim que forem publicados."
            }
            action={
              hasFilters ? (
                <Link
                  href={`/projetos?view=${view}`}
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Limpar filtros
                </Link>
              ) : undefined
            }
          />
        </section>
      ) : view === "list" ? (
        <div className="mt-10 space-y-12">
          <ProjectListSection title="Destaques" titleId="featured-projects-title" projects={featuredProjects} />
          <ProjectListSection title="Todos os projetos" titleId="all-projects-title" projects={remainingProjects} />
        </div>
      ) : (
        <section aria-labelledby="all-projects-title" className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
            <h2 id="all-projects-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Todos os projetos
            </h2>
            <p className="text-xs text-muted-foreground">
              {filteredProjects.length} projeto{filteredProjects.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

    </PageContainer>
  );
}
