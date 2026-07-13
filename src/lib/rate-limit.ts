import "server-only";

import { createHash } from "crypto";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type RateLimitOptions = {
  scope: string;
  identifier: string;
  maxAttempts: number;
  windowSeconds: number;
};

export function hashRateLimitIdentifier(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function enforceRateLimit(options: RateLimitOptions): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_scope: options.scope,
    p_identifier: options.identifier,
    p_max_attempts: options.maxAttempts,
    p_window_seconds: options.windowSeconds,
  });

  if (error) throw new Error("Não foi possível validar o limite de tentativas.");
  if (!data) throw new Error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
}
