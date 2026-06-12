import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCurrentUser } from "@/features/auth/repositories/auth-repository";

export default async function NewPostPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin");
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Novo post</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar artigo</h1>
      </div>
      <PostForm />
    </AdminShell>
  );
}
