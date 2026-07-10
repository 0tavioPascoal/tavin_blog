import type { Metadata } from "next";
import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { CertificateCard } from "@/components/certificates/certificate-card";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";

export const metadata: Metadata = {
  title: "Certificados",
  description:
    "Certificados, cursos e estudos publicados por Otávio Pascoal.",
};

export default async function CertificatesPage() {
  const certificates = await listPublishedCertificates();
  const certificatesCount = certificates.length;

  return (
    <main className="site-container py-10 sm:py-12">
      {/* Apresentação */}
      <section className="overflow-hidden border-y border-border bg-card/50">
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_280px] lg:items-center lg:gap-12 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-2 text-xs font-bold uppercase tracking-normal text-blue-700 shadow-sm shadow-blue-950/5 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              <Award className="size-3.5" />
              Formação contínua
            </div>

            <h1 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-normal text-foreground sm:text-4xl md:text-5xl">
              Estudos e certificações que{" "}
              <span className="text-blue-600 dark:text-blue-300">
                acompanham a prática.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Cursos, certificações e trilhas de aprendizado que complementam
              minha experiência prática em desenvolvimento de software,
              arquitetura, qualidade e tecnologia.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <GraduationCap className="size-4 text-blue-600 dark:text-blue-300" />
                Aprendizado contínuo
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BadgeCheck className="size-4 text-blue-600 dark:text-blue-300" />
                Conhecimento validado
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="size-4 text-blue-600 dark:text-blue-300" />
                Aplicação prática
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-blue-50/70 p-5 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/[0.07] sm:p-6">
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Award className="size-5" />
              </div>

              <p className="mt-5 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
                {certificatesCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {certificatesCount === 1
                  ? "certificado publicado"
                  : "certificados publicados"}
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Registros de cursos e estudos que fazem parte da minha evolução
                profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {certificatesCount > 0 ? (
        <section
          aria-labelledby="certificates-title"
          className="mt-12"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-600 dark:text-blue-400">
                Minha formação
              </p>

              <h2
                id="certificates-title"
                className="mt-3 text-2xl font-bold tracking-normal text-foreground sm:text-3xl"
              >
                Certificados e cursos concluídos
              </h2>

              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Conhecimentos que complementam os projetos, experiências e
                conteúdos compartilhados neste portfólio.
              </p>
            </div>

            <span className="inline-flex h-9 w-fit items-center rounded-full border border-slate-200 bg-card px-3.5 text-xs font-semibold text-muted-foreground shadow-sm dark:border-white/10">
              {certificatesCount}{" "}
              {certificatesCount === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-lg border border-dashed border-border bg-card p-8 text-center sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
            <BookOpenCheck className="size-6" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Certificados em breve
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Cursos e certificações aparecerão aqui assim que forem publicados
            no portfólio.
          </p>
        </section>
      )}
    </main>
  );
} 
