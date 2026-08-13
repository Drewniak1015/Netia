"use client"

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  Clock,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { trackContact } from "@/lib/meta-track";

/* ------------------------------------------------------------------ */
/*  HERO — [KOPIA] bez animacji wejścia.                                */
/*                                                                      */
/*  POPRAWKI W TEJ WERSJI:                                              */
/*                                                                      */
/*  [1] ALT TEXT — poprzedni opisywał "rodzinę oglądającą film", ale    */
/*      MainHero.avif to split-screen z mężczyzną na wideorozmowie      */
/*      (sfrustrowany po lewej / zadowolony po prawej). Alt niezgodny   */
/*      z obrazem to problem dla czytników ekranu i dla SEO. Opis       */
/*      zaktualizowany do faktycznej zawartości.                        */
/*                                                                      */
/*  [2] "Jedyny dostawca" -> "Dostawca". Twierdzenie o wyłączności to   */
/*      superlatyw, który w razie skargi trzeba udowodnić (UOKiK,       */
/*      ustawa o zwalczaniu nieuczciwej konkurencji). Jeśli macie na    */
/*      to twarde źródło, możecie wrócić do "Jedyny" — ale świadomie.   */
/*                                                                      */
/*  [3] <h2> -> <p>. To zdanie nie jest nagłówkiem sekcji, tylko        */
/*      podtytułem. H2 bez własnej sekcji psuje strukturę dokumentu     */
/*      (outline) i myli czytniki ekranu. Wygląd bez zmian.             */
/*                                                                      */
/*  [4] Mikrocopy "zajmuje 3 minuty, bez zobowiązań" przeniesione       */
/*      BEZPOŚREDNIO pod CTA (było order-7, czyli dwa bloki niżej —     */
/*      za social proof i trust badges). Zdanie zbijające opór przed    */
/*      kliknięciem musi być przy przycisku, nie na końcu sekcji.       */
/*      Nowa kolejność mobile: H1 -> zdjęcie -> podtytuł -> CTA ->      */
/*      mikrocopy -> social proof -> trust badges.                      */
/*                                                                      */
/*  [5] "spokojny wieczór już od 3. dnia po instalacji" -> "...już      */
/*      trzeciego dnia od zamówienia". Poprzednie brzmienie sugerowało, */
/*      że przez pierwsze dwa dni PO instalacji coś nie działa.         */
/*                                                                      */
/*  [6] Usunięty badge "Serwisant w 24h" — dublował statystykę "24h /   */
/*      czas reakcji serwisu" stojącą 30px obok. W jego miejsce         */
/*      "Bez opłaty za router" (informacja, której nigdzie w hero nie   */
/*      było, a jest realnym argumentem zakupowym z kart oferty).       */
/*      UWAGA: jeśli router NIE jest w cenie we wszystkich pakietach,   */
/*      zmień ten tekst — w danych ofert widziałem go przy każdej,      */
/*      ale zweryfikuj przed publikacją.                                */
/*                                                                      */
/*  [7] Trust badges: grid-cols-2 na mobile zamiast 3 (trzeci badge     */
/*      na pełną szerokość). Przy 375px trzy kolumny dawały ~110px na   */
/*      tekst "Umowa online w 5 min" — łamało się brzydko.              */
/*                                                                      */
/*  [8] <Image> dostał `sizes` — bez tego Next serwuje plik liczony     */
/*      względem width=1600 także na mobile. To obraz LCP, więc realna  */
/*      oszczędność transferu.                                          */
/*                                                                      */
/*  NIE ZMIENIAŁEM (wymaga Twojej decyzji — to zmiany w przekazie,      */
/*  nie w implementacji):                                               */
/*   - CTA mówi "Sprawdź dostępność", a prowadzi do konfiguratora       */
/*     oferty. Rozjazd obietnicy z treścią docelową to typowy wyciek    */
/*     konwersji. Albo etykieta "Skonfiguruj ofertę", albo pole adresu  */
/*     jako pierwszy krok konfiguratora.                                */
/*   - Brak ścieżki telefonicznej w hero, mimo że reszta strony mocno   */
/*     pcha "ZADZWOŃ". Wart testu jako drugi, poboczny CTA.             */
/*   - Podtytuł upycha 5 obietnic w jedno zdanie. Przy 44s średniego    */
/*     czasu na "/" (dane z GA4) nikt tego nie doczyta.                 */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden pt-28 font-sans sm:pt-18"
    >
      <DottedBackground variant="dots-fade" focusY="25%" size={24} />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 z-0 h-[34rem] w-[34rem] rounded-full bg-teal-400/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 z-0 h-96 w-96 rounded-full bg-teal-500/5 blur-[100px]"
      />

      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-6 px-5 py-4 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8 lg:px-8 lg:py-20">
        {/* Kolumna tekstowa — na mobile "contents" rozbija ją na pojedyncze
            elementy, które ustawiają się wg order-* w całym gridzie.
            Na lg wraca jako normalna kolumna flex. */}
        <div className="contents text-center lg:flex lg:flex-col lg:text-left">
          {/* H1 — order 1 na mobile */}
          <h1 className="order-1 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:order-none lg:text-5xl xl:text-6xl">
            Przestań sprawdzać, czy internet{" "}
            <span className="text-teal-300">znowu zwolnił</span>.
          </h1>

          {/* [3] Podtytuł — <p>, nie <h2>. Wygląd identyczny, semantyka
              poprawna. Order 3 na mobile (po zdjęciu). */}
          <p className="order-3 mx-auto mt-3 max-w-xl text-base font-normal leading-snug text-white/75 sm:mt-4 sm:text-lg lg:order-none lg:mx-0">
            Dostawca, który{" "}
            <span className="text-teal-300">
              monitoruje Twoje łącze 24/7
            </span>{" "}
            i zapisuje cenę w umowie na stałe, żeby zagwarantować realną
            prędkość, stabilne wideorozmowy i{" "}
            <span className="text-teal-300">
              spokojny wieczór już trzeciego dnia od zamówienia
            </span>
            .
          </p>

          {/* Social proof — order 6 na mobile (po CTA i mikrocopy) */}
          <div className="order-6 mx-auto mt-4 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-6 lg:order-none lg:mx-0">
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <Users size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                2,4 mln
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                obsłużonych klientów
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <ShieldCheck size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                15 lat
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                doświadczenia na rynku
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <Clock size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                24h
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                czas reakcji serwisu
              </span>
            </div>
          </div>

          {/* [6][7] Trust badges — order 7, 2 kolumny na mobile (trzeci
              badge na pełną szerokość), 3 od sm. Badge "Serwisant w 24h"
              usunięty jako duplikat statystyki obok. */}
          <div className="order-7 mx-auto mt-3 grid max-w-xl grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 lg:order-none lg:mx-0">
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Umowa online w 5 min
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <Zap size={14} className="shrink-0 text-teal-300" />
              Bez opłaty za router
            </span>
            <span className="col-span-2 flex items-center justify-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-center text-xs font-semibold text-white/90 sm:col-span-1">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Rezygnacja w 14 dni
            </span>
          </div>
        </div>

        {/* Kolumna wizualna — analogicznie "contents" na mobile */}
        <div className="contents lg:flex lg:flex-col">
          {/* Zdjęcie — order 2 na mobile (zaraz po H1) */}
          <div className="order-2 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 lg:order-none">
            <Image
              src="/images/MainHero.avif"
              /* [1] Alt zgodny z faktyczną zawartością obrazu. */
              alt="Porównanie przed i po: po lewej mężczyzna sfrustrowany zrywającą się wideorozmową, po prawej ten sam mężczyzna na stabilnym połączeniu"
              width={1600}
              height={900}
              priority
              fetchPriority="high"
              /* [8] Bez `sizes` Next liczy rozmiar względem width=1600
                 również na mobile. To obraz LCP — warto zawęzić. */
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </div>

          {/* CTA — order 4 na mobile (po podtytule) */}
          <div className="order-4 mt-6 flex w-full sm:mt-10 lg:order-none">
            <Link
              href="/konfigurator/InternetOrazTelewizja"
              onClick={() => trackContact("hero_konfigurator_button")}
              className="flex min-h-[60px] w-full items-center justify-between gap-4 rounded-2xl bg-teal-500 px-5 py-3 text-black shadow-lg shadow-teal-500/20 outline-none transition-all duration-150 hover:scale-[1.02] hover:shadow-teal-400/30 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10">
                  <Zap size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">Sprawdź dostępność</span>
                  <span className="block text-xs text-black/70">Skonfiguruj ofertę w 3 minuty</span>
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-black/60" />
            </Link>
          </div>

          {/* [4] Mikrocopy — order 5, BEZPOŚREDNIO pod CTA (było order-7,
              czyli za social proof i trust badges). */}
          <div className="order-5 mx-auto mt-2 flex w-fit items-center justify-center sm:mt-3 sm:mx-0 lg:order-none">
            <span className="text-xs font-medium text-white/50 sm:text-sm">
              Sprawdzenie dostępności zajmuje 3 minuty i jest bez zobowiązań,
              oddzwonimy zanim znów o tym zapomnisz.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;