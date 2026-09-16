import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterArticleCta() {
  return (
    <section aria-labelledby="article-newsletter-title" className="my-12 border-y border-border/80 py-8">
      <div className="max-w-xl">
        <h2 id="article-newsletter-title" className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Receba os próximos artigos
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Conteúdos sobre desenvolvimento, arquitetura e engenharia de software.
        </p>
        <div className="mt-5">
          <NewsletterForm source="article" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sem spam. Você pode cancelar quando quiser.
        </p>
      </div>
    </section>
  );
}
