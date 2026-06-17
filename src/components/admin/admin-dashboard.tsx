import Link from "next/link";
import {
  Award,
  FilePenLine,
  FileText,
  Plus,
  ShieldCheck,
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
      value: articles.length,
      icon: FileText,
    },
    {
      label: "Publicados",
      value: published,
      icon: ShieldCheck,
    },
    {
      label: "Rascunhos",
      value: drafts,
      icon: FilePenLine,
    },
    {
      label: "Certificados",
      value: certificates.length,
      icon: Award,
    },
  ];

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-card p-8 shadow-sm dark:border-slate-800">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Dashboard
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                Visão geral
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Acompanhe rapidamente a saúde do conteúdo do seu blog.
              </p>
            </div>

            <Button
              asChild
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              <Link href="/admin/posts/new">
                <Plus className="size-4" />
                Novo post
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-300 bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                    <Icon className="size-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AdminShell>
  );
}
