import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TagBadge } from "@/components/blog/tag-badge";
import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllCertificatesForAdmin } from "@/features/certificates/repositories/certificates-repository";
import { formatDate } from "@/lib/formatters";

export default async function AdminCertificatesPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const certificates = await listAllCertificatesForAdmin();

  return (
    <AdminShell user={user}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Certificados</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Gerenciar certificações</h1>
        </div>
        <Button asChild className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <Link href="/admin/certificates/new">
            <Plus className="size-4" />
            Novo certificado
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        {certificates.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-950 dark:text-white">{certificate.title}</h2>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {certificate.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{certificate.issuer}</p>
                    {certificate.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {certificate.tags.map((tag) => (
                          <TagBadge key={tag.id} name={tag.name} colorHex={tag.colorHex} />
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 text-xs text-slate-500">
                      Emitido em {formatDate(certificate.issuedAt)} · Ordem {certificate.sortOrder}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/certificates/${certificate.id}/edit`}>
                      <Edit className="size-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="Nenhum certificado cadastrado" description="Crie o primeiro certificado para exibir na página Sobre." />
        )}
      </div>
    </AdminShell>
  );
}
