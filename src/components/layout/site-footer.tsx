import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/70">
      <div className="flex w-full flex-col gap-3 px-4 py-5 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-[7vw]">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/"
            className="font-semibold text-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Otávio Pascoal
          </Link>

          <span className="hidden size-1 rounded-full bg-border sm:block" />

          <p className="text-muted-foreground">
            Desenvolvimento, arquitetura, qualidade e negócio.
          </p>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <Link
            href="/sobre"
            className="transition-colors hover:text-foreground"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            className="transition-colors hover:text-foreground"
          >
            Contato
          </Link>

          <span className="hidden h-4 w-px bg-border sm:block" />

          <p>© {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
