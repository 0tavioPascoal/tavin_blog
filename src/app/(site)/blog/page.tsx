import type { Metadata } from "next";

import { ArticleCard } from "@/components/blog/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos técnicos de Otávio Pascoal sobre engenharia de software, arquitetura, qualidade e desenvolvimento fullstack.",
};

export default async function BlogPage() {
  const articles = await listPublishedArticles();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Blog</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
          Artigos sobre software, produto e qualidade
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
          Conteúdo prático sobre desenvolvimento fullstack, arquitetura, boas práticas e aprendizados de projetos reais.
        </p>
      </div>
      <div className="mt-10">
        {articles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum artigo publicado"
            description="Publique o primeiro post no admin ou diretamente no Supabase para alimentar esta página."
          />
        )}
      </div>
    </section>
  );
}
