"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ChevronLeft, Calendar, Clock, Tag, ImageOff, Home, Search, X } from "lucide-react";
import { CATEGORY_LIST, CATEGORIES, type CategorySlug } from "@/lib/blog/categories";
import type { BlogPostMeta } from "@/lib/blog/types";
import { urlPosta } from "@/app/blog/url";
import { normalizujTekst, urlStrony, formatujDate, MOJA_NETIA_HOME } from "@/app/blog/Bloghelpers";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
/*  Filtr tagów — sztywny układ 3 kolumn (grid):                          */
/*  [1] etykieta "Tagi"  [2] wyszukiwarka + combobox (stała szerokość,     */
/*  zawsze w tym samym miejscu)  [3] wybrane tagi, lecące dalej w prawo.   */
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
  const router = useRouter();
  const [szukajTagu, setSzukajTagu] = useState("");
  const [otwarte, setOtwarte] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Zamknij panel przy kliknięciu poza nim.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOtwarte(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (dostepneTagi.length === 0) return null;

  const fraza = normalizujTekst(szukajTagu.trim());
  const wyswietlaneTagi = fraza
    ? dostepneTagi.filter((tag) => normalizujTekst(tag).includes(fraza))
    : dostepneTagi;

  function przelaczTag(tag: string) {
    const noweTagi = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    router.push(urlStrony(activeCategory, szukaj, noweTagi, 1), { scroll: false });
  }

  return (
    <div className="grid grid-cols-[auto_14rem_1fr] items-start gap-4">
      {/* Kolumna 1: etykieta */}
      <span className="mt-2 inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/35">
        <Tag size={12} />
        Tagi:
      </span>

      {/* Kolumna 2: wyszukiwarka + combobox — szerokość stała (14rem),       */}
      {/* nigdy się nie rusza niezależnie od tego, co dzieje się w kolumnie 3 */}
      <div ref={wrapperRef} className="relative w-56">
        <div className="relative">
          <Search
            size={12}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={szukajTagu}
            onChange={(e) => setSzukajTagu(e.target.value)}
            onFocus={() => setOtwarte(true)}
            placeholder="Szukaj tagu…"
            aria-label="Szukaj i wybierz tag"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-7 pr-6 text-xs text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-400/50 focus:bg-white/[0.07]"
          />
          {szukajTagu && (
            <button
              type="button"
              onClick={() => setSzukajTagu("")}
              aria-label="Wyczyść wyszukiwanie tagu"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/70"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {otwarte && (
          <div className="absolute left-0 top-full z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#0B2A3D] shadow-lg shadow-black/30">
            {wyswietlaneTagi.length > 0 ? (
              <ul className="py-1">
                {wyswietlaneTagi.map((tag) => {
                  const active = activeTags.includes(tag);
                  return (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => przelaczTag(tag)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                          active
                            ? "bg-teal-400/15 text-teal-200"
                            : "text-white/65 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Tag size={11} />
                          {tag}
                        </span>
                        {active && <X size={11} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-3 py-3 text-xs text-white/35">
                Brak tagów pasujących do „{szukajTagu}”.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Kolumna 3: wybrane tagi — lecą tu dalej w prawo (i zawijają się     */}
      {/* niżej, gdy jest ich dużo), nie wpływając na kolumnę 2 obok.         */}
      <div className="flex min-h-[2.25rem] flex-wrap items-center gap-1.5 pt-0.5">
        {activeTags.length > 0 ? (
          activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => przelaczTag(tag)}
              className="inline-flex items-center gap-1 rounded-full border border-teal-400/50 bg-teal-400/15 px-2.5 py-1 text-[11px] font-medium text-teal-200 transition-colors hover:bg-teal-400/25"
            >
              {tag}
              <X size={10} />
            </button>
          ))
        ) : (
          <span className="text-[11px] text-white/25">Brak wybranych tagów</span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Wyszukiwarka postów — filtruje po tytule, zajawce i tagach.            */
/*  Wpisany tekst trafia do URL (?szukaj=...) z małym debounce, żeby nie   */
/*  przepisywać historii przeglądarki przy każdym naciśnięciu klawisza.    */
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
          placeholder="Szukaj po tytule, opisie"
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
function KartaPosta({
  post,
  index,
  reduceMotion,
}: {
  post: BlogPostMeta;
  index: number;
  reduceMotion: boolean | null;
}) {
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
/*  Właściwa zawartość strony — dostaje WSZYSTKO jako propsy z page.tsx    */
/*  (Server Component). Nie wywołuje useSearchParams() ani żadnego innego  */
/*  hooka wymagającego Suspense — więc renderuje się od razu, bez         */
/*  żadnego opóźnienia czy CSR-bail.                                       */
/* ---------------------------------------------------------------------- */
interface BlogContentProps {
  activeCategory: CategorySlug | null;
  szukaj: string;
  activeTags: string[];
  dostepneTagi: string[];
  postyPoTagachMeta: BlogPostMeta[];
  postyNaStronie: BlogPostMeta[];
  strona: number;
  liczbaStron: number;
}

export default function BlogContent({
  activeCategory,
  szukaj,
  activeTags,
  dostepneTagi,
  postyPoTagachMeta,
  postyNaStronie,
  strona,
  liczbaStron,
}: BlogContentProps) {
  const reduceMotion = useReducedMotion();

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
              postyDoPrzeszukania={postyPoTagachMeta}
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
                <KartaPosta key={post.id} post={post} index={i} reduceMotion={reduceMotion} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <p className="text-white/60">
                {szukaj || activeTags.length > 0
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