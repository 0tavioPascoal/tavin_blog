"use server";

import { randomUUID } from "crypto";
import { revalidatePath, updateTag as expireCacheTag } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { siteSettingsFormSchema } from "@/features/settings/schemas/settings-schema";
import { getSiteSettings, updateResumeUrl, updateSiteSettings } from "@/features/settings/repositories/settings-repository";
import type { SiteSettingsMutationInput } from "@/features/settings/types/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export type SettingsActionState = {
  ok: boolean;
  message: string;
};

export type ResumeUploadActionState = SettingsActionState & { url?: string };
const resumesBucket = "resumes";
const maxResumeSizeBytes = 5 * 1024 * 1024;

function getResumePath(publicUrl: string): string | null {
  const marker = `/object/public/${resumesBucket}/`;
  const markerIndex = publicUrl.indexOf(marker);
  return markerIndex === -1 ? null : decodeURIComponent(publicUrl.slice(markerIndex + marker.length).split("?")[0]);
}

function normalizeOptionalUrl(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function toMutationInput(input: unknown): SiteSettingsMutationInput {
  const settings = siteSettingsFormSchema.parse(input);

  return {
    siteUrl: settings.siteUrl,
    contactEmail: settings.contactEmail,
    githubUrl: normalizeOptionalUrl(settings.githubUrl),
    linkedinUrl: normalizeOptionalUrl(settings.linkedinUrl),
  };
}

export async function updateSettingsAction(input: unknown): Promise<SettingsActionState> {
  try {
    const user = await getCurrentAdminUser();

    if (!user) {
      throw new Error("Você precisa estar autenticado como administrador.");
    }

    await updateSiteSettings(toMutationInput(input));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
    };
  }

  revalidatePath("/");
  expireCacheTag("settings");
  revalidatePath("/contato");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");

  return {
    ok: true,
    message: "Configurações salvas com sucesso.",
  };
}

export async function uploadResumeAction(formData: FormData): Promise<ResumeUploadActionState> {
  let uploadedPath: string | null = null;
  try {
    const user = await getCurrentAdminUser();
    if (!user) throw new Error("Você precisa estar autenticado como administrador.");
    await enforceRateLimit({ scope: "admin-upload", identifier: user.id, maxAttempts: 20, windowSeconds: 60 * 60 });
    const resume = formData.get("resume");
    if (!(resume instanceof File) || resume.size === 0) throw new Error("Selecione um currículo em PDF.");
    if (resume.size > maxResumeSizeBytes) throw new Error("O currículo deve ter no máximo 5 MB.");
    const bytes = await resume.arrayBuffer();
    const signature = new TextDecoder().decode(bytes.slice(0, 5));
    if (resume.type !== "application/pdf" || !resume.name.toLowerCase().endsWith(".pdf") || signature !== "%PDF-") throw new Error("O arquivo enviado não corresponde a um PDF válido.");
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase não está configurado.");
    const previousSettings = await getSiteSettings();
    uploadedPath = `resume/${randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage.from(resumesBucket).upload(uploadedPath, bytes, { contentType: "application/pdf", upsert: false });
    if (uploadError) throw new Error(uploadError.message || "Não foi possível enviar o currículo.");
    const { data } = supabase.storage.from(resumesBucket).getPublicUrl(uploadedPath);
    await updateResumeUrl(data.publicUrl);
    if (previousSettings.resumeUrl) {
      const previousPath = getResumePath(previousSettings.resumeUrl);
      if (previousPath && previousPath !== uploadedPath) await supabase.storage.from(resumesBucket).remove([previousPath]);
    }
    revalidatePath("/sobre");
    expireCacheTag("settings");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Currículo enviado com sucesso.", url: data.publicUrl };
  } catch (error) {
    if (uploadedPath) {
      const supabase = await createSupabaseServerClient();
      await supabase?.storage.from(resumesBucket).remove([uploadedPath]);
    }
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível enviar o currículo." };
  }
}
