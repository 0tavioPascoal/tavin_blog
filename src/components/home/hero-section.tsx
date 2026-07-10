import {
  ArrowRight,
  Braces,
  BriefcaseBusiness,
  FileText,
  ServerCog,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Technology = {
  label: string;
  ariaLabel: string;
  iconSrc: string;
};

type HeroHighlight = {
  label: string;
  icon: LucideIcon;
};

type ProfilePillar = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  accentClassName: string;
};

const technologies: Technology[] = [
  {
    label: ".NET",
    ariaLabel: ".NET",
    iconSrc: "/icons/asp%20net.png",
  },
  {
    label: "C#",
    ariaLabel: "C Sharp",
    iconSrc: "/icons/csharp.png",
  },
  {
    label: "Java",
    ariaLabel: "Java",
    iconSrc: "/icons/java.png",
  },
  {
    label: "TypeScript",
    ariaLabel: "TypeScript",
    iconSrc: "/icons/ts.png",
  },
  {
    label: "Next.js",
    ariaLabel: "Next.js",
    iconSrc: "/icons/nextjs.png",
  },
  {
    label: "PostgreSQL",
    ariaLabel: "PostgreSQL",
    iconSrc: "/icons/postgresql.png",
  },
  {
    label: "Docker",
    ariaLabel: "Docker",
    iconSrc: "/icons/docker.png",
  },
  {
    label: "Redis",
    ariaLabel: "Redis",
    iconSrc: "/icons/redis.png",
  },
  {
    label: "Spring",
    ariaLabel: "Spring Framework",
    iconSrc: "/icons/spring.png",
  },
];

const heroHighlights: HeroHighlight[] = [
  {
    label: "Experiências reais",
    icon: UsersRound,
  },
  {
    label: "Código e arquitetura",
    icon: Braces,
  },
  {
    label: "Evolução contínua",
    icon: TrendingUp,
  },
];

const profilePillars: ProfilePillar[] = [
  {
    title: "Backend & Arquitetura",
    description: ".NET · Java · SQL",
    icon: ServerCog,
    iconClassName: "bg-blue-600 text-white shadow-md shadow-blue-600/20",
    accentClassName: "bg-blue-600",
  },
  {
    title: "Produto & Negócio",
    description: "Requisitos · Processos · Valor",
    icon: BriefcaseBusiness,
    iconClassName: "bg-cyan-500 text-white shadow-md shadow-cyan-500/20",
    accentClassName: "bg-cyan-500",
  },
  {
    title: "Qualidade & Evolução",
    description: "Testes · Artigos · Projetos",
    icon: ShieldCheck,
    iconClassName: "bg-violet-500 text-white shadow-md shadow-violet-500/20",
    accentClassName: "bg-violet-500",
  },
];

function TechnologyBadge({ technology }: { technology: Technology }) {
  return (
    <span
      aria-label={technology.ariaLabel}
      title={technology.label}
      className="group inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/75 px-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-950/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-slate-950 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-400/40 dark:hover:bg-white/9 dark:hover:text-white"
    >
      <Image
        src={technology.iconSrc}
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
        className="size-5 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
      />

      <span>{technology.label}</span>
    </span>
  );
}

function ProfilePillarCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  accentClassName,
}: ProfilePillar) {
  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/92 px-3.5 py-3 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/92 dark:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.75)]">
      <span
        aria-hidden="true"
        className={`absolute inset-y-3 left-0 w-0.5 rounded-full ${accentClassName}`}
      />

      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-tight text-slate-950 dark:text-white">
          {title}
        </p>

        <p className="mt-1 truncate text-[11px] leading-4 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Grid de fundo */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[44px_44px] opacity-65 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] dark:opacity-35" />

      {/* Iluminação de fundo */}
      <div className="pointer-events-none absolute left-[4%] top-20 -z-20 size-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15" />

      <div className="pointer-events-none absolute bottom-0 right-[4%] -z-20 size-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10" />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-background via-background/85 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-background via-background/85 to-transparent" />

      <div className="relative grid w-full gap-10 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:px-[7vw] lg:py-14">
        {/* Conteúdo pessoal */}
        <div className="relative z-20 flex items-center">
          <div className="max-w-175">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm shadow-blue-950/5 backdrop-blur-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              <Braces className="size-3.5" />
              Desenvolvimento, produto e qualidade
            </div>

            <h1 className="mt-5 max-w-170 text-balance text-4xl font-bold leading-[1.06] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl lg:text-[3.7rem]">
              Construindo software e{" "}
              <span className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                compartilhando a jornada.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Sou Otávio Pascoal e compartilho projetos, experiências e
              aprendizados sobre desenvolvimento de software, arquitetura,
              qualidade e análise de negócios. Sempre aprendendo,{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-300">
                sempre construindo.
              </span>
            </p>

            {/* Diferenciais */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              {heroHighlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div
                    key={highlight.label}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                  >
                    <Icon className="size-4 text-blue-600 dark:text-blue-300" />

                    <span>{highlight.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Tecnologias */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Tecnologias que fazem parte da jornada
              </p>

              <div className="flex max-w-2xl flex-wrap gap-2">
                {technologies.map((technology) => (
                  <TechnologyBadge
                    key={technology.label}
                    technology={technology}
                  />
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="group h-12 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 sm:w-auto"
              >
                <Link href="/projetos">
                  Conhecer meus projetos
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="group h-12 w-full rounded-xl border-blue-300 bg-white/70 px-6 font-semibold text-blue-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-400/30 dark:bg-white/4.5 dark:text-blue-200 dark:hover:border-blue-400/50 dark:hover:bg-blue-400/10 sm:w-auto"
              >
                <Link href="/blog/artigos">
                  <FileText className="size-4" />
                  Explorar artigos
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Composição visual */}
        <div className="relative z-10 w-full pb-8 lg:h-124">
          <div className="pointer-events-none absolute -inset-7 -z-20 rounded-[3rem] bg-linear-to-br from-blue-500/20 via-blue-400/5 to-cyan-400/20 blur-2xl" />

          {/* Foto */}
          <div className="relative h-116 overflow-hidden rounded-[2rem] border border-blue-200/70 bg-blue-50 shadow-[0_30px_90px_-35px_rgba(37,99,235,0.5)] dark:border-blue-400/15 dark:bg-slate-950 dark:shadow-[0_30px_90px_-35px_rgba(37,99,235,0.4)] sm:h-124 lg:h-full">
            <Image
              src="/images/hero-otavio-light.png"
              alt="Otávio Pascoal trabalhando em um notebook"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[64%_center] dark:hidden"
            />

            <Image
              src="/images/hero-otavio-dark.png"
              alt="Otávio Pascoal trabalhando em um notebook"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="hidden object-cover object-[64%_center] dark:block"
            />

            {/* Sobreposições para preservar contraste sem esconder o rosto */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/15 via-transparent to-transparent dark:from-slate-950/35" />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/30 via-transparent to-transparent" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.14),transparent_35%)]" />
          </div>

          {/* Status isolado no topo para não competir com os pilares */}
          <div className="absolute right-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/92 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-xl dark:border-emerald-400/20 dark:bg-slate-900/92 dark:text-emerald-300 sm:right-5 sm:top-5">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            Em evolução
          </div>

          {/* Pilares profissionais: uma única composição coerente e fora do rosto */}
          <div className="absolute left-4 top-1/2 z-30 hidden w-59.5 -translate-y-1/2 flex-col gap-2 sm:flex lg:-left-7 lg:w-62.5">
            {profilePillars.map((pillar) => (
              <ProfilePillarCard key={pillar.title} {...pillar} />
            ))}
          </div>

          {/* Painel de evolução */}
          <div className="absolute bottom-1 left-3 right-3 z-40 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-slate-200/90 bg-white/94 p-4 shadow-[0_20px_55px_-22px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/94 sm:-bottom-5 sm:left-[18%] sm:right-[6%] lg:left-[16%]">
            <div className="min-w-0 font-mono text-[10px] leading-5 text-slate-500 dark:text-slate-400 sm:text-xs">
              <p>
                <span className="text-blue-600 dark:text-blue-300">&gt;</span>{" "}
                intencao = aprender;
              </p>

              <p>constancia = diaria;</p>

              <p>resultado = impacto;</p>

              <p>
                <span className="text-violet-600 dark:text-violet-300">
                  return
                </span>{" "}
                evolucao;
              </p>
            </div>

            <div className="hidden w-28 sm:block">
              <svg
                viewBox="0 0 120 56"
                role="img"
                aria-label="Gráfico representando evolução contínua"
                className="h-14 w-full overflow-visible text-blue-500"
              >
                <path
                  d="M2 49H118"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />

                <path
                  d="M4 44L25 34L44 41L62 29L80 37L98 23L116 8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />

                <circle cx="116" cy="8" r="3" fill="currentColor" />

                <circle
                  cx="116"
                  cy="8"
                  r="7"
                  fill="currentColor"
                  fillOpacity="0.14"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}