// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/konfigurator/podsumowanie"],
      },
    ],
    sitemap: "https://netia.vercel.app/sitemap.xml",
  };
}