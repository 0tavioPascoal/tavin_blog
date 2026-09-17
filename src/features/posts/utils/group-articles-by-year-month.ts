import type { ArticleSummary } from "@/features/posts/types/post";

export type ArticleArchiveGroup = {
  year: number;
  month: number;
  monthLabel: string;
  anchor: string;
  articles: ArticleSummary[];
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

const monthSlugs = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

export function groupArticlesByYearMonth(
  articles: ArticleSummary[],
): ArticleArchiveGroup[] {
  const sortedArticles = [...articles].sort((first, second) => {
    const firstTime = first.publishedAt
      ? new Date(first.publishedAt).getTime()
      : 0;
    const secondTime = second.publishedAt
      ? new Date(second.publishedAt).getTime()
      : 0;

    return secondTime - firstTime;
  });
  const groups = new Map<string, ArticleArchiveGroup>();

  for (const article of sortedArticles) {
    if (!article.publishedAt) continue;

    const publishedAt = new Date(article.publishedAt);
    if (Number.isNaN(publishedAt.getTime())) continue;

    const year = publishedAt.getUTCFullYear();
    const month = publishedAt.getUTCMonth() + 1;
    const key = `${year}-${month}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.articles.push(article);
      continue;
    }

    groups.set(key, {
      year,
      month,
      monthLabel: monthNames[month - 1],
      anchor: `${year}-${monthSlugs[month - 1]}`,
      articles: [article],
    });
  }

  return Array.from(groups.values());
}
