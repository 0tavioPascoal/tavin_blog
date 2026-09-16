"use client";

import { useRef } from "react";
import { ChevronDown, ListTree } from "lucide-react";

import type { ArticleHeading } from "@/lib/markdown/extract-headings";
import { cn } from "@/lib/utils";

type ArticleTocMobileProps = {
  headings: ArticleHeading[];
};

export function ArticleTocMobile({ headings }: ArticleTocMobileProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (headings.length < 2) {
    return null;
  }

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);

    // Fecha o details no mobile para desobstruir a leitura
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }

    if (targetElement) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      targetElement.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <details
      ref={detailsRef}
      className="group mb-8 rounded-xl border border-border/80 bg-card/80 p-4 transition-all duration-200 open:bg-card open:shadow-xs lg:hidden"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between font-sans text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="flex items-center gap-2">
          <ListTree className="size-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Neste artigo</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {headings.length} tópicos
          </span>
          <ChevronDown
            className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </div>
      </summary>

      <nav aria-label="Sumário móvel do artigo" className="mt-3 border-t border-border/60 pt-3">
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={cn(
                  "block rounded-sm py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-blue-600",
                  heading.level === 3
                    ? "pl-4 text-xs sm:text-sm"
                    : "text-sm font-medium",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
