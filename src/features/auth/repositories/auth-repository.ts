import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AdminUser = AuthUser & {
  isAdmin: true;
};

export type AdminAuthState = {
  sessionUser: AuthUser | null;
  adminUser: AdminUser | null;
};

async function resolveCurrentUser(): Promise<AuthUser | null> {
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

export async function getCurrentUser(): Promise<AuthUser | null> {
  return resolveCurrentUser();
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const user = await resolveCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    ...user,
    isAdmin: true,
  };
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  const sessionUser = await resolveCurrentUser();

  if (!sessionUser) {
    return {
      sessionUser: null,
      adminUser: null,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      sessionUser,
      adminUser: null,
    };
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", sessionUser.id)
    .maybeSingle();

  return {
    sessionUser,
    adminUser: error || !data
      ? null
      : {
          ...sessionUser,
          isAdmin: true,
        },
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
