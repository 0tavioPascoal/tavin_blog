import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenText,
  BriefcaseBusiness,
  Code2,
  Download,
  FolderCode,
  GraduationCap,
  Layers3,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a trajetória de Otávio Pascoal entre análise de negócios, qualidade e desenvolvimento de software.",
};

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type JourneyItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type QuickFact = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const quickFacts: QuickFact[] = [
  {
    label: "Atuação",
    value: "Negócio, QA e Desenvolvimento",
    icon: BriefcaseBusiness,
  },
  {
    label: "Formação",
    value: "Engenharia da Computação",
    icon: GraduationCap,
  },
  {
    label: "Projeto em destaque",
    value: "Kraken — 1º lugar",
    icon: Award,
  },
];

const highlights: Highlight[] = [
  {
    title: "Negócio & Produto",
    description:
      "Entendo processos, regras e necessidades antes de definir a solução técnica.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Qualidade",
    description:
      "Valido fluxos, cenários de erro e critérios de aceite para entregar com segurança.",
    icon: BadgeCheck,
  },
  {
    title: "Backend & Arquitetura",
    description:
      "Desenvolvo APIs, integrações e aplicações com foco em organização e evolução.",
    icon: Code2,
  },
  {
    title: "Aprendizado Contínuo",
    description:
      "Transformo estudos e experiências práticas em projetos e conteúdos técnicos.",
    icon: GraduationCap,
  },
];

const journeyItems: JourneyItem[] = [
  {
    title: "Entender antes de construir",
    description:
      "Minha base profissional está na análise de processos, requisitos e regras de negócio. Antes de pensar em código, procuro entender o problema, o contexto e o resultado esperado.",
    icon: Target,
  },
  {
    title: "Validar antes de entregar",
    description:
      "A experiência com qualidade e análise de sistemas fortaleceu minha visão sobre cenários de erro, critérios de aceite, homologação e confiabilidade das entregas.",
    icon: BadgeCheck,
  },
  {
    title: "Construir pensando na evolução",
    description:
      "No desenvolvimento, busco soluções claras e sustentáveis utilizando .NET, Java, TypeScript, SQL, APIs, arquitetura e práticas de engenharia de software.",
    icon: Layers3,
  },
  {
    title: "Compartilhar para continuar aprendendo",
    description:
      "Este blog é um registro da minha evolução. Aqui compartilho decisões, erros, aprendizados, projetos e conteúdos que também podem ajudar outros profissionais.",
    icon: BookOpenText,
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <main className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      {/* Apresentação */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-slate-300/70 bg-card shadow-sm dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:42px_42px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />

        <div className="pointer-events-none absolute -left-20 top-10 -z-10 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />

        <div className="pointer-events-none absolute -bottom-24 right-0 -z-10 size-80 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10" />

        <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              <Sparkles className="size-3.5" />
              Sobre mim
            </div>

            <h1 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl md:text-5xl">
              Minha trajetória acontece entre o{" "}
              <span className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                problema de negócio
              </span>{" "}
              e o software em produção.
            </h1>

            <div className="mt-6 grid gap-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              <p>
                Sou{" "}
                <strong className="font-semibold text-foreground">
                  Otávio Pascoal
                </strong>
                , profissional de tecnologia com experiência em análise de
                negócios, análise de sistemas, qualidade e desenvolvimento de
                software.
              </p>

              <p>
                Minha forma de trabalhar combina visão analítica e prática
                técnica: entender o processo, organizar requisitos, validar
                regras e transformar tudo isso em soluções claras, confiáveis e
                preparadas para evoluir.
              </p>

              <p>
                Neste espaço compartilho projetos, experiências e aprendizados
                sobre .NET, Java, TypeScript, SQL, arquitetura, qualidade e
                engenharia de software.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 2xl:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 2xl:w-auto"
              >
                <Link href="/projetos">
                  Conhecer meus projetos
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="group h-12 w-full rounded-xl border-slate-300 bg-background/70 px-6 font-semibold backdrop-blur-sm dark:border-white/15 2xl:w-auto"
              >
                <Link href="/blog/artigos">
                  Ler meus artigos
                  <BookOpenText className="size-4" />
                </Link>
              </Button>

              {settings.resumeUrl ? (
                <Button asChild variant="outline" size="lg" className="group h-12 w-full rounded-xl border-slate-300 bg-background/70 px-6 font-semibold backdrop-blur-sm dark:border-white/15 2xl:w-auto">
                  <a href={`${settings.resumeUrl}?download=Curriculo-Otavio-Pascoal.pdf`}>
                    Baixar meu currículo
                    <Download className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          {/* Imagem */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-linear-to-br from-blue-500/15 via-transparent to-cyan-400/15 blur-2xl" />

            <div className="relative aspect-[4/4.3] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-[0_28px_80px_-35px_rgba(37,99,235,0.5)] dark:border-white/10 dark:bg-slate-950">
              <Image
                src="/images/hero-otavio-light.png"
                alt="Otávio Pascoal trabalhando com desenvolvimento de software"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center dark:hidden"
              />

              <Image
                src="/images/hero-otavio-dark.png"
                alt="Otávio Pascoal trabalhando com desenvolvimento de software"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="hidden object-cover object-center dark:block"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-slate-950/75 p-4 text-white shadow-xl backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                  Visão multidisciplinar
                </p>

                <p className="mt-1 text-sm font-semibold sm:text-base">
                  Negócio · Qualidade · Arquitetura · Código
                </p>
              </div>
            </div>

            <div className="absolute -right-3 top-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-xl dark:border-emerald-400/20 dark:bg-slate-900/90 dark:text-emerald-300 sm:right-5">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              Em evolução constante
            </div>
          </div>
        </div>

        {/* Informações rápidas */}
        <div className="grid border-t border-slate-200/80 bg-background/40 sm:grid-cols-3 dark:border-white/10">
          {quickFacts.map((fact, index) => {
            const Icon = fact.icon;

            return (
              <div
                key={fact.label}
                className={`flex items-center gap-3 px-5 py-5 sm:px-7 ${
                  index > 0
                    ? "border-t border-slate-200/80 sm:border-l sm:border-t-0 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    {fact.label}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {fact.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Áreas de atuação */}
      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Perfil profissional
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Uma visão que conecta diferentes áreas da entrega.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Minha experiência não está limitada a uma única etapa. Participo da
            compreensão do problema, da validação das regras e da construção da
            solução.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:p-6"
              >
                <div className="relative">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:group-hover:bg-blue-950">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Trajetória */}
      <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
        <div className="rounded-3xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Trajetória
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Da análise do problema à evolução da solução.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Minha jornada pode ser entendida como um processo contínuo de
              análise, validação, construção e compartilhamento.
            </p>
          </div>

          <div className="relative mt-9">
            <div className="absolute bottom-6 left-5 top-6 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="grid gap-8">
              {journeyItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="relative grid grid-cols-[40px_1fr] gap-4"
                  >
                    <div className="relative z-10 flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
                      <Icon className="size-4" />
                    </div>

                    <div className="pb-1">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                        Etapa {index + 1}
                      </p>

                      <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Foco atual */}
        <aside className="flex flex-col rounded-3xl border border-blue-200/80 bg-linear-to-br from-blue-50 to-cyan-50 p-6 shadow-sm dark:border-blue-400/15 dark:from-blue-950/40 dark:to-cyan-950/20">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Code2 className="size-5" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">
            Foco atual
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
            Evoluindo como desenvolvedor fullstack.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Aprofundando conhecimentos em backend, arquitetura e construção de
            produtos completos, sem perder a visão de negócio e qualidade.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              ".NET e ASP.NET Core",
              "Java e Spring",
              "Next.js e TypeScript",
              "SQL, APIs e arquitetura",
            ].map((focus) => (
              <div
                key={focus}
                className="flex items-center gap-2 rounded-xl border border-blue-200/70 bg-white/65 px-3 py-2.5 text-sm font-medium text-slate-700 dark:border-blue-400/15 dark:bg-white/[0.04] dark:text-slate-200"
              >
                <span className="size-1.5 rounded-full bg-blue-500" />
                {focus}
              </div>
            ))}
          </div>

          <Button
            asChild
            variant="outline"
            className="mt-6 w-full rounded-xl border-blue-300 bg-white/60 text-blue-700 hover:bg-white dark:border-blue-400/25 dark:bg-white/[0.04] dark:text-blue-200 lg:mt-auto"
          >
            <Link href="/projetos">
              <FolderCode className="size-4" />
              Ver projetos
            </Link>
          </Button>
        </aside>
      </section>
    </main>
  );
}
