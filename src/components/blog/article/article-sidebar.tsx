import Link from "next/link";
import { FolderTree, Hash } from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";

type ArticleSidebarProps = {
  categories: CategorySummary[];
  tags: TagSummary[];
  currentCategorySlug?: string | null;
  currentTagSlugs?: string[];
};

export function ArticleSidebar({
  categories,
  tags,
  currentCategorySlug,
  currentTagSlugs = [],
}: ArticleSidebarProps) {
  // Limita a exibição de tags a um conjunto razoável e compacto
  const displayedTags = tags.slice(0, 18);

  return (
    <aside
      aria-label="Exploração do blog"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 text-sm [scrollbar-width:thin]"
    >
      <div className="space-y-8">
        {/* Seção de Categorias */}
        {categories.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <FolderTree className="size-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Categorias</span>
            </div>

            <nav aria-label="Categorias do blog">
              <ul className="space-y-1">
                {categories.map((category) => {
                  const isCurrent = category.slug === currentCategorySlug;

                  return (
                    <li key={category.id}>
                      <Link
                        href={`/blog/categoria/${category.slug}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "group flex min-h-9 items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isCurrent
                            ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        <span className="truncate">{category.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        ) : null}

        {/* Seção de Tags / Tecnologias */}
        {displayedTags.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Hash className="size-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Tecnologias e temas</span>
            </div>

            <nav aria-label="Tags do blog" className="flex flex-wrap gap-1.5">
              {displayedTags.map((tag) => {
                const isCurrent = currentTagSlugs.includes(tag.slug);

                return (
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    colorHex={tag.colorHex}
                    href={`/blog/tag/${tag.slug}`}
                    active={isCurrent}
                    className="h-6 px-2 text-[10px]"
                  />
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
