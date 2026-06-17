import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ArticleSummary } from "@/features/posts/types/post";
import { formatDate } from "@/lib/formatters";

type ArticleCardProps = {
  article: ArticleSummary;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const visibleTags = article.tags.slice(0, 3);
  const hiddenTagsCount = Math.max(article.tags.length - visibleTags.length, 0);

  return (
    <Link
      href={`/blog/${article.slug}`}
      aria-label={`Ler artigo: ${article.title}`}
      className="group flex h-full min-h-0 flex-col rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:min-h-60 sm:p-5"
    >
      <div className="flex min-h-7 flex-wrap items-center gap-2">
        {article.category ? (
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {article.category.name}
          </span>
        ) : null}

        {visibleTags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            colorHex={tag.colorHex}
            className="px-2 py-0.5 text-[10px] leading-4"
          />
        ))}

        {hiddenTagsCount > 0 ? (
          <span className="inline-flex rounded-full border border-slate-300 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:border-slate-800">
            +{hiddenTagsCount}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {article.title}
      </h3>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(article.publishedAt)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {article.readingTimeMinutes} min
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
          Ler
          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}