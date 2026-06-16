import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ArticleSummary } from "@/features/posts/types/post";
import { formatDate } from "@/lib/formatters";

type ArticleCardProps = {
  article: ArticleSummary;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [primaryTag] = article.tags;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full min-h-60 flex-col rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800"
    >
      <div className="min-h-7">
        {article.category ? (
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {article.category.name}
          </span>
        ) : primaryTag ? (
          <TagBadge
            name={primaryTag.name}
            colorHex={primaryTag.colorHex}
          />
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {article.title}
      </h3>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {formatDate(article.publishedAt)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {article.readingTimeMinutes} min de leitura
        </span>
      </div>
    </Link>
  );
}