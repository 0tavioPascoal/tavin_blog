import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const technologies = [
  ".NET",
  "C#",
  "Java",
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "Docker",
  "Redis",
  "Spring",
];

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
          <div className="mt-8 flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                {technology}
              </span>
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
            src="/images/hero-otavio.png"
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
