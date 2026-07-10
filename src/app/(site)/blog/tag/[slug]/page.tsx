import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpenText,
  Hash,
  SlidersHorizontal,
} from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogTaxonomyFilters } from "@/components/blog/blog-taxonomy-filters";
import { EmptyState } from "@/components/shared/empty-state";
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

  const articleCountLabel =
    articles.length === 1 ? "artigo publicado" : "artigos publicados";

  return (
    <main className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-[7vw] lg:py-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-8 shadow-sm dark:border-slate-800 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />

        <Link
          href="/blog/artigos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-violet-600 dark:hover:text-violet-400"
        >
          <ArrowLeft className="size-4" />
          Voltar para todos os artigos
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
              <Hash className="size-3.5" />
              Tag
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              {tag.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {tag.description ??
                `Explore os artigos publicados com a tag ${tag.name}.`}
            </p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
            <div className="flex items-center gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm shadow-violet-600/20">
                <BookOpenText className="size-5" />
              </span>

              <div>
                <strong className="block text-2xl font-bold tracking-tight text-foreground">
                  {articles.length}
                </strong>

                <span className="text-sm font-medium text-muted-foreground">
                  {articleCountLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside>
          <details className="group xl:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-slate-300/70 bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-violet-300 dark:border-slate-800 dark:hover:border-violet-800 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-violet-600 dark:text-violet-400" />
                Explorar categorias e tags
              </span>

              <span className="text-xs font-medium text-muted-foreground transition group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="mt-2 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:p-5">
              <BlogTaxonomyFilters
                categories={categories}
                tags={tags}
                activeTagSlug={tag.slug}
              />
            </div>
          </details>

          <div className="hidden xl:sticky xl:top-24 xl:block">
            <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Explorar</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Categorias e tecnologias
                  </p>
                </div>

                <SlidersHorizontal className="size-4 text-muted-foreground" />
              </div>

              <BlogTaxonomyFilters
                categories={categories}
                tags={tags}
                activeTagSlug={tag.slug}
              />
            </div>
          </div>
        </aside>

        <section className="min-w-0" aria-labelledby="tag-articles-title">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
                Biblioteca
              </p>

              <h2
                id="tag-articles-title"
                className="mt-1 text-2xl font-bold tracking-tight text-foreground"
              >
                Artigos com {tag.name}
              </h2>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Conteúdos relacionados a esta tecnologia ou assunto.
              </p>
            </div>

            <span className="inline-flex h-9 w-fit items-center rounded-full border border-border bg-muted/50 px-3 text-xs font-semibold text-muted-foreground">
              {articles.length}{" "}
              {articles.length === 1
                ? "resultado encontrado"
                : "resultados encontrados"}
            </span>
          </div>

          {articles.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {articles.map((article) => (
                <div key={article.id} className="h-full *:h-full">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300/80 bg-card p-4 dark:border-slate-800">
              <EmptyState
                title="Nenhum artigo com esta tag"
                description="Ainda não existem artigos publicados com esta tag. Explore outra tecnologia ou volte para a biblioteca completa."
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}