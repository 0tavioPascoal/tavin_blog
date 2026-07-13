import { z } from "zod";

const nullableUrlSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().url().nullable().catch(null),
);

export const siteSettingsRowSchema = z.object({
  id: z.boolean(),
  site_url: z.string().url(),
  contact_email: z.email(),
  github_url: nullableUrlSchema,
  linkedin_url: nullableUrlSchema,
  resume_url: nullableUrlSchema,
  updated_at: z.string(),
});

export const siteSettingsFormSchema = z.object({
  siteUrl: z.string().url("Informe uma URL válida."),
  contactEmail: z.email("Informe um e-mail válido."),
  githubUrl: z.union([z.string().url("Informe uma URL válida."), z.literal("")]),
  linkedinUrl: z.union([z.string().url("Informe uma URL válida."), z.literal("")]),
});

export type SiteSettingsFormInput = z.infer<typeof siteSettingsFormSchema>;
