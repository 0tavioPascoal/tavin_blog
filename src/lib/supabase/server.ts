import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/supabase";

export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always mutate cookies. Server Actions can.
          }
        },
      },
    },
  );
}
