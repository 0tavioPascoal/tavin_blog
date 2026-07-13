export default function Loading() {
  return (
    <main className="w-full animate-pulse px-4 py-10 sm:px-6 lg:px-[7vw]" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="h-64 rounded-3xl border border-border bg-card" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-56 rounded-2xl bg-muted" />
        <div className="h-56 rounded-2xl bg-muted" />
        <div className="h-56 rounded-2xl bg-muted" />
      </div>
    </main>
  );
}
