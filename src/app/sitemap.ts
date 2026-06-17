import type { MetadataRoute } from "next";

import { listActiveCategories } from "@/features/categories/repositories/categories-repository";
import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";
import { listActiveTags } from "@/features/tags/repositories/tags-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags, settings] = await Promise.all([
    listPublishedArticles(),
    listActiveCategories(),
    listActiveTags(),
    getSiteSettings(),
  ]);
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/blog", "/projetos", "/sobre", "/contato"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/categoria/${category.slug}`,
    lastModified: new Date(),
  }));

  const tagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes];
}
