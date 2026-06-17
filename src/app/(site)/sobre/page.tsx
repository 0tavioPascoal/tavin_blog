import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
} from "lucide-react";

import { CertificateCard } from "@/components/certificates/certificate-card";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a trajetória técnica de Otávio Pascoal.",
};

const highlights = [
  {
    title: "Negócio & Produto",
    description:
      "Tradução de problemas reais em requisitos claros e soluções viáveis.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Qualidade",
    description:
      "Validação técnica, testes, análise crítica e foco em entrega confiável.",
    icon: BadgeCheck,
  },
  {
    title: "Backend & Arquitetura",
    description: "Estudos e projetos com .NET, Java, SQL, APIs e boas práticas.",
    icon: Code2,
  },
  {
    title: "Evolução Contínua",
    description: "Aprendizado em público através de artigos, projetos e estudos.",
    icon: GraduationCap,
  },
];

const aboutImageSrc = "/images/hero-otavio.png?v=20260614";

export default async function AboutPage() {
  const certificates = await listPublishedCertificates();

  return (
    <div className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-[7vw]">
      <section className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:rounded-3xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-32 -top-32 size-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5 sm:-right-24 sm:-top-24 sm:size-72" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-center">
          <div className="relative order-first min-h-80 overflow-hidden rounded-2xl border border-border bg-background shadow-md shadow-slate-200/70 dark:shadow-black/20 sm:min-h-96 lg:order-last lg:min-h-125">
            <Image
              src={aboutImageSrc}
              alt="Otávio Pascoal trabalhando em um notebook"
              fill
              sizes="(max-width: 1024px) calc(100vw - 2.5rem), 34vw"
              className="object-cover object-center"
            />
          </div>

          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Sobre
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Engenharia com visão de negócio, qualidade e arquitetura.
            </h1>

            <div className="mt-6 grid gap-5 text-base leading-7 text-muted-foreground sm:mt-8 sm:gap-6 sm:text-lg sm:leading-8">
              <p>
                Sou{" "}
                <strong className="font-semibold text-foreground">
                  Otávio Pascoal
                </strong>
                , profissional de tecnologia com atuação em análise de negócios,
                análise de sistemas, QA e desenvolvimento de software.
              </p>

              <p>
                Minha forma de trabalhar começa antes do código: entender o
                problema, organizar requisitos, validar regras de negócio e
                transformar isso em soluções técnicas claras, sustentáveis e bem
                direcionadas.
              </p>

              <p>
                Neste blog compartilho aprendizados, projetos e artigos sobre
                .NET, Java, TypeScript, SQL, arquitetura de software, qualidade e
                decisões técnicas aplicadas em cenários reais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:mt-10 xl:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:hover:border-blue-800 sm:p-6"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:group-hover:bg-blue-950">
                <Icon className="size-5" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:mt-12 sm:rounded-3xl sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Trajetória
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Construindo uma jornada entre análise, qualidade e desenvolvimento.
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Minha trajetória une a visão analítica de quem trabalha próximo das
            regras de negócio com a prática técnica de quem busca construir
            software melhor. Essa combinação me permite enxergar tanto o impacto
            da solução quanto os detalhes necessários para entregar sistemas mais
            confiáveis, organizados e fáceis de evoluir.
          </p>
        </div>
      </section>

      {certificates.length > 0 ? (
        <section className="mt-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Certificados
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Estudos e certificações
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Certificados que reforçam minha evolução contínua em tecnologia,
              arquitetura, qualidade e entrega de software.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
