import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";

export default function SiteNotFound() {
  return (
    <PageContainer as="main" size="narrow">
      <section className="mx-auto max-w-xl py-12 text-center sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          O endereço pode ter mudado ou o conteúdo não está mais disponível.
          Escolha um dos caminhos abaixo para continuar.
        </p>
        <nav
          aria-label="Caminhos para continuar"
          className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Ir para o início
          </Link>
          <Link
            href="/blog/artigos"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Explorar artigos
          </Link>
          <Link
            href="/projetos"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver projetos
          </Link>
        </nav>
      </section>
    </PageContainer>
  );
}
