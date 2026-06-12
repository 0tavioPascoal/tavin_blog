import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
