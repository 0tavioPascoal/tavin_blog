import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/blog/article/article-layout";
import { HighlightedMarkdownContent } from "@/components/blog/markdown-content-highlighted";
import { removeDuplicateLeadingTitle } from "@/components/blog/markdown-content";
import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { getPublishedArticleBySlug } from "@/features/posts/repositories/posts-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";
import { extractHeadings } from "@/lib/markdown/extract-headings";

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

  const [article, categories, tags] = await Promise.all([
    getPublishedArticleBySlug(slug),
    listActiveCategories(),
    listActiveTags(),
  ]);

  if (!article) {
    notFound();
  }

  const normalizedContent = removeDuplicateLeadingTitle(
    article.contentMarkdown,
    article.title,
  );
  const headings = extractHeadings(normalizedContent);

  return (
    <main className="w-full">
      <ArticleLayout
        article={article}
        headings={headings}
        categories={categories}
        tags={tags}
      >
        <HighlightedMarkdownContent
          content={article.contentMarkdown}
          articleTitle={article.title}
        />
      </ArticleLayout>
    </main>
  );
}
