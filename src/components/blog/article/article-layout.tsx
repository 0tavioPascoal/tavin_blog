import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ArticleFooter } from "@/components/blog/article/article-footer";
import { ArticleHeader } from "@/components/blog/article/article-header";
import { ArticleSidebar } from "@/components/blog/article/article-sidebar";
import { ArticleTableOfContents } from "@/components/blog/article/article-table-of-contents";
import { ArticleTocMobile } from "@/components/blog/article/article-toc-mobile";
import { PageContainer } from "@/components/layout/page-container";
import type { CategorySummary } from "@/features/categories/types/category";
import type { ArticleDetail } from "@/features/posts/types/post";
import type { TagSummary } from "@/features/tags/types/tag";
import type { ArticleHeading } from "@/lib/markdown/extract-headings";
import { cn } from "@/lib/utils";

type ArticleLayoutProps = {
  article: ArticleDetail;
  headings: ArticleHeading[];
  categories: CategorySummary[];
  tags: TagSummary[];
  children: ReactNode;
};

export function ArticleLayout({
  article,
  headings,
  categories,
  tags,
  children,
}: ArticleLayoutProps) {
  const hasToc = headings.length >= 2;
  const currentTagSlugs = article.tags.map((t) => t.slug);

  return (
    <PageContainer>
      {/* Navegação / Breadcrumb de retorno */}
      <nav
        aria-label="Navegação do artigo"
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href="/blog/artigos"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Artigos</span>
        </Link>

        {article.category ? (
          <>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <Link
              href={`/blog/categoria/${article.category.slug}`}
              className="inline-flex min-h-9 items-center rounded-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {article.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      {/* Grid responsivo de 1 a 3 colunas (sem items-start para permitir sticky em toda extensão) */}
      <div
        className={cn(
          "grid gap-8 lg:gap-10 xl:gap-12",
          // Layout com TOC (3 colunas em xl, 2 colunas em lg, 1 coluna em mobile/tablet)
          hasToc
            ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] 2xl:grid-cols-[220px_minmax(0,1fr)_240px]"
            : "grid-cols-1 2xl:grid-cols-[220px_minmax(0,1fr)]",
        )}
      >
        {/* Coluna 1: Sidebar de Exploração (apenas telas grandes) */}
        <div className="hidden 2xl:block">
          <ArticleSidebar
            categories={categories}
            tags={tags}
            currentCategorySlug={article.category?.slug}
            currentTagSlugs={currentTagSlugs}
          />
        </div>

        {/* Coluna 2: Conteúdo Central Dominante */}
        <article className="mx-auto w-full min-w-0 max-w-[47.5rem]">
          <ArticleHeader
            title={article.title}
            description={article.description}
            publishedAt={article.publishedAt}
            readingTimeMinutes={article.readingTimeMinutes}
            category={article.category}
            tags={article.tags}
          />

          {/* Sumário expansível para Mobile e Tablet */}
          <div className="mt-8">
            <ArticleTocMobile headings={headings} />
          </div>

          {/* Conteúdo Markdown */}
          <section aria-label="Conteúdo do artigo" className="mt-6">
            {children}
          </section>

          {/* Rodapé do artigo */}
          <ArticleFooter />
        </article>

        {/* Coluna 3: Table of Contents Sticky (Desktop intermediário e grande) */}
        {hasToc ? (
          <div className="hidden lg:block">
            <ArticleTableOfContents headings={headings} />
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
