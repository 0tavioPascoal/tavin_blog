import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { deleteTagAction } from "@/features/tags/actions/tag-actions";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

export default async function AdminTagsPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const tags = await listAllTagsForAdmin();

  return (
    <AdminShell user={user}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Tags</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Assuntos do blog</h1>
        </div>
        <Button asChild className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <Link href="/admin/tags/new">
            <Plus className="size-4" />
            Nova tag
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        {tags.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {tags.map((tag) => (
                <div key={tag.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-950 dark:text-white">{tag.name}</h2>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        /{tag.slug}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {tag.isActive ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    {tag.description ? (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tag.description}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/tags/${tag.id}/edit`}>
                        <Edit className="size-4" />
                        Editar
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTagAction(tag.id);
                      }}
                    >
                      <Button type="submit" variant="destructive" size="sm">
                        <Trash2 className="size-4" />
                        Remover
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="Nenhuma tag cadastrada" description="Crie tags para relacionar assuntos aos artigos." />
        )}
      </div>
    </AdminShell>
  );
}
