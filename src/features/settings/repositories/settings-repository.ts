import "server-only";

import { cache } from "react";

import { getContactEmailFallback, getSiteUrlFallback } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteSettingsRowSchema } from "@/features/settings/schemas/settings-schema";
import type { SiteSettings, SiteSettingsMutationInput } from "@/features/settings/types/settings";

const fallbackSettings: SiteSettings = {
  siteUrl: getSiteUrlFallback(),
  contactEmail: getContactEmailFallback(),
  githubUrl: null,
  linkedinUrl: null,
  updatedAt: null,
};

export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    return fallbackSettings;
  }

  const settings = siteSettingsRowSchema.parse(data);

  return {
    siteUrl: settings.site_url,
    contactEmail: settings.contact_email,
    githubUrl: settings.github_url,
    linkedinUrl: settings.linkedin_url,
    updatedAt: settings.updated_at,
  };
});

export async function updateSiteSettings(input: SiteSettingsMutationInput): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: true,
      site_url: input.siteUrl,
      contact_email: input.contactEmail,
      github_url: input.githubUrl,
      linkedin_url: input.linkedinUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) {
    throw new Error(`Não foi possível salvar as configurações: ${error.message}`);
  }
}
