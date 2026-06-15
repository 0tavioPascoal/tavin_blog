import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { FeaturedArticleCard } from "@/components/home/featured-article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ArticleSummary } from "@/features/posts/types/post";

type FeaturedArticlesSectionProps = {
  articles: ArticleSummary[];
};

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
  return (
    <section>
      <SectionHeading
        title="Artigos em Destaque"
        action={
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-blue-700">
            Ver todos os artigos
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum artigo publicado ainda"
          description="Quando os primeiros posts forem publicados no Supabase, eles aparecerão aqui automaticamente."
        />
      )}
    </section>
  );
}
