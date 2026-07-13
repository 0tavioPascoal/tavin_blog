import {
  Award,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CertificateSummary } from "@/features/certificates/types/certificate";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type CertificateCardProps = {
  certificate: CertificateSummary;
};

function CertificateMedia({ certificate }: CertificateCardProps) {
  return (
    <div className="relative h-32 overflow-hidden border-b border-border bg-muted sm:h-36">
      {certificate.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={certificate.imageUrl}
          alt={`Certificado ${certificate.title}`}
          className="size-full object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      ) : certificate.pdfUrl ? (
        <iframe
          src={`${certificate.pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={`Prévia do certificado ${certificate.title}`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none h-[calc(100%+18px)] w-[calc(100%+18px)] border-0 bg-white"
        />
      ) : (
        <div className="relative flex size-full items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-slate-50 to-cyan-50 text-blue-600 dark:from-blue-950/45 dark:via-slate-950 dark:to-cyan-950/30 dark:text-blue-300">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[24px_24px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]" />

          <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-blue-200 bg-white/80 shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-950/70">
            <Award className="size-6" aria-hidden="true" />
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {certificate.pdfUrl || certificate.credentialUrl ? (
        <span className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-xl border border-white/50 bg-white/90 text-blue-600 shadow-sm backdrop-blur transition group-hover:bg-blue-600 group-hover:text-white dark:border-white/10 dark:bg-slate-950/85 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">Abrir credencial</span>
        </span>
      ) : null}
    </div>
  );
}

function CertificateContent({ certificate }: CertificateCardProps) {
  const visibleTags = certificate.tags.slice(0, 3);
  const remainingTags = Math.max(certificate.tags.length - visibleTags.length, 0);

  return (
    <div className="flex flex-1 flex-col p-3.5">
      <div className="flex items-center gap-2">
        <BadgeCheck
          className="size-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />

        <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
          {certificate.issuer}
        </p>
      </div>

      <h3 className="mt-2 line-clamp-2 text-base font-bold leading-5 tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {certificate.title}
      </h3>

      {certificate.description ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {certificate.description}
        </p>
      ) : null}

      {visibleTags.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              colorHex={tag.colorHex}
              className="h-6 px-2 text-[9px] shadow-none"
            />
          ))}

          {remainingTags > 0 ? (
            <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2 text-[9px] font-bold text-muted-foreground">
              +{remainingTags}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-3">
        <div className="flex flex-col gap-2 border-t border-border pt-2.5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <CalendarDays
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />

            <span>Emitido em {formatDate(certificate.issuedAt)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-full border px-2 text-[9px] font-bold uppercase tracking-wide",
                certificate.expiresAt
                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-300",
              )}
            >
              {certificate.expiresAt
                ? `Expira em ${formatDate(certificate.expiresAt)}`
                : "Sem expiração"}
            </span>

            {certificate.pdfUrl || certificate.credentialUrl ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 transition group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                {certificate.pdfUrl ? "Ver certificado" : "Ver credencial"}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const cardClassName =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-300/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-950/5 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:shadow-black/20";

  const content = (
    <>
      <CertificateMedia certificate={certificate} />
      <CertificateContent certificate={certificate} />
    </>
  );

  const certificateUrl = certificate.pdfUrl ?? certificate.credentialUrl;

  if (certificateUrl) {
    return (
      <a
        href={certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir credencial ${certificate.title}`}
        className={cardClassName}
      >
        {content}
      </a>
    );
  }

  return <article className={cardClassName}>{content}</article>;
}
