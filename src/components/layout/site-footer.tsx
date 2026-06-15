export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="px-6 py-8 sm:px-10 lg:px-[7vw]">
        <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              Otávio Pascoal
            </p>
            <p className="text-slate-500">
              Analista de Negócios • QA • Desenvolvedor Fullstack
            </p>
          </div>

          <p className="text-slate-500">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}