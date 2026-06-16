import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { FeaturedArticleCard } from "@/components/home/featured-article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ArticleSummary } from "@/features/posts/types/post";

type FeaturedArticlesSectionProps = {
  articles: ArticleSummary[];
};

export function FeaturedArticlesSection({
  articles,
}: FeaturedArticlesSectionProps) {
  return (
    <section>
      <SectionHeading
        title="Artigos em Destaque"
        action={
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:gap-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver todos os artigos
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      {articles.length > 0 ? (
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="Nenhum artigo publicado ainda"
            description="Quando os primeiros posts forem publicados, eles aparecerão aqui automaticamente."
          />
        </div>
      )}
    </section>
  );
}