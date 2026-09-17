"use client";

import { Check, ChevronDown, Grid2X2, List, Search, X } from "lucide-react";
import Link from "next/link";
import { Popover } from "radix-ui";

import type { CategorySummary } from "@/features/categories/types/category";
import type { TagSummary } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";

type ArticleView = "list" | "grid";

type ArticleFilterBarProps = {
  categories: CategorySummary[];
  tags: TagSummary[];
  searchTerm: string;
  activeCategorySlug: string;
  activeTagSlug: string;
  view: ArticleView;
  resultCount: number;
};

type ArticlesUrlParams = {
  q?: string;
  categoria?: string;
  tag?: string;
  view?: ArticleView;
};

function buildArticlesUrl(params: ArticlesUrlParams) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.categoria) searchParams.set("categoria", params.categoria);
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.view) searchParams.set("view", params.view);

  const queryString = searchParams.toString();
  return queryString ? `/blog/artigos?${queryString}` : "/blog/artigos";
}

type FilterPopoverProps = {
  label: string;
  activeLabel?: string;
  allLabel: string;
  allHref: string;
  items: Array<{ id: string; label: string; href: string; active: boolean }>;
};

function FilterPopover({
  label,
  activeLabel,
  allLabel,
  allHref,
  items,
}: FilterPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-36",
            activeLabel
              ? "border-primary/50 bg-primary/5 text-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="truncate">{activeLabel ?? label}</span>
          <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-60 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none"
        >
          <Popover.Close asChild>
            <Link
              href={allHref}
              className="flex min-h-9 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {allLabel}
              {!activeLabel ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
            </Link>
          </Popover.Close>
          {items.map((item) => (
            <Popover.Close key={item.id} asChild>
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className="flex min-h-9 items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="truncate">{item.label}</span>
                {item.active ? <Check className="size-4 shrink-0 text-primary" aria-hidden="true" /> : null}
              </Link>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function ArticleFilterBar({
  categories,
  tags,
  searchTerm,
  activeCategorySlug,
  activeTagSlug,
  view,
  resultCount,
}: ArticleFilterBarProps) {
  const activeCategory = categories.find(
    (category) => category.slug === activeCategorySlug,
  );
  const activeTag = tags.find((tag) => tag.slug === activeTagSlug);
  const sharedParams = {
    q: searchTerm || undefined,
    categoria: activeCategorySlug || undefined,
    tag: activeTagSlug || undefined,
    view,
  } satisfies ArticlesUrlParams;
  const hasFilters = Boolean(searchTerm || activeCategory || activeTag);

  return (
    <section aria-label="Busca e filtros de artigos" className="mt-8">
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto_auto_auto]">
        <form className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="article-search" className="sr-only">
            Buscar artigos
          </label>
          <input
            id="article-search"
            name="q"
            type="search"
            defaultValue={searchTerm}
            placeholder="Buscar artigos por título, descrição ou tecnologia..."
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {activeCategorySlug ? <input type="hidden" name="categoria" value={activeCategorySlug} /> : null}
          {activeTagSlug ? <input type="hidden" name="tag" value={activeTagSlug} /> : null}
          <input type="hidden" name="view" value={view} />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Search className="size-4" aria-hidden="true" />
          </button>
        </form>

        <div className="grid grid-cols-2 gap-3 lg:contents">
          <FilterPopover
            label="Categoria"
            activeLabel={activeCategory?.name}
            allLabel="Todas as categorias"
            allHref={buildArticlesUrl({ ...sharedParams, categoria: undefined })}
            items={categories.map((category) => ({
              id: category.id,
              label: category.name,
              active: category.slug === activeCategorySlug,
              href: buildArticlesUrl({ ...sharedParams, categoria: category.slug }),
            }))}
          />

          <FilterPopover
            label="Tag"
            activeLabel={activeTag?.name}
            allLabel="Todas as tags"
            allHref={buildArticlesUrl({ ...sharedParams, tag: undefined })}
            items={tags.map((tag) => ({
              id: tag.id,
              label: tag.name,
              active: tag.slug === activeTagSlug,
              href: buildArticlesUrl({ ...sharedParams, tag: tag.slug }),
            }))}
          />
        </div>

        <div
          role="group"
          className="flex h-11 items-center rounded-lg border border-border bg-card p-1"
          aria-label="Visualização dos artigos"
        >
          <Link
            href={buildArticlesUrl({ ...sharedParams, view: "list" })}
            aria-label="Visualizar como lista"
            aria-current={view === "list" ? "page" : undefined}
            className={cn(
              "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-none",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <List className="size-3.5" aria-hidden="true" />
            Lista
          </Link>
          <Link
            href={buildArticlesUrl({ ...sharedParams, view: "grid" })}
            aria-label="Visualizar como grade"
            aria-current={view === "grid" ? "page" : undefined}
            className={cn(
              "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-none",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Grid2X2 className="size-3.5" aria-hidden="true" />
            Grade
          </Link>
        </div>
      </div>

      <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeCategory ? (
            <Link
              href={buildArticlesUrl({ ...sharedParams, categoria: undefined })}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {activeCategory.name}
              <X className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
          {activeTag ? (
            <Link
              href={buildArticlesUrl({ ...sharedParams, tag: undefined })}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {activeTag.name}
              <X className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
          {searchTerm ? (
            <Link
              href={buildArticlesUrl({ ...sharedParams, q: undefined })}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Busca: “{searchTerm}”
              <X className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
          {hasFilters ? (
            <Link
              href={buildArticlesUrl({ view })}
              className="rounded-sm text-xs font-semibold text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400"
            >
              Limpar filtros
            </Link>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {resultCount} artigo{resultCount === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
}
