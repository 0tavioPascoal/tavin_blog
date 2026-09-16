import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterInlineCta() {
  return (
    <section aria-labelledby="articles-newsletter-title" className="mt-12 rounded-xl border border-border/80 bg-card p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] md:items-center">
        <div>
          <h2 id="articles-newsletter-title" className="text-lg font-bold text-foreground">
            Receba novos artigos no seu e-mail
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Uma mensagem quando um novo conteúdo técnico for publicado. Sem spam e com cancelamento fácil.
          </p>
        </div>
        <NewsletterForm source="articles-page" variant="compact" />
      </div>
    </section>
  );
}
