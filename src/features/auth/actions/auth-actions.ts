"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/features/auth/schemas/auth-schema";
import { signInWithPassword, signOut } from "@/features/auth/repositories/auth-repository";

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

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect("/admin");
}
