import { certificateRowSchema } from "@/features/certificates/schemas/certificate-schema";
import type { CertificateDetail, CertificateSummary } from "@/features/certificates/types/certificate";
import type { TagSummary } from "@/features/tags/types/tag";
import type { Database } from "@/types/supabase";

type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];

export function mapCertificateRowToSummary(row: CertificateRow, tags: TagSummary[] = []): CertificateSummary {
  const certificate = certificateRowSchema.parse(row);

  return {
    id: certificate.id,
    title: certificate.title,
    slug: certificate.slug,
    issuer: certificate.issuer,
    description: certificate.description,
    credentialUrl: certificate.credential_url,
    imageUrl: certificate.image_url,
    pdfUrl: certificate.pdf_url,
    issuedAt: certificate.issued_at,
    expiresAt: certificate.expires_at,
    status: certificate.status,
    tags,
    sortOrder: certificate.sort_order,
    updatedAt: certificate.updated_at,
  };
}

export function mapCertificateRowToDetail(row: CertificateRow, tags: TagSummary[] = []): CertificateDetail {
  const certificate = certificateRowSchema.parse(row);

  return {
    ...mapCertificateRowToSummary(certificate, tags),
    createdAt: certificate.created_at,
  };
}
