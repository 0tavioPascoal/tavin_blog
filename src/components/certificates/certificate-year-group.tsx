import { CertificateListItem } from "@/components/certificates/certificate-list-item";
import type { CertificateYearGroup as CertificateYearGroupData } from "@/features/certificates/utils/group-certificates-by-year";

type CertificateYearGroupProps = {
  group: CertificateYearGroupData;
};

export function CertificateYearGroup({ group }: CertificateYearGroupProps) {
  const titleId = `certificates-${group.year}-title`;

  return (
    <section aria-labelledby={titleId}>
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2 id={titleId} className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {group.year}
        </h2>
        <p className="shrink-0 pb-0.5 text-xs text-muted-foreground">
          {group.certificates.length} certificado
          {group.certificates.length === 1 ? "" : "s"}
        </p>
      </header>
      <div>
        {group.certificates.map((certificate) => (
          <CertificateListItem key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </section>
  );
}
