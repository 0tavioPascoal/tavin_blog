import { z } from "zod";

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

export type SupabaseConfig = z.infer<typeof supabaseEnvSchema>;

export function getSupabaseConfig(): SupabaseConfig | null {
  const parsed = supabaseEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  });

  return parsed.success ? parsed.data : null;
}
