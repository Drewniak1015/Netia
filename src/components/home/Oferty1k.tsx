"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Wifi, Rocket, Shield } from "lucide-react";
import { offers1gb, offers2gb } from "@/components/home/Oferty1kdata";
import Plan1kCard from "@/components/home/Plan1Card";
import { SzczegolyOferty } from "@/components/home/Promocena";
import DottedBackground from "../ui/DottedBackground";

/* [PODZIAŁ] InfoModal lazy-loadowany osobno, bo jest czysto interaktywny
   i potrzebny tylko po kliknięciu (i).
   UWAGA: dopasuj ścieżkę, jeśli różni się w Twoim projekcie. */
const InfoModal = dynamic(() => import("@/components/home/Infomodal"), {
  ssr: false,
});

type Grupa = "1gb" | "2gb";

/* ---------------------------------------------------------------------- */
/*  Nowa, samodzielna sekcja ofert — NIE zależy od Oferty.tsx.            */
/*  Bez żadnych animacji (brak IntersectionObserver, brak fade/hover).    */
/*  Przełącznik pigułkowy 1:1 jak Podstawa/MAX w Oferty.tsx, zero ramek — */
/*  same karty w gridzie.                                                 */
/*    "1gb" = Internet 1 Gb/s (akcent pink)                               */
/*    "2gb" = Internet 2 Gb/s (akcent orange)                             */
/*                                                                          */
/*  [WZMOCNIONE VALUE — na podstawie beliefes.docx / Avatar_Sheet /        */
/*  Offer_Brief]:                                                          */
/*                                                                          */
/*  1. Dodana pigułka "14 dni na rezygnację, zero pytań" nad nagłówkiem —  */
/*     tej sekcji brakowało tego trust-signalu, mimo że jest w Oferty.tsx. */
/*     To przekonanie #4 z beliefes.docx (switching jest low-risk) —      */
/*     bez niego nawet przekonany klient zawiesza się na "a jeśli się     */
/*     pomylę".                                                            */
/*                                                                          */
/*  2. Nagłówek i podnagłówek przebudowane pod sekwencję przekonań         */
/*     #2 -> #3 z beliefes.docx: najpierw nazwać cynizm wobec "do X Mb/s"  */
/*     i "gwarantowanej ceny" (bo to właśnie ten sceptycyzm ma zniknąć     */
/*     dopiero po pokazaniu mechanizmu), a nie zakładać, że klient już     */
/*     wierzy w monitoring i cenę w umowie tylko dlatego, że to           */
/*     przeczytał. To samo podejście, które działa w Twoim Hero.tsx        */
/*     (linia sceptycyzmu przed obietnicą).                                */
/*                                                                          */
/*  3. "Obie paczki mają to samo" -> "Każda paczka ma tę samą gwarancję"   */
/*     — poprzednia wersja tego zdania brzmiała toporne (już to            */
/*     poprawialiśmy w Oferty.tsx, ta kopia po prostu jeszcze tego nie     */
/*     miała).                                                             */
/*                                                                          */
/*  UWAGA: masz teraz DWIE osobne sekcje ofert w projekcie — Oferty.tsx    */
/*  (600 Mb/s / 1 Gb/s) i Oferty1k.tsx (1 Gb/s / 2 Gb/s). Jeśli obie       */
/*  renderują się na tej samej stronie, sprawdź, czy to celowe.            */
/* ---------------------------------------------------------------------- */
export default function Oferty1k() {
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [grupa, setGrupa] = useState<Grupa>("1gb");

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);
  const handleWybierz1gb = useCallback(() => setGrupa("1gb"), []);
  const handleWybierz2gb = useCallback(() => setGrupa("2gb"), []);

  const aktywneOferty = grupa === "1gb" ? offers1gb : offers2gb;
  const accent = grupa === "1gb" ? "pink" : "orange";

  return (
    <section className="relative w-full py-8 px-8" style={{ backgroundColor: "#0B2A3D" }}>
      <DottedBackground variant="dots-accent" size={22} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(236,72,153,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(251,191,36,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-305 mx-auto">
        <div className="text-center mb-10">
          {/* [NOWE] Trust pill — brakowało jej w tej sekcji, jest w Oferty.tsx.
              Belief #4: switching jest low-risk. */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
            <Shield size={13} className="text-pink-400" />
            14 dni na rezygnację, zero pytań
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Wybierz prędkość.{" "}
            <span className="text-pink-400">Gwarancja zostaje ta sama.</span>
          </h2>

          {/* [PRZEBUDOWANE] Najpierw cynizm (belief #2), potem mechanizm
              (belief #3) — zamiast od razu zakładać wiarę w monitoring
              i cenę w umowie. */}
          <p className="mx-auto mt-4 max-w-xl text-sm italic leading-snug text-white/45 sm:text-base">
            „Do X Mb/s” i „gwarantowana cena” słyszałeś już wszędzie — i wiesz,
            ile są warte po sześciu miesiącach.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
            Każda paczka ma tę samą gwarancję:{" "}
            <span className="font-semibold text-white">monitorowaną prędkość 24/7</span>,{" "}
            <span className="font-semibold text-white">cenę zapisaną w umowie</span>{" "}
            na cały okres i{" "}
            <span className="font-semibold text-white">14 dni na zmianę zdania</span>.
          </p>
          <p className="mt-2 text-sm font-semibold text-white/80">
            Zmienia się tylko liczba na liczniku.
          </p>

          {/* Przełącznik — 1:1 jak Podstawa/MAX w Oferty.tsx, bez animacji */}
          <div
            className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1"
            role="tablist"
            aria-label="Wybór prędkości internetu"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full ${
                grupa === "2gb"
                  ? "translate-x-[calc(100%+8px)] bg-gradient-to-r from-amber-500 to-amber-400"
                  : "translate-x-0 bg-gradient-to-r from-pink-500 to-pink-400"
              }`}
            />
            <button
              type="button"
              role="tab"
              aria-selected={grupa === "1gb"}
              onClick={handleWybierz1gb}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-9 py-2 text-sm font-bold ${
                grupa === "1gb" ? "text-white" : "text-white/70"
              }`}
            >
              <Wifi size={14} className="shrink-0" />
              1 Gb/s
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={grupa === "2gb"}
              onClick={handleWybierz2gb}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-9 py-2 text-sm font-bold ${
                grupa === "2gb" ? "text-[#2b1a05]" : "text-white/70"
              }`}
            >
              <Rocket size={14} className={`shrink-0 ${grupa === "2gb" ? "fill-current" : ""}`} />
              2 Gb/s
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {aktywneOferty.map((offer) => (
            <Plan1kCard
              key={`${offer.speed}-${offer.pkg}`}
              offer={offer}
              accent={accent}
              onPokazInfo={handlePokazInfo}
            />
          ))}
        </div>

        {/* [NOWE] Disclaimer prawny — ten sam wzorzec "Zobacz szczegóły
            oferty" (rozwijane, z hover-podkreśleniem) co w Oferty.tsx.
            Treść dotyczy TYLKO ofert prezentowanych w tej sekcji
            (1 Gb/s / 2 Gb/s), nie kopiuj tego samego bloku dla Oferty.tsx
            (600 Mb/s), bo tam obowiązują inne liczby/nazwy promocji. */}
        <SzczegolyOferty>
          Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje inna oferta.
          Prezentowana oferta Netii S.A.: „Wybierz szybszy Internet 12 mies. 1/2Gb/s (PON, HFC, ETTH)”
          obowiązuje przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy
          jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku
          rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą
          fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję.
          Po 24 miesiącach cena abonamentu wzrasta o 10 zł. Usługa Internetowa oparta jest na parametrach
          jakości wynikających z maksymalnych parametrów technicznych danej technologii, w jakiej świadczona
          jest Usługa Internetowa lub wynikających z ofertowych ustawień technicznych łącza. Parametry
          świadczenia Usługi Internetowej, w szczególności parametry prędkości oraz wpływu innych Usług na
          Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest ograniczona terytorialnie do
          zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.
        </SzczegolyOferty>
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
    </section>
  );
}