import type { Metadata } from "next";
import { Code2, Mail, Network } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Otávio Pascoal.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Contato</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
        Vamos conversar sobre tecnologia e produto
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        Para oportunidades, parcerias ou conversas técnicas, use um dos canais abaixo.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href="mailto:contato@otaviopascoal.dev">
          <Mail className="mb-4 size-5 text-blue-600" />
          E-mail
        </a>
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href="https://github.com/" target="_blank" rel="noreferrer">
          <Code2 className="mb-4 size-5 text-blue-600" />
          GitHub
        </a>
        <a className="rounded-lg border border-slate-200 bg-white p-5 font-medium shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <Network className="mb-4 size-5 text-blue-600" />
          LinkedIn
        </a>
      </div>
    </section>
  );
}
