import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Download,
  FolderCode,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a trajetória de Otávio Pascoal entre análise de negócios, qualidade e desenvolvimento de software.",
};

const techGroups = [
  {
    category: "Backend & Arquitetura",
    items: [".NET", "ASP.NET Core", "C#", "Java", "Spring Boot", "REST APIs", "Clean Architecture"],
  },
  {
    category: "Frontend & Web",
    items: ["TypeScript", "Next.js", "React", "Tailwind CSS", "HTML5/CSS3"],
  },
  {
    category: "Dados & Qualidade",
    items: ["PostgreSQL", "SQL Server", "Supabase", "Testes Unitários", "QA & Critérios de Aceite"],
  },
  {
    category: "Práticas & Ferramentas",
    items: ["Git & GitHub", "Docker", "Modelagem de Processos (BPMN)", "Engenharia de Software"],
  },
];

const trajectorySteps = [
  {
    step: "01",
    title: "Entender antes de construir",
    description:
      "Minha base profissional está na análise de processos, requisitos e regras de negócio. Antes de pensar em código, o foco é compreender a fundo o problema e o impacto esperado.",
  },
  {
    step: "02",
    title: "Validar antes de entregar",
    description:
      "A atuação com qualidade e análise de sistemas fortaleceu minha visão sobre cenários de erro, critérios de aceite, homologação e previsibilidade das entregas.",
  },
  {
    step: "03",
    title: "Construir pensando na evolução",
    description:
      "No desenvolvimento, busco arquiteturas claras, código limpo e soluções sustentáveis com .NET, Java, TypeScript, APIs modernas e boas práticas de engenharia.",
  },
  {
    step: "04",
    title: "Compartilhar e evoluir",
    description:
      "Compartilho artigos e projetos para consolidar aprendizados, documentar decisões arquiteturais e contribuir com a comunidade de tecnologia.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <PageContainer as="main" size="narrow">
      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Sobre mim"
        title="Otávio Pascoal"
        description="Desenvolvedor com foco em backend, arquitetura de software, qualidade e visão de produto."
      />

      {/* Conteúdo Editorial de Leitura Confortável */}
      <div className="mt-10 space-y-12 text-foreground sm:space-y-14">
        {/* Resumo / Introdução */}
        <section aria-labelledby="about-intro" className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
          <p>
            Olá! Sou Otávio Pascoal, profissional de tecnologia com experiência
            combinada em análise de processos, regras de negócio, qualidade e
            desenvolvimento de software.
          </p>

          <p>
            Acredito que um software excelente nasce do equilíbrio entre entender
            a necessidade real do usuário e desenhar uma arquitetura técnica
            robusta, limpa e sustentável para o longo prazo.
          </p>

          <p>
            Neste espaço compartilho projetos práticos, desafios do dia a dia e
            artigos técnicos detalhados sobre .NET, Java, TypeScript, qualidade e
            arquitetura.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button asChild size="default" className="rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">
              <Link href="/projetos">
                <FolderCode className="size-4" />
                Ver meus projetos
              </Link>
            </Button>

            <Button asChild variant="outline" size="default" className="rounded-lg">
              <Link href="/blog/artigos">
                <BookOpenText className="size-4" />
                Ler artigos
              </Link>
            </Button>

            {settings.resumeUrl ? (
              <Button asChild variant="outline" size="default" className="rounded-lg">
                <a href={`${settings.resumeUrl}?download=Curriculo-Otavio-Pascoal.pdf`}>
                  <Download className="size-4" />
                  Baixar currículo
                </a>
              </Button>
            ) : null}
          </div>
        </section>

        {/* Minha Trajetória */}
        <section aria-labelledby="about-trajectory" className="border-t border-border/80 pt-10 sm:pt-12">
          <div className="mb-6">
            <h2 id="about-trajectory" className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Minha abordagem
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Como encaro o ciclo de vida do desenvolvimento de software.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {trajectorySteps.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border/80 bg-card p-5 transition-colors hover:border-border"
              >
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {item.step}
                </span>

                <h3 className="mt-2 text-base font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tecnologias & Habilidades */}
        <section aria-labelledby="about-tech" className="border-t border-border/80 pt-10 sm:pt-12">
          <div className="mb-6">
            <h2 id="about-tech" className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Tecnologias e ferramentas
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Principais tecnologias utilizadas em projetos e estudos práticos.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {techGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-border/80 bg-card p-5"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.category}
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex h-6 items-center rounded-md border border-border bg-muted/60 px-2 text-xs font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-900/60 dark:bg-blue-950/25 sm:p-8">
          <div className="max-w-xl">
            <h2 className="font-sans text-xl font-bold text-foreground">
              Vamos conversar?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Estou aberto a oportunidades profissionais, discussões técnicas
              sobre arquitetura ou parcerias em projetos.
            </p>
            <div className="mt-5">
              <Button asChild className="rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">
                <Link href="/contato">
                  Entrar em contato
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
