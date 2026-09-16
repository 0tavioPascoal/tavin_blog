import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { TagBadge } from "@/components/blog/tag-badge";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
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

  const articlesToShow = (featuredArticle ? otherArticles : articles).slice(
    0,
    6,
  );

  return (
    <PageContainer as="main">
      <PageHeader
        eyebrow="Blog"
        title="Artigos sobre software, arquitetura e qualidade"
        description="Compartilho aprendizados, experiências e boas práticas sobre .NET, Java, arquitetura de software, qualidade e desenvolvimento backend."
      />

      {featuredArticle ? (
        <Link
          href={`/blog/${featuredArticle.slug}`}
          className="group mt-8 block rounded-xl border border-border/80 bg-card p-6 transition-colors hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  Artigo em destaque
                </span>

                {featuredArticle.category ? (
                  <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
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

              <h2 className="text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-2xl md:text-3xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featuredArticle.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {formatDate(featuredArticle.publishedAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {featuredArticle.readingTimeMinutes} min de leitura
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              Ler artigo
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-10 grid gap-8 xl:mt-12 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-10">
        <section aria-label="Últimos artigos">
          {articles.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-sans text-xl font-bold text-foreground">
                  Últimos artigos
                </h2>
                <Link
                  href="/blog/artigos"
                  className="rounded-sm text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {articlesToShow.map((article) => (
                  <div key={article.id} className="h-full">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>

              {articles.length > articlesToShow.length ? (
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/blog/artigos"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Ver todos os artigos
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="Nenhum artigo publicado"
              description="Os primeiros artigos aparecerão aqui assim que estiverem disponíveis."
            />
          )}
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <BlogTaxonomyFilters
            categories={categories}
            tags={tags}
          />
        </aside>
      </div>
    </PageContainer>
  );
}
