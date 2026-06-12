import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [safaris, blogs] = await Promise.all([
    prisma.safari.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/safaris",
    "/blog",
    "/about",
    "/faq",
    "/destinations",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const safariRoutes: MetadataRoute.Sitemap = safaris.map((safari) => ({
    url: `${siteConfig.url}/safaris/${safari.slug}`,
    lastModified: safari.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...safariRoutes, ...blogRoutes];
}
