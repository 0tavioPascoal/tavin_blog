"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/features/auth/actions/auth-actions";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/auth-schema";

export function LoginForm() {
  const router = useRouter();
  const toast = useAdminToast();
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
      const toastId = toast.info("Validando suas credenciais...");
      const result = await loginAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          E-mail
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="h-11 w-full rounded-xl border border-slate-300/70 bg-card pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800"
            {...form.register("email")}
          />
        </div>

        {form.formState.errors.email ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-foreground"
        >
          Senha
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="h-11 w-full rounded-xl border border-slate-300/70 bg-card pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800"
            {...form.register("password")}
          />
        </div>

        {form.formState.errors.password ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="mt-1 h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar no admin"}
      </Button>
    </form>
  );
}