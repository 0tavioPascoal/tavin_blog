import { PageContainer } from "@/components/layout/page-container";

export default function SiteLoading() {
  return (
    <PageContainer as="main" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="animate-pulse motion-reduce:animate-none">
        <div className="border-b border-border/80 pb-8 sm:pb-10">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="mt-4 h-10 max-w-xl rounded-lg bg-muted" />
          <div className="mt-4 h-5 max-w-2xl rounded bg-muted/80" />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-xl border border-border/80 bg-card"
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
