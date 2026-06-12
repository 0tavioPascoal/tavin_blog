import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCurrentUser } from "@/features/auth/repositories/auth-repository";
import { getArticleByIdForAdmin } from "@/features/posts/repositories/posts-repository";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin");
  }

  const { id } = await params;
  const post = await getArticleByIdForAdmin(id);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Editar post</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{post.title}</h1>
      </div>
      <PostForm post={post} />
    </AdminShell>
  );
}
