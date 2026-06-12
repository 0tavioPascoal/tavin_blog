import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticlesByTagId } from "@/features/posts/repositories/posts-repository";
import { getTagBySlug, listActiveTags } from "@/features/tags/repositories/tags-repository";

type BlogTagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag não encontrada",
    };
  }

  return {
    title: `Tag: ${tag.name}`,
    description: tag.description ?? `Artigos publicados com a tag ${tag.name}.`,
  };
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const [articles, categories, tags] = await Promise.all([
    listPublishedArticlesByTagId(tag.id),
    listActiveCategories(),
    listActiveTags(),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Tag</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">{tag.name}</h1>
        {tag.description ? (
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{tag.description}</p>
        ) : null}
      </div>
      <BlogTaxonomyFilters categories={categories} tags={tags} activeTagSlug={tag.slug} />
      <div className="mt-10">
        {articles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum artigo com esta tag" description="Publique um artigo com esta tag para alimentar a listagem." />
        )}
      </div>
    </section>
  );
}
