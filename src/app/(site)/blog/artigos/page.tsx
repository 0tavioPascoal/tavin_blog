import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { TagBadge } from "@/components/blog/tag-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { CategorySummary } from "@/features/categories/types/category";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";
import type { TagSummary } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Todos os artigos",
  description:
    "Biblioteca completa de artigos técnicos sobre desenvolvimento de software, arquitetura, qualidade e backend.",
};

const ARTICLES_PER_PAGE = 6;

type ArticlesPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    tag?: string;
    page?: string;
  }>;
};

function buildArticlesUrl(params: {
  q?: string;
  categoria?: string;
  tag?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.categoria) searchParams.set("categoria", params.categoria);
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const queryString = searchParams.toString();

  return queryString ? `/blog/artigos?${queryString}` : "/blog/artigos";
}

function normalizePage(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

type ArticleFilterOptionsProps = {
  categories: CategorySummary[];
  tags: TagSummary[];
  searchTerm: string;
  activeCategorySlug: string;
  activeTagSlug: string;
};

function ArticleFilterOptions({
  categories,
  tags,
  searchTerm,
  activeCategorySlug,
  activeTagSlug,
}: ArticleFilterOptionsProps) {
  return (
    <div className="grid gap-5">
      {categories.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categorias
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={buildArticlesUrl({ q: searchTerm, tag: activeTagSlug })}
              aria-current={!activeCategorySlug ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                !activeCategorySlug
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-slate-300 bg-background text-muted-foreground hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400",
              )}
            >
              Todas
            </Link>

            {categories.map((category) => {
              const active = activeCategorySlug === category.slug;

              return (
                <Link
                  key={category.id}
                  href={buildArticlesUrl({
                    q: searchTerm,
                    categoria: active ? undefined : category.slug,
                    tag: activeTagSlug,
                  })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    active
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-slate-300 bg-background text-muted-foreground hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400",
                  )}
                >
                  {active ? `${category.name} ×` : category.name}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((currentTag) => {
              const active = activeTagSlug === currentTag.slug;

              return (
                <TagBadge
                  key={currentTag.id}
                  href={buildArticlesUrl({
                    q: searchTerm,
                    categoria: activeCategorySlug,
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
  );
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { q, categoria, tag, page } = await searchParams;

  const [articles, categories, tags] = await Promise.all([
    listPublishedArticles(),
    listActiveCategories(),
    listActiveTags(),
  ]);

  const searchTerm = q?.trim() ?? "";
  const activeCategorySlug = categoria?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = searchTerm
      ? [
          article.title,
          article.description,
          article.category?.name,
          ...article.tags.map((articleTag) => articleTag.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = activeCategorySlug
      ? article.category?.slug === activeCategorySlug
      : true;

    const matchesTag = activeTagSlug
      ? article.tags.some((articleTag) => articleTag.slug === activeTagSlug)
      : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  const currentPage = normalizePage(page);
  const totalPages = Math.max(
    Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE),
    1,
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedArticles = filteredArticles.slice(
    (safeCurrentPage - 1) * ARTICLES_PER_PAGE,
    safeCurrentPage * ARTICLES_PER_PAGE,
  );

  const hasFilters = Boolean(searchTerm || activeCategorySlug || activeTagSlug);
  const activeFiltersCount = Number(Boolean(activeCategorySlug)) +
    Number(Boolean(activeTagSlug));

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Artigos
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore os conteúdos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Encontre artigos por assunto, tecnologia ou etapa da jornada de
            desenvolvimento.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:p-5">
        <form>
          <label htmlFor="article-search" className="sr-only">
            Buscar artigos
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="article-search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Buscar por título, descrição, categoria ou tag..."
              className="h-12 w-full rounded-xl border border-slate-300/70 bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:hover:border-slate-700"
            />

            <button
              type="submit"
              aria-label="Buscar artigos"
              title="Buscar"
              className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <Search className="size-4" />
            </button>
          </div>

          {activeCategorySlug ? (
            <input type="hidden" name="categoria" value={activeCategorySlug} />
          ) : null}

          {activeTagSlug ? (
            <input type="hidden" name="tag" value={activeTagSlug} />
          ) : null}
        </form>

        {categories.length > 0 || tags.length > 0 ? (
          <>
            <div className="mt-5 hidden border-t border-border pt-5 md:block">
              <ArticleFilterOptions
                categories={categories}
                tags={tags}
                searchTerm={searchTerm}
                activeCategorySlug={activeCategorySlug}
                activeTagSlug={activeTagSlug}
              />
            </div>

            <details className="group mt-5 md:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground transition hover:border-blue-300 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-400" />
                  Categorias e tags
                  {activeFiltersCount > 0 ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  ) : null}
                </span>

                <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-4 border-t border-border pt-4">
                <ArticleFilterOptions
                  categories={categories}
                  tags={tags}
                  searchTerm={searchTerm}
                  activeCategorySlug={activeCategorySlug}
                  activeTagSlug={activeTagSlug}
                />
              </div>
            </details>
          </>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredArticles.length} resultado
          {filteredArticles.length === 1 ? "" : "s"} encontrado
          {filteredArticles.length === 1 ? "" : "s"}
          {totalPages > 1 ? (
            <>
              {" "}
              · página {safeCurrentPage} de {totalPages}
            </>
          ) : null}
        </p>

        {hasFilters ? (
          <Link
            href="/blog/artigos"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <X className="size-3.5" />
            Limpar filtros
          </Link>
        ) : null}
      </div>

      {paginatedArticles.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav
              aria-label="Paginação de artigos"
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <Link
                href={buildArticlesUrl({
                  q: searchTerm,
                  categoria: activeCategorySlug,
                  tag: activeTagSlug,
                  page: safeCurrentPage - 1,
                })}
                aria-disabled={safeCurrentPage === 1}
                aria-label="Página anterior"
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300/70 bg-card px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400 sm:px-4",
                  safeCurrentPage === 1 && "pointer-events-none opacity-50",
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
                    href={buildArticlesUrl({
                      q: searchTerm,
                      categoria: activeCategorySlug,
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
                href={buildArticlesUrl({
                  q: searchTerm,
                  categoria: activeCategorySlug,
                  tag: activeTagSlug,
                  page: safeCurrentPage + 1,
                })}
                aria-disabled={safeCurrentPage === totalPages}
                aria-label="Próxima página"
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300/70 bg-card px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:text-blue-400 sm:px-4",
                  safeCurrentPage === totalPages &&
                    "pointer-events-none opacity-50",
                )}
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="size-4" />
              </Link>
            </nav>
          ) : null}
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="Nenhum artigo encontrado"
            description="Tente buscar por outro termo ou limpar os filtros."
          />
        </div>
      )}
    </section>
  );
}
