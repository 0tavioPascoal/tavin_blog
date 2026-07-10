import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Clock3,
  Code2,
  Mail,
  MessageSquareText,
  Network,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Otávio Pascoal para conversar sobre tecnologia, desenvolvimento de software e oportunidades profissionais.",
};

type ContactTopic = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const contactTopics: ContactTopic[] = [
  {
    title: "Oportunidades profissionais",
    description:
      "Conversas sobre desenvolvimento, análise de sistemas, qualidade e produto.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Projetos e colaborações",
    description:
      "Ideias, produtos digitais, projetos de portfólio e iniciativas técnicas.",
    icon: Network,
  },
  {
    title: "Tecnologia e conteúdo",
    description:
      "Troca de experiências sobre arquitetura, backend, testes e engenharia.",
    icon: Code2,
  },
];

const messageTips = [
  "O contexto da oportunidade ou projeto",
  "O objetivo principal da conversa",
  "Links ou materiais que ajudem no entendimento",
];

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(
    "Contato pelo portfólio",
  )}`;

  return (
    <main className="site-container py-10 sm:py-12">
      {/* Apresentação */}
      <section className="overflow-hidden border-y border-border bg-card/50">
        <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:p-10">
          {/* Texto */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-2 text-xs font-bold uppercase tracking-normal text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              <Sparkles className="size-3.5" />
              Contato
            </div>

            <h1 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-normal text-foreground sm:text-4xl md:text-5xl">
              Boas conversas também podem se transformar em{" "}
              <span className="text-blue-600 dark:text-blue-300">
                grandes projetos.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Estou aberto para conversar sobre tecnologia, desenvolvimento de
              software, arquitetura, qualidade, oportunidades profissionais e
              projetos que gerem aprendizado e impacto real.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BadgeCheck className="size-4 text-blue-600 dark:text-blue-300" />
                Conversas profissionais
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquareText className="size-4 text-blue-600 dark:text-blue-300" />
                Troca de experiências
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Network className="size-4 text-blue-600 dark:text-blue-300" />
                Novas conexões
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="group h-12 w-full rounded-lg bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300  hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 sm:w-auto"
              >
                <a href={emailHref}>
                  Enviar um e-mail
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>

              {settings.linkedinUrl ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group h-12 w-full rounded-lg border-blue-300 bg-background/70 px-6 font-semibold text-blue-700 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-200 dark:hover:bg-blue-400/10 sm:w-auto"
                >
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedinIn className="size-4" />
                    Conectar no LinkedIn
                    <ArrowUpRight className="size-4 transition-transform duration-300 group- group-hover:translate-x-0.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          {/* Painel de disponibilidade */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative overflow-hidden rounded-lg border border-border bg-background/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-normal text-blue-600 dark:text-blue-300">
                    Disponibilidade
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
                    Aberto para novas conversas.
                  </h2>
                </div>

                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <MessageSquareText className="size-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                O e-mail é o melhor canal para oportunidades, propostas,
                projetos e conversas que precisam de mais contexto.
              </p>

              <a
                href={emailHref}
                className="mt-5 block rounded-lg border border-border bg-card/80 p-4 transition-colors hover:border-blue-300 hover:bg-card dark:hover:border-blue-400/30"
              >
                <p className="text-xs font-bold uppercase tracking-normal text-muted-foreground">
                  E-mail profissional
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">
                    {settings.contactEmail}
                  </p>

                  <ArrowUpRight className="size-4 shrink-0 text-blue-600 dark:text-blue-300" />
                </div>
              </a>

              <div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50/80 p-4 dark:bg-blue-400/[0.08]">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Clock3 className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Respondo assim que possível
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    Mensagens com contexto facilitam uma resposta mais rápida e
                    objetiva.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 -top-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/90 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-xl dark:border-emerald-400/20 dark:bg-slate-900/90 dark:text-emerald-300 sm:right-5">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              Disponível para conversar
            </div>
          </div>
        </div>
      </section>

      {/* Assuntos */}
      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600 dark:text-blue-400">
            Vamos conversar sobre
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-normal text-foreground">
            Ideias, oportunidades e desafios interessantes.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Alguns dos assuntos que mais combinam com minha trajetória e com os
            conteúdos compartilhados neste portfólio.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {contactTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-blue-300 dark:hover:border-blue-500/40 sm:p-6"
              >
                <div className="relative">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-300  group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:group-hover:bg-blue-950">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {topic.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Canais */}
      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-600 dark:text-blue-400">
            Canais
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-normal text-foreground">
            Escolha o melhor caminho para a conversa.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={emailHref}
            className="group flex min-h-[245px] flex-col rounded-lg border border-blue-200 bg-blue-50/60 p-5 shadow-sm transition-colors hover:border-blue-400 dark:border-blue-400/20 dark:bg-blue-400/[0.07] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Mail className="size-5" />
              </div>

              <ArrowUpRight className="size-5 text-blue-600 transition-transform duration-300 group- group-hover:translate-x-0.5 dark:text-blue-300" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground">
              E-mail
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Melhor canal para oportunidades, propostas, parcerias e conversas
              mais detalhadas.
            </p>

            <div className="mt-auto pt-5">
              <p className="truncate text-sm font-semibold text-blue-600 dark:text-blue-300">
                {settings.contactEmail}
              </p>
            </div>
          </a>

          {settings.linkedinUrl ? (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[245px] flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-blue-300 dark:hover:border-blue-500/40 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-[#0A66C2]/15 dark:text-blue-300">
                  <FaLinkedinIn className="size-5" />
                </div>

                <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group- group-hover:translate-x-0.5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                LinkedIn
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Para acompanhar minha trajetória, publicações e criar uma
                conexão profissional.
              </p>

              <div className="mt-auto pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
                  Ver perfil
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </p>
              </div>
            </a>
          ) : null}

          {settings.githubUrl ? (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[245px] flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-slate-400 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                  <FaGithub className="size-5" />
                </div>

                <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group- group-hover:translate-x-0.5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                GitHub
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Projetos, estudos, experimentos e implementações que fazem parte
                da minha evolução técnica.
              </p>

              <div className="mt-auto pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
                  Explorar repositórios
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </p>
              </div>
            </a>
          ) : null}
        </div>
      </section>

      {/* Orientação para contato */}
      <section className="mt-14 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
              <Mail className="size-5" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-normal text-blue-300">
              Uma boa primeira mensagem
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-normal sm:text-3xl">
              Contexto ajuda a conversa a começar melhor.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Não precisa ser uma mensagem longa. Algumas informações simples
              ajudam a entender rapidamente o assunto e preparar uma resposta
              mais útil.
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold text-foreground">
              Ao entrar em contato, você pode incluir:
            </p>

            <div className="mt-5 grid gap-3">
              {messageTips.map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background/60 p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>

                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="group mt-6 h-12 w-full rounded-lg bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 sm:w-auto"
            >
              <a href={emailHref}>
                Iniciar uma conversa
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
