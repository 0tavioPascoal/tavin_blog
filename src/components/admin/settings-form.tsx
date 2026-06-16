"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "@/features/settings/actions/settings-actions";
import { siteSettingsFormSchema, type SiteSettingsFormInput } from "@/features/settings/schemas/settings-schema";
import type { SiteSettings } from "@/features/settings/types/settings";

type SettingsFormProps = {
  settings: SiteSettings;
};

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
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-2">
          <label htmlFor="siteUrl" className="text-sm font-medium">URL do site</label>
          <input id="siteUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("siteUrl")} />
          {form.formState.errors.siteUrl ? <p className="text-sm text-red-600">{form.formState.errors.siteUrl.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="contactEmail" className="text-sm font-medium">E-mail público</label>
          <input id="contactEmail" type="email" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("contactEmail")} />
          {form.formState.errors.contactEmail ? <p className="text-sm text-red-600">{form.formState.errors.contactEmail.message}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="githubUrl" className="text-sm font-medium">GitHub</label>
            <input id="githubUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("githubUrl")} />
            {form.formState.errors.githubUrl ? <p className="text-sm text-red-600">{form.formState.errors.githubUrl.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn</label>
            <input id="linkedinUrl" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950" {...form.register("linkedinUrl")} />
            {form.formState.errors.linkedinUrl ? <p className="text-sm text-red-600">{form.formState.errors.linkedinUrl.message}</p> : null}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </form>
  );
}
