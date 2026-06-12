import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a trajetória técnica de Otávio Pascoal.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
  );
}
