// lib/blog/types.ts
import type { ComponentType } from "react";
import type { CategorySlug } from "./categories";

export interface BlogPostMeta {
  /** Numer posta — zgodny z nazwą pliku w content/blog/posts (np. 1 -> posts/1.tsx). */
  id: number;
  /** Ładny URL posta, np. /blog/jak-bezpiecznie-korzystac-z-internetu-w-domu */
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  tags: string[];
  /** Format ISO, np. "2026-07-01" */
  date: string;
  author?: string;
  // TODO: podmień ścieżkę, jeśli plik leży gdzie indziej niż /public.
  coverImage?: string;
  readingMinutes?: number;
}

export interface BlogPostEntry {
  meta: BlogPostMeta;
  /** Właściwa treść artykułu — zwykły komponent React (patrz posts/1.tsx). */
  Content: ComponentType;
}