import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/supabase";

export function createSupabasePublicClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createClient<Database>(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
