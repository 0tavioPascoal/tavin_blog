import {
  BadgeCheck,
  BookOpenText,
  FolderKanban,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";

const highlights = [
  {
    title: "Conteúdo técnico",
    description: "Gerencie artigos, categorias e tags.",
    icon: BookOpenText,
  },
  {
    title: "Portfólio profissional",
    description: "Organize projetos e certificados.",
    icon: FolderKanban,
  },
  {
    title: "Acesso protegido",
    description: "Área restrita para usuários autorizados.",
    icon: ShieldCheck,
  },
];

export function AdminLoginScreen() {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 size-80 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 -z-10 size-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />

      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:shadow-black/30 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative hidden overflow-hidden border-r border-slate-300/70 bg-muted/35 p-8 dark:border-slate-800 dark:bg-slate-950/35 lg:block lg:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
          <div className="pointer-events-none absolute -bottom-24 right-8 size-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />

          <div className="relative flex h-full min-h-142.5 flex-col justify-between">
            <div>
              <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/90 text-blue-600 shadow-sm dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Painel administrativo
              </p>

              <h1 className="mt-3 max-w-lg text-4xl font-bold tracking-[-0.035em] text-foreground">
                Controle seu conteúdo com clareza e organização.
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                Centralize publicações, projetos, certificados e informações do
                portfólio em uma área administrativa simples e segura.
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-300/70 bg-background/80 p-4 shadow-sm backdrop-blur transition hover:border-blue-300 hover:bg-background dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-blue-800"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative flex items-center p-5 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative w-full">
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/90 text-blue-600 shadow-sm dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                  <LockKeyhole className="size-5" aria-hidden="true" />
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Área protegida
                </span>
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Login seguro
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Entrar no admin
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Use uma conta autorizada para acessar o painel administrativo.
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <ShieldCheck
                className="size-4 shrink-0 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              O acesso é restrito e monitorado.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}