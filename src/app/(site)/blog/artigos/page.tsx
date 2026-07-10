import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Search,
  SlidersHorizontal,
  Tags,
  X,
} from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { TagBadge } from "@/components/blog/tag-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import type { CategorySummary } from "@/features/categories/types/category";
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

type ArticleFilterOptionsProps = {
  categories: CategorySummary[];
  tags: TagSummary[];
  searchTerm: string;
  activeCategorySlug: string;
  activeTagSlug: string;
};

type MetricCardProps = {
  icon: typeof BookOpenText;
  value: number;
  label: string;
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

function MetricCard({ icon: Icon, value, label }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
          <Icon className="size-4.5" />
        </span>

        <div className="min-w-0">
          <strong className="block text-xl font-bold tracking-tight text-foreground">
            {value}
          </strong>
          <span className="block truncate text-xs font-medium text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArticleFilterOptions({
  categories,
  tags,
  searchTerm,
  activeCategorySlug,
  activeTagSlug,
}: ArticleFilterOptionsProps) {
  return (
    <div className="grid gap-6">
      {categories.length > 0 ? (
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="size-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
              Categorias
            </p>
          </div>

          <div className="mt-3 grid gap-1.5">
            <Link
              href={buildArticlesUrl({ q: searchTerm, tag: activeTagSlug })}
              aria-current={!activeCategorySlug ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center justify-between rounded-xl border px-3.5 text-sm font-medium transition",
                !activeCategorySlug
                  ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
              )}
            >
              <span>Todas as categorias</span>

              {!activeCategorySlug ? (
                <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              ) : null}
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
                    "flex min-h-10 items-center justify-between gap-3 rounded-xl border px-3.5 text-sm font-medium transition",
                    active
                      ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="truncate">{category.name}</span>

                  {active ? <X className="size-3.5 shrink-0" /> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="border-t border-border pt-6">
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
                  href={buildArticlesUrl({
                    q: searchTerm,
                    categoria: activeCategorySlug,
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
    const searchableContent = [
      article.title,
      article.description,
      article.category?.name,
      ...article.tags.map((articleTag) => articleTag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch = searchTerm
      ? searchableContent.includes(searchTerm.toLocaleLowerCase("pt-BR"))
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
  const activeFiltersCount =
    Number(Boolean(searchTerm)) +
    Number(Boolean(activeCategorySlug)) +
    Number(Boolean(activeTagSlug));

  const activeCategory = categories.find(
    (category) => category.slug === activeCategorySlug,
  );
  const activeTag = tags.find((currentTag) => currentTag.slug === activeTagSlug);

  return (
    <main className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-[7vw] lg:py-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-8 shadow-sm dark:border-slate-800 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
              <BookOpenText className="size-3.5" />
              Biblioteca técnica
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Conteúdo prático para construir software melhor.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Artigos sobre backend, arquitetura, qualidade, regras de negócio e
              experiências reais de desenvolvimento.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-1">
            <MetricCard
              icon={BookOpenText}
              value={articles.length}
              label="artigos publicados"
            />
            <MetricCard
              icon={FolderTree}
              value={categories.length}
              label="categorias disponíveis"
            />
            <MetricCard icon={Tags} value={tags.length} label="tags para explorar" />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-300/70 bg-card p-3 shadow-sm dark:border-slate-800 sm:p-4">
        <form className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="article-search" className="sr-only">
            Buscar artigos
          </label>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="article-search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Busque por título, descrição, categoria ou tecnologia..."
              className="h-12 w-full rounded-xl border border-transparent bg-muted/55 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 hover:bg-muted focus:border-blue-500 focus:bg-background focus:ring-4 focus:ring-blue-500/10 dark:bg-slate-900/70 dark:hover:bg-slate-900"
            />
          </div>

          {activeCategorySlug ? (
            <input type="hidden" name="categoria" value={activeCategorySlug} />
          ) : null}

          {activeTagSlug ? (
            <input type="hidden" name="tag" value={activeTagSlug} />
          ) : null}

          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
          >
            <Search className="size-4" />
            Buscar artigos
          </button>
        </form>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        {(categories.length > 0 || tags.length > 0) && (
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="h-120 overflow-y-auto rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 xl:h-125">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Explorar</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Refine os resultados
                  </p>
                </div>

                <SlidersHorizontal className="size-4 text-muted-foreground" />
              </div>

              <ArticleFilterOptions
                categories={categories}
                tags={tags}
                searchTerm={searchTerm}
                activeCategorySlug={activeCategorySlug}
                activeTagSlug={activeTagSlug}
              />
            </div>
          </aside>
        )}

        <div className="min-w-0">
          {categories.length > 0 || tags.length > 0 ? (
            <details className="group mb-5 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-slate-300/70 bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-800 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-400" />
                  Filtrar artigos

                  {activeFiltersCount > 0 ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  ) : null}
                </span>

                <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-2 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:p-5">
                <ArticleFilterOptions
                  categories={categories}
                  tags={tags}
                  searchTerm={searchTerm}
                  activeCategorySlug={activeCategorySlug}
                  activeTagSlug={activeTagSlug}
                />
              </div>
            </details>
          ) : null}

          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Resultados
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {hasFilters ? "Artigos encontrados" : "Todos os artigos"}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {filteredArticles.length} resultado
                {filteredArticles.length === 1 ? "" : "s"}
                {totalPages > 1
                  ? ` · página ${safeCurrentPage} de ${totalPages}`
                  : ""}
              </p>
            </div>

            {hasFilters ? (
              <Link
                href="/blog/artigos"
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
                  href={buildArticlesUrl({
                    categoria: activeCategorySlug,
                    tag: activeTagSlug,
                  })}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 text-xs font-semibold text-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
                >
                  Busca: “{searchTerm}”
                  <X className="size-3" />
                </Link>
              ) : null}

              {activeCategory ? (
                <Link
                  href={buildArticlesUrl({ q: searchTerm, tag: activeTagSlug })}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
                >
                  Categoria: {activeCategory.name}
                  <X className="size-3" />
                </Link>
              ) : null}

              {activeTag ? (
                <Link
                  href={buildArticlesUrl({
                    q: searchTerm,
                    categoria: activeCategorySlug,
                  })}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
                >
                  Tag: {activeTag.name}
                  <X className="size-3" />
                </Link>
              ) : null}
            </div>
          ) : null}

          {paginatedArticles.length > 0 ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {paginatedArticles.map((article) => (
                  <div key={article.id} className="h-full *:h-full">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>

              {totalPages > 1 ? (
                <nav
                  aria-label="Paginação de artigos"
                  className="mt-9 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-7"
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
                            ? "border-blue-600 bg-blue-600 text-white shadow-blue-600/20"
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
                title="Nenhum artigo encontrado"
                description="Tente buscar por outro termo ou remova algum dos filtros aplicados."
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}