import type { ArticleDetail } from "@/features/posts/types/post";
import { getSiteUrlFallback } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createArticlePublishedEmail(
  article: ArticleDetail,
  unsubscribeUrl: string,
) {
  const articleUrl = new URL(`/blog/${article.slug}`, getSiteUrlFallback()).toString();
  const tags = article.tags.slice(0, 3).map((tag) => `#${tag.name}`).join(" ");
  const metadata = [
    article.category?.name.toUpperCase(),
    article.readingTimeMinutes > 0 ? `${article.readingTimeMinutes} min de leitura` : null,
  ].filter(Boolean).join(" · ");

  const html = `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;background:#f4f6f8;color:#172033;font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(article.description)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #d8dee8;border-radius:12px;">
          <tr><td style="padding:32px 28px 12px;font-size:15px;font-weight:700;">Otávio Pascoal</td></tr>
          <tr><td style="padding:12px 28px 0;color:#2563eb;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Novo artigo</td></tr>
          <tr><td style="padding:12px 28px 0;font-size:30px;line-height:1.15;font-weight:700;letter-spacing:-.02em;">${escapeHtml(article.title)}</td></tr>
          <tr><td style="padding:18px 28px 0;color:#475569;font-family:Georgia,serif;font-size:18px;line-height:1.65;">${escapeHtml(article.description)}</td></tr>
          ${metadata ? `<tr><td style="padding:20px 28px 0;color:#64748b;font-size:12px;font-weight:700;">${escapeHtml(metadata)}</td></tr>` : ""}
          <tr><td style="padding:24px 28px 4px;"><a href="${articleUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 18px;font-size:14px;font-weight:700;">Ler artigo</a></td></tr>
          ${tags ? `<tr><td style="padding:20px 28px 28px;color:#64748b;font-size:13px;">${escapeHtml(tags)}</td></tr>` : ""}
          <tr><td style="border-top:1px solid #e2e8f0;padding:22px 28px 28px;color:#64748b;font-size:12px;line-height:1.6;">Você está recebendo este email porque se inscreveu para receber novos artigos.<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#475569;text-decoration:underline;">Cancelar inscrição</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    "Otávio Pascoal", "", "Novo artigo", "", article.title, "",
    article.description, "", metadata, "", `Ler artigo: ${articleUrl}`, "",
    tags, "", "Você recebeu este email porque se inscreveu para receber novos artigos.",
    `Cancelar inscrição: ${unsubscribeUrl}`,
  ].filter((line) => line !== null).join("\n");

  return {
    subject: `Novo artigo: ${article.title}`,
    previewText: article.description,
    html,
    text,
  };
}
