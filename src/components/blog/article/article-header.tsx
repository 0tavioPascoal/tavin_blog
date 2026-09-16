import Link from "next/link";
import { CalendarDays, Clock, FolderTree } from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import { formatDate } from "@/lib/formatters";

type ArticleHeaderProps = {
  title: string;
  description: string;
  publishedAt: string | null;
  readingTimeMinutes: number;
  category: CategorySummary | null;
  tags: TagSummary[];
};

export function ArticleHeader({
  title,
  description,
  publishedAt,
  readingTimeMinutes,
  category,
  tags,
}: ArticleHeaderProps) {
  return (
    <header className="border-b border-border/80 pb-8 sm:pb-10">
      {/* Categoria */}
      {category ? (
        <div className="mb-4">
          <Link
            href={`/blog/categoria/${category.slug}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-xs font-bold uppercase tracking-[0.14em] text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FolderTree className="size-3.5" aria-hidden="true" />
            <span>{category.name}</span>
          </Link>
        </div>
      ) : null}

      {/* Título editorial */}
      <h1 className="font-sans text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
        {title}
      </h1>

      {/* Descrição */}
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}

      {/* Tags */}
      {tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              name={tag.name}
              colorHex={tag.colorHex}
              className="h-7 px-2.5 text-[11px]"
            />
          ))}
        </div>
      ) : null}

      {/* Metadados de publicação */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
        {publishedAt ? (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-muted-foreground/80 sm:size-4" aria-hidden="true" />
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </span>
        ) : null}

        {publishedAt && readingTimeMinutes > 0 ? (
          <span aria-hidden="true" className="text-border">
            ·
          </span>
        ) : null}

        {readingTimeMinutes > 0 ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground/80 sm:size-4" aria-hidden="true" />
            <span>{readingTimeMinutes} min de leitura</span>
          </span>
        ) : null}
      </div>
    </header>
  );
}
