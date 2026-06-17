import { Globe2 } from "lucide-react";
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
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-5 sm:rounded-3xl sm:p-8 shadow-sm dark:border-slate-800">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative max-w-3xl">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Globe2 className="size-6" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Configurações
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dados globais do site
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Gerencie informações públicas utilizadas no blog, portfólio,
              contatos e integrações externas.
            </p>
          </div>
        </section>

        <SettingsForm settings={settings} />
      </div>
    </AdminShell>
  );
}