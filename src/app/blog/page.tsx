import { POSTS } from "@/app/content/blog/posts";
import { isValidCategory, type CategorySlug } from "@/lib/blog/categories";
import { normalizujTekst, parsujTagiZUrl, POSTS_PER_PAGE } from "@/app/blog/Bloghelpers";
import BlogContent from "@/app/blog/Blogcontent";

/* ---------------------------------------------------------------------- */
/*  FIX (CLS — ten sam winowajca co w Konfiguratorze): poprzednio cała     */
/*  strona bloga była jednym "use client" komponentem czytającym           */
/*  useSearchParams() wewnątrz <Suspense fallback={null}>. Next.js         */
/*  wysyłał wtedy PUSTE initial HTML (fallback=null) i CAŁA treść —        */
/*  breadcrumb, nagłówek, wyszukiwarka, filtry, siatka postów — pojawiała  */
/*  się dopiero po hydracji, losowo w zależności od tego, czy JS zdążył    */
/*  się załadować przed pierwszym pomiarem (Header/Footer wtedy "skakały"  */
/*  w dół, gdy treść nagle wskakiwała).                                    */
/*                                                                          */
/*  Fix: ta strona to teraz Server Component (bez "use client"), a         */
/*  searchParams dostajemy jako zwykły prop od Next.js — zero hooków,      */
/*  zero Suspense, zero CSR-bail. Filtrowanie/sortowanie/paginacja liczą   */
/*  się na serwerze, więc od pierwszego bajtu HTML strona jest w 100%      */
/*  kompletna, zawsze, przy każdym odświeżeniu — nie ma czego "wskoczyć"   */
/*  później.                                                               */
/*                                                                          */
/*  <BlogContent> (osobny plik, "use client") dostaje już gotowe, policzone*/
/*  dane jako propsy i odpowiada tylko za interaktywność (input           */
/*  wyszukiwarki z debounce, combobox tagów, animacje wejścia) — te        */
/*  fragmenty NIE czytają searchParams, więc nie potrzebują Suspense.      */
/* ---------------------------------------------------------------------- */

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function jedenParam(
  sp: { [key: string]: string | string[] | undefined },
  klucz: string
): string | null {
  const wartosc = sp[klucz];
  if (Array.isArray(wartosc)) return wartosc[0] ?? null;
  return wartosc ?? null;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const kategoriaParam = jedenParam(sp, "kategoria");
  const activeCategory: CategorySlug | null =
    kategoriaParam && isValidCategory(kategoriaParam) ? kategoriaParam : null;
  const szukaj = jedenParam(sp, "szukaj") ?? "";
  const activeTags = parsujTagiZUrl(jedenParam(sp, "tagi"));

  const postyKategoria = activeCategory
    ? POSTS.filter((p) => p.meta.category === activeCategory)
    : POSTS;

  // Dostępne tagi do wyboru — tylko te występujące w aktualnie widocznej
  // (po kategorii) puli postów, posortowane alfabetycznie.
  const dostepneTagiSet = new Set<string>();
  postyKategoria.forEach((p) => p.meta.tags.forEach((t) => dostepneTagiSet.add(t)));
  const dostepneTagi = Array.from(dostepneTagiSet).sort((a, b) => a.localeCompare(b, "pl"));

  // Filtr tagów — post pasuje, jeśli ma CHOCIAŻ JEDEN z zaznaczonych tagów.
  const postyPoTagach =
    activeTags.length > 0
      ? postyKategoria.filter((p) => p.meta.tags.some((t) => activeTags.includes(t)))
      : postyKategoria;

  // Filtr wyszukiwarki — dopasowanie po tytule, zajawce i tagach.
  const fraza = normalizujTekst(szukaj.trim());
  const postyPrzefiltrowane = fraza
    ? postyPoTagach.filter(({ meta }) =>
        normalizujTekst([meta.title, meta.excerpt, ...meta.tags].join(" ")).includes(fraza)
      )
    : postyPoTagach;

  const postySortowane = [...postyPrzefiltrowane].sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

  // Numer strony z URL, przycięty do sensownego zakresu [1, liczbaStron].
  const liczbaStron = Math.max(1, Math.ceil(postySortowane.length / POSTS_PER_PAGE));
  const stronaParam = Number(jedenParam(sp, "strona"));
  const strona =
    Number.isFinite(stronaParam) && stronaParam >= 1
      ? Math.min(Math.floor(stronaParam), liczbaStron)
      : 1;

  const start = (strona - 1) * POSTS_PER_PAGE;
  const postyNaStronie = postySortowane.slice(start, start + POSTS_PER_PAGE).map((p) => p.meta);

  return (
    <BlogContent
      activeCategory={activeCategory}
      szukaj={szukaj}
      activeTags={activeTags}
      dostepneTagi={dostepneTagi}
      postyPoTagachMeta={postyPoTagach.map((p) => p.meta)}
      postyNaStronie={postyNaStronie}
      strona={strona}
      liczbaStron={liczbaStron}
    />
  );
}