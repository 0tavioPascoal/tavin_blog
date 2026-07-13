import type { CertificateStatus } from "@/types/supabase";
import type { TagSummary } from "@/features/tags/types/tag";

export type CertificateSummary = {
  id: string;
  title: string;
  slug: string;
  issuer: string;
  description: string;
  credentialUrl: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  issuedAt: string;
  expiresAt: string | null;
  status: CertificateStatus;
  tags: TagSummary[];
  sortOrder: number;
  updatedAt: string;
};

export type CertificateDetail = CertificateSummary & {
  createdAt: string;
};

export type CertificateMutationInput = {
  title: string;
  slug: string;
  issuer: string;
  description: string;
  credentialUrl: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  issuedAt: string;
  expiresAt: string | null;
  status: CertificateStatus;
  tagIds: string[];
  sortOrder: number;
};
