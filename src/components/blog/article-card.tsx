import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import { formatDate } from "@/lib/formatters";
import type { ArticleSummary } from "@/features/posts/types/post";

type ArticleCardProps = {
  article: ArticleSummary;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [primaryTag] = article.tags;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"
    >
      {article.category ? (
        <span className="mb-4 w-fit rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {article.category.name}
        </span>
      ) : null}
      {!article.category && primaryTag ? (
        <TagBadge name={primaryTag.name} colorHex={primaryTag.colorHex} className="mb-4" />
      ) : null}
      <h3 className="text-lg font-semibold leading-7 text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {article.description}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-500">
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
