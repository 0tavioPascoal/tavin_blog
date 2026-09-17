import type { Metadata } from "next";
import Link from "next/link";

import { CertificateCard } from "@/components/certificates/certificate-card";
import {
  CertificateFilterBar,
  type CertificateIssuerOption,
} from "@/components/certificates/certificate-filter-bar";
import { CertificateYearGroup } from "@/components/certificates/certificate-year-group";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { listPublishedCertificates } from "@/features/certificates/repositories/certificates-repository";
import { groupCertificatesByYear } from "@/features/certificates/utils/group-certificates-by-year";
import { normalizeCertificateIssuer } from "@/features/certificates/utils/normalize-certificate-issuer";

export const metadata: Metadata = {
  title: "Certificados",
  description:
    "Cursos, certificações e formações complementares concluídas por Otávio Pascoal.",
};

type CertificatesPageProps = {
  searchParams: Promise<{
    q?: string;
    emissor?: string;
    tag?: string;
    view?: string;
  }>;
};

export default async function CertificatesPage({ searchParams }: CertificatesPageProps) {
  const { q, emissor, tag, view: requestedView } = await searchParams;
  const certificates = await listPublishedCertificates();
  const searchTerm = q?.trim() ?? "";
  const activeIssuerValue = emissor?.trim() ?? "";
  const activeTagSlug = tag?.trim() ?? "";
  const view = requestedView === "grid" ? "grid" : "list";
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase("pt-BR");

  const issuerMap = new Map<string, string>();
  certificates.forEach((certificate) => {
    const value = normalizeCertificateIssuer(certificate.issuer);
    if (value && !issuerMap.has(value)) issuerMap.set(value, certificate.issuer);
  });
  const issuers: CertificateIssuerOption[] = Array.from(issuerMap, ([value, label]) => ({
    label,
    value,
  })).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  const tagMap = new Map(
    certificates.flatMap((certificate) => certificate.tags).map((certificateTag) => [certificateTag.id, certificateTag]),
  );
  const tags = Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const filteredCertificates = certificates.filter((certificate) => {
    const searchableContent = [
      certificate.title,
      certificate.issuer,
      certificate.description,
      ...certificate.tags.map((certificateTag) => certificateTag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch = normalizedSearchTerm
      ? searchableContent.includes(normalizedSearchTerm)
      : true;
    const matchesIssuer = activeIssuerValue
      ? normalizeCertificateIssuer(certificate.issuer) === activeIssuerValue
      : true;
    const matchesTag = activeTagSlug
      ? certificate.tags.some((certificateTag) => certificateTag.slug === activeTagSlug)
      : true;

    return matchesSearch && matchesIssuer && matchesTag;
  });

  const yearGroups = groupCertificatesByYear(filteredCertificates);
  const hasFilters = Boolean(searchTerm || activeIssuerValue || activeTagSlug);
  const hasResults = filteredCertificates.length > 0;

  return (
    <PageContainer as="main" size="wide" className="max-w-7xl">
      <PageHeader
        eyebrow="Formação contínua"
        title="Certificados"
        description="Cursos, certificações e trilhas de aprendizado que complementam minha experiência prática em desenvolvimento de software, arquitetura e qualidade."
      />

      <CertificateFilterBar
        issuers={issuers}
        tags={tags}
        searchTerm={searchTerm}
        activeIssuerValue={activeIssuerValue}
        activeTagSlug={activeTagSlug}
        view={view}
        resultCount={filteredCertificates.length}
      />

      {!hasResults ? (
        <section aria-label="Resultado da busca" className="mt-10">
          <EmptyState
            title={hasFilters ? "Nenhum certificado encontrado" : "Nenhum certificado registrado"}
            description={
              hasFilters
                ? "Tente buscar por outro termo ou remova algum filtro."
                : "Cursos e certificações aparecerão aqui assim que forem publicados no portfólio."
            }
            action={
              hasFilters ? (
                <Link
                  href={`/certificados?view=${view}`}
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Limpar filtros
                </Link>
              ) : undefined
            }
          />
        </section>
      ) : view === "list" ? (
        <div className="mt-10 space-y-12">
          {yearGroups.map((group) => (
            <CertificateYearGroup key={group.year} group={group} />
          ))}
        </div>
      ) : (
        <section aria-labelledby="all-certificates-title" className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
            <h2 id="all-certificates-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Todos os certificados
            </h2>
            <p className="text-xs text-muted-foreground">
              {filteredCertificates.length} certificado
              {filteredCertificates.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        </section>
      )}

    </PageContainer>
  );
}
