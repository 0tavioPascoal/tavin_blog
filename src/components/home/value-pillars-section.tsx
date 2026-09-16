import {
  BadgeCheck,
  BrainCircuit,
  CloudCog,
  Rocket,
  Sparkles,
} from "lucide-react";

const pillars = [
  {
    title: "Visão de Negócio",
    description:
      "Entendo o problema além do código para construir soluções que geram impacto real.",
    icon: BrainCircuit,
  },
  {
    title: "Qualidade em Foco",
    description:
      "Validação, testes e boas práticas para entregar software confiável e sustentável.",
    icon: BadgeCheck,
  },
  {
    title: "Desenvolvimento Fullstack",
    description:
      "Experiência em backend, frontend e integrações para desenvolver produtos completos.",
    icon: CloudCog,
  },
  {
    title: "Evolução Contínua",
    description:
      "Aprendizado constante e aplicação das melhores práticas de engenharia.",
    icon: Rocket,
  },
];

export function ValuePillarsSection() {
  return (
    <section aria-labelledby="value-pillars-title">
      <div className="mb-7 flex flex-col gap-3 sm:mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
          <Sparkles className="size-4" aria-hidden="true" />
          Diferenciais
        </div>

        <div>
          <h2
            id="value-pillars-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Como eu penso software
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Tecnologia vai além do código. Minha abordagem combina produto,
            arquitetura, qualidade e negócio para construir soluções úteis,
            escaláveis e sustentáveis.
          </p>
        </div>
      </div>

      <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              key={pillar.title}
              className="group flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 transition-colors duration-150 hover:border-blue-500/50 hover:shadow-xs sm:p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-sans text-base font-bold tracking-tight text-foreground">
                {pillar.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}