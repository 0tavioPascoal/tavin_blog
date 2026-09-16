import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock3,
  Mail,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { ContactForm } from "@/components/contact/contact-form";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Otávio Pascoal para oportunidades profissionais, colaborações ou discussões técnicas.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(
    "Contato pelo portfólio",
  )}`;

  return (
    <PageContainer as="main" size="narrow">
      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Contato"
        title="Vamos conversar?"
        description="Estou sempre disponível para conversar sobre oportunidades profissionais, projetos técnicos, engenharia de software e arquitetura."
      />

      {/* Canais Principais de Contato */}
      <div className="mt-10 space-y-10">
        <ContactForm email={settings.contactEmail} />

        <section aria-labelledby="other-contact-title">
          <h2 id="other-contact-title" className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Outras formas de contato
          </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* E-mail */}
          <a
            href={emailHref}
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-colors hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                  <Mail className="size-5" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground">
                E-mail profissional
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Melhor canal para propostas, projetos e conversas com mais contexto.
              </p>
            </div>

            <p className="mt-4 break-all text-sm font-semibold text-blue-600 dark:text-blue-400">
              {settings.contactEmail}
            </p>
          </a>

          {/* LinkedIn */}
          {settings.linkedinUrl ? (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-colors hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-blue-300">
                    <FaLinkedinIn className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground">
                  LinkedIn
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Conecte-se para acompanhar minha trajetória e publicações.
                </p>
              </div>

              <p className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Acessar perfil
              </p>
            </a>
          ) : null}

          {/* GitHub */}
          {settings.githubUrl ? (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-colors hover:border-blue-500/50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:col-span-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <FaGithub className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground">
                  GitHub
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Explore os repositórios de código, projetos e implementações práticas.
                </p>
              </div>

              <p className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Ver repositórios
              </p>
            </a>
          ) : null}
        </div>
        </section>

        {/* Informação sobre tempo de resposta */}
        <section className="flex items-start gap-4 rounded-xl border border-border/80 bg-card/60 p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Clock3 className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Tempo de resposta
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Procuro responder a todas as mensagens com brevidade. Incluir detalhes
              sobre o assunto ou objetivo da conversa ajuda a agilizar o contato.
            </p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
