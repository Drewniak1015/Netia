// app/lib/blog/url.ts
import type { BlogPostMeta } from "@/lib/blog/types";

/** Buduje czytelny segment URL posta: "{id}-{slug}", np. "1-jak-bezpiecznie-...". */
export function budujIdSegment(id: number, slug: string): string {
  return `${id}-${slug}`;
}

/** Pełna ścieżka do posta, np. "/blog/1-jak-bezpiecznie-korzystac-z-internetu-w-domu". */
export function urlPosta(meta: Pick<BlogPostMeta, "id" | "slug">): string {
  return `/blog/${budujIdSegment(meta.id, meta.slug)}`;
}