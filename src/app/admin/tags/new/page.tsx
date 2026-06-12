import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { TagForm } from "@/components/admin/tag-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";

export default async function NewTagPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Nova tag</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar tag</h1>
      </div>
      <TagForm />
    </AdminShell>
  );
}
