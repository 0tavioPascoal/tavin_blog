import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  getCategoryBySlug,
  listActiveCategories,
} from "@/features/categories/repositories/categories-repository";
import { listPublishedArticlesByCategoryId } from "@/features/posts/repositories/posts-repository";
import { cn } from "@/lib/utils";

type BlogCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria não encontrada",
    };
  }

  return {
    title: `Categoria: ${category.name}`,
    description:
      category.description ??
      `Artigos publicados na categoria ${category.name}.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [articles, categories] = await Promise.all([
    listPublishedArticlesByCategoryId(category.id),
    listActiveCategories(),
  ]);

  return (
    <PageContainer as="main">
      {/* Navegação / Breadcrumb */}
      <nav
        aria-label="Navegação da categoria"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href="/blog/artigos"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Todos os artigos</span>
        </Link>
        <span aria-hidden="true" className="text-border">
          /
        </span>
        <span className="font-semibold text-foreground">{category.name}</span>
      </nav>

      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Categoria"
        title={category.name}
        description={
          category.description ??
          `Artigos e conteúdos práticos publicados na categoria ${category.name}.`
        }
      />

      {/* Filtros de Outras Categorias (chips horizontais) */}
      {categories.length > 1 ? (
        <section aria-label="Outras categorias" className="mt-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]">
            <Link
              href="/blog/artigos"
            className="inline-flex h-10 shrink-0 items-center rounded-lg border border-border/80 bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Todas
            </Link>

            {categories.map((c) => {
              const active = c.slug === category.slug;

              return (
                <Link
                  key={c.id}
                  href={`/blog/categoria/${c.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                      : "border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Grid de Artigos */}
      <section aria-label={`Artigos de ${category.name}`} className="mt-8">
        <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3 text-xs text-muted-foreground">
          <p>
            {articles.length} artigo{articles.length === 1 ? "" : "s"} nesta
            categoria
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id} className="h-full">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum artigo nesta categoria"
            description="Ainda não existem artigos publicados nesta categoria. Explore outros tópicos ou volte para todos os artigos."
            action={
              <Link
                href="/blog/artigos"
                className="inline-flex h-11 items-center rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Ver todos os artigos
              </Link>
            }
          />
        )}
      </section>
    </PageContainer>
  );
}
