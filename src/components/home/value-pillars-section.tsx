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
              className="
                group
                flex
                h-full
                flex-col
                rounded-2xl
                border
                border-slate-300/70
                bg-card
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-xl
                hover:shadow-slate-950/5
                dark:border-slate-800
                dark:hover:border-blue-800
                dark:hover:shadow-black/20
                sm:p-6
              "
            >
              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50/80
                  text-blue-600
                  shadow-sm
                  transition-all
                  duration-300
                  group-hover:border-blue-300
                  group-hover:bg-blue-100
                  group-hover:text-blue-700
                  dark:border-blue-900
                  dark:bg-blue-950/40
                  dark:text-blue-300
                  dark:group-hover:border-blue-800
                  dark:group-hover:bg-blue-950/70
                  dark:group-hover:text-blue-200
                "
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                {pillar.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {pillar.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}