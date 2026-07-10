import type { MetadataRoute } from "next";

import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";

type SitemapEntry = MetadataRoute.Sitemap[number];

function normalizeBaseUrl(value: string) {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      "A URL do site usada no sitemap deve utilizar HTTP ou HTTPS.",
    );
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function buildUrl(baseUrl: string, pathname = "") {
  const normalizedPath = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  return `${baseUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
}

function parseOptionalDate(
  value: string | Date | null | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function removeDuplicateUrls(entries: MetadataRoute.Sitemap) {
  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values(),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags, settings] = await Promise.all([
    listPublishedArticles(),
    listActiveCategories(),
    listActiveTags(),
    getSiteSettings(),
  ]);

  const configuredSiteUrl =
    settings.siteUrl?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredSiteUrl) {
    throw new Error(
      "Configure settings.siteUrl ou NEXT_PUBLIC_SITE_URL para gerar o sitemap.",
    );
  }

  const baseUrl = normalizeBaseUrl(configuredSiteUrl);

  const staticRoutes: SitemapEntry[] = [
    {
      url: buildUrl(baseUrl),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildUrl(baseUrl, "/blog/artigos"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildUrl(baseUrl, "/projetos"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: buildUrl(baseUrl, "/certificados"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "/sobre"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "/contato"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const articleRoutes: SitemapEntry[] = articles.map((article) => ({
    url: buildUrl(baseUrl, `/blog/${article.slug}`),
    lastModified: parseOptionalDate(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: SitemapEntry[] = categories.map((category) => ({
    url: buildUrl(baseUrl, `/blog/categoria/${category.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const tagRoutes: SitemapEntry[] = tags.map((tag) => ({
    url: buildUrl(baseUrl, `/blog/tag/${tag.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return removeDuplicateUrls([
    ...staticRoutes,
    ...articleRoutes,
    ...categoryRoutes,
    ...tagRoutes,
  ]);
}