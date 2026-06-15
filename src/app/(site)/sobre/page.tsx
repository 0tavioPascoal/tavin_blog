import type { Metadata } from "next";

import { CertificateCard } from "@/components/certificates/certificate-card";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a trajetória técnica de Otávio Pascoal.",
};

export default async function AboutPage() {
  const certificates = await listPublishedCertificates();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Sobre</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
          Engenharia com visão de produto e qualidade
        </h1>
        <div className="mt-6 grid gap-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          <p>
            Sou Otávio Pascoal, profissional de tecnologia com atuação em análise de negócios,
            análise de sistemas, QA e desenvolvimento fullstack.
          </p>
          <p>
            Meu foco é transformar problemas complexos em soluções claras, sustentáveis e bem
            arquitetadas, conectando requisitos de negócio com implementação técnica.
          </p>
          <p>
            Este espaço reúne artigos, aprendizados e projetos sobre .NET, TypeScript, Java,
            arquitetura de software, qualidade e entrega de produto.
          </p>
        </div>
      </section>

      {certificates.length > 0 ? (
        <section className="mt-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Certificados</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
              Estudos e certificações
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Certificados que reforçam minha evolução contínua em tecnologia, arquitetura,
              qualidade e entrega de software.
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
