import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getProjectByIdForAdmin } from "@/features/projects/repositories/projects-repository";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const project = await getProjectByIdForAdmin(id);

  if (!project) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar projeto</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{project.title}</h1>
      </div>
      <ProjectForm project={project} />
    </AdminShell>
  );
}
