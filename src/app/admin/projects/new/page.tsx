import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";

export default async function NewProjectPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Novo projeto</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar projeto</h1>
      </div>
      <ProjectForm />
    </AdminShell>
  );
}
