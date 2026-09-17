import type { CertificateSummary } from "@/features/certificates/types/certificate";

export type CertificateYearGroup = {
  year: number;
  certificates: CertificateSummary[];
};

function getIssuedYear(certificate: CertificateSummary): number {
  return Number(certificate.issuedAt.slice(0, 4));
}

export function groupCertificatesByYear(
  certificates: CertificateSummary[],
): CertificateYearGroup[] {
  const groups = new Map<number, CertificateSummary[]>();

  certificates.forEach((certificate) => {
    const year = getIssuedYear(certificate);
    groups.set(year, [...(groups.get(year) ?? []), certificate]);
  });

  return Array.from(groups, ([year, yearCertificates]) => ({
    year,
    certificates: yearCertificates.sort((a, b) => {
      const sortOrderDifference = a.sortOrder - b.sortOrder;
      return sortOrderDifference || b.issuedAt.localeCompare(a.issuedAt);
    }),
  })).sort((a, b) => b.year - a.year);
}
