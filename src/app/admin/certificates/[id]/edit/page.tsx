import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CertificateForm } from "@/components/admin/certificate-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getCertificateByIdForAdmin } from "@/features/certificates/repositories/certificates-repository";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

type EditCertificatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const [certificate, tags] = await Promise.all([
    getCertificateByIdForAdmin(id),
    listAllTagsForAdmin(),
  ]);

  if (!certificate) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar certificado</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{certificate.title}</h1>
      </div>
      <CertificateForm certificate={certificate} tags={tags} />
    </AdminShell>
  );
}
