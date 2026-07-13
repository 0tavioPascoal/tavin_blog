"use server";

import { loginSchema } from "@/features/auth/schemas/auth-schema";
import { signInWithPassword, signOut } from "@/features/auth/repositories/auth-repository";
import { enforceRateLimit, hashRateLimitIdentifier } from "@/lib/rate-limit";

export type LoginActionState = {
  ok: boolean;
  message: string;
};

export async function loginAction(input: unknown): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise o e-mail e a senha informados.",
    };
  }

  try {
    await enforceRateLimit({
      scope: "admin-login",
      identifier: hashRateLimitIdentifier(parsed.data.email),
      maxAttempts: 5,
      windowSeconds: 15 * 60,
    });
    await signInWithPassword(parsed.data.email, parsed.data.password);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível entrar.",
    };
  }

  return {
    ok: true,
    message: "Login realizado.",
  };
}

export async function signOutAction(): Promise<LoginActionState> {
  try {
    await signOut();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível sair.",
    };
  }

  return {
    ok: true,
    message: "Sessão encerrada.",
  };
}
