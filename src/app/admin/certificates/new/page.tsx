import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CertificateForm } from "@/components/admin/certificate-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

export default async function NewCertificatePage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const tags = await listAllTagsForAdmin();

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Novo certificado</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar certificado</h1>
      </div>
      <CertificateForm tags={tags} />
    </AdminShell>
  );
}
