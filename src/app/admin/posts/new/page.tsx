import { FileText } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllCategoriesForAdmin } from "@/features/categories/repositories/categories-repository";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

export default async function NewPostPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const [categories, tags] = await Promise.all([
    listAllCategoriesForAdmin(),
    listAllTagsForAdmin(),
  ]);

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-300/80 bg-card p-8 shadow-lg shadow-slate-200/70 dark:border-slate-800 dark:shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <FileText className="size-6" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Novo post
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Criar artigo
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Escreva um novo artigo para o blog, organize por categoria,
              adicione tags e publique quando estiver pronto.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-xl border border-slate-300 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground dark:border-slate-800">
                Markdown
              </span>

              <span className="rounded-xl border border-slate-300 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground dark:border-slate-800">
                Categorias
              </span>

              <span className="rounded-xl border border-slate-300 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground dark:border-slate-800">
                Tags
              </span>

              <span className="rounded-xl border border-slate-300 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground dark:border-slate-800">
                Publicação
              </span>
            </div>
          </div>
        </section>

        <PostForm
          categories={categories}
          tags={tags}
        />
      </div>
    </AdminShell>
  );
}