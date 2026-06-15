import { Award, FileText, FolderKanban, Home, LogOut, PenSquare, Settings, Tags } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/features/auth/actions/auth-actions";
import type { AdminUser } from "@/features/auth/repositories/auth-repository";
import { Button } from "@/components/ui/button";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <Link href="/admin" className="text-lg font-semibold text-slate-950 dark:text-white">
          Admin Otávio
        </Link>
        <p className="mt-2 truncate text-sm text-slate-500">{user.email}</p>
        <nav className="mt-8 grid gap-2">
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin">
            <Home className="size-4" />
            Dashboard
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/posts">
            <FileText className="size-4" />
            Posts
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/projects">
            <FolderKanban className="size-4" />
            Projetos
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/certificates">
            <Award className="size-4" />
            Certificados
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/categories">
            <Tags className="size-4" />
            Categorias
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/tags">
            <Tags className="size-4" />
            Tags
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/posts/new">
            <PenSquare className="size-4" />
            Novo post
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/admin/settings">
            <Settings className="size-4" />
            Configurações
          </Link>
        </nav>
        <form action={signOutAction} className="absolute bottom-6 left-6 right-6">
          <Button variant="outline" className="w-full" type="submit">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-semibold">Admin Otávio</Link>
            <form action={signOutAction}>
              <Button variant="ghost" size="sm" type="submit">Sair</Button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
