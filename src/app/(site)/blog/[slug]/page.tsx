import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/blog/markdown-content";
import { formatDate } from "@/lib/formatters";
import { getPublishedArticleBySlug } from "@/features/posts/repositories/posts-repository";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">{article.description}</p>
        <p className="mt-5 text-sm text-slate-500">
          {formatDate(article.publishedAt)} · {article.readingTimeMinutes} min de leitura
        </p>
      </div>
      <MarkdownContent content={article.contentMarkdown} />
    </article>
  );
}
