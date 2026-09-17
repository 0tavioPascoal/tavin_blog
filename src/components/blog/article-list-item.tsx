import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { ArticleSummary } from "@/features/posts/types/post";

type ArticleListItemProps = {
  article: ArticleSummary;
};

const articleDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <article className="group border-b border-border/80 py-5 first:pt-0 sm:py-6">
      <div className="flex items-start justify-between gap-5 rounded-lg px-2 py-2 transition-colors group-hover:bg-muted/35 sm:px-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {article.publishedAt ? (
              <time dateTime={article.publishedAt}>
                {articleDateFormatter.format(new Date(article.publishedAt))}
              </time>
            ) : null}
            {article.publishedAt && article.readingTimeMinutes > 0 ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {article.readingTimeMinutes > 0 ? (
              <span>{article.readingTimeMinutes} min de leitura</span>
            ) : null}
          </div>

          {article.category ? (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
              {article.category.name}
            </p>
          ) : null}

          <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight sm:text-xl">
            <Link
              href={`/blog/${article.slug}`}
              className="rounded-sm text-foreground transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:text-blue-400"
            >
              {article.title}
            </Link>
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {article.description}
          </p>

          {article.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 4).map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  colorHex={tag.colorHex}
                  className="h-6 px-2 text-[10px] shadow-none"
                />
              ))}
            </div>
          ) : null}
        </div>

        <Link
          href={`/blog/${article.slug}`}
          aria-label={`Ler artigo: ${article.title}`}
          className="mt-7 hidden size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[color,transform,background-color] hover:bg-muted hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex sm:group-hover:translate-x-1 dark:hover:text-blue-400"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
