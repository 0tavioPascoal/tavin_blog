"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2, Mail, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "@/features/settings/actions/settings-actions";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormInput,
} from "@/features/settings/schemas/settings-schema";
import type { SiteSettings } from "@/features/settings/types/settings";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

type SettingsFormProps = {
  settings: SiteSettings;
};

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

type InputFieldProps = {
  id: keyof SiteSettingsFormInput;
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ComponentType<{ className?: string }>;
  register: ReturnType<typeof useForm<SiteSettingsFormInput>>["register"];
  error?: string;
};

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  error,
}: InputFieldProps) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="
            h-11 w-full rounded-xl
            border border-slate-400/70
            bg-card
            pl-10 pr-3

            text-sm text-foreground
            shadow-sm

            outline-none
            transition-all duration-200

            placeholder:text-muted-foreground/70

            hover:border-slate-500/80

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10

            dark:border-slate-700
            dark:hover:border-slate-600
          "
          {...register(id)}
        />
      </div>

      <FieldError message={error} />
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

  function onSubmit(values: SiteSettingsFormInput) {
    startTransition(async () => {
      const toastId = toast.info("Salvando configurações...");
      const result = await updateSettingsAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-2xl border border-slate-300 bg-card p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:shadow-black/20 sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações públicas
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Esses dados são utilizados no site público, links de contato e SEO
            básico do blog.
          </p>
        </div>

        <div className="grid gap-5">
          <InputField
            id="siteUrl"
            label="URL do site"
            placeholder="https://seudominio.com"
            icon={Globe2}
            register={form.register}
            error={form.formState.errors.siteUrl?.message}
          />

          <InputField
            id="contactEmail"
            label="E-mail público"
            type="email"
            placeholder="contato@email.com"
            icon={Mail}
            register={form.register}
            error={form.formState.errors.contactEmail?.message}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              id="githubUrl"
              label="GitHub"
              placeholder="https://github.com/seuusuario"
              icon={FaGithub}
              register={form.register}
              error={form.formState.errors.githubUrl?.message}
            />

            <InputField
              id="linkedinUrl"
              label="LinkedIn"
              placeholder="https://linkedin.com/in/seuusuario"
              icon={FaLinkedinIn}
              register={form.register}
              error={form.formState.errors.linkedinUrl?.message}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </form>
  );
}
