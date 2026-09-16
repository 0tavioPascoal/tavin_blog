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

import {
  NewsletterHeaderMobile,
  NewsletterHeaderPopover,
} from "@/components/newsletter/newsletter-header-popover";
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
  if (href === "/blog/artigos") {
    return pathname === "/blog" || pathname === href || pathname.startsWith("/blog/");
  }

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
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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
    mobileMenuRef.current
      ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
      ?.focus();

    function handleMenuKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !mobileMenuRef.current) return;

      const focusableElements = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleMenuKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleMenuKeyboard);
    };
  }, [isOpen]);

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 shadow-[0_8px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:bg-background/80 dark:shadow-[0_8px_30px_-22px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identidade */}
        <Link
          href="/"
          aria-label="Ir para a página inicial"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] border border-white/15 bg-linear-to-br from-blue-600 to-cyan-500 text-[13px] font-extrabold tracking-[-0.04em] text-white shadow-sm shadow-blue-600/20 transition-shadow group-hover:shadow-blue-600/30">
            OP
          </span>

          <span className="min-w-0 leading-none">
            <span className="block truncate text-[15px] font-bold leading-5 tracking-[-0.02em] text-foreground">
              Otávio Pascoal
            </span>

            <span className="block text-[11px] font-medium leading-4 text-muted-foreground max-[340px]:hidden">
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
                  "relative flex h-10 items-center rounded-lg px-3.5 text-sm font-medium transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
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
        <div className="hidden items-center gap-1.5 lg:flex">
          {settings.githubUrl ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
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
              className="size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
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
            className="size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
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

          <NewsletterHeaderPopover />

          <Button
            asChild
            size="sm"
            className="h-9 rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
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
            className="size-9 rounded-lg text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground"
          >
            <Link
              href="/admin"
              aria-label="Acessar administração"
            >
              <ShieldCheck className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Botão mobile */}
        <Button
          ref={mobileMenuButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-lg lg:hidden"
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
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/80 bg-background/95 px-4 py-4 shadow-xl backdrop-blur-xl sm:px-6 lg:hidden"
        >
          <nav
            aria-label="Navegação mobile"
            className="grid gap-1"
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
                    "flex h-11 items-center rounded-lg border-l-2 px-3.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3">
            <NewsletterHeaderMobile />
          </div>

          <nav aria-label="Ações mobile" className="mt-3">
            <Link
              href="/contato"
              onClick={() => setIsOpen(false)}
              aria-current={
                isActive(pathname, "/contato")
                  ? "page"
                  : undefined
              }
              className={cn(
                "flex h-11 items-center justify-between rounded-lg border-l-2 px-3.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive(pathname, "/contato")
                  ? "border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-muted-foreground",
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
                className="h-10 flex-1 rounded-lg"
              >
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                className="h-10 flex-1 rounded-lg"
              >
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
              className="size-10 shrink-0 rounded-lg"
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
              className="size-10 shrink-0 rounded-lg"
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
