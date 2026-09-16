import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";

type BlogTaxonomyFiltersProps = {
  categories: CategorySummary[];
  tags: TagSummary[];
  activeCategorySlug?: string;
  activeTagSlug?: string;
};

export function BlogTaxonomyFilters({
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: BlogTaxonomyFiltersProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }

  const hasActiveFilter = Boolean(activeCategorySlug || activeTagSlug);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Explorar
          </h2>
        </div>

        {hasActiveFilter ? (
          <Link
            href="/blog/artigos"
            className="rounded-sm text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400"
          >
            Limpar
          </Link>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categorias
          </h3>

          <div className="mt-2.5 grid gap-1">
            <Link
              href="/blog/artigos"
              aria-current={!hasActiveFilter ? "page" : undefined}
              className={cn(
                "flex min-h-9 items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !hasActiveFilter
                  ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span>Todas</span>
              {!hasActiveFilter ? <span className="text-[10px]">•</span> : null}
            </Link>

            {categories.map((category) => {
              const active = activeCategorySlug === category.slug;

              return (
                <Link
                  key={category.id}
                  href={active ? "/blog/artigos" : `/blog/categoria/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-9 items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{category.name}</span>
                  {active ? <span className="text-xs">×</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-5 border-t border-border/80 pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 16).map((tag) => {
              const active = activeTagSlug === tag.slug;

              return (
                <TagBadge
                  key={tag.id}
                  href={active ? "/blog/artigos" : `/blog/tag/${tag.slug}`}
                  name={active ? `${tag.name} ×` : tag.name}
                  colorHex={tag.colorHex}
                  active={active}
                  className="h-6 px-2 text-[10px] shadow-none"
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
