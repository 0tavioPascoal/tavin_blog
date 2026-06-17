export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="px-6 py-8 sm:px-10 lg:px-[7vw]">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">
            Otávio Pascoal
          </p>

          <p className="text-muted-foreground">
            Compartilhando aprendizados sobre .NET, Java, Arquitetura de Software e Tecnologia.
          </p>

          <p className="text-muted-foreground">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}