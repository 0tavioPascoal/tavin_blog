import { Edit, FolderTree, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteActionButton } from "@/components/admin/delete-action-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { deleteCategoryAction } from "@/features/categories/actions/category-actions";
import { listAllCategoriesForAdmin } from "@/features/categories/repositories/categories-repository";

export default async function AdminCategoriesPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const categories = await listAllCategoriesForAdmin();

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-card p-8 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <FolderTree className="size-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Categorias
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                Organizar artigos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Agrupe seus artigos por temas principais para facilitar a
                navegação e a organização editorial do blog.
              </p>
            </div>

            <Button
              asChild
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Link href="/admin/categories/new">
                <Plus className="size-4" />
                Nova categoria
              </Link>
            </Button>
          </div>
        </section>

        {categories.length > 0 ? (
          <section className="overflow-hidden rounded-3xl border border-slate-300 bg-card shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/30">
              <h2 className="text-base font-semibold text-foreground">
                Categorias cadastradas
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {categories.length}{" "}
                {categories.length === 1
                  ? "categoria criada"
                  : "categorias criadas"}
              </p>
            </div>

            <div className="divide-y divide-slate-300 dark:divide-slate-800">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="line-clamp-1 font-semibold text-foreground">
                        {category.name}
                      </h2>

                      <span className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        /{category.slug}
                      </span>

                      <span
                        className={
                          category.isActive
                            ? "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        }
                      >
                        {category.isActive ? "Ativa" : "Inativa"}
                      </span>
                    </div>

                    {category.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                    >
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="size-4" />
                        Editar
                      </Link>
                    </Button>

                    <DeleteActionButton
                      action={deleteCategoryAction.bind(null, category.id)}
                      pendingMessage="Removendo categoria..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="Nenhuma categoria cadastrada"
            description="Crie categorias para organizar os artigos do blog."
          />
        )}
      </div>
    </AdminShell>
  );
}