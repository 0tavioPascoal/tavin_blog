import { Blocks, ChartNoAxesCombined, DatabaseZap } from "lucide-react";

import type { Project } from "@/features/projects/types/project";

export const projects: Project[] = [
  {
    id: "rh-analyzer",
    title: "RH Analyzer",
    description: "Plataforma de análise comportamental e gestão estratégica para empresas.",
    href: "/projetos#rh-analyzer",
    icon: ChartNoAxesCombined,
    tags: ["ASP.NET", "PostgreSQL", "Analytics"],
    isFeatured: true,
  },
  {
    id: "kraken",
    title: "Kraken",
    description: "Solução de integração e automação de processos empresariais.",
    href: "/projetos#kraken",
    icon: DatabaseZap,
    tags: ["Integrações", "Redis", "Docker"],
    isFeatured: true,
  },
  {
    id: "erp-aspnet",
    title: "ERP ASP.NET",
    description: "Sistema de gestão empresarial completo desenvolvido em ASP.NET Core.",
    href: "/projetos#erp-aspnet",
    icon: Blocks,
    tags: ["ASP.NET Core", "C#", "SQL"],
    isFeatured: true,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.isFeatured);
}
