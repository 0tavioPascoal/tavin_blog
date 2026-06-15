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
    <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-100" aria-label={technology.ariaLabel}>
      <Image
        src={technology.iconSrc}
        alt=""
        width={28}
        height={28}
        aria-hidden="true"
        className="size-7 shrink-0 object-contain"
      />
      <span className="truncate">{technology.label}</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-0">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Transformo ideias em soluções de{" "}
            <span className="text-blue-600">software</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Analista de Negócios, Analista de Sistemas, QA e Desenvolvedor Fullstack apaixonado por tecnologia,
            arquitetura de software e resolução de problemas.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-7 gap-y-5 sm:grid-cols-3 lg:max-w-xl lg:grid-cols-5">
            {technologies.map((technology) => (
              <TechnologyBadge key={technology.label} technology={technology} />
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700">
              <Link href="/projetos">
                Ver Projetos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-lg px-6">
              <Link href="/blog">
                Ler Artigos
                <FileText className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative min-h-[360px] lg:min-h-[620px]">
          <Image
            src={heroImageSrc}
            alt="Profissional de software trabalhando em um notebook"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="rounded-xl object-cover object-center shadow-2xl lg:rounded-none lg:shadow-none"
          />
          <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950 lg:block" />
        </div>
      </div>
    </section>
  );
}
