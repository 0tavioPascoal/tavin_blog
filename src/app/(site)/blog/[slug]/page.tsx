import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock,
  FolderTree,
  Hash,
} from "lucide-react";

import { HighlightedMarkdownContent } from "@/components/blog/markdown-content-highlighted";
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
    <main className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-[7vw] lg:py-12">
      <article className="mx-auto max-w-360">
        <nav
          aria-label="Navegação do artigo"
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link
            href="/blog/artigos"
            className="inline-flex items-center gap-2 font-semibold transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft className="size-4" />
            Artigos
          </Link>

          {article.category ? (
            <>
              <span aria-hidden="true" className="text-border">
                /
              </span>

              <Link
                href={`/blog/categoria/${article.category.slug}`}
                className="font-medium transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                {article.category.name}
              </Link>
            </>
          ) : null}
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-8 shadow-sm dark:border-slate-800 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 size-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />

          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              {article.category ? (
                <Link
                  href={`/blog/categoria/${article.category.slug}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3 text-xs font-bold uppercase tracking-[0.12em] text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:border-blue-800"
                >
                  <FolderTree className="size-3.5" />
                  {article.category.name}
                </Link>
              ) : null}

              {article.tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  name={tag.name}
                  colorHex={tag.colorHex}
                  className="h-8 px-3 text-[11px]"
                />
              ))}
            </div>

            <h1 className="mt-6 max-w-4xl text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl xl:text-6xl xl:leading-[1.08]">
              {article.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {article.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/80 pt-5 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-blue-600 dark:text-blue-400" />
                Publicado em {formatDate(article.publishedAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                {article.readingTimeMinutes} min de leitura
              </span>

              <span className="inline-flex items-center gap-2">
                <BookOpenText className="size-4 text-blue-600 dark:text-blue-400" />
                Leitura técnica
              </span>
            </div>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section
            aria-label="Conteúdo do artigo"
            className="min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-300/70 bg-card px-5 py-7 shadow-sm dark:border-slate-800 sm:px-8 sm:py-9 lg:px-12 lg:py-12"
          >
            <div className="mx-auto max-w-3xl">
              <HighlightedMarkdownContent content={article.contentMarkdown} />
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                  <BookOpenText className="size-4" />
                </span>

                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Sobre este artigo
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Informações da publicação
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-4 border-t border-border pt-5">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Publicação
                  </dt>
                  <dd className="text-right text-sm font-medium text-foreground">
                    {formatDate(article.publishedAt)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Leitura
                  </dt>
                  <dd className="text-right text-sm font-medium text-foreground">
                    {article.readingTimeMinutes} minutos
                  </dd>
                </div>

                {article.category ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Categoria
                    </dt>
                    <dd className="text-right">
                      <Link
                        href={`/blog/categoria/${article.category.slug}`}
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {article.category.name}
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {article.tags.length > 0 ? (
              <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Hash className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground">
                    Tecnologias e assuntos
                  </h2>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      name={tag.name}
                      colorHex={tag.colorHex}
                      className="h-8 px-3 text-[11px]"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <Link
              href="/blog/artigos"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/50"
            >
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                  Continue explorando
                </span>
                <span className="mt-1 block text-sm font-bold text-foreground">
                  Ver todos os artigos
                </span>
              </div>

              <ArrowRight className="size-5 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400" />
            </Link>
          </aside>
        </div>

        <footer className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-bold text-foreground">
              Chegou ao fim deste artigo?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue navegando pela biblioteca e explore outros conteúdos.
            </p>
          </div>

          <Link
            href="/blog/artigos"
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            Ver mais artigos
            <ArrowRight className="size-4" />
          </Link>
        </footer>
      </article>
    </main>
  );
}