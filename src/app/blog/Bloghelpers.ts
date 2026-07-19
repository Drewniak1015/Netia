/* ---------------------------------------------------------------------- */
/*  Czyste funkcje pomocnicze bloga — bez React, bez hooków, bez           */
/*  "use client". Dzięki temu można ich używać zarówno w page.tsx          */
/*  (Server Component, liczy dane z searchParams) jak i w komponentach     */
/*  klienckich (linki, buforowanie inputów).                               */
/* ---------------------------------------------------------------------- */
import type { CategorySlug } from "@/lib/blog/categories";

export function formatujDate(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

// Normalizacja tekstu do porównań — lowercase i bez polskich znaków
// diakrytycznych, żeby "ą" == "a" itp. (użytkownik nie musi trafić z klawiaturą).
export function normalizujTekst(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Buduje link do listy z zachowaniem kategorii, tagów, frazy szukania i strony.
// Stronę 1 pomijamy w URL, żeby "goły" /blog i /blog?strona=1 wyglądały tak samo.
export function urlStrony(
  activeCategory: CategorySlug | null,
  szukaj: string,
  tagi: string[],
  strona: number
): string {
  const params = new URLSearchParams();
  if (activeCategory) params.set("kategoria", activeCategory);
  if (szukaj) params.set("szukaj", szukaj);
  if (tagi.length > 0) params.set("tagi", tagi.join(","));
  if (strona > 1) params.set("strona", String(strona));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function parsujTagiZUrl(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Ile postów pokazujemy maksymalnie na jednej stronie listy.
export const POSTS_PER_PAGE = 15;

// TODO: podmień, jeśli adres strony głównej "Moja Netia" różni się od "/".
export const MOJA_NETIA_HOME = "/";