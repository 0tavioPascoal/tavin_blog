"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "@/features/auth/actions/auth-actions";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schema";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginAction(values);
      setMessage(result.message);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input
          id="email"
          type="email"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input
          id="password"
          type="password"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p> : null}
      <Button type="submit" className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
