import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { LoginForm } from "@/components/admin/login-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser, getCurrentUser } from "@/features/auth/repositories/auth-repository";
import { listAllCertificatesForAdmin } from "@/features/certificates/repositories/certificates-repository";
import { listAllArticlesForAdmin } from "@/features/posts/repositories/posts-repository";

export default async function AdminPage() {
  const sessionUser = await getCurrentUser();
  const user = await getCurrentAdminUser();

  if (!user) {
    if (sessionUser) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Acesso restrito</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Sua sessão está ativa, mas este usuário não está autorizado como administrador do blog.
            </p>
            <div className="mt-6">
              <LogoutButton label="Sair e entrar com outro usuário" showIcon={false} className="w-full" />
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Entrar no admin</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Use sua conta Supabase para gerenciar artigos.
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
  const published = articles.filter((article) => article.status === "published").length;
  const drafts = articles.filter((article) => article.status === "draft").length;

  return (
    <AdminShell user={user}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Visão geral</h1>
          </div>
          <Button asChild className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/admin/posts/new">Novo post</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500">Total de posts</p>
            <p className="mt-2 text-3xl font-semibold">{articles.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500">Publicados</p>
            <p className="mt-2 text-3xl font-semibold">{published}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500">Rascunhos</p>
            <p className="mt-2 text-3xl font-semibold">{drafts}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500">Certificados</p>
            <p className="mt-2 text-3xl font-semibold">{certificates.length}</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
