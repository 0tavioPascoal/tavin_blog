import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export default async function AdminSettingsPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const settings = await getSiteSettings();

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Configurações</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Dados globais do site</h1>
      </div>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
