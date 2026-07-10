import { ArrowRight, BookOpenText } from "lucide-react";
import Link from "next/link";

import { FeaturedArticleCard } from "@/components/home/featured-article-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ArticleSummary } from "@/features/posts/types/post";

type FeaturedArticlesSectionProps = {
  articles: ArticleSummary[];
};

export function FeaturedArticlesSection({
  articles,
}: FeaturedArticlesSectionProps) {
  const featuredArticles = articles.slice(0, 3);

  return (
    <section
      aria-labelledby="featured-articles-title"
      className="lg:row-span-2 lg:grid lg:grid-rows-subgrid"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center mb-4 gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
            <BookOpenText className="size-4" aria-hidden="true" />
            Biblioteca técnica
          </div>

          <h2
            id="featured-articles-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Artigos em destaque
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Conteúdos sobre backend, arquitetura, qualidade, regras de negócio e
            desafios reais do desenvolvimento de software.
          </p>
        </div>

        <Link
          href="/blog/artigos"
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-muted-foreground transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 dark:focus-visible:ring-offset-slate-950"
        >
          Ver todos os artigos
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      {featuredArticles.length > 0 ? (
        <div className="mt-5 grid items-stretch gap-5 md:grid-cols-2 lg:mt-0 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <div key={article.id} className="h-full *:h-full">
              <FeaturedArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300/80 bg-card p-4 shadow-sm dark:border-slate-800 lg:mt-0">
          <EmptyState
            title="Nenhum artigo publicado ainda"
            description="Quando os primeiros artigos forem publicados, eles aparecerão aqui automaticamente."
          />
        </div>
      )}
    </section>
  );
}
