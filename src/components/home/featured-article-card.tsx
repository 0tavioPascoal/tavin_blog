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
      className="
        group flex
        min-h-[15rem]
        flex-col
        rounded-2xl
        border
        border-slate-300/80
        bg-card
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-300
        hover:shadow-lg
        dark:border-slate-800
        dark:hover:border-blue-900
      "
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

      <h3 className="
        mt-3
        line-clamp-2
        text-lg
        font-semibold
        leading-7
        text-foreground
        transition-colors
        group-hover:text-blue-600
        dark:group-hover:text-blue-400
      ">
        {article.title}
      </h3>

      <p className="
        mt-3
        line-clamp-3
        flex-1
        text-sm
        leading-6
        text-muted-foreground
      ">
        {article.description}
      </p>

      <div className="
        mt-6
        flex
        items-center
        justify-between
        gap-3
        border-t
        border-border
        pt-4
        text-xs
        text-muted-foreground
      ">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">
            {formatDate(article.publishedAt)}
          </span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          <Clock className="size-3.5" />
          {article.readingTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}
