"use client";

import { Code2, LayoutDashboard, Menu, Moon, Network, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    const nextDark = !isDark;
    document.documentElement.classList.toggle("dark", nextDark);
    setIsDark(nextDark);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-slate-950 dark:text-white">
          <span className="text-2xl text-blue-600">&lt;/&gt;</span>
          <span className="text-lg">
            OTÁVIO <span className="font-normal">PASCOAL</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative py-5 text-sm font-medium text-slate-700 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300",
                isActive(pathname, item.href) && "text-blue-700 dark:text-blue-300",
              )}
            >
              {item.label}
              {isActive(pathname, item.href) ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon-sm" asChild aria-label="GitHub">
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <Code2 className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild aria-label="LinkedIn">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              <Network className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Alternar tema">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon-sm" asChild aria-label="Admin">
            <Link href="/admin">
              <LayoutDashboard className="size-4" />
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
        <nav className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300",
                  isActive(pathname, item.href) && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300",
                isActive(pathname, "/admin") && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
              )}
            >
              Admin
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
