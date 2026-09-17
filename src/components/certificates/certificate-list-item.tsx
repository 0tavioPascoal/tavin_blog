import { ArrowRight } from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CertificateSummary } from "@/features/certificates/types/certificate";

type CertificateListItemProps = {
  certificate: CertificateSummary;
};

const certificateDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function CertificateListItem({ certificate }: CertificateListItemProps) {
  const certificateUrl = certificate.pdfUrl ?? certificate.credentialUrl;
  const visibleTags = certificate.tags.slice(0, 2);
  const remainingTags = Math.max(certificate.tags.length - visibleTags.length, 0);

  return (
    <article className="group border-b border-border/80 py-5 first:pt-0 sm:py-6">
      <div className="rounded-lg px-2 py-2 transition-colors group-hover:bg-muted/35 sm:px-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              <time dateTime={certificate.issuedAt}>
                {certificateDateFormatter.format(new Date(certificate.issuedAt))}
              </time>
              <span aria-hidden="true">·</span>
              <span>{certificate.issuer}</span>
            </div>

            <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-xl">
              {certificate.title}
            </h3>

            {certificate.description ? (
              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:line-clamp-1 sm:text-[15px]">
                {certificate.description}
              </p>
            ) : null}

            {certificate.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {visibleTags.map((tag) => (
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    colorHex={tag.colorHex}
                    className="h-6 px-2 text-[10px] shadow-none"
                  />
                ))}
                {remainingTags > 0 ? (
                  <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2 text-[10px] font-bold text-muted-foreground">
                    +{remainingTags}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {certificateUrl ? (
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir certificado: ${certificate.title} (nova aba)`}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:text-blue-600 dark:hover:text-blue-400 dark:group-hover:text-blue-400 sm:self-auto"
            >
              Ver certificado
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
