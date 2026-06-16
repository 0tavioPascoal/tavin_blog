import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Technology = {
  label: string;
  ariaLabel: string;
  iconSrc: string;
};

const technologies: Technology[] = [
  { label: ".NET", ariaLabel: ".NET", iconSrc: "/icons/asp%20net.png" },
  { label: "C#", ariaLabel: "C Sharp", iconSrc: "/icons/csharp.png" },
  { label: "Java", ariaLabel: "Java", iconSrc: "/icons/java.png" },
  { label: "TypeScript", ariaLabel: "TypeScript", iconSrc: "/icons/ts.png" },
  { label: "Next.js", ariaLabel: "Next.js", iconSrc: "/icons/nextjs.png" },
  { label: "PostgreSQL", ariaLabel: "PostgreSQL", iconSrc: "/icons/postgresql.png" },
  { label: "Docker", ariaLabel: "Docker", iconSrc: "/icons/docker.png" },
  { label: "Redis", ariaLabel: "Redis", iconSrc: "/icons/redis.png" },
  { label: "Spring", ariaLabel: "Spring", iconSrc: "/icons/spring.png" },
];

const heroImageSrc = "/images/hero-otavio.png?v=20260614";

function TechnologyBadge({ technology }: { technology: Technology }) {
  return (
    <span
      aria-label={technology.ariaLabel}
      title={technology.label}
      className="
        inline-flex h-11 w-full min-w-0 items-center justify-center gap-2
        rounded-xl
        border border-border
        bg-card
        px-3
        text-sm font-semibold text-foreground
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-blue-300
        hover:shadow-md
        dark:hover:border-blue-800
      "
    >
      <Image
        src={technology.iconSrc}
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
        className="size-5 shrink-0 object-contain"
      />

      <span className="min-w-0 truncate">
        {technology.label}
      </span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="relative grid min-h-145 w-full lg:grid-cols-[48%_52%]">
        <div className="relative z-20 flex items-center px-6 py-14 sm:px-10 lg:py-0 lg:pl-[7vw] lg:pr-8">
          <div className="max-w-170">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Transformo ideias em soluções de{" "}
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                software
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Construo soluções que conectam negócio, arquitetura e qualidade.
              Compartilho aprendizados sobre .NET, Java, TypeScript, testes,
              produto e engenharia de software.
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
              {technologies.map((technology) => (
                <TechnologyBadge key={technology.label} technology={technology} />
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-blue-600 px-6 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                <Link href="/projetos">
                  Ver Projetos
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-border bg-card px-6 shadow-sm hover:bg-accent"
              >
                <Link href="/blog">
                  Ler Artigos
                  <FileText className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-145 lg:block">
          <div className="absolute inset-y-0 -left-1 z-10 w-80 bg-linear-to-r from-background via-background/90 to-transparent" />

          <Image
            src={heroImageSrc}
            alt="Otávio Pascoal trabalhando em um notebook"
            fill
            priority
            sizes="52vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative mx-6 mb-10 h-105 overflow-hidden rounded-3xl border border-border bg-card shadow-md shadow-slate-200/70 dark:shadow-black/20 sm:mx-10 lg:hidden">
          <Image
            src={heroImageSrc}
            alt="Otávio Pascoal trabalhando em um notebook"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}