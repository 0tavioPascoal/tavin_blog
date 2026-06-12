import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";

export default async function NewCategoryPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Nova categoria</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar categoria</h1>
      </div>
      <CategoryForm />
    </AdminShell>
  );
}
