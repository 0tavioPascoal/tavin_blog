import { BadgeCheck, BrainCircuit, CloudCog, Rocket } from "lucide-react";

const pillars = [
  {
    title: "Visão de Negócio",
    description: "Entendo o problema além do código para entregar soluções que geram valor.",
    icon: BrainCircuit,
  },
  {
    title: "Qualidade em Foco",
    description: "Testes, validações e boas práticas garantindo software confiável.",
    icon: BadgeCheck,
  },
  {
    title: "Desenvolvimento Fullstack",
    description: "Experiência com diversas tecnologias para construir soluções completas.",
    icon: CloudCog,
  },
  {
    title: "Evolução Contínua",
    description: "Aprendizado constante para acompanhar e aplicar as melhores práticas.",
    icon: Rocket,
  },
];

export function ValuePillarsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;

        return (
          <div
            key={pillar.title}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-300">
              <Icon className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white">{pillar.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{pillar.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
