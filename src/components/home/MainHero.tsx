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
/*  ZMIANY W TEJ WERSJI:                                                */
/*  1. Kolejność na mobile: H1 -> zdjęcie -> H2 -> CTA -> social proof  */
/*     -> trust badges -> tekst pod CTA (przez "contents" + order-*).   */
/*  2. Mniejsze odstępy pionowe na mobile: py-4 (od sm: wraca py-12),   */
/*     gap-6 (od sm: gap-10), mt-6 przy CTA (od sm: mt-10), oraz        */
/*     drobne cięcia w mt-3/mt-4 dla social proof/trust badges.         */
/*  3. Większy odstęp od góry na mobile przez padding-top: pt-28,       */
/*     od sm: wraca pt-18.                                              */
/*  4. W H2: wyróżnienia "monitoruje Twoje łącze 24/7" i "spokojny      */
/*     wieczór już od 3. dnia po instalacji" zamienione z font-semibold */
/*     na kolor teal-300 (bez pogrubienia).                             */
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

          {/* H2 — order 3 na mobile (po zdjęciu) */}
          <h2 className="order-3 mx-auto mt-3 max-w-xl text-base font-normal leading-snug text-white/75 sm:mt-4 sm:text-lg lg:order-none lg:mx-0">
            Jedyny dostawca, który{" "}
            <span className="text-teal-300">
              monitoruje Twoje łącze 24/7
            </span>{" "}
            i zapisuje cenę w umowie na stałe, żeby zagwarantować realną
            prędkość, stabilne wideorozmowy i{" "}
            <span className="text-teal-300">
              spokojny wieczór już od 3. dnia po instalacji
            </span>
            .
          </h2>

          {/* Social proof — order 5 na mobile (po CTA) */}
          <div className="order-5 mx-auto mt-4 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-6 lg:order-none lg:mx-0">
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

          {/* Trust badges — order 6 na mobile (po social proof) */}
          <div className="order-6 mx-auto mt-3 grid max-w-xl grid-cols-3 gap-2 sm:mt-4 lg:order-none lg:mx-0">
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Umowa online w 5 min
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <Zap size={14} className="shrink-0 text-teal-300" />
              Serwisant w 24h
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-center text-xs font-semibold text-white/90">
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
              alt="Rodzina w salonie ogląda film bez przerywania dzięki stabilnemu połączeniu światłowodowemu"
              width={1600}
              height={900}
              priority
              fetchPriority="high"
              className="h-auto w-full"
            />
          </div>

          {/* CTA — order 4 na mobile (po H2, przed social proof) */}
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

          {/* Tekst pod CTA — order 7, na końcu */}
          <div className="order-7 mx-auto mt-3 flex w-fit items-center justify-center sm:mt-4 sm:mx-0 lg:order-none">
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