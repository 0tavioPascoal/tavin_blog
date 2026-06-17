"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { siteSettingsFormSchema } from "@/features/settings/schemas/settings-schema";
import { updateSiteSettings } from "@/features/settings/repositories/settings-repository";
import type { SiteSettingsMutationInput } from "@/features/settings/types/settings";

export type SettingsActionState = {
  ok: boolean;
  message: string;
};

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
  revalidatePath("/contato");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");

  return {
    ok: true,
    message: "Configurações salvas com sucesso.",
  };
}
