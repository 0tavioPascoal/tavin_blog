"use client";

import { RotateCcw } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";

type SiteErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function SiteError({ unstable_retry }: SiteErrorProps) {
  return (
    <PageContainer as="main" size="narrow">
      <section className="mx-auto max-w-lg py-12 text-center sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
          Algo deu errado
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Tente novamente. Se o problema continuar, volte mais tarde.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mx-auto mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Tentar novamente
        </button>
      </section>
    </PageContainer>
  );
}
