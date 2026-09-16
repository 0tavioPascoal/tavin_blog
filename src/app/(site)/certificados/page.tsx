import type { Metadata } from "next";

import { CertificateCard } from "@/components/certificates/certificate-card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";

export const metadata: Metadata = {
  title: "Certificados",
  description:
    "Cursos, certificações e formações complementares concluídas por Otávio Pascoal.",
};

export default async function CertificatesPage() {
  const certificates = await listPublishedCertificates();

  return (
    <PageContainer as="main">
      {/* Header Padronizado */}
      <PageHeader
        eyebrow="Formação contínua"
        title="Certificados"
        description="Cursos, certificações e trilhas de aprendizado que complementam minha experiência prática em desenvolvimento de software, arquitetura e qualidade."
      />

      {/* Grid de Certificados */}
      <section aria-label="Lista de certificados" className="mt-8">
        <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3 text-xs text-muted-foreground">
          <p>
            {certificates.length} certificado
            {certificates.length === 1 ? "" : "s"} registrado
            {certificates.length === 1 ? "" : "s"}
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="h-full">
                <CertificateCard certificate={certificate} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum certificado registrado"
            description="Cursos e certificações aparecerão aqui assim que forem publicados no portfólio."
          />
        )}
      </section>
    </PageContainer>
  );
}
