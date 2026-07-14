"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ChevronLeft, Calendar, Clock, Tag, ImageOff, Home, Search, X } from "lucide-react";
import { CATEGORY_LIST, CATEGORIES, isValidCategory, type CategorySlug } from "@/lib/blog/categories";
import { POSTS } from "@/app/content/blog/posts";
import type { BlogPostMeta } from "@/lib/blog/types";
import { urlPosta } from "@/app/blog/url";

/* ---------------------------------------------------------------------- */
/*  Strona bloga — "Moja Netia" > "Blog" > [Kategoria, jeśli wybrana].     */
/*  Filtr kategorii sterowany parametrem ?kategoria=<slug>, filtr tagów    */
/*  parametrem ?tagi=<tag1>,<tag2> (dopasowanie "dowolny z zaznaczonych"), */
/*  wyszukiwarka tekstowa ?szukaj=<fraza> (przeszukuje tytuł/zajawkę/tagi),*/
/*  a lista jest stronicowana ?strona=<numer>, max POSTS_PER_PAGE na stronę.*/
/*  Każdy widok (w tym połączenie filtrów) ma swój własny, udostępnialny  */
/*  link.                                                                  */
/* ---------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// TODO: podmień, jeśli adres strony głównej "Moja Netia" różni się od "/".
const MOJA_NETIA_HOME = "/";

// Ile postów pokazujemy maksymalnie na jednej stronie listy.
const POSTS_PER_PAGE = 15;

function formatujDate(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

// Normalizacja tekstu do porównań — lowercase i bez polskich znaków
// diakrytycznych, żeby "ą" == "a" itp. (użytkownik nie musi trafić z klawiaturą).
function normalizujTekst(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Buduje link do listy z zachowaniem kategorii, tagów, frazy szukania i strony.
// Stronę 1 pomijamy w URL, żeby "goły" /blog i /blog?strona=1 wyglądały tak samo.
function urlStrony(
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

function parsujTagiZUrl(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ---------------------------------------------------------------------- */
/*  Breadcrumb — Moja Netia / Blog / (Kategoria)                          */
/* ---------------------------------------------------------------------- */
function Breadcrumb({ activeCategory }: { activeCategory: CategorySlug | null }) {
  return (
    <nav aria-label="Ścieżka nawigacji" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link
        href={MOJA_NETIA_HOME}
        className="inline-flex items-center gap-1.5 text-white/50 transition-colors hover:text-white/80"
      >
        <Home size={14} />
        Moja Netia
      </Link>
      <ChevronRight size={14} className="text-white/25" />
      <Link
        href="/blog"
        className={
          activeCategory
            ? "text-white/50 transition-colors hover:text-white/80"
            : "font-semibold text-teal-300"
        }
      >
        Blog
      </Link>
      {activeCategory && (
        <>
          <ChevronRight size={14} className="text-white/25" />
          <span className="font-semibold text-teal-300">{CATEGORIES[activeCategory].label}</span>
        </>
      )}
    </nav>
  );
}

/* ---------------------------------------------------------------------- */
/*  Pasek filtrów kategorii — pigułki, jak reszta strony. Przełączenie     */
/*  kategorii zachowuje aktualną frazę szukania i wybrane tagi.            */
/* ---------------------------------------------------------------------- */
function FiltrKategorii({
  activeCategory,
  szukaj,
  activeTags,
}: {
  activeCategory: CategorySlug | null;
  szukaj: string;
  activeTags: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={urlStrony(null, szukaj, activeTags, 1)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
          !activeCategory
            ? "border-teal-400/50 bg-teal-400/15 text-teal-200"
            : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
        }`}
      >
        Wszystkie
      </Link>
      {CATEGORY_LIST.map((kategoria) => {
        const Ikona = kategoria.icon;
        const active = activeCategory === kategoria.slug;
        return (
          <Link
            key={kategoria.slug}
            href={urlStrony(kategoria.slug, szukaj, activeTags, 1)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              active
                ? "border-teal-400/50 bg-teal-400/15 text-teal-200"
                : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Ikona size={14} />
            {kategoria.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Filtr tagów — klikalne chipy, wielokrotny wybór (dopasowanie: post     */
/*  pasuje, jeśli ma CHOCIAŻ JEDEN z zaznaczonych tagów). Lista dostępnych */
/*  tagów jest kontekstowa — pokazuje tylko tagi występujące w aktualnie   */
/*  wybranej kategorii, żeby nie proponować pustych filtrów.               */
/* ---------------------------------------------------------------------- */
function FiltrTagow({
  dostepneTagi,
  activeCategory,
  szukaj,
  activeTags,
}: {
  dostepneTagi: string[];
  activeCategory: CategorySlug | null;
  szukaj: string;
  activeTags: string[];
}) {
  if (dostepneTagi.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/35">
        <Tag size={12} />
        Tagi:
      </span>
      {dostepneTagi.map((tag) => {
        const active = activeTags.includes(tag);
        const noweTagi = active ? activeTags.filter((t) => t !== tag) : [...activeTags, tag];
        return (
          <Link
            key={tag}
            href={urlStrony(activeCategory, szukaj, noweTagi, 1)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-teal-400/50 bg-teal-400/15 text-teal-200"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {active && <X size={11} />}
            {tag}
          </Link>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Wyszukiwarka postów — filtruje po tytule, zajawce i tagach.            */
/*  Wpisany tekst trafia do URL (?szukaj=...) z małym debounce, żeby nie   */
/*  przepisywać historii przeglądarki przy każdym naciśnięciu klawisza.    */
/*  Dla wrażenia "żywej" reakcji: licznik pasujących wyników aktualizuje   */
/*  się NATYCHMIAST (bez czekania na debounce/nawigację), a input ma       */
/*  subtelną animację focusu (poświata + delikatne powiększenie).         */
/* ---------------------------------------------------------------------- */
function SzukajkaPostow({
  activeCategory,
  activeTags,
  szukajInitial,
  postyDoPrzeszukania,
  reduceMotion,
}: {
  activeCategory: CategorySlug | null;
  activeTags: string[];
  szukajInitial: string;
  postyDoPrzeszukania: BlogPostMeta[];
  reduceMotion: boolean | null;
}) {
  const router = useRouter();
  const [wartosc, setWartosc] = useState(szukajInitial);
  const [wFokusie, setWFokusie] = useState(false);

  // Trzymaj input w zgodzie z URL, gdy zmienia się np. przez cofnięcie w historii.
  useEffect(() => {
    setWartosc(szukajInitial);
  }, [szukajInitial]);

  useEffect(() => {
    const znormalizowana = wartosc.trim();
    if (znormalizowana === szukajInitial.trim()) return;

    const id = setTimeout(() => {
      // Nowe wyszukiwanie zawsze wraca na stronę 1.
      router.push(urlStrony(activeCategory, znormalizowana, activeTags, 1));
    }, 350);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wartosc]);

  // Natychmiastowy (bez debounce) licznik dopasowań — czysto wizualna
  // informacja zwrotna podczas pisania, niezależna od faktycznej nawigacji.
  const liczbaNaZywo = useMemo(() => {
    const fraza = normalizujTekst(wartosc.trim());
    if (!fraza) return null;
    return postyDoPrzeszukania.filter(({ title, excerpt, tags }) =>
      normalizujTekst([title, excerpt, ...tags].join(" ")).includes(fraza)
    ).length;
  }, [wartosc, postyDoPrzeszukania]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <m.div
        animate={
          reduceMotion
            ? undefined
            : {
                scale: wFokusie ? 1.015 : 1,
                boxShadow: wFokusie
                  ? "0 0 0 3px rgba(45,212,191,0.18)"
                  : "0 0 0 0px rgba(45,212,191,0)",
              }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-full"
      >
        <Search
          size={16}
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            wFokusie ? "text-teal-300" : "text-white/35"
          }`}
        />
        <input
          type="text"
          value={wartosc}
          onChange={(e) => setWartosc(e.target.value)}
          onFocus={() => setWFokusie(true)}
          onBlur={() => setWFokusie(false)}
          placeholder="Szukaj po tytule, opisie lub tagu…"
          aria-label="Szukaj artykułów"
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-teal-400/50 focus:bg-white/[0.07]"
        />
        {wartosc && (
          <button
            type="button"
            onClick={() => setWartosc("")}
            aria-label="Wyczyść wyszukiwanie"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/70"
          >
            <X size={15} />
          </button>
        )}
      </m.div>

      {/* Żywy licznik wyników — pojawia się/znika płynnie w trakcie pisania */}
      <AnimatePresence>
        {liczbaNaZywo !== null && (
          <m.span
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap text-xs font-medium text-white/45"
          >
            {liczbaNaZywo === 0
              ? "Brak wyników"
              : `${liczbaNaZywo} ${liczbaNaZywo === 1 ? "wynik" : liczbaNaZywo < 5 ? "wyniki" : "wyników"}`}
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Karta pojedynczego posta                                               */
/* ---------------------------------------------------------------------- */
function KartaPosta({ post, index, reduceMotion }: { post: BlogPostMeta; index: number; reduceMotion: boolean | null }) {
  const kategoria = CATEGORIES[post.category];
  const Ikona = kategoria.icon;

  return (
    <m.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <Link
        href={urlPosta(post)}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-white/20"
      >
        {/* Okładka — placeholder ikona, gdy brak coverImage */}
        <div className="flex h-40 w-full items-center justify-center border-b border-white/10 bg-white/[0.03]">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <ImageOff size={28} className="text-white/20" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[11px] font-semibold text-teal-300">
            <Ikona size={12} />
            {kategoria.label}
          </span>

          <h3 className="mt-3 text-lg font-extrabold leading-snug text-white">{post.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{post.excerpt}</p>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/50"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3 text-[11px] text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} />
              {formatujDate(post.date)}
            </span>
            {post.readingMinutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {post.readingMinutes} min czytania
              </span>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Nawigacja stron — strzałki "poprzednia" / "następna" + numerki stron   */
/* ---------------------------------------------------------------------- */
function Paginacja({
  activeCategory,
  szukaj,
  activeTags,
  strona,
  liczbaStron,
}: {
  activeCategory: CategorySlug | null;
  szukaj: string;
  activeTags: string[];
  strona: number;
  liczbaStron: number;
}) {
  if (liczbaStron <= 1) return null;

  const numeryStron = Array.from({ length: liczbaStron }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginacja" className="mt-10 flex items-center justify-center gap-2">
      {strona > 1 ? (
        <Link
          href={urlStrony(activeCategory, szukaj, activeTags, strona - 1)}
          aria-label="Poprzednia strona"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 text-white/20"
        >
          <ChevronLeft size={16} />
        </span>
      )}

      {numeryStron.map((n) => (
        <Link
          key={n}
          href={urlStrony(activeCategory, szukaj, activeTags, n)}
          aria-current={n === strona ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            n === strona
              ? "bg-teal-400/15 text-teal-200 ring-1 ring-inset ring-teal-400/50"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          {n}
        </Link>
      ))}

      {strona < liczbaStron ? (
        <Link
          href={urlStrony(activeCategory, szukaj, activeTags, strona + 1)}
          aria-label="Następna strona"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 text-white/20"
        >
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}

/* ---------------------------------------------------------------------- */
/*  Właściwa zawartość strony — używa useSearchParams, więc MUSI być       */
/*  renderowana wewnątrz <Suspense> (patrz eksport domyślny niżej).        */
/*  Brak tego opakowania powoduje błąd builda:                             */
/*  "useSearchParams() should be wrapped in a suspense boundary".          */
/* ---------------------------------------------------------------------- */
function BlogContent() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const kategoriaParam = searchParams.get("kategoria");
  const activeCategory: CategorySlug | null =
    kategoriaParam && isValidCategory(kategoriaParam) ? kategoriaParam : null;
  const szukaj = searchParams.get("szukaj") ?? "";
  const activeTags = parsujTagiZUrl(searchParams.get("tagi"));

  const postyKategoria = activeCategory ? POSTS.filter((p) => p.meta.category === activeCategory) : POSTS;

  // Dostępne tagi do wyboru — tylko te występujące w aktualnie widocznej
  // (po kategorii) puli postów, posortowane alfabetycznie.
  const dostepneTagi = useMemo(() => {
    const zbior = new Set<string>();
    postyKategoria.forEach((p) => p.meta.tags.forEach((t) => zbior.add(t)));
    return Array.from(zbior).sort((a, b) => a.localeCompare(b, "pl"));
  }, [postyKategoria]);

  // Filtr tagów — post pasuje, jeśli ma CHOCIAŻ JEDEN z zaznaczonych tagów.
  const postyPoTagach =
    activeTags.length > 0
      ? postyKategoria.filter((p) => p.meta.tags.some((t) => activeTags.includes(t)))
      : postyKategoria;

  // Filtr wyszukiwarki — dopasowanie po tytule, zajawce i tagach (bez uwzględniania wielkości liter i diakrytyków).
  const fraza = normalizujTekst(szukaj.trim());
  const postyPrzefiltrowane = fraza
    ? postyPoTagach.filter(({ meta }) => {
        const przeszukiwanyTekst = normalizujTekst(
          [meta.title, meta.excerpt, ...meta.tags].join(" ")
        );
        return przeszukiwanyTekst.includes(fraza);
      })
    : postyPoTagach;

  const postySortowane = [...postyPrzefiltrowane].sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

  // Numer strony z URL, przycięty do sensownego zakresu [1, liczbaStron].
  const liczbaStron = Math.max(1, Math.ceil(postySortowane.length / POSTS_PER_PAGE));
  const stronaParam = Number(searchParams.get("strona"));
  const strona =
    Number.isFinite(stronaParam) && stronaParam >= 1
      ? Math.min(Math.floor(stronaParam), liczbaStron)
      : 1;

  const start = (strona - 1) * POSTS_PER_PAGE;
  const postyNaStronie = postySortowane.slice(start, start + POSTS_PER_PAGE);

  return (
    <LazyMotion features={domAnimation} strict>
      <section style={{ backgroundColor: "#0B2A3D" }} className="min-h-screen py-16 font-sans pt-36">
        <div className="mx-auto max-w-320 px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Breadcrumb activeCategory={activeCategory} />
          </m.div>

          {/* Nagłówek */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="mt-4"
          >
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {activeCategory ? CATEGORIES[activeCategory].label : "Blog"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60 sm:text-base">
              {activeCategory
                ? `Artykuły z kategorii „${CATEGORIES[activeCategory].label}”.`
                : "Poradniki, nowości i praktyczne wskazówki od Netii."}
            </p>
          </m.div>

          {/* Wyszukiwarka */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            className="mt-6"
          >
            <SzukajkaPostow
              activeCategory={activeCategory}
              activeTags={activeTags}
              szukajInitial={szukaj}
              postyDoPrzeszukania={postyPoTagach.map((p) => p.meta)}
              reduceMotion={reduceMotion}
            />
          </m.div>

          {/* Filtr kategorii */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mt-6"
          >
            <FiltrKategorii activeCategory={activeCategory} szukaj={szukaj} activeTags={activeTags} />
          </m.div>

          {/* Filtr tagów */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
            className="mt-4"
          >
            <FiltrTagow
              dostepneTagi={dostepneTagi}
              activeCategory={activeCategory}
              szukaj={szukaj}
              activeTags={activeTags}
            />
          </m.div>

          {/* Siatka postów (maks. POSTS_PER_PAGE na stronę) */}
          {postyNaStronie.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {postyNaStronie.map((post, i) => (
                <KartaPosta key={post.meta.id} post={post.meta} index={i} reduceMotion={reduceMotion} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <p className="text-white/60">
                {fraza || activeTags.length > 0
                  ? "Brak artykułów pasujących do wybranych filtrów."
                  : "Nie ma jeszcze żadnych artykułów w tej kategorii — zajrzyj tu wkrótce."}
              </p>
            </div>
          )}

          {/* Numerki stron + strzałki */}
          <Paginacja
            activeCategory={activeCategory}
            szukaj={szukaj}
            activeTags={activeTags}
            strona={strona}
            liczbaStron={liczbaStron}
          />
        </div>
      </section>
    </LazyMotion>
  );
}

/* ---------------------------------------------------------------------- */
/*  Eksport domyślny strony — opakowuje BlogContent w Suspense, co jest    */
/*  wymagane przez Next.js dla komponentów korzystających z               */
/*  useSearchParams() podczas statycznego prerenderowania.                */
/* ---------------------------------------------------------------------- */
export default function Blog() {
  return (
    <Suspense fallback={null}>
      <BlogContent />
    </Suspense>
  );
}