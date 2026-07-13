"use server";

import { revalidatePath, updateTag as expireCacheTag } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { createCertificate, updateCertificate } from "@/features/certificates/repositories/certificates-repository";
import { certificateFormSchema } from "@/features/certificates/schemas/certificate-schema";
import type { CertificateMutationInput } from "@/features/certificates/types/certificate";

export type CertificateActionState = {
  ok: boolean;
  message: string;
};

function normalizeOptionalText(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toMutationInput(input: unknown): CertificateMutationInput {
  const certificate = certificateFormSchema.parse(input);

  return {
    title: certificate.title,
    slug: certificate.slug,
    issuer: certificate.issuer,
    description: certificate.description,
    credentialUrl: normalizeOptionalText(certificate.credentialUrl),
    imageUrl: normalizeOptionalText(certificate.imageUrl),
    issuedAt: certificate.issuedAt,
    expiresAt: normalizeOptionalText(certificate.expiresAt),
    status: certificate.status,
    tagIds: certificate.tagIds,
    sortOrder: certificate.sortOrder,
  };
}

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar certificados.");
  }
}

function revalidateCertificatePaths(): void {
  expireCacheTag("certificates");
  expireCacheTag("taxonomy");
  revalidatePath("/certificados");
  revalidatePath("/sobre");
  revalidatePath("/admin/certificates");
}

export async function createCertificateAction(input: unknown): Promise<CertificateActionState> {
  try {
    await requireAdmin();
    await createCertificate(toMutationInput(input));
    revalidateCertificatePaths();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar o certificado.",
    };
  }

  return {
    ok: true,
    message: "Certificado criado com sucesso.",
  };
}

export async function updateCertificateAction(id: string, input: unknown): Promise<CertificateActionState> {
  try {
    await requireAdmin();
    await updateCertificate(id, toMutationInput(input));
    revalidateCertificatePaths();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar o certificado.",
    };
  }

  return {
    ok: true,
    message: "Certificado atualizado com sucesso.",
  };
}
