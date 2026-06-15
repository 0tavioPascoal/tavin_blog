import type { Metadata } from "next";
import { BadgeCheck, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";

import { CertificateCard } from "@/components/certificates/certificate-card";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a trajetória técnica de Otávio Pascoal.",
};

const highlights = [
  {
    title: "Negócio & Produto",
    description: "Tradução de problemas reais em requisitos claros e soluções viáveis.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Qualidade",
    description: "Validação técnica, testes, análise crítica e foco em entrega confiável.",
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

export default async function AboutPage() {
  const certificates = await listPublishedCertificates();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border bg-card p-8 shadow-md shadow-slate-200/70 dark:shadow-black/20 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Sobre
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-card-foreground md:text-5xl">
          Engenharia com visão de negócio, qualidade e arquitetura.
        </h1>

        <div className="mt-8 grid gap-6 text-lg leading-8 text-muted-foreground">
          <p>
            Sou{" "}
            <strong className="font-semibold text-card-foreground">
              Otávio Pascoal
            </strong>
            , profissional de tecnologia com atuação em análise de negócios,
            análise de sistemas, QA e desenvolvimento de software.
          </p>

          <p>
            Minha forma de trabalhar começa antes do código: entender o problema,
            organizar requisitos, validar regras de negócio e transformar isso em
            soluções técnicas claras, sustentáveis e bem direcionadas.
          </p>

          <p>
            Neste blog compartilho aprendizados, projetos e artigos sobre .NET,
            Java, TypeScript, SQL, arquitetura de software, qualidade e decisões
            técnicas aplicadas em cenários reais.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-md shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg dark:shadow-black/20"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/50">
                <Icon className="size-5" />
              </div>

              <h2 className="mt-5 text-base font-semibold text-card-foreground">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-12 rounded-3xl border border-border bg-card p-8 shadow-md shadow-slate-200/70 dark:shadow-black/20 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Trajetória
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
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
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Certificados
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
              Estudos e certificações
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Certificados que reforçam minha evolução contínua em tecnologia,
              arquitetura, qualidade e entrega de software.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}