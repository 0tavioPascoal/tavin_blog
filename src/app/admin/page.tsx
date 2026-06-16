import Link from "next/link";
import {
  Award,
  FileText,
  FilePenLine,
  Plus,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { LoginForm } from "@/components/admin/login-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { Button } from "@/components/ui/button";
import {
  getCurrentAdminUser,
  getCurrentUser,
} from "@/features/auth/repositories/auth-repository";
import { listAllCertificatesForAdmin } from "@/features/certificates/repositories/certificates-repository";
import { listAllArticlesForAdmin } from "@/features/posts/repositories/posts-repository";

export default async function AdminPage() {
  const sessionUser = await getCurrentUser();
  const user = await getCurrentAdminUser();

  if (!user) {
    if (sessionUser) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-300/70 bg-card p-8 shadow-sm dark:border-slate-800">
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <ShieldAlert className="size-6" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Acesso restrito
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sua sessão está ativa, mas este usuário não está autorizado como
              administrador do blog.
            </p>

            <div className="mt-6">
              <LogoutButton
                label="Sair e entrar com outro usuário"
                showIcon={false}
                className="w-full"
              />
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="grid min-h-screen place-items-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-300/70 bg-card p-8 shadow-sm dark:border-slate-800">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <ShieldCheck className="size-6" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Entrar no admin
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use sua conta autorizada para gerenciar artigos, projetos e
            certificados.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    );
  }

  const [articles, certificates] = await Promise.all([
    listAllArticlesForAdmin(),
    listAllCertificatesForAdmin(),
  ]);

  const published = articles.filter(
    (article) => article.status === "published",
  ).length;

  const drafts = articles.filter((article) => article.status === "draft").length;

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
        <section className="relative overflow-hidden rounded-3xl border border-slate-300/70 bg-card p-8 shadow-sm dark:border-slate-800">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Dashboard
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                Visão geral
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Acompanhe o conteúdo publicado e gerencie rapidamente os
                principais recursos do seu blog.
              </p>
            </div>

            <Button
              asChild
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
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
                className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
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