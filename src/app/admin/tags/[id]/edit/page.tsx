import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { TagForm } from "@/components/admin/tag-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getTagByIdForAdmin } from "@/features/tags/repositories/tags-repository";

type EditTagPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTagPage({ params }: EditTagPageProps) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const tag = await getTagByIdForAdmin(id);

  if (!tag) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar tag</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{tag.name}</h1>
      </div>
      <TagForm tag={tag} />
    </AdminShell>
  );
}
