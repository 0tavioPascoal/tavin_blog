import "server-only";

import { z } from "zod";

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

const supabaseAdminEnvSchema = supabaseEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const gmailSmtpEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z.enum(["true", "false"]).transform((value) => value === "true"),
  SMTP_USER: z.email(),
  SMTP_APP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.string().min(1),
});

const newsletterDeliveryEnvSchema = z.object({
  NEWSLETTER_UNSUBSCRIBE_SECRET: z.string().min(32),
  NEWSLETTER_MAX_RECIPIENTS_PER_CAMPAIGN: z.coerce.number().int().positive().max(500),
});

export type SupabaseConfig = z.infer<typeof supabaseEnvSchema>;
export type SupabaseAdminConfig = z.infer<typeof supabaseAdminEnvSchema>;
export type GmailSmtpConfig = z.infer<typeof gmailSmtpEnvSchema>;
export type NewsletterDeliveryConfig = z.infer<typeof newsletterDeliveryEnvSchema>;

const defaultSiteUrl = "http://localhost:3000";
const defaultContactEmail = "contato@example.com";

export function getSupabaseConfig(): SupabaseConfig | null {
  const parsed = supabaseEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  });

  return parsed.success ? parsed.data : null;
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const parsed = supabaseAdminEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  return parsed.success ? parsed.data : null;
}

export function getGmailSmtpConfig(): GmailSmtpConfig | null {
  const parsed = gmailSmtpEnvSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
  });

  return parsed.success ? parsed.data : null;
}

export function getNewsletterDeliveryConfig(): NewsletterDeliveryConfig | null {
  const parsed = newsletterDeliveryEnvSchema.safeParse({
    NEWSLETTER_UNSUBSCRIBE_SECRET: process.env.NEWSLETTER_UNSUBSCRIBE_SECRET,
    NEWSLETTER_MAX_RECIPIENTS_PER_CAMPAIGN:
      process.env.NEWSLETTER_MAX_RECIPIENTS_PER_CAMPAIGN,
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
