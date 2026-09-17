import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export const CERTIFICATE_BUCKET = "certificate-files";
export const CERTIFICATE_DIRECTORY = "certificates";
export const CERTIFICATE_PREVIEW_DIRECTORY = `${CERTIFICATE_DIRECTORY}/previews`;

type CertificateStorageClient = SupabaseClient<Database>;
type StorageOperation = "upload" | "remove";

function logStorageError(
  operation: StorageOperation,
  path: string,
  error: { message?: string; statusCode?: string; error?: string },
): void {
  console.error(`[certificates:storage] ${operation} failed`, {
    bucket: CERTIFICATE_BUCKET,
    path,
    operation,
    code: error.statusCode ?? error.error ?? "unknown",
    message: error.message ?? "Unknown Storage error",
  });
}

function isSafeCertificateObjectPath(path: string): boolean {
  if (!path.startsWith(`${CERTIFICATE_DIRECTORY}/`)) return false;
  if (path.includes("\\") || path.includes("..")) return false;

  const segments = path.split("/");
  return segments.every((segment) => segment.length > 0);
}

/**
 * Extracts a certificate object path from a public Supabase URL (including a
 * URL from a previous project) or from an already persisted object path.
 * Arbitrary URLs and paths outside the certificate directory are rejected.
 */
export function getCertificateObjectPath(value: string | null): string | null {
  if (!value) return null;

  const normalized = value.trim();
  if (isSafeCertificateObjectPath(normalized)) return normalized;

  try {
    const url = new URL(normalized);
    const marker = `/storage/v1/object/public/${CERTIFICATE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;

    const encodedPath = url.pathname.slice(markerIndex + marker.length);
    const path = decodeURIComponent(encodedPath);
    return isSafeCertificateObjectPath(path) ? path : null;
  } catch {
    return null;
  }
}

export function getCertificatePublicUrl(
  supabase: CertificateStorageClient,
  path: string,
): string {
  if (!isSafeCertificateObjectPath(path)) {
    throw new Error("Path de certificado inválido.");
  }

  return supabase.storage.from(CERTIFICATE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadCertificatePdf(
  supabase: CertificateStorageClient,
  path: string,
  bytes: ArrayBuffer,
): Promise<void> {
  if (!isSafeCertificateObjectPath(path) || !path.toLowerCase().endsWith(".pdf")) {
    throw new Error("Path de PDF de certificado inválido.");
  }

  const { error } = await supabase.storage.from(CERTIFICATE_BUCKET).upload(path, bytes, {
    contentType: "application/pdf",
    upsert: false,
  });

  if (error) {
    logStorageError("upload", path, error);
    throw new Error(error.message || "Não foi possível enviar o PDF.");
  }
}

export async function uploadCertificatePreview(
  supabase: CertificateStorageClient,
  path: string,
  bytes: ArrayBuffer,
  contentType: "image/jpeg" | "image/png" | "image/webp",
): Promise<void> {
  if (!isSafeCertificateObjectPath(path) || !path.startsWith(`${CERTIFICATE_PREVIEW_DIRECTORY}/`)) {
    throw new Error("Path de preview de certificado inválido.");
  }

  const { error } = await supabase.storage.from(CERTIFICATE_BUCKET).upload(path, bytes, {
    contentType,
    upsert: false,
  });

  if (error) {
    logStorageError("upload", path, error);
    throw new Error(error.message || "Não foi possível enviar o preview.");
  }
}

export async function removeCertificateFile(
  supabase: CertificateStorageClient,
  path: string | null,
): Promise<void> {
  if (!path) return;

  const { error } = await supabase.storage.from(CERTIFICATE_BUCKET).remove([path]);
  if (error) {
    logStorageError("remove", path, error);
  }
}
