import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ArticleSummary } from "@/features/posts/types/post";
import { formatDate } from "@/lib/formatters";

type FeaturedArticleCardProps = {
  article: ArticleSummary;
};

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  const [primaryTag] = article.tags;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex min-h-[14.5rem] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"
    >
      <div className="min-h-7">
        {primaryTag ? (
          <TagBadge
            name={primaryTag.name}
            colorHex={primaryTag.colorHex}
            className="px-2 py-0.5 text-[0.68rem] leading-4"
          />
        ) : null}
      </div>
      <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
        {article.title}
      </h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {article.description}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">{formatDate(article.publishedAt)}</span>
        </span>
        <span className="shrink-0 inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {article.readingTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}
