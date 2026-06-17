import { LockKeyhole, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";

export function AdminLoginScreen() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-10">
      <div className="pointer-events-none absolute -left-32 top-16 size-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none absolute -right-32 bottom-16 size-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-300 bg-card shadow-xl shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/30 lg:grid-cols-[1fr_420px]">
        <div className="relative hidden overflow-hidden border-r border-slate-300 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/30 lg:block">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="size-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Painel administrativo
              </p>

              <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-foreground">
                Gerencie seu blog com foco e organização.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Publique artigos, organize projetos, mantenha certificados e
                ajuste dados globais do seu portfólio técnico.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-foreground">
                  Conteúdo técnico
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Posts, categorias e tags para manter tudo organizado.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-foreground">
                  Portfólio profissional
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Centralize projetos e certificações em um único lugar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <LockKeyhole className="size-6" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Login seguro
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Entrar no admin
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Use sua conta autorizada para acessar o painel administrativo.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
