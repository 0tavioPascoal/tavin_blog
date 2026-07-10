"use client";

import type { ComponentType } from "react";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExternalLink,
  Globe2,
  Link2,
  Mail,
  Save,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "@/features/settings/actions/settings-actions";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormInput,
} from "@/features/settings/schemas/settings-schema";
import type { SiteSettings } from "@/features/settings/types/settings";

type SettingsFormProps = {
  settings: SiteSettings;
};

type FieldErrorProps = {
  message?: string;
};

type InputFieldProps<TFieldValues extends FieldValues> = {
  id: Path<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  register: UseFormRegister<TFieldValues>;
  error?: string;
};

const inputClassName = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-300/80
  bg-background
  pl-10
  pr-3
  text-sm
  text-foreground
  shadow-sm
  outline-none
  transition
  placeholder:text-muted-foreground/70
  hover:border-slate-400
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-500/10
  disabled:cursor-not-allowed
  disabled:opacity-60
  dark:border-slate-700
  dark:hover:border-slate-600
`;

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="text-sm font-medium text-red-600 dark:text-red-400"
    >
      {message}
    </p>
  );
}

function InputField<TFieldValues extends FieldValues>({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  icon: Icon,
  register,
  error,
}: InputFieldProps<TFieldValues>) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          className={inputClassName}
          {...register(id)}
        />
      </div>

      {hint && !error ? (
        <p
          id={hintId}
          className="text-xs leading-5 text-muted-foreground"
        >
          {hint}
        </p>
      ) : null}

      {error ? (
        <div id={errorId}>
          <FieldError message={error} />
        </div>
      ) : null}
    </div>
  );
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SiteSettingsFormInput>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: {
      siteUrl: settings.siteUrl,
      contactEmail: settings.contactEmail,
      githubUrl: settings.githubUrl ?? "",
      linkedinUrl: settings.linkedinUrl ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  function onSubmit(values: SiteSettingsFormInput) {
    startTransition(async () => {
      const toastId = toast.info("Salvando configurações...");
      const result = await updateSettingsAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        reset(values);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-7 shadow-sm dark:border-slate-800 sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/90 text-blue-600 shadow-sm dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
            <Settings2 className="size-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Configurações
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Informações públicas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Gerencie os dados utilizados no site público, nos links de
              contato, nas redes profissionais e na geração de metadados.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
          <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Globe2 className="size-4" aria-hidden="true" />
            </span>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Site e contato
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Informações principais usadas no domínio, sitemap, SEO e
                canais de contato.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <InputField
              id="siteUrl"
              label="URL do site"
              placeholder="https://seudominio.com"
              hint="Use a URL pública completa, incluindo https://."
              icon={Globe2}
              register={register}
              error={errors.siteUrl?.message}
            />

            <InputField
              id="contactEmail"
              label="E-mail público"
              type="email"
              placeholder="contato@email.com"
              hint="Este endereço pode ser exibido na página de contato."
              icon={Mail}
              register={register}
              error={errors.contactEmail?.message}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
          <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Link2 className="size-4" aria-hidden="true" />
            </span>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Redes profissionais
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Links usados no cabeçalho, rodapé e páginas públicas do
                portfólio.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <InputField
              id="githubUrl"
              label="GitHub"
              placeholder="https://github.com/seuusuario"
              hint="Informe a URL completa do seu perfil ou organização."
              icon={FaGithub}
              register={register}
              error={errors.githubUrl?.message}
            />

            <InputField
              id="linkedinUrl"
              label="LinkedIn"
              placeholder="https://linkedin.com/in/seuusuario"
              hint="Informe a URL pública completa do seu perfil."
              icon={FaLinkedinIn}
              register={register}
              error={errors.linkedinUrl?.message}
            />
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </span>

          <div>
            <p className="text-sm font-bold text-foreground">
              Dados públicos do portfólio
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Revise os endereços antes de salvar para evitar links quebrados.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {settings.siteUrl ? (
            <a
              href={settings.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
            >
              Visualizar site
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          ) : null}

          <Button
            type="submit"
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            disabled={isPending || !isDirty}
          >
            <Save className="size-4" aria-hidden="true" />
            {isPending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </div>
      </section>
    </form>
  );
}