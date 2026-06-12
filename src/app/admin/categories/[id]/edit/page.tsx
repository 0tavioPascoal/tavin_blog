import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getCategoryByIdForAdmin } from "@/features/categories/repositories/categories-repository";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
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
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar categoria</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{category.name}</h1>
      </div>
      <CategoryForm category={category} />
    </AdminShell>
  );
}
