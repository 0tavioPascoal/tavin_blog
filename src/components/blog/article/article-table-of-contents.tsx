"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ListTree, Search, X } from "lucide-react";

import type { ArticleHeading } from "@/lib/markdown/extract-headings";
import { cn } from "@/lib/utils";

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export function ArticleTableOfContents({
  headings,
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const isClickingRef = useRef<boolean>(false);

  // Filtro de busca rápida para artigos longos
  const filteredHeadings = useMemo(() => {
    if (!searchQuery.trim()) {
      return headings;
    }
    const query = searchQuery.toLowerCase().trim();
    return headings.filter((heading) =>
      heading.text.toLowerCase().includes(query),
    );
  }, [headings, searchQuery]);

  // Algoritmo de Scroll Spy contínuo e preciso
  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const headingElements = headings
      .map((h) => ({
        id: h.id,
        element: document.getElementById(h.id),
      }))
      .filter((item): item is { id: string; element: HTMLElement } => item.element !== null);

    if (headingElements.length === 0) {
      return;
    }

    let animationFrameId: number | null = null;

    const updateActiveHeading = () => {
      if (isClickingRef.current) {
        return;
      }

      // Offset considerando navbar sticky de 64px + folga
      const headerOffset = 110;
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Se o usuário estiver no fim da página, ativa o último tópico
      if (scrollY + windowHeight >= documentHeight - 50) {
        const lastHeading = headingElements[headingElements.length - 1];
        if (lastHeading) {
          setActiveId(lastHeading.id);
        }
        return;
      }

      // Encontra o heading mais recente que passou do offset do topo
      let currentActiveId = "";

      for (let i = 0; i < headingElements.length; i++) {
        const { id, element } = headingElements[i];
        const rect = element.getBoundingClientRect();

        if (rect.top <= headerOffset) {
          currentActiveId = id;
        } else {
          break;
        }
      }

      // Se nenhum passou pelo offset mas estamos na página, seleciona o primeiro
      if (!currentActiveId && headingElements.length > 0 && scrollY > 100) {
        currentActiveId = headingElements[0].id;
      }

      setActiveId(currentActiveId);
    };

    const handleScroll = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateActiveHeading);
    };

    // Executa no carregamento inicial
    updateActiveHeading();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [headings]);

  // Acompanha o item ativo no scroll do próprio container da TOC quando houver muitos tópicos
  useEffect(() => {
    if (!activeId || !tocContainerRef.current) {
      return;
    }

    const activeElement = tocContainerRef.current.querySelector(
      `[data-heading-id="${activeId}"]`,
    );

    if (activeElement) {
      activeElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeId]);

  if (headings.length < 2) {
    return null;
  }

  const handleHeadingClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    if (!targetElement) {
      return;
    }

    isClickingRef.current = true;
    setActiveId(id);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    targetElement.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.history.pushState(null, "", `#${id}`);

    // Libera a trava do Scroll Spy após a animação suave de scroll
    setTimeout(() => {
      isClickingRef.current = false;
    }, reducedMotion ? 0 : 800);
  };

  return (
    <aside
      aria-label="Sumário deste artigo"
      className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col rounded-xl pr-2 text-sm [scrollbar-width:thin]"
    >
      {/* Cabeçalho do TOC */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <ListTree className="size-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Neste artigo</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {headings.length} seções
        </span>
      </div>

      {/* Campo de Busca Rápida (para artigos longos ou navegação ágil) */}
      {headings.length >= 4 ? (
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tópico..."
            aria-label="Buscar tópico no artigo"
            className="h-8 w-full rounded-lg border border-border/80 bg-card/60 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-blue-500 focus:bg-background focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-card/40"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Lista de tópicos com acompanhamento de scroll */}
      <nav
        ref={tocContainerRef}
        aria-label="Navegação das seções do artigo"
        className="overflow-y-auto pr-1 text-sm [scrollbar-width:thin]"
      >
        {filteredHeadings.length === 0 ? (
          <p className="py-2 text-xs text-muted-foreground">
            Nenhum tópico encontrado.
          </p>
        ) : (
          <ul className="space-y-1 border-l border-border/70">
            {filteredHeadings.map((heading) => {
              const isActive = activeId === heading.id;

              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    data-heading-id={heading.id}
                    onClick={(e) => handleHeadingClick(e, heading.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                      heading.level === 3
                        ? "pl-6 text-xs sm:text-[13px]"
                        : "pl-3.5 text-sm font-medium",
                      isActive
                        ? "border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
