import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticlesByTagId } from "@/features/posts/repositories/posts-repository";
import {
  getTagBySlug,
  listActiveTags,
} from "@/features/tags/repositories/tags-repository";

type BlogTagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
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
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <PageHero
        eyebrow="Tag"
        title={tag.name}
        description={
          <p>
            {tag.description ?? `Artigos publicados com a tag ${tag.name}.`}
          </p>
        }
      />

      <div className="mt-10 grid gap-8 xl:mt-12 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <main>
          {articles.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    Biblioteca
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    Artigos com {tag.name}
                  </h2>
                </div>

                <span className="text-sm text-muted-foreground">
                  {articles.length}{" "}
                  {articles.length === 1
                    ? "artigo encontrado"
                    : "artigos encontrados"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Nenhum artigo com esta tag"
              description="Publique um artigo com esta tag para alimentar a listagem."
            />
          )}
        </main>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <BlogTaxonomyFilters
            categories={categories}
            tags={tags}
            activeTagSlug={tag.slug}
          />
        </aside>
      </div>
    </section>
  );
}
