import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllCategoriesForAdmin } from "@/features/categories/repositories/categories-repository";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

export default async function NewPostPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const [categories, tags] = await Promise.all([
    listAllCategoriesForAdmin(),
    listAllTagsForAdmin(),
  ]);

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Novo post</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Criar artigo</h1>
      </div>
      <PostForm categories={categories} tags={tags} />
    </AdminShell>
  );
}
