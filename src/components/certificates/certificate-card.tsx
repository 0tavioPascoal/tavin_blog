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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={certificate.imageUrl}
        alt={`Certificado ${certificate.title}`}
        className="h-24 w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-24 w-full items-center justify-center bg-linear-to-br from-blue-50 to-slate-100 text-blue-600 dark:from-blue-950/40 dark:to-slate-900 dark:text-blue-300">
      <Award className="size-8" aria-hidden="true" />
    </div>
  );
}

function CertificateContent({ certificate }: CertificateCardProps) {
  return (
    <div className="grid flex-1 gap-2 p-3">
      <div>
        <p className="line-clamp-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          {certificate.issuer}
        </p>

        <h3 className="mt-1 text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {certificate.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {certificate.description}
        </p>

        {certificate.tags.length > 0 ? (
          <div className="mt-2 hidden flex-wrap gap-1.5 md:flex">
            {certificate.tags.slice(0, 2).map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                colorHex={tag.colorHex}
                className="px-2 py-0.5 text-[10px]"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border pt-2 text-[10px] text-muted-foreground">
        <span className="block truncate">
          {formatDate(certificate.issuedAt)}
        </span>

        {certificate.expiresAt ? (
          <span className="mt-1 block truncate">
            Expira: {formatDate(certificate.expiresAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const cardClassName =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-300/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800";

  if (certificate.credentialUrl) {
    return (
      <a
        href={certificate.credentialUrl}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        <div className="relative overflow-hidden">
          <CertificateMedia certificate={certificate} />

          <span className="absolute right-2 top-2 rounded-lg border border-border bg-card/95 p-1.5 text-blue-600 shadow-sm backdrop-blur dark:text-blue-400">
            <ExternalLink className="size-3.5" />
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
