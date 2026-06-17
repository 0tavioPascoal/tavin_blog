import { FolderTree } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getCategoryByIdForAdmin } from "@/features/categories/repositories/categories-repository";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const category = await getCategoryByIdForAdmin(id);

  if (!category) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-300 bg-card p-5 sm:rounded-3xl sm:p-8 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative max-w-3xl">
            <div className="flex size-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <FolderTree className="size-6" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Editar categoria
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Atualize o nome, slug, descrição, ordem e status desta categoria.
            </p>
          </div>
        </section>

        <CategoryForm category={category} />
      </div>
    </AdminShell>
  );
}