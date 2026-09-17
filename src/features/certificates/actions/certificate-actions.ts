"use server";

import { randomUUID } from "crypto";
import { revalidatePath, updateTag as expireCacheTag } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { createCertificate, getCertificateByIdForAdmin, updateCertificate } from "@/features/certificates/repositories/certificates-repository";
import { certificateFormSchema } from "@/features/certificates/schemas/certificate-schema";
import {
  CERTIFICATE_DIRECTORY,
  CERTIFICATE_PREVIEW_DIRECTORY,
  getCertificateObjectPath,
  getCertificatePublicUrl,
  removeCertificateFile,
  uploadCertificatePdf,
  uploadCertificatePreview,
} from "@/features/certificates/services/certificate-storage";
import type { CertificateMutationInput } from "@/features/certificates/types/certificate";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CertificateActionState = {
  ok: boolean;
  message: string;
};

const maxCertificatePdfSizeBytes = 5 * 1024 * 1024;
const maxCertificatePreviewSizeBytes = 2 * 1024 * 1024;

type CertificateAssets = Pick<CertificateMutationInput, "credentialUrl" | "imageUrl" | "pdfUrl">;
type UploadedPdf = { path: string; url: string };
type UploadedPreview = { path: string; url: string };

const previewExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

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
    expiresAt: certificate.doesNotExpire ? null : normalizeOptionalText(certificate.expiresAt),
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

async function uploadCertificatePdfFromForm(formData: FormData, userId: string): Promise<UploadedPdf | null> {
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

  const path = `${CERTIFICATE_DIRECTORY}/${randomUUID()}.pdf`;
  await uploadCertificatePdf(supabase, path, bytes);
  return { path, url: getCertificatePublicUrl(supabase, path) };
}

function hasValidPreviewSignature(bytes: Uint8Array, contentType: keyof typeof previewExtensions): boolean {
  if (contentType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF"
    && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
}

async function uploadCertificatePreviewFromForm(
  formData: FormData,
  userId: string,
): Promise<UploadedPreview | null> {
  const preview = formData.get("certificatePreview");
  if (!(preview instanceof File) || preview.size === 0) return null;
  if (preview.size > maxCertificatePreviewSizeBytes) {
    throw new Error("A imagem de preview deve ter no máximo 2 MB.");
  }

  if (!(preview.type in previewExtensions)) {
    throw new Error("O preview deve ser uma imagem JPEG, PNG ou WebP.");
  }

  const contentType = preview.type as keyof typeof previewExtensions;
  const bytes = await preview.arrayBuffer();
  if (!hasValidPreviewSignature(new Uint8Array(bytes), contentType)) {
    throw new Error("O arquivo enviado não corresponde a uma imagem válida.");
  }

  await enforceRateLimit({ scope: "admin-upload", identifier: userId, maxAttempts: 20, windowSeconds: 3600 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase não está configurado.");

  const path = `${CERTIFICATE_PREVIEW_DIRECTORY}/${randomUUID()}.${previewExtensions[contentType]}`;
  await uploadCertificatePreview(supabase, path, bytes, contentType);
  return { path, url: getCertificatePublicUrl(supabase, path) };
}

async function removeUploadedAsset(path: string | null): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) await removeCertificateFile(supabase, path);
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
  let uploadedPreview: UploadedPreview | null = null;
  let persisted = false;
  try {
    const user = await requireAdmin();
    const parsed = certificateFormSchema.parse(input);
    uploadedPdf = await uploadCertificatePdfFromForm(formData, user.id);
    uploadedPreview = await uploadCertificatePreviewFromForm(formData, user.id);
    if (parsed.status === "published" && !uploadedPdf) throw new Error("Envie o PDF antes de publicar o certificado.");

    await createCertificate(toMutationInput(parsed, {
      credentialUrl: null,
      imageUrl: uploadedPreview?.url ?? null,
      pdfUrl: uploadedPdf?.url ?? null,
    }));
    persisted = true;
    revalidateCertificatePaths();
  } catch (error) {
    if (uploadedPdf && !persisted) {
      await removeUploadedAsset(uploadedPdf.path);
    }
    if (uploadedPreview && !persisted) await removeUploadedAsset(uploadedPreview.path);
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
  let uploadedPreview: UploadedPreview | null = null;
  let persisted = false;
  try {
    const user = await requireAdmin();
    const current = await getCertificateByIdForAdmin(id);
    if (!current) throw new Error("Certificado não encontrado.");

    const parsed = certificateFormSchema.parse(input);
    uploadedPdf = await uploadCertificatePdfFromForm(formData, user.id);
    uploadedPreview = await uploadCertificatePreviewFromForm(formData, user.id);
    const pdfUrl = uploadedPdf?.url ?? current.pdfUrl;
    if (parsed.status === "published" && !pdfUrl) throw new Error("Envie o PDF antes de publicar ou atualizar este certificado.");

    await updateCertificate(id, toMutationInput(parsed, uploadedPdf ? {
      credentialUrl: null,
      imageUrl: uploadedPreview?.url ?? current.imageUrl,
      pdfUrl,
    } : {
      credentialUrl: current.credentialUrl,
      imageUrl: uploadedPreview?.url ?? current.imageUrl,
      pdfUrl,
    }));
    persisted = true;

    if (uploadedPdf && current.pdfUrl) {
      await removeUploadedAsset(getCertificateObjectPath(current.pdfUrl));
    }
    if (uploadedPreview && current.imageUrl) {
      await removeUploadedAsset(getCertificateObjectPath(current.imageUrl));
    }
    revalidateCertificatePaths();
  } catch (error) {
    if (uploadedPdf && !persisted) {
      await removeUploadedAsset(uploadedPdf.path);
    }
    if (uploadedPreview && !persisted) await removeUploadedAsset(uploadedPreview.path);
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
