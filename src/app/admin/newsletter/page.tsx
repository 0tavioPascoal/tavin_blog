import { ExternalLink, MailCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { NewsletterRetryButton } from "@/components/admin/newsletter-retry-button";
import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { getCampaignDeliveryStats } from "@/features/newsletter/repositories/newsletter-campaign-delivery-repository";
import { listArticleEmailCampaigns } from "@/features/newsletter/repositories/newsletter-campaign-repository";
import { listNewsletterSubscribers } from "@/features/newsletter/repositories/newsletter-subscriber-repository";
import { getArticleByIdForAdmin } from "@/features/posts/repositories/posts-repository";
import { formatDate } from "@/lib/formatters";

const statusLabels = {
  subscribed: "Inscrito", unsubscribed: "Desinscrito", bounced: "Bounce", complained: "Reclamação",
  pending: "Pendente", sending: "Enviando", sent: "Enviada", failed: "Erro",
} as const;

export default async function AdminNewsletterPage() {
  const user = await getCurrentAdminUser();
  if (!user) redirect("/admin");

  const [subscribers, campaigns, deliveryStats] = await Promise.all([
    listNewsletterSubscribers(),
    listArticleEmailCampaigns(),
    getCampaignDeliveryStats(),
  ]);
  const articles = await Promise.all(campaigns.map((campaign) => getArticleByIdForAdmin(campaign.postId)));
  const articleById = new Map(articles.filter(Boolean).map((article) => [article!.id, article!]));
  const metrics = [
    ["Inscritos ativos", subscribers.filter((item) => item.status === "subscribed").length],
    ["Desinscritos", subscribers.filter((item) => item.status === "unsubscribed").length],
    ["Campanhas enviadas", campaigns.filter((item) => item.status === "sent").length],
    ["Campanhas com erro", campaigns.filter((item) => item.status === "failed").length],
  ];

  return (
    <AdminShell user={user}>
      <div className="grid gap-8">
        <header className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <MailCheck className="size-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Newsletter</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acompanhe inscritos e notificações de novos artigos.</p>
        </header>

        <section aria-label="Resumo da newsletter" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Inscritos</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground"><tr><th className="px-5 py-3">E-mail</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Origem</th><th className="px-5 py-3">Inscrição</th></tr></thead>
              <tbody className="divide-y divide-border">
                {subscribers.map((subscriber) => <tr key={subscriber.id}><td className="px-5 py-3 font-medium">{subscriber.email}</td><td className="px-5 py-3">{statusLabels[subscriber.status]}</td><td className="px-5 py-3 text-muted-foreground">{subscriber.source ?? "—"}</td><td className="px-5 py-3 text-muted-foreground">{formatDate(subscriber.subscribedAt)}</td></tr>)}
                {subscribers.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Nenhum inscrito.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Campanhas</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground"><tr><th className="px-5 py-3">Artigo</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Enviados</th><th className="px-5 py-3">Falhas</th><th className="px-5 py-3">Data</th><th className="px-5 py-3">Erro</th><th className="px-5 py-3">Ações</th></tr></thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((campaign) => {
                  const article = articleById.get(campaign.postId);
                  const deliveries = deliveryStats.get(campaign.id) ?? { total: 0, sent: 0, failed: 0 };
                  return <tr key={campaign.id}><td className="px-5 py-3 font-medium">{article?.title ?? campaign.postId}</td><td className="px-5 py-3">{statusLabels[campaign.status]}</td><td className="px-5 py-3 text-muted-foreground">{deliveries.total}</td><td className="px-5 py-3 text-muted-foreground">{deliveries.sent}</td><td className="px-5 py-3 text-muted-foreground">{deliveries.failed}</td><td className="px-5 py-3 text-muted-foreground">{formatDate(campaign.sentAt ?? campaign.createdAt)}</td><td className="max-w-80 px-5 py-3 text-xs text-destructive">{campaign.lastError ?? "—"}</td><td className="px-5 py-3"><div className="flex gap-2">{article ? <Link href={`/blog/${article.slug}`} target="_blank" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted">Ver artigo <ExternalLink className="size-3" /></Link> : null}{campaign.status === "failed" ? <NewsletterRetryButton postId={campaign.postId} /> : null}</div></td></tr>;
                })}
                {campaigns.length === 0 ? <tr><td colSpan={8} className="px-5 py-8 text-center text-muted-foreground">Nenhuma campanha.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
