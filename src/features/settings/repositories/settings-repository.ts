import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getContactEmailFallback, getSiteUrlFallback } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { siteSettingsRowSchema } from "@/features/settings/schemas/settings-schema";
import type { SiteSettings, SiteSettingsMutationInput } from "@/features/settings/types/settings";

const fallbackSettings: SiteSettings = {
  siteUrl: getSiteUrlFallback(),
  contactEmail: getContactEmailFallback(),
  githubUrl: null,
  linkedinUrl: null,
  resumeUrl: null,
  updatedAt: null,
};

const getSiteSettingsCached = unstable_cache(async function getSiteSettingsCached(): Promise<SiteSettings> {
  const supabase = createSupabasePublicClient();

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
    resumeUrl: settings.resume_url,
    updatedAt: settings.updated_at,
  };
}, ["site-settings"], { tags: ["settings"], revalidate: 3600 });

export const getSiteSettings = cache(getSiteSettingsCached);

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

export async function updateResumeUrl(resumeUrl: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase não está configurado.");
  const { error } = await supabase.from("site_settings").update({ resume_url: resumeUrl, updated_at: new Date().toISOString() }).eq("id", true);
  if (error) throw new Error(`Não foi possível salvar o currículo: ${error.message}`);
}
