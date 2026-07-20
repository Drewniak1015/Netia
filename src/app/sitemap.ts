// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { POSTS } from "@/app/content/blog/posts";
import { CITIES } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://netia.vercel.app/", priority: 1.0, changeFrequency: "daily" },
    { url: "https://netia.vercel.app/oferty/max", priority: 0.9, changeFrequency: "weekly" },
    { url: "https://netia.vercel.app/oferty/popularne", priority: 0.9, changeFrequency: "weekly" },
    { url: "https://netia.vercel.app/konfigurator", priority: 0.8, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/kanaly", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/pomoc/faq", priority: 0.6, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/pomoc/Telewizja", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/pomoc/internet", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/pomoc/telefon", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/pomoc/awarie", priority: 0.6, changeFrequency: "monthly" },
    { url: "https://netia.vercel.app/blog", priority: 0.6, changeFrequency: "weekly" },
    { url: "https://netia.vercel.app/polityka-prywatnosci", priority: 0.2, changeFrequency: "yearly" },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map(({ meta }) => ({
    url: `https://netia.vercel.app/blog/${meta.slug}`,
    lastModified: meta.date,
    priority: 0.5,
    changeFrequency: "monthly",
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `https://netia.vercel.app/internet-miasta/${city.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...blogPages, ...cityPages];
}