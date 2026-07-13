"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Mail,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/features/settings/types/settings";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

const navigation = [
  {
    href: "/",
    label: "Início",
  },
  {
    href: "/blog/artigos",
    label: "Artigos",
  },
  {
    href: "/projetos",
    label: "Projetos",
  },
  {
    href: "/certificados",
    label: "Certificados",
  },
  {
    href: "/sobre",
    label: "Sobre",
  },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === href
    : pathname.startsWith(href);
}

function subscribe() {
  return () => {};
}

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenuRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 shadow-[0_8px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:bg-background/80 dark:shadow-[0_8px_30px_-22px_rgba(0,0,0,0.8)]">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-[7vw]">
        {/* Identidade */}
        <Link
          href="/"
          aria-label="Ir para a página inicial"
          className="group flex min-w-0 items-center gap-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-sm font-black tracking-[-0.06em] text-white shadow-md shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105">
            OP
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-[-0.02em] text-foreground sm:text-base">
              Otávio Pascoal
            </span>

            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Blog & Portfólio
            </span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav
          aria-label="Navegação principal"
          className="hidden h-full items-center gap-1 lg:flex"
        >
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center rounded-xl px-3.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/70 hover:text-foreground",
                  active &&
                    "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
                )}
              >
                {item.label}

                {active ? (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Ações desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {settings.githubUrl ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Acessar GitHub"
              >
                <FaGithub className="size-[18px]" />
              </a>
            </Button>
          ) : null}

          {settings.linkedinUrl ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl text-muted-foreground hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-400/10 dark:hover:text-blue-300"
            >
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Acessar LinkedIn"
              >
                <FaLinkedinIn className="size-[18px]" />
              </a>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-muted-foreground hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-400/10 dark:hover:text-amber-300"
            onClick={toggleTheme}
            aria-label={
              mounted && isDark
                ? "Ativar tema claro"
                : "Ativar tema escuro"
            }
          >
            {mounted && isDark ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button
            asChild
            size="sm"
            className="h-9 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-md shadow-blue-600/15 hover:bg-blue-700"
          >
            <Link href="/contato">
              <Mail className="size-4" />
              Contato
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="ml-1 size-9 rounded-xl text-muted-foreground/70 hover:bg-accent hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Link
              href="/admin"
              aria-label="Acessar administração"
            >
              <ShieldCheck className="size-[18px]" />
            </Link>
          </Button>
        </div>

        {/* Botão mobile */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Menu mobile */}
      {isOpen ? (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          tabIndex={-1}
          className="border-t border-border/80 bg-background/95 px-4 py-4 shadow-xl shadow-slate-950/5 backdrop-blur-xl sm:px-6 lg:hidden"
        >
          <nav
            aria-label="Navegação mobile"
            className="grid gap-1.5"
          >
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-xl px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    active &&
                      "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/contato"
              onClick={() => setIsOpen(false)}
              aria-current={
                isActive(pathname, "/contato")
                  ? "page"
                  : undefined
              }
              className={cn(
                "flex h-11 items-center justify-between rounded-xl px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive(pathname, "/contato") &&
                  "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200",
              )}
            >
              Contato
              <Mail className="size-4" />
            </Link>
          </nav>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            {settings.githubUrl ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 flex-1 rounded-xl"
              >
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub className="size-4" />
                  GitHub
                </a>
              </Button>
            ) : null}

            {settings.linkedinUrl ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 flex-1 rounded-xl"
              >
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn className="size-4" />
                  LinkedIn
                </a>
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 shrink-0 rounded-xl"
              onClick={toggleTheme}
              aria-label={
                mounted && isDark
                  ? "Ativar tema claro"
                  : "Ativar tema escuro"
              }
            >
              {mounted && isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-10 shrink-0 rounded-xl"
            >
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                aria-label="Acessar administração"
              >
                <ShieldCheck className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
