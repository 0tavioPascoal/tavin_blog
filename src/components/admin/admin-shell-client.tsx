"use client";

import {
  Award,
  FileText,
  FolderKanban,
  Home,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  Settings,
  Sun,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { LogoutButton } from "@/components/admin/logout-button";
import type { AdminUser } from "@/features/auth/repositories/auth-repository";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

type AdminShellClientProps = {
  user: AdminUser;
  children: React.ReactNode;
  initialCollapsed: boolean;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/projects", label: "Projetos", icon: FolderKanban },
  { href: "/admin/certificates", label: "Certificados", icon: Award },
  { href: "/admin/categories", label: "Categorias", icon: Tags },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/posts/new", label: "Novo post", icon: PenSquare },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function subscribe() {
  return () => {};
}

export function AdminShellClient({
  user,
  children,
  initialCollapsed,
}: AdminShellClientProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileNavRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileNavOpen]);

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  function toggleSidebar() {
    setCollapsed((current) => {
      const nextValue = !current;

      document.cookie = `admin-sidebar-collapsed=${nextValue}; path=/; max-age=31536000; SameSite=Lax`;

      return nextValue;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 hidden border-r border-slate-300/70 bg-card transition-all duration-300 dark:border-slate-800 lg:block",
          collapsed ? "w-20" : "w-72",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            {!collapsed ? (
              <div className="min-w-0">
                <Link href="/admin" className="text-lg font-bold text-foreground">
                  Admin Otávio
                </Link>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={toggleSidebar}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
          </div>

          <nav className="mt-8 grid gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      : "text-muted-foreground hover:bg-background hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto grid gap-2 pt-6">
            <button
              type="button"
              onClick={toggleTheme}
              title={collapsed ? "Alternar tema" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400",
                collapsed && "justify-center px-0",
              )}
            >
              {mounted && isDark ? (
                <Sun className="size-4 shrink-0" />
              ) : (
                <Moon className="size-4 shrink-0" />
              )}

              {!collapsed ? (
                <span>{mounted && isDark ? "Modo claro" : "Modo escuro"}</span>
              ) : null}
            </button>

            <LogoutButton
              showIcon
              label={collapsed ? "" : "Sair"}
              className={cn(
                collapsed
                  ? "h-11 w-full justify-center px-0"
                  : "w-full justify-start",
              )}
            />
          </div>
        </div>
      </aside>

      <div
        className={cn(
          "transition-all duration-300 lg:pl-72",
          collapsed && "lg:pl-20",
        )}
      >
        <header className="sticky top-0 z-40 border-b border-slate-300/70 bg-card/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
              aria-label="Abrir navegação do admin"
            >
              <Menu className="size-4" />
            </button>

            <Link
              href="/admin"
              className="min-w-0 flex-1 truncate font-semibold text-foreground"
            >
              Admin Otávio
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-background hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Alternar tema"
              >
                {mounted && isDark ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>

              <LogoutButton
                variant="ghost"
                size="sm"
                showIcon={false}
                label="Sair"
              />
            </div>
          </div>
        </header>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              aria-label="Fechar navegação do admin"
              onClick={() => setMobileNavOpen(false)}
            />

            <aside ref={mobileNavRef} role="dialog" aria-modal="true" aria-label="Navegação administrativa" tabIndex={-1} className="relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col overflow-y-auto border-r border-border bg-card p-4 shadow-2xl shadow-slate-950/30">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href="/admin"
                    onClick={() => setMobileNavOpen(false)}
                    className="text-lg font-bold text-foreground"
                  >
                    Admin Otávio
                  </Link>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
                  aria-label="Fechar navegação do admin"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="mt-8 grid gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                        active
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-muted-foreground hover:bg-background hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto grid gap-2 pt-6">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:text-blue-400"
                >
                  {mounted && isDark ? (
                    <Sun className="size-4 shrink-0" />
                  ) : (
                    <Moon className="size-4 shrink-0" />
                  )}
                  <span>{mounted && isDark ? "Modo claro" : "Modo escuro"}</span>
                </button>

                <LogoutButton
                  showIcon
                  label="Sair"
                  className="w-full justify-start"
                />
              </div>
            </aside>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
