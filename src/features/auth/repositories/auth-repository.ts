import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
  };
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error("E-mail ou senha inválidos.");
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
