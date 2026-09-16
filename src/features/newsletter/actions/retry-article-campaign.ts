"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { sendArticlePublishedCampaign } from "@/features/newsletter/services/article-campaign-service";
import { getArticleByIdForAdmin } from "@/features/posts/repositories/posts-repository";

export async function retryArticleCampaignAction(postId: string) {
  const user = await getCurrentAdminUser();
  if (!user) return { ok: false, message: "Acesso não autorizado." };

  const article = await getArticleByIdForAdmin(postId);
  if (!article || article.status !== "published") {
    return { ok: false, message: "Artigo publicado não encontrado." };
  }

  const result = await sendArticlePublishedCampaign(article.id);
  revalidatePath("/admin/newsletter");
  return result.status === "failed"
    ? { ok: false, message: result.message }
    : { ok: true, message: result.status === "sent" ? "Newsletter enviada." : "A newsletter já foi processada." };
}
