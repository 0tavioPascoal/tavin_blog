import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import type { SiteSettings } from "@/features/settings/types/settings";

type SiteFooterProps = {
  settings: SiteSettings;
};

const footerNavigation = [
  { href: "/blog/artigos", label: "Artigos" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteFooter({ settings }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/70">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:px-8">
        <div>
          <Link
            href="/"
            className="font-semibold text-foreground transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:text-blue-400"
          >
            Otávio Pascoal
          </Link>
          <p className="mt-1 max-w-md text-muted-foreground">
            Desenvolvimento, arquitetura, qualidade e negócio.
          </p>
        </div>

        <div className="space-y-4 md:text-right">
          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground md:justify-end">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-9 items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-muted-foreground md:justify-end">
            {settings.githubUrl ? (
              <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub de Otávio Pascoal" className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <FaGithub className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            {settings.linkedinUrl ? (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Otávio Pascoal" className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <FaLinkedinIn className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            <p>© {currentYear}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
