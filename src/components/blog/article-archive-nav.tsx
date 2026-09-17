import Link from "next/link";

import type { ArticleArchiveGroup } from "@/features/posts/utils/group-articles-by-year-month";

type ArticleArchiveNavProps = {
  groups: ArticleArchiveGroup[];
  mobile?: boolean;
};

function ArchiveLinks({ groups }: { groups: ArticleArchiveGroup[] }) {
  const groupsByYear = groups.reduce(
    (years, group) => {
      const yearGroups = years.get(group.year) ?? [];
      yearGroups.push(group);
      years.set(group.year, yearGroups);
      return years;
    },
    new Map<number, ArticleArchiveGroup[]>(),
  );

  return (
    <div className="space-y-4">
      {Array.from(groupsByYear.entries()).map(([year, yearGroups]) => (
        <div key={year}>
          <p className="text-sm font-bold text-foreground">{year}</p>
          <ul className="mt-2 space-y-1 border-l border-border pl-3">
            {yearGroups.map((group) => (
              <li key={group.anchor}>
                <Link
                  href={`#${group.anchor}`}
                  className="block rounded-sm py-1 text-sm text-muted-foreground transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:text-blue-400"
                >
                  {group.monthLabel}
                  <span className="ml-1.5 text-xs text-muted-foreground/75">
                    ({group.articles.length})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ArticleArchiveNav({ groups, mobile = false }: ArticleArchiveNavProps) {
  if (groups.length === 0) return null;

  if (mobile) {
    return (
      <details className="rounded-xl border border-border bg-card px-4 py-3 xl:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-foreground marker:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Navegar por período
        </summary>
        <nav aria-label="Navegação por período" className="mt-4 border-t border-border pt-4">
          <ArchiveLinks groups={groups} />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-labelledby="archive-navigation-title">
      <h2 id="archive-navigation-title" className="text-sm font-bold text-foreground">
        Nesta página
      </h2>
      <div className="mt-4">
        <ArchiveLinks groups={groups} />
      </div>
    </nav>
  );
}
