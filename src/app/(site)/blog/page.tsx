import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { TagBadge } from "@/components/blog/tag-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";
import { formatDate } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos técnicos de Otávio Pascoal sobre engenharia de software, arquitetura, qualidade e desenvolvimento backend.",
};

export default async function BlogPage() {
  const [articles, categories, tags] = await Promise.all([
    listPublishedArticles(),
    listActiveCategories(),
    listActiveTags(),
  ]);

  const [featuredArticle, ...otherArticles] = articles;
  const [featuredTag] = featuredArticle?.tags ?? [];
  const articlesToShow = featuredArticle ? otherArticles : articles;

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <div className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:rounded-3xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-32 -top-32 size-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5 sm:-right-24 sm:-top-24 sm:size-72" />

        <div className="relative max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Blog
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Artigos sobre software, arquitetura e qualidade.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
            Compartilho aprendizados, experiências e boas práticas sobre .NET,
            arquitetura de software, qualidade, bancos de dados e desenvolvimento
            backend.
          </p>
        </div>
      </div>

      {featuredArticle ? (
        <Link
          href={`/blog/${featuredArticle.slug}`}
          className="group mt-6 block rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:mt-8 sm:rounded-3xl sm:p-6 lg:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  Artigo em destaque
                </span>

                {featuredArticle.category ? (
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {featuredArticle.category.name}
                  </span>
                ) : featuredTag ? (
                  <TagBadge
                    name={featuredTag.name}
                    colorHex={featuredTag.colorHex}
                    className="text-xs"
                  />
                ) : null}
              </div>

              <h2 className="text-xl font-bold leading-tight text-foreground transition group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-2xl md:text-3xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                {featuredArticle.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formatDate(featuredArticle.publishedAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {featuredArticle.readingTimeMinutes} min de leitura
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              Ler artigo
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-10 grid gap-8 xl:mt-12 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <main>
          {articles.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    Biblioteca
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    Últimos artigos
                  </h2>
                </div>

                <span className="text-sm text-muted-foreground">
                  {articles.length}{" "}
                  {articles.length === 1 ? "artigo publicado" : "artigos publicados"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {(articlesToShow.length > 0 ? articlesToShow : articles).map(
                  (article) => (
                    <ArticleCard key={article.id} article={article} />
                  ),
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="Nenhum artigo publicado"
              description="Publique seu primeiro artigo para começar a construir sua biblioteca de conteúdo."
            />
          )}
        </main>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <BlogTaxonomyFilters categories={categories} tags={tags} />
        </aside>
      </div>
    </section>
  );
}
