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
    <div className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Explorar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtre os conteúdos.
          </p>
        </div>

        {hasActiveFilter ? (
          <Link
            href="/blog"
            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
          >
            Limpar
          </Link>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categorias
          </h3>

          <div className="mt-3 grid gap-1.5">
            <Link
              href="/blog"
              aria-current={!hasActiveFilter ? "page" : undefined}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
                !hasActiveFilter
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-background hover:text-foreground",
              )}
            >
              <span>Todas</span>
              {!hasActiveFilter ? <span className="text-xs">Selecionado</span> : null}
            </Link>

            {categories.map((category) => {
              const active = activeCategorySlug === category.slug;

              return (
                <Link
                  key={category.id}
                  href={active ? "/blog" : `/blog/categoria/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      : "text-muted-foreground hover:bg-background hover:text-foreground",
                  )}
                >
                  <span>{category.name}</span>
                  {active ? <span className="text-xs">×</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = activeTagSlug === tag.slug;

              return (
                <TagBadge
                  key={tag.id}
                  href={active ? "/blog" : `/blog/tag/${tag.slug}`}
                  name={active ? `${tag.name} ×` : tag.name}
                  colorHex={tag.colorHex}
                  active={active}
                  className="h-8 px-3 text-[11px]"
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}