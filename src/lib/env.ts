import { z } from "zod";

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

export type SupabaseConfig = z.infer<typeof supabaseEnvSchema>;

const defaultSiteUrl = "http://localhost:3000";
const defaultContactEmail = "contato@example.com";

export function getSupabaseConfig(): SupabaseConfig | null {
  const parsed = supabaseEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  });

  return parsed.success ? parsed.data : null;
}

export function getSiteUrlFallback(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return defaultSiteUrl;
  }

  const parsed = z.string().url().safeParse(siteUrl);

  return parsed.success ? parsed.data : defaultSiteUrl;
}

export function getContactEmailFallback(): string {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!contactEmail) {
    return defaultContactEmail;
  }

  const parsed = z.email().safeParse(contactEmail);

  return parsed.success ? parsed.data : defaultContactEmail;
}
