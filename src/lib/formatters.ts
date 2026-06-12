export function formatDate(date: string | null): string {
  if (!date) {
    return "Não publicado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
