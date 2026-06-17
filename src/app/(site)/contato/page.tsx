import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { PageHero } from "@/components/shared/page-hero";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Otávio Pascoal.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <PageHero
        eyebrow="Contato"
        title="Vamos conversar."
        description={
          <p>
            Estou sempre aberto para trocar ideias sobre tecnologia,
            desenvolvimento de software, arquitetura, qualidade, oportunidades
            profissionais e projetos interessantes.
          </p>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href={`mailto:${settings.contactEmail}`}
          className="group rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:p-6"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:group-hover:bg-blue-950">
            <Mail className="size-5" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground">
            E-mail
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Canal ideal para oportunidades, parcerias e contato profissional.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Entrar em contato
            <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </a>

        {settings.githubUrl ? (
          <a
            href={settings.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:p-6"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700">
              <FaGithub className="size-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-foreground">
              GitHub
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Projetos, estudos, experimentos e código compartilhado.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
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
            className="group rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:p-6"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:group-hover:bg-blue-950">
              <FaLinkedinIn className="size-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-foreground">
              LinkedIn
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Minha trajetória profissional, artigos e networking.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              Ver perfil
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ) : null}
      </div>
    </section>
  );
}
