import { Edit, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllArticlesForAdmin } from "@/features/posts/repositories/posts-repository";
import { formatDate } from "@/lib/formatters";

export default async function AdminPostsPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const articles = await listAllArticlesForAdmin();

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-card p-8 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <FileText className="size-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Posts
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                Gerenciar artigos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Crie, revise e organize os artigos publicados no blog.
              </p>
            </div>

            <Button
              asChild
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Link href="/admin/posts/new">
                <Plus className="size-4" />
                Novo post
              </Link>
            </Button>
          </div>
        </section>

        {articles.length > 0 ? (
          <section className="overflow-hidden rounded-3xl border border-slate-300 bg-card shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/30">
              <h2 className="text-base font-semibold text-foreground">
                Artigos cadastrados
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {articles.length}{" "}
                {articles.length === 1 ? "artigo criado" : "artigos criados"}
              </p>
            </div>

            <div className="divide-y divide-slate-300 dark:divide-slate-800">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="line-clamp-1 font-semibold text-foreground">
                        {article.title}
                      </h2>

                      <span
                        className={
                          article.status === "published"
                            ? "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400"
                        }
                      >
                        {article.status === "published"
                          ? "Publicado"
                          : "Rascunho"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {article.description}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(article.publishedAt)}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-xl border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  >
                    <Link href={`/admin/posts/${article.id}/edit`}>
                      <Edit className="size-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="Nenhum post cadastrado"
            description="Crie o primeiro artigo para iniciar o blog."
          />
        )}
      </div>
    </AdminShell>
  );
}