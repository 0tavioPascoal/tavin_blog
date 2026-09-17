import { Mail } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { cn } from "@/lib/utils";

type ArticlesNewsletterPanelProps = {
  className?: string;
  titleId: string;
};

export function ArticlesNewsletterPanel({
  className,
  titleId,
}: ArticlesNewsletterPanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id={titleId} className="text-sm font-bold text-foreground">
            Receba novos artigos
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Conteúdo direto no seu e-mail, sem spam.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <NewsletterForm
          source="articles-page"
          variant="compact"
          buttonLabel="Assinar newsletter"
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Você pode cancelar a qualquer momento.
      </p>
    </section>
  );
}
