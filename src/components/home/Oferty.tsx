"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Shield, Gauge } from "lucide-react";
import { offersBySpeed, type SpeedTier } from "@/components/home/Offersdata";
import OfferCard from "@/components/home/Offercard";
import { SzczegolyOferty } from "@/components/home/Promocena";

/* [PODZIAŁ] InfoModal (i cały jego duży zestaw danych INFO_ITEMS) trafia
   do osobnego chunku, pobieranego dopiero po kliknięciu w pozycję z
   `infoId`. `ssr: false`, bo modal jest czysto interaktywny.

   UWAGA: dopasuj tę ścieżkę do faktycznej lokalizacji pliku InfoModal w
   Twoim projekcie (@/components/home/...), jeśli różni się od poniższej —
   nie mam wglądu w Twoją rzeczywistą strukturę folderów dla tego pliku. */
const InfoModal = dynamic(() => import("@/components/home/Infomodal"), {
  ssr: false,
});

/* [BEZ ANIMACJI] Usunięto IntersectionObserver/useInView i cały system
   reveal-on-scroll (@keyframes, klasy .oferty-reveal/.oferty-panel).
   Sekcja renderuje się od razu w finalnym stanie, przełącznik zakładek
   przeskakuje natychmiast (bez fade/slide). */

/* [USUNIĘTE] Cały tryb "MAX" (state `tryb`, MaxOfferCard, maxOffers,
   przełącznik Podstawa/MAX, drugi SzczegolyOferty dla MAX) — nieużywany,
   więc wyleciał. Zostaje tylko wybór prędkości 600 Mb/s / 1 Gb/s. */

interface OfertyProps {
  cityLocative?: string;
  defaultPredkosc?: SpeedTier;
}

export default function Oferty({ cityLocative, defaultPredkosc = "600" }: OfertyProps = {}) {
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [predkosc, setPredkosc] = useState<SpeedTier>(defaultPredkosc);

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);
  const handleWybierz600 = useCallback(() => setPredkosc("600"), []);
  const handleWybierz1000 = useCallback(() => setPredkosc("1000"), []);

  const aktywneOferty = useMemo(() => offersBySpeed[predkosc], [predkosc]);

  return (
    <section className="relative w-full py-8 px-8" style={{ backgroundColor: "#0B2A3D" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-305 mx-auto">
        <div className="text-center mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
            <Shield size={13} className="text-teal-300" />
            14 dni na rezygnację, zero pytań
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            {cityLocative ? (
              <>
                Internet w <span className="text-teal-400">{cityLocative}</span>, który nie
                zawodzi.
              </>
            ) : (
              <>
                Wybierz swoją prędkość,{" "}
                <span className="text-teal-400">jedna decyzja</span>.
              </>
            )}
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Internet od <span className="font-semibold text-white/80">55 zł/mies.</span>, z
            monitorowaną prędkością 24/7 i ceną zapisaną w umowie na cały okres.
          </p>

          {/* Toggle prędkości — chudszy wariant: mniejszy padding pionowy,
              cieńszy pasek i mniejszy tekst niż poprzednio */}
          <div
            className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-0.5"
            role="tablist"
            aria-label="Wybór prędkości"
          >
            <span
              aria-hidden="true"
              style={{
                background:
                  predkosc === "1000"
                    ? "#fb64b6"
                    : "#00be81",
              }}
              className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-all ${
                predkosc === "1000" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              role="tab"
              aria-selected={predkosc === "600"}
              onClick={handleWybierz600}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold sm:text-sm ${
                predkosc === "600" ? "text-[#0B2A3D]" : "text-white/70"
              }`}
            >
              <Gauge size={12} />
              600 Mb/s
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={predkosc === "1000"}
              onClick={handleWybierz1000}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold sm:text-sm ${
                predkosc === "1000" ? "text-[#0B2A3D]" : "text-white/70"
              }`}
            >
              <Gauge size={12} />
              1 Gb/s
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {aktywneOferty.map((offer) => (
            <OfferCard
              key={`${offer.speed}-${offer.pkg}`}
              offer={offer}
              onPokazInfo={handlePokazInfo}
            />
          ))}
        </div>

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