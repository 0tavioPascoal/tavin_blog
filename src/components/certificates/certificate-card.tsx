import { Award, ExternalLink } from "lucide-react";

import { TagBadge } from "@/components/blog/tag-badge";
import type { CertificateSummary } from "@/features/certificates/types/certificate";
import { formatDate } from "@/lib/formatters";

type CertificateCardProps = {
  certificate: CertificateSummary;
};

function CertificateMedia({ certificate }: CertificateCardProps) {
  if (certificate.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Certificate images can come from arbitrary external issuers.
      <img
        src={certificate.imageUrl}
        alt={`Certificado ${certificate.title}`}
        className="h-40 w-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-blue-600 dark:from-slate-900 dark:to-slate-800">
      <Award className="size-12" aria-hidden="true" />
    </div>
  );
}

function CertificateContent({ certificate }: CertificateCardProps) {
  return (
    <div className="grid flex-1 gap-4 p-5">
      <div>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{certificate.issuer}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-normal text-slate-950 dark:text-white">
          {certificate.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {certificate.description}
        </p>
        {certificate.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {certificate.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} colorHex={tag.colorHex} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800">
        <span>Emitido em {formatDate(certificate.issuedAt)}</span>
        {certificate.expiresAt ? <span>Expira em {formatDate(certificate.expiresAt)}</span> : null}
      </div>
    </div>
  );
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const cardClassName = "group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900";

  if (certificate.credentialUrl) {
    return (
      <a href={certificate.credentialUrl} target="_blank" rel="noreferrer" className={cardClassName}>
        <div className="relative">
          <CertificateMedia certificate={certificate} />
          <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-blue-700 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:text-blue-400">
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">Abrir credencial</span>
          </span>
        </div>
        <CertificateContent certificate={certificate} />
      </a>
    );
  }

  return (
    <article className={cardClassName}>
      <CertificateMedia certificate={certificate} />
      <CertificateContent certificate={certificate} />
    </article>
  );
}
