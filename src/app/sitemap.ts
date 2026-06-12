import type { MetadataRoute } from "next";

import { listPublishedArticles } from "@/features/posts/repositories/posts-repository";

const baseUrl = "https://otaviopascoal.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublishedArticles();
  const staticRoutes = ["", "/blog", "/projetos", "/sobre", "/contato"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
  }));

  return [...staticRoutes, ...articleRoutes];
}
