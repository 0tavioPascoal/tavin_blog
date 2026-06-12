import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { getCategoryBySlug, listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticlesByCategoryId } from "@/features/posts/repositories/posts-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";

type BlogCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria não encontrada",
    };
  }

  return {
    title: `Categoria: ${category.name}`,
    description: category.description ?? `Artigos publicados na categoria ${category.name}.`,
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
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
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Categoria</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">{category.name}</h1>
        {category.description ? (
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{category.description}</p>
        ) : null}
      </div>
      <BlogTaxonomyFilters categories={categories} tags={tags} activeCategorySlug={category.slug} />
      <div className="mt-10">
        {articles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum artigo nesta categoria" description="Publique um artigo com esta categoria para alimentar a listagem." />
        )}
      </div>
    </section>
  );
}
