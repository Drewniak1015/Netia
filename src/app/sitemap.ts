// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { POSTS } from "@/app/content/blog/posts";
import { CITIES } from "@/lib/cities";

const BASE_URL = "https://www.swiatlowod-netia-oferta.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE_URL}/oferty/max`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/oferty/popularne`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/oferty/dobierz`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/oferty/internet-tv`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/konfigurator`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/kanaly`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/pomoc/faq`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/pomoc/Telewizja`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/pomoc/internet`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/pomoc/telefon`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/pomoc/awarie`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/blog`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE_URL}/polityka-prywatnosci`, priority: 0.2, changeFrequency: "yearly" },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map(({ meta }) => ({
    url: `${BASE_URL}/blog/${meta.slug}`,
    lastModified: meta.date,
    priority: 0.5,
    changeFrequency: "monthly",
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE_URL}/internet-miasta/${city.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...blogPages, ...cityPages];
}