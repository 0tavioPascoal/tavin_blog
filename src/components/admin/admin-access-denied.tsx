import { ShieldAlert } from "lucide-react";

import { LogoutButton } from "@/components/admin/logout-button";

type Props = {
  userEmail?: string | null;
};

export function AdminAccessDenied({ userEmail }: Props) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-10">
      <div className="pointer-events-none absolute -left-32 top-16 size-80 rounded-full bg-red-500/10 blur-3xl dark:bg-red-500/5" />
      <div className="pointer-events-none absolute -right-32 bottom-16 size-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-300 bg-card p-8 shadow-xl shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/30">
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-red-500/10 blur-3xl dark:bg-red-500/5" />

        <div className="relative">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            <ShieldAlert className="size-6" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Acesso restrito
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Usuário sem permissão
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sua sessão está ativa, mas este usuário não possui acesso ao painel
            administrativo.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sessão atual
            </p>

            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {userEmail}
            </p>
          </div>

          <div className="mt-6">
            <LogoutButton
              label="Sair e entrar com outro usuário"
              showIcon={false}
              className="h-11 w-full rounded-xl"
            />
          </div>
        </div>
      </section>
    </main>
  );
}