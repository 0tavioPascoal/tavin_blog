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

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Blog
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-card-foreground md:text-5xl">
          Artigos sobre software, arquitetura e qualidade.
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Compartilho aprendizados, experiências e boas práticas sobre .NET,
          arquitetura de software, qualidade, bancos de dados e desenvolvimento
          backend.
        </p>
      </div>

      {featuredArticle ? (
        <Link
          href={`/blog/${featuredArticle.slug}`}
          className="group mt-10 block rounded-3xl border border-border bg-card p-6 shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:shadow-black/20 dark:hover:border-blue-800 lg:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
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

              <h2 className="text-2xl font-bold leading-tight text-card-foreground transition group-hover:text-blue-700 dark:group-hover:text-blue-300 md:text-3xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
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

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
              Ler artigo
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-10">
        <BlogTaxonomyFilters categories={categories} tags={tags} />
      </div>

      <div className="mt-10">
        {articles.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                Últimos artigos
              </h2>

              <span className="text-sm text-muted-foreground">
                {articles.length} publicados
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(otherArticles.length > 0 ? otherArticles : articles).map(
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
      </div>
    </section>
  );
}