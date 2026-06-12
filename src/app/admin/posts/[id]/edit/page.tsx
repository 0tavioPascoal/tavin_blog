import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { listAllCategoriesForAdmin } from "@/features/categories/repositories/categories-repository";
import { getArticleByIdForAdmin } from "@/features/posts/repositories/posts-repository";
import { listAllTagsForAdmin } from "@/features/tags/repositories/tags-repository";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    getArticleByIdForAdmin(id),
    listAllCategoriesForAdmin(),
    listAllTagsForAdmin(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar post</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{post.title}</h1>
      </div>
      <PostForm post={post} categories={categories} tags={tags} />
    </AdminShell>
  );
}
