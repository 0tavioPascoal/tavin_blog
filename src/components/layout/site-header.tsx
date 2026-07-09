"use client";

import { Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useState, useSyncExternalStore } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/features/settings/types/settings";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/blog/artigos", label: "Artigos" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname.startsWith(href);
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
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 shadow-[0_4px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-[7vw]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground sm:gap-3"
        >
          <span className="shrink-0 text-xl text-blue-600 dark:text-blue-400 sm:text-2xl">
            &lt;/&gt;
          </span>

          <span className="truncate text-base sm:text-lg">
            OTÁVIO <span className="font-normal">PASCOAL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-5 text-sm font-medium text-muted-foreground transition hover:text-blue-700 dark:hover:text-blue-300",
                  active && "text-blue-700 dark:text-blue-300",
                )}
              >
                {item.label}

                {active ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          {settings.githubUrl ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              asChild
              aria-label="GitHub"
            >
              <a href={settings.githubUrl} target="_blank" rel="noreferrer">
                <FaGithub className="size-5" />
              </a>
            </Button>
          ) : null}

          {settings.linkedinUrl ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-blue-600 dark:hover:text-blue-400"
              asChild
              aria-label="LinkedIn"
            >
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">
                <FaLinkedinIn className="size-5" />
              </a>
            </Button>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-amber-500 dark:hover:text-amber-400"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {mounted && isDark ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-emerald-600 dark:hover:text-emerald-400"
            asChild
            aria-label="Admin"
          >
            <Link href="/admin">
              <ShieldCheck className="size-5" />
            </Link>
          </Button>
        </div>

        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Abrir menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {isOpen ? (
        <nav className="border-t border-border bg-card px-4 py-4 shadow-lg shadow-slate-900/5 sm:px-6 md:hidden">
          <div className="grid gap-2">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
                    active &&
                      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
                isActive(pathname, "/admin") &&
                  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
              )}
            >
              Admin
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
            {settings.githubUrl ? (
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                asChild
                aria-label="GitHub"
              >
                <a href={settings.githubUrl} target="_blank" rel="noreferrer">
                  <FaGithub className="size-4" />
                  GitHub
                </a>
              </Button>
            ) : null}

            {settings.linkedinUrl ? (
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                asChild
                aria-label="LinkedIn"
              >
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">
                  <FaLinkedinIn className="size-4" />
                  LinkedIn
                </a>
              </Button>
            ) : null}

            <Button
              variant="outline"
              className="h-10 rounded-xl"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              {mounted && isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              Tema
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

