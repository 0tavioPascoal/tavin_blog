import type { Metadata } from "next";
import Link from "next/link";

import { ArticleArchiveNav } from "@/components/blog/article-archive-nav";
import { ArticleCard } from "@/components/blog/article-card";
import { ArticleFilterBar } from "@/components/blog/article-filter-bar";
import { ArticleListItem } from "@/components/blog/article-list-item";
import { ArticlesNewsletterPanel } from "@/components/blog/articles-newsletter-panel";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";
import { groupArticlesByYearMonth } from "@/features/posts/utils/group-articles-by-year-month";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Conteúdos sobre desenvolvimento, arquitetura e engenharia de software.",
};

type ArticlesPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    tag?: string;
    view?: string;
  }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { q, categoria, tag, view: requestedView } = await searchParams;
  const [articles, categories, tags] = await Promise.all([
    listPublishedArticles(),
    listActiveCategories(),
    listActiveTags(),
  ]);

  const searchTerm = q?.trim() ?? "";
  const activeCategorySlug = categoria?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";
  const view = requestedView === "grid" ? "grid" : "list";
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase("pt-BR");

  const filteredArticles = articles.filter((article) => {
    const searchableContent = [
      article.title,
      article.description,
      article.category?.name,
      ...article.tags.map((articleTag) => articleTag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch = normalizedSearchTerm
      ? searchableContent.includes(normalizedSearchTerm)
      : true;
    const matchesCategory = activeCategorySlug
      ? article.category?.slug === activeCategorySlug
      : true;
    const matchesTag = activeTagSlug
      ? article.tags.some((articleTag) => articleTag.slug === activeTagSlug)
      : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  const archiveArticles = filteredArticles;
  const archiveGroups = groupArticlesByYearMonth(archiveArticles);
  const hasFilters = Boolean(
    searchTerm || activeCategorySlug || activeTagSlug,
  );
  const hasResults = filteredArticles.length > 0;

  return (
    <PageContainer as="main" size="wide" className="max-w-7xl">
      <PageHeader
        eyebrow="Biblioteca técnica"
        title="Artigos"
        description="Conteúdos sobre desenvolvimento de software, arquitetura, qualidade e experiências técnicas."
      />

      <ArticleFilterBar
        categories={categories}
        tags={tags}
        searchTerm={searchTerm}
        activeCategorySlug={activeCategorySlug}
        activeTagSlug={activeTagSlug}
        view={view}
        resultCount={filteredArticles.length}
      />

      {!hasResults ? (
        <section aria-label="Resultado da busca" className="mt-10">
          <EmptyState
            title={hasFilters ? "Nenhum artigo encontrado" : "Nenhum artigo publicado ainda"}
            description={
              hasFilters
                ? "Tente buscar por outro termo ou remova algum filtro."
                : "Novos conteúdos aparecerão aqui assim que forem publicados."
            }
            action={
              hasFilters ? (
                <Link
                  href="/blog/artigos"
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Limpar filtros
                </Link>
              ) : undefined
            }
          />
        </section>
      ) : (
        <>
          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
            <div className="min-w-0">
              {view === "list" ? (
                <>
                  <ArticleArchiveNav groups={archiveGroups} mobile />

                  <div className="mt-8 space-y-12 xl:mt-0">
                      {archiveGroups.map((group) => (
                        <section
                          key={group.anchor}
                          id={group.anchor}
                          aria-labelledby={`${group.anchor}-title`}
                          className="scroll-mt-24"
                        >
                          <header className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
                            <h2
                              id={`${group.anchor}-title`}
                              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                            >
                              {group.year} — {group.monthLabel}
                            </h2>
                            <p className="shrink-0 pb-0.5 text-xs text-muted-foreground">
                              {group.articles.length} artigo
                              {group.articles.length === 1 ? "" : "s"}
                            </p>
                          </header>
                          <div>
                            {group.articles.map((article) => (
                              <ArticleListItem key={article.id} article={article} />
                            ))}
                          </div>
                        </section>
                      ))}
                  </div>
                </>
              ) : (
                <section aria-labelledby="all-articles-title">
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
                    <h2 id="all-articles-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      Todos os artigos
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {archiveArticles.length} artigo
                      {archiveArticles.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    {archiveArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside aria-label="Navegação complementar" className="hidden xl:block">
              <div className="sticky top-24 space-y-6">
                {view === "list" ? (
                  <div className="border-b border-border pb-6">
                    <ArticleArchiveNav groups={archiveGroups} />
                  </div>
                ) : null}
                <ArticlesNewsletterPanel titleId="articles-newsletter-sidebar-title" />
                <figure className="border-l-2 border-primary/40 pl-4">
                  <blockquote className="text-sm italic leading-6 text-muted-foreground">
                    “Tecnologia é mais interessante quando compartilhada.”
                  </blockquote>
                  <figcaption className="mt-2 text-xs font-semibold text-foreground">
                    — Otávio Pascoal
                  </figcaption>
                </figure>
              </div>
            </aside>
          </div>

        </>
      )}
    </PageContainer>
  );
}
