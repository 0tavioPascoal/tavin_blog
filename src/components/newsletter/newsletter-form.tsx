"use client";

import { CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import type { Ref } from "react";

import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe-newsletter";
import type {
  NewsletterActionState,
  NewsletterSource,
} from "@/features/newsletter/types/newsletter";
import { cn } from "@/lib/utils";

type NewsletterFormProps = {
  source: NewsletterSource;
  buttonLabel?: string;
  variant?: "default" | "compact";
  inputRef?: Ref<HTMLInputElement>;
};

const initialNewsletterActionState: NewsletterActionState = {
  status: "idle",
  message: "",
};

export function NewsletterForm({
  source,
  buttonLabel = "Quero receber",
  variant = "default",
  inputRef,
}: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialNewsletterActionState,
  );
  const inputId = useId();
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const emailErrors = state.fieldErrors?.email;

  useEffect(() => {
    if (state.status === "success") {
      localStorage.setItem("newsletter-subscribed", "true");
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3" role="status" aria-live="polite">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">
            {variant === "compact" ? "Inscrição realizada!" : "Inscrição realizada."}
          </p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {variant === "compact"
              ? "Você receberá os próximos artigos por email."
              : state.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="source" value={source} />
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${inputId}-website`}>Website</label>
        <input id={`${inputId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={cn("flex flex-col gap-3", variant === "default" && "sm:flex-row")}>
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">Seu e-mail</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              id={inputId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              required
              disabled={pending}
              aria-invalid={state.status === "error"}
              aria-describedby={`${descriptionId}${emailErrors ? ` ${errorId}` : ""}`}
              placeholder="seu@email.com"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive"
            />
          </div>
          <span id={descriptionId} className="sr-only">E-mail que receberá notificações de novos artigos.</span>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Inscrevendo..." : buttonLabel}
        </button>
      </div>

      {state.status === "error" ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-destructive">
          {emailErrors?.[0] ?? (
            variant === "compact"
              ? "Não foi possível realizar sua inscrição. Tente novamente."
              : state.message
          )}
        </p>
      ) : null}
    </form>
  );
}
