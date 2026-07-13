"use server";

import { randomUUID } from "crypto";
import { revalidatePath, updateTag as expireCacheTag } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { createCertificate, getCertificateByIdForAdmin, updateCertificate } from "@/features/certificates/repositories/certificates-repository";
import { certificateFormSchema } from "@/features/certificates/schemas/certificate-schema";
import type { CertificateMutationInput } from "@/features/certificates/types/certificate";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CertificateActionState = {
  ok: boolean;
  message: string;
};

const certificateFilesBucket = "certificate-files";
const maxCertificatePdfSizeBytes = 5 * 1024 * 1024;

type CertificateAssets = Pick<CertificateMutationInput, "credentialUrl" | "imageUrl" | "pdfUrl">;
type UploadedPdf = { path: string; url: string };

function normalizeOptionalText(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toMutationInput(input: unknown, assets: CertificateAssets): CertificateMutationInput {
  const certificate = certificateFormSchema.parse(input);

  return {
    title: certificate.title,
    slug: certificate.slug,
    issuer: certificate.issuer,
    description: certificate.description,
    ...assets,
    issuedAt: certificate.issuedAt,
    expiresAt: normalizeOptionalText(certificate.expiresAt),
    status: certificate.status,
    tagIds: certificate.tagIds,
    sortOrder: certificate.sortOrder,
  };
}

async function requireAdmin() {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador para gerenciar certificados.");
  }

  return user;
}

function getCertificatePdfPath(publicUrl: string): string | null {
  const marker = `/object/public/${certificateFilesBucket}/`;
  const index = publicUrl.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(publicUrl.slice(index + marker.length).split("?")[0]);
}

async function uploadCertificatePdf(formData: FormData, userId: string): Promise<UploadedPdf | null> {
  const pdf = formData.get("certificatePdf");
  if (!(pdf instanceof File) || pdf.size === 0) return null;
  if (pdf.size > maxCertificatePdfSizeBytes) throw new Error("O PDF deve ter no máximo 5 MB.");

  const bytes = await pdf.arrayBuffer();
  const signature = new TextDecoder().decode(bytes.slice(0, 5));
  if (pdf.type !== "application/pdf" || !pdf.name.toLowerCase().endsWith(".pdf") || signature !== "%PDF-") {
    throw new Error("O arquivo enviado não corresponde a um PDF válido.");
  }

  await enforceRateLimit({ scope: "admin-upload", identifier: userId, maxAttempts: 20, windowSeconds: 3600 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase não está configurado.");

  const path = `certificates/${randomUUID()}.pdf`;
  const { error } = await supabase.storage.from(certificateFilesBucket).upload(path, bytes, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Não foi possível enviar o PDF.");

  const { data } = supabase.storage.from(certificateFilesBucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function removeCertificatePdf(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createSupabaseServerClient();
  await supabase?.storage.from(certificateFilesBucket).remove([path]);
}

function revalidateCertificatePaths(): void {
  expireCacheTag("certificates");
  expireCacheTag("taxonomy");
  revalidatePath("/certificados");
  revalidatePath("/sobre");
  revalidatePath("/admin/certificates");
}

export async function createCertificateAction(input: unknown, formData: FormData): Promise<CertificateActionState> {
  let uploadedPdf: UploadedPdf | null = null;
  let persisted = false;
  try {
    const user = await requireAdmin();
    const parsed = certificateFormSchema.parse(input);
    uploadedPdf = await uploadCertificatePdf(formData, user.id);
    if (parsed.status === "published" && !uploadedPdf) throw new Error("Envie o PDF antes de publicar o certificado.");

    await createCertificate(toMutationInput(parsed, {
      credentialUrl: null,
      imageUrl: null,
      pdfUrl: uploadedPdf?.url ?? null,
    }));
    persisted = true;
    revalidateCertificatePaths();
  } catch (error) {
    if (uploadedPdf && !persisted) await removeCertificatePdf(uploadedPdf.path);
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

export async function updateCertificateAction(id: string, input: unknown, formData: FormData): Promise<CertificateActionState> {
  let uploadedPdf: UploadedPdf | null = null;
  let persisted = false;
  try {
    const user = await requireAdmin();
    const current = await getCertificateByIdForAdmin(id);
    if (!current) throw new Error("Certificado não encontrado.");

    const parsed = certificateFormSchema.parse(input);
    uploadedPdf = await uploadCertificatePdf(formData, user.id);
    const pdfUrl = uploadedPdf?.url ?? current.pdfUrl;
    if (parsed.status === "published" && !pdfUrl) throw new Error("Envie o PDF antes de publicar ou atualizar este certificado.");

    await updateCertificate(id, toMutationInput(parsed, uploadedPdf ? {
      credentialUrl: null,
      imageUrl: current.imageUrl,
      pdfUrl,
    } : {
      credentialUrl: current.credentialUrl,
      imageUrl: current.imageUrl,
      pdfUrl,
    }));
    persisted = true;

    if (uploadedPdf && current.pdfUrl) {
      await removeCertificatePdf(getCertificatePdfPath(current.pdfUrl));
    }
    revalidateCertificatePaths();
  } catch (error) {
    if (uploadedPdf && !persisted) await removeCertificatePdf(uploadedPdf.path);
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
