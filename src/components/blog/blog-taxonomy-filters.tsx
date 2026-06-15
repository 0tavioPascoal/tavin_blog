import Link from "next/link";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";

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
    <section className="mt-10 rounded-lg border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Filtrar artigos</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Navegue por categorias ou escolha uma tag técnica.
          </p>
        </div>
        {hasActiveFilter ? (
          <Link
            href="/blog"
            className="inline-flex h-9 w-fit items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-blue-300"
          >
            Limpar filtro
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(220px,0.42fr)_1fr]">
        {categories.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Categorias</h3>
              <span className="text-xs text-slate-500">{categories.length}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/blog"
                aria-current={!hasActiveFilter ? "page" : undefined}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  !hasActiveFilter
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-blue-300"
                }`}
              >
                Todas
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/categoria/${category.slug}`}
                  aria-current={activeCategorySlug === category.slug ? "page" : undefined}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                    activeCategorySlug === category.slug
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-blue-300"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {tags.length > 0 ? (
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Tags</h3>
                {activeTagSlug ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tag selecionada</p>
                ) : null}
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                {tags.length} tags
              </span>
            </div>
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  name={tag.name}
                  colorHex={tag.colorHex}
                  active={activeTagSlug === tag.slug}
                  className="h-9 shrink-0 px-3 text-sm shadow-sm hover:-translate-y-0.5"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
