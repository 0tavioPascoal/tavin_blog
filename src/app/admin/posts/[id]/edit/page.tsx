import { FileText } from "lucide-react";
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
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-card p-8 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative max-w-3xl">
            <div className="flex size-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <FileText className="size-6" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Editar post
            </p>

            <h1 className="mt-3 line-clamp-2 text-4xl font-bold tracking-tight text-foreground">
              {post.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Atualize o conteúdo, categoria, tags, status e destaque deste
              artigo.
            </p>
          </div>
        </section>

        <PostForm post={post} categories={categories} tags={tags} />
      </div>
    </AdminShell>
  );
}