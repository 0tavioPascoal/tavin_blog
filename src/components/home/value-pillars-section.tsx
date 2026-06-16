import {
  BadgeCheck,
  BrainCircuit,
  CloudCog,
  Rocket,
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
    <section>
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Diferenciais
        </span>

        <h2 className="mt-2 text-3xl font-bold text-foreground">
          Como eu penso software
        </h2>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tecnologia vai além de código. Minha abordagem combina produto,
          arquitetura, qualidade e negócio para construir soluções que sejam
          úteis, escaláveis e sustentáveis.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <div
              key={pillar.title}
              className="
                group
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-lg
                dark:hover:border-blue-800
              "
            >
              <div
                className="
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  transition-colors
                  group-hover:bg-blue-100
                  dark:bg-blue-950/50
                  dark:text-blue-300
                  dark:group-hover:bg-blue-950
                "
              >
                <Icon className="size-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {pillar.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}