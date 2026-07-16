import type { MetadataRoute } from "next";
import { getNews, getProjects } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://schutz-von-wildtieren-web.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, news] = await Promise.all([getProjects(), getNews()]);

  const staticRoutes = [
    "",
    "/verein",
    "/projekte",
    "/erfolge",
    "/aktuelles",
    "/bilder",
    "/unterstuetzen",
    "/kontakt",
    "/agb",
    "/datenschutz",
    "/impressum",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${siteUrl}/projekte/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  const newsRoutes = news.map((n) => ({
    url: `${siteUrl}/aktuelles/${n.slug}`,
    lastModified: new Date(n.updated_at),
  }));

  return [...staticRoutes, ...projectRoutes, ...newsRoutes];
}
