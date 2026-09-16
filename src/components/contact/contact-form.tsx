"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type ContactFormProps = {
  email: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

export function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name") ?? "").trim();
      const senderEmail = String(data.get("email") ?? "").trim();
      const subject = String(data.get("subject") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();
      const body = [`Nome: ${name}`, `E-mail: ${senderEmail}`, "", message].join("\n");

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const disabled = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/80 bg-card p-5 sm:p-6" aria-labelledby="contact-form-title">
      <div>
        <h2 id="contact-form-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Envie uma mensagem
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preencha os campos e eu preparo a mensagem no seu aplicativo de e-mail.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">
          Nome
          <input className={fieldClassName} name="name" autoComplete="name" placeholder="Seu nome" required disabled={disabled} />
        </label>
        <label className="text-sm font-medium text-foreground">
          E-mail
          <input className={fieldClassName} name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required disabled={disabled} />
        </label>
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Assunto
          <input className={fieldClassName} name="subject" placeholder="Sobre o que você quer conversar?" required disabled={disabled} />
        </label>
        <label className="text-sm font-medium text-foreground sm:col-span-2">
          Mensagem
          <textarea className={`${fieldClassName} min-h-36 resize-y py-3`} name="message" placeholder="Compartilhe o contexto da conversa." required disabled={disabled} />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={disabled} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
          {status === "loading" ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          {status === "loading" ? "Preparando..." : "Preparar e-mail"}
        </button>

        <div className="min-h-5 text-sm" role="status" aria-live="polite">
          {status === "success" ? (
            <p className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4" aria-hidden="true" /> E-mail preparado no seu aplicativo.
            </p>
          ) : null}
          {status === "error" ? <p className="text-destructive">Não foi possível abrir o e-mail. Use o endereço abaixo.</p> : null}
        </div>
      </div>
    </form>
  );
}
