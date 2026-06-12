import type { Metadata } from "next";
import { Code2, Mail, Network } from "lucide-react";

import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Otávio Pascoal.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Contato</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
        Vamos conversar sobre tecnologia e produto
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        Para oportunidades, parcerias ou conversas técnicas, use um dos canais abaixo.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href={`mailto:${settings.contactEmail}`}>
          <Mail className="mb-4 size-5 text-blue-600" />
          E-mail
        </a>
        {settings.githubUrl ? (
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href={settings.githubUrl} target="_blank" rel="noreferrer">
          <Code2 className="mb-4 size-5 text-blue-600" />
          GitHub
        </a>
        ) : null}
        {settings.linkedinUrl ? (
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href={settings.linkedinUrl} target="_blank" rel="noreferrer">
          <Network className="mb-4 size-5 text-blue-600" />
          LinkedIn
        </a>
        ) : null}
      </div>
    </section>
  );
}
