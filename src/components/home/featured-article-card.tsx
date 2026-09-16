import {
  ArrowRight,
  CalendarDays,
  Clock,
  FolderTree,
} from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ArticleSummary } from "@/features/posts/types/post";
import { formatDate } from "@/lib/formatters";

type FeaturedArticleCardProps = {
  article: ArticleSummary;
};

export function FeaturedArticleCard({
  article,
}: FeaturedArticleCardProps) {
  const [primaryTag] = article.tags;

  return (
    <Link
      href={`/blog/${article.slug}`}
      aria-label={`Ler artigo: ${article.title}`}
      className="group flex min-h-60 flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-colors duration-150 hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex min-h-7 items-center gap-2">
        {article.category ? (
          <span className="inline-flex h-6 max-w-[55%] items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            <FolderTree className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{article.category.name}</span>
          </span>
        ) : null}

        {primaryTag ? (
          <TagBadge
            name={primaryTag.name}
            colorHex={primaryTag.colorHex}
            className="h-6 max-w-[45%] truncate px-2 text-[10px] shadow-none"
          />
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 font-sans text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-3 text-[11px] font-medium">
            {article.publishedAt ? (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <CalendarDays className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span className="truncate">{formatDate(article.publishedAt)}</span>
              </span>
            ) : null}

            {article.readingTimeMinutes > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-1.5">
                <Clock className="size-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>{article.readingTimeMinutes} min</span>
              </span>
            ) : null}
          </div>

          <ArrowRight
            className="size-3.5 shrink-0 text-blue-600 transition-transform duration-150 group-hover:translate-x-1 dark:text-blue-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}