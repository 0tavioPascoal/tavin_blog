import type { Metadata } from "next";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { MarkdownContent } from "@/components/blog/markdown-content";
import { TagBadge } from "@/components/blog/tag-badge";
import { getPublishedArticleBySlug } from "@/features/posts/repositories/posts-repository";
import { formatDate } from "@/lib/formatters";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado",
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="size-4" />
          Voltar para o blog
        </Link>

        <header className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-32 -top-32 size-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5 sm:-right-24 sm:-top-24 sm:size-72" />

          <div className="relative">
            <div className="flex flex-wrap gap-2">
              {article.category ? (
                <Link
                  href={`/blog/categoria/${article.category.slug}`}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
                >
                  {article.category.name}
                </Link>
              ) : null}

              {article.tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  name={tag.name}
                  colorHex={tag.colorHex}
                />
              ))}
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
              {article.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDate(article.publishedAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {article.readingTimeMinutes} min de leitura
              </span>
            </div>
          </div>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:mt-8 sm:rounded-3xl sm:p-6 lg:p-10">
          <MarkdownContent content={article.contentMarkdown} />
        </div>
      </div>
    </article>
  );
}
