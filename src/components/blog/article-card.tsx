import { CalendarDays, Clock, FolderTree } from "lucide-react";
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
      className="group flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 transition-colors duration-150 hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-6"
    >
      {/* 1. Categoria */}
      {article.category ? (
        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
          <FolderTree className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{article.category.name}</span>
        </div>
      ) : null}

      {/* 2. Título */}
      <h3 className="line-clamp-2 font-sans text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-xl">
        {article.title}
      </h3>

      {/* 3. Descrição */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {article.description}
      </p>

      {/* 4. Metadados (Data e Tempo de leitura) & 5. Tags */}
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/70 pt-3.5 text-xs font-medium text-muted-foreground">
          {article.publishedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </span>
          ) : null}

          {article.readingTimeMinutes > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>{article.readingTimeMinutes} min</span>
            </span>
          ) : null}
        </div>

        {visibleTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                colorHex={tag.colorHex}
                className="h-6 px-2 text-[10px] shadow-none"
              />
            ))}

            {hiddenTagsCount > 0 ? (
              <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2 text-[10px] font-bold text-muted-foreground">
                +{hiddenTagsCount}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}