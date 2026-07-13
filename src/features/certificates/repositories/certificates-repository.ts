import "server-only";

import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { CertificateDetail, CertificateMutationInput, CertificateSummary } from "@/features/certificates/types/certificate";
import { mapCertificateRowToDetail, mapCertificateRowToSummary } from "@/features/certificates/utils/mappers";
import type { TagSummary } from "@/features/tags/types/tag";
import { mapTagRowToSummary } from "@/features/tags/utils/mappers";
import type { Database } from "@/types/supabase";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];
type CertificateInsert = Database["public"]["Tables"]["certificates"]["Insert"];
type CertificateUpdate = Database["public"]["Tables"]["certificates"]["Update"];
type CertificateTagInsert = Database["public"]["Tables"]["certificate_tags"]["Insert"];

type CertificateRelations = {
  tagsByCertificateId: Map<string, TagSummary[]>;
};

function toInsert(input: CertificateMutationInput): CertificateInsert {
  const now = new Date().toISOString();

  return {
    title: input.title,
    slug: input.slug,
    issuer: input.issuer,
    description: input.description,
    credential_url: input.credentialUrl,
    image_url: input.imageUrl,
    pdf_url: input.pdfUrl,
    issued_at: input.issuedAt,
    expires_at: input.expiresAt,
    status: input.status,
    sort_order: input.sortOrder,
    created_at: now,
    updated_at: now,
  };
}

function toUpdate(input: CertificateMutationInput): CertificateUpdate {
  return {
    title: input.title,
    slug: input.slug,
    issuer: input.issuer,
    description: input.description,
    credential_url: input.credentialUrl,
    image_url: input.imageUrl,
    pdf_url: input.pdfUrl,
    issued_at: input.issuedAt,
    expires_at: input.expiresAt,
    status: input.status,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

async function loadCertificateRelations(
  supabase: SupabaseClient,
  certificates: CertificateRow[],
  includeInactiveTags: boolean,
): Promise<CertificateRelations> {
  const certificateIds = certificates.map((certificate) => certificate.id);
  const tagsByCertificateId = new Map<string, TagSummary[]>();

  if (certificateIds.length === 0) {
    return { tagsByCertificateId };
  }

  const { data: relationRows, error: relationError } = await supabase
    .from("certificate_tags")
    .select("*")
    .in("certificate_id", certificateIds);

  if (relationError) {
    throw new Error(`Não foi possível carregar tags dos certificados: ${relationError.message}`);
  }

  const tagIds = uniqueStrings(relationRows.map((relation) => relation.tag_id));

  if (tagIds.length === 0) {
    return { tagsByCertificateId };
  }

  let tagQuery = supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  if (!includeInactiveTags) {
    tagQuery = tagQuery.eq("is_active", true);
  }

  const { data: tagRows, error: tagError } = await tagQuery.order("name", { ascending: true });

  if (tagError) {
    throw new Error(`Não foi possível carregar tags dos certificados: ${tagError.message}`);
  }

  const tagsById = new Map<string, TagSummary>();
  tagRows.map(mapTagRowToSummary).forEach((tag) => {
    tagsById.set(tag.id, tag);
  });

  relationRows.forEach((relation) => {
    const tag = tagsById.get(relation.tag_id);

    if (!tag) {
      return;
    }

    const currentTags = tagsByCertificateId.get(relation.certificate_id) ?? [];
    tagsByCertificateId.set(relation.certificate_id, [...currentTags, tag]);
  });

  return { tagsByCertificateId };
}

async function hydrateCertificateSummaries(
  supabase: SupabaseClient,
  certificates: CertificateRow[],
  includeInactiveTags: boolean,
): Promise<CertificateSummary[]> {
  const relations = await loadCertificateRelations(supabase, certificates, includeInactiveTags);

  return certificates.map((certificate) =>
    mapCertificateRowToSummary(certificate, relations.tagsByCertificateId.get(certificate.id) ?? []),
  );
}

async function hydrateCertificateDetail(
  supabase: SupabaseClient,
  certificate: CertificateRow,
  includeInactiveTags: boolean,
): Promise<CertificateDetail> {
  const relations = await loadCertificateRelations(supabase, [certificate], includeInactiveTags);

  return mapCertificateRowToDetail(certificate, relations.tagsByCertificateId.get(certificate.id) ?? []);
}

async function replaceCertificateTags(
  supabase: SupabaseClient,
  certificateId: string,
  tagIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("certificate_tags")
    .delete()
    .eq("certificate_id", certificateId);

  if (deleteError) {
    throw new Error(`Não foi possível atualizar tags do certificado: ${deleteError.message}`);
  }

  const uniqueTagIds = uniqueStrings(tagIds);

  if (uniqueTagIds.length === 0) {
    return;
  }

  const insertRows: CertificateTagInsert[] = uniqueTagIds.map((tagId) => ({
    certificate_id: certificateId,
    tag_id: tagId,
  }));

  const { error: insertError } = await supabase
    .from("certificate_tags")
    .insert(insertRows);

  if (insertError) {
    throw new Error(`Não foi possível salvar tags do certificado: ${insertError.message}`);
  }
}

async function listPublishedCertificatesUncached(): Promise<CertificateSummary[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar certificados: ${error.message}`);
  }

  return hydrateCertificateSummaries(supabase, data, false);
}

export const listPublishedCertificates = unstable_cache(
  listPublishedCertificatesUncached,
  ["published-certificates-v2"],
  { tags: ["certificates", "taxonomy"], revalidate: 300 },
);

export async function listAllCertificatesForAdmin(): Promise<CertificateSummary[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar certificados do admin: ${error.message}`);
  }

  return hydrateCertificateSummaries(supabase, data, true);
}

export async function getCertificateByIdForAdmin(id: string): Promise<CertificateDetail | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar o certificado: ${error.message}`);
  }

  return data ? hydrateCertificateDetail(supabase, data, true) : null;
}

export async function createCertificate(input: CertificateMutationInput): Promise<string> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("certificates")
    .insert(toInsert(input))
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar o certificado: ${error.message}`);
  }

  await replaceCertificateTags(supabase, data.id, input.tagIds);

  return data.id;
}

export async function updateCertificate(id: string, input: CertificateMutationInput): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("certificates")
    .update(toUpdate(input))
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar o certificado: ${error.message}`);
  }

  await replaceCertificateTags(supabase, id, input.tagIds);
}
