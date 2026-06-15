import type { Metadata } from "next";
import {
  ArrowUpRight,
  Mail,
} from "lucide-react";

import { getSiteSettings } from "@/features/settings/repositories/settings-repository";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Otávio Pascoal.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-md shadow-slate-200/70 dark:shadow-black/20 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Contato
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-card-foreground md:text-5xl">
          Vamos conversar.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Estou sempre aberto para trocar ideias sobre tecnologia,
          desenvolvimento de software, arquitetura, qualidade, oportunidades
          profissionais e projetos interessantes.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <a
          href={`mailto:${settings.contactEmail}`}
          className="group rounded-3xl border border-border bg-card p-6 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:shadow-black/20 dark:hover:border-blue-800"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <Mail className="size-5" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-card-foreground">
            E-mail
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Canal ideal para oportunidades, parcerias e contato profissional.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
            Entrar em contato
            <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </a>

        {settings.githubUrl ? (
          <a
            href={settings.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-border bg-card p-6 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:shadow-black/20 dark:hover:border-blue-800"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <FaGithub className="size-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-card-foreground">
              GitHub
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Projetos, estudos, experimentos e código compartilhado.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
              Ver perfil
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ) : null}

        {settings.linkedinUrl ? (
          <a
            href={settings.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-border bg-card p-6 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:shadow-black/20 dark:hover:border-blue-800"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <FaLinkedinIn className="size-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-card-foreground">
              LinkedIn
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Minha trajetória profissional, artigos e networking.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
              Ver perfil
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ) : null}
      </div>
    </section>
  );
}