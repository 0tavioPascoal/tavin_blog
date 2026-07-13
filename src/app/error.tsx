"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Algo deu errado</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Não foi possível carregar esta página.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Tente novamente. Se o problema continuar, volte mais tarde.</p>
        <Button type="button" onClick={reset} className="mt-6 h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700">
          <RotateCcw className="size-4" />
          Tentar novamente
        </Button>
      </section>
    </main>
  );
}
