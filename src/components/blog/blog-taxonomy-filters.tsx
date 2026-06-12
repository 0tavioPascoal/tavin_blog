import Link from "next/link";

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

  return (
    <div className="mt-10 grid gap-6 border-y border-slate-200 py-6 dark:border-slate-800">
      {categories.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Categorias</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-blue-300"
            >
              Todas
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/categoria/${category.slug}`}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  activeCategorySlug === category.slug
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-blue-300"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {tags.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  activeTagSlug === tag.slug
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-blue-300"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
