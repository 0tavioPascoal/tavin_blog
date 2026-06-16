import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { EmptyState } from "@/components/shared/empty-state";
import {
  getCategoryBySlug,
  listActiveCategories,
} from "@/features/categories/repositories/categories-repository";
import { listPublishedArticlesByCategoryId } from "@/features/posts/repositories/posts-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";

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
      category.description ?? `Artigos publicados na categoria ${category.name}.`,
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

  const [articles, categories, tags] = await Promise.all([
    listPublishedArticlesByCategoryId(category.id),
    listActiveCategories(),
    listActiveTags(),
  ]);

  return (
    <section className="w-full px-6 py-12 sm:px-10 lg:px-[7vw]">
      <div className="relative overflow-hidden rounded-3xl border border-slate-300/70 bg-card p-8 shadow-sm dark:border-slate-800 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

        <div className="relative max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Categoria
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {category.name}
          </h1>

          {category.description ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {category.description}
            </p>
          ) : (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Artigos publicados na categoria {category.name}.
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main>
          {articles.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    Biblioteca
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    Artigos de {category.name}
                  </h2>
                </div>

                <span className="text-sm text-muted-foreground">
                  {articles.length}{" "}
                  {articles.length === 1
                    ? "artigo encontrado"
                    : "artigos encontrados"}
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Nenhum artigo nesta categoria"
              description="Publique um artigo com esta categoria para alimentar a listagem."
            />
          )}
        </main>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <BlogTaxonomyFilters
            categories={categories}
            tags={tags}
            activeCategorySlug={category.slug}
          />
        </aside>
      </div>
    </section>
  );
}