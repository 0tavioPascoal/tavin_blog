import {
  Award,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CertificateSummary } from "@/features/certificates/types/certificate";
import { formatDate } from "@/lib/formatters";

type CertificateCardProps = {
  certificate: CertificateSummary;
};

export function CertificateCard({ certificate }: CertificateCardProps) {
  const visibleTags = certificate.tags.slice(0, 3);
  const remainingTags = Math.max(certificate.tags.length - visibleTags.length, 0);
  const certificateUrl = certificate.pdfUrl ?? certificate.credentialUrl;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition-colors duration-150 hover:border-blue-500/50 hover:shadow-xs">
      {/* Mídia / Prévia com Aspect Ratio Consistente */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/70 bg-muted">
        {certificate.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.imageUrl}
            alt={`Certificado ${certificate.title}`}
            className="size-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted/60 text-muted-foreground">
            <Award className="size-8 opacity-40" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
          <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{certificate.issuer}</span>
        </div>

        <h3 className="mt-2 font-sans text-base font-bold leading-snug text-foreground">
          {certificate.title}
        </h3>

        {certificate.description ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {certificate.description}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <CalendarDays className="size-3 text-muted-foreground" aria-hidden="true" />
              <time dateTime={certificate.issuedAt}>
                {formatDate(certificate.issuedAt)}
              </time>
            </span>

            {certificateUrl ? (
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir credencial do certificado ${certificate.title}`}
                className="inline-flex min-h-9 items-center gap-1 rounded-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>Ver credencial</span>
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>

          {visibleTags.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  colorHex={tag.colorHex}
                  className="h-5 px-1.5 text-[9px] shadow-none"
                />
              ))}

              {remainingTags > 0 ? (
                <span className="inline-flex h-5 items-center rounded-full border border-border bg-muted/60 px-1.5 text-[9px] font-bold text-muted-foreground">
                  +{remainingTags}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
