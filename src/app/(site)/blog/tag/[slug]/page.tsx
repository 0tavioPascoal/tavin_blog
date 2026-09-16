import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedArticlesByTagId } from "@/features/posts/repositories/posts-repository";
import {
  getTagBySlug,
  listActiveTags,
} from "@/features/tags/repositories/tags-repository";
import { cn } from "@/lib/utils";

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

  const [articles, tags] = await Promise.all([
    listPublishedArticlesByTagId(tag.id),
    listActiveTags(),
  ]);

  return (
    <PageContainer as="main">
      {/* Navegação / Breadcrumb */}
      <nav
        aria-label="Navegação da tag"
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
        <span className="font-semibold text-foreground">{tag.name}</span>
      </nav>

      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Tag / Tecnologia"
        title={tag.name}
        description={
          tag.description ??
          `Artigos e publicações técnicas relacionadas a ${tag.name}.`
        }
      />

      {/* Outras tags relacionadas */}
      {tags.length > 1 ? (
        <section aria-label="Outras tags" className="mt-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            <span className="mr-1 shrink-0 text-xs font-medium text-muted-foreground">
              Outras tags:
            </span>
            {tags.slice(0, 16).map((t) => {
              const active = t.slug === tag.slug;

              return (
                <Link
                  key={t.id}
                  href={`/blog/tag/${t.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-[10px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                      : "border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t.name}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Grid de Artigos */}
      <section aria-label={`Artigos com a tag ${tag.name}`} className="mt-8">
        <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3 text-xs text-muted-foreground">
          <p>
            {articles.length} artigo{articles.length === 1 ? "" : "s"} com esta
            tag
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
            title="Nenhum artigo com esta tag"
            description="Ainda não existem artigos publicados com esta tag. Explore outros assuntos ou volte para todos os artigos."
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
