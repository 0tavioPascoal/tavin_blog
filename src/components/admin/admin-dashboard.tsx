import Link from "next/link";
import {
  Award,
  FilePenLine,
  FileText,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/features/auth/repositories/auth-repository";
import type { CertificateSummary } from "@/features/certificates/types/certificate";
import type { ArticleSummary } from "@/features/posts/types/post";

type Props = {
  user: AdminUser;
  articles: ArticleSummary[];
  certificates: CertificateSummary[];
};

export function AdminDashboard({
  user,
  articles,
  certificates,
}: Props) {
  const published = articles.filter(
    (article) => article.status === "published",
  ).length;

  const drafts = articles.filter(
    (article) => article.status === "draft",
  ).length;

  const stats = [
    {
      label: "Total de posts",
      description: "Todos os conteúdos cadastrados",
      value: articles.length,
      icon: FileText,
    },
    {
      label: "Publicados",
      description: "Conteúdos disponíveis no blog",
      value: published,
      icon: ShieldCheck,
    },
    {
      label: "Rascunhos",
      description: "Conteúdos em preparação",
      value: drafts,
      icon: FilePenLine,
    },
    {
      label: "Certificados",
      description: "Credenciais cadastradas",
      value: certificates.length,
      icon: Award,
    },
  ];

  return (
    <AdminShell user={user}>
      <div className="grid gap-6 lg:gap-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-7 shadow-sm dark:border-slate-800 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                <LayoutDashboard className="size-3.5" aria-hidden="true" />
                Dashboard
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl">
                Visão geral
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Acompanhe os principais números do blog e acesse rapidamente as
                ações mais importantes do painel administrativo.
              </p>
            </div>

            <Button
              asChild
              className="h-11 w-fit rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Link href="/admin/posts/new">
                <Plus className="size-4" aria-hidden="true" />
                Novo post
              </Link>
            </Button>
          </div>
        </section>

        <section
          aria-labelledby="dashboard-metrics-title"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <h2 id="dashboard-metrics-title" className="sr-only">
            Métricas do painel
          </h2>

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="group flex min-h-40 flex-col justify-between rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-950/5 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                  </div>

                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-600 shadow-sm transition-colors group-hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:group-hover:bg-blue-950/70">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>

                <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>

            <div>
              <h2 className="text-sm font-bold text-foreground">
                Continue produzindo
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Mantenha o portfólio atualizado com novos conteúdos e
                certificações.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-10 w-fit rounded-xl"
          >
            <Link href="/admin/posts">
              Gerenciar posts
            </Link>
          </Button>
        </section>
      </div>
    </AdminShell>
  );
}