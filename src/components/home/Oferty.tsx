"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Shield, Gauge } from "lucide-react";
import { offersBySpeed, type SpeedTier } from "@/components/home/Offersdata";
import OfferCard from "@/components/home/Offercard";

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
   więc wyleciał. Zostaje tylko wybór prędkości. */

/* [NOWE] Dodano trzeci wariant prędkości: "300" (obok istniejących "600" i
   "1000"). Toggle przeszedł z 2 na 3 zakładki — patrz sekcja poniżej.
   UWAGA: `SpeedTier` w @/components/home/Offersdata musi zawierać "300",
   a `offersBySpeed["300"]` musi istnieć w danych (patrz przykład w
   Offersdata.example.ts, który dołączam osobno). */

interface OfertyProps {
  cityLocative?: string;
  defaultPredkosc?: SpeedTier;
}

const TABS: { value: SpeedTier; label: string; color: string }[] = [
  { value: "300", label: "300 Mb/s", color: "#00d5be" },
  { value: "600", label: "600 Mb/s", color: "#00be81" },
];

export default function Oferty({ cityLocative, defaultPredkosc = "300" }: OfertyProps = {}) {
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [predkosc, setPredkosc] = useState<SpeedTier>(defaultPredkosc);

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);
  const handleWybierzPredkosc = useCallback((value: SpeedTier) => setPredkosc(value), []);

  const aktywneOferty = useMemo(() => offersBySpeed[predkosc], [predkosc]);
  const aktywnyIndex = TABS.findIndex((t) => t.value === predkosc);
  const aktywnyTab = TABS[aktywnyIndex];

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

      <div className="relative max-w-304 mx-auto">
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
            Internet od <span className="font-semibold text-white/80">30 zł/mies.</span>, z
            monitorowaną prędkością 24/7 i ceną zapisaną w umowie na cały okres.
          </p>

          {/* Toggle prędkości — 2 zakładki: 300 / 600 Mb/s. Guziki wydłużone
              (px-8 zamiast px-4, py-2.5 zamiast py-1.5), kolor aktywnej
              pigułki zmieniony na #00d5be. */}
          <div
            className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-0.5"
            role="tablist"
            aria-label="Wybór prędkości"
          >
            <span
              aria-hidden="true"
              style={{
                background: aktywnyTab?.color ?? "#00d5be",
                width: "calc(50% - 2px)",
                transform: `translateX(calc(${aktywnyIndex} * (100% + 2px)))`,
              }}
              className="absolute inset-y-0.5 left-0.5 rounded-full transition-all"
            />
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={predkosc === tab.value}
                onClick={() => handleWybierzPredkosc(tab.value)}
                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-8 py-1.5 text-xs font-bold sm:text-sm ${
                  predkosc === tab.value ? "text-[#0B2A3D]" : "text-white/70"
                }`}
              >
                <Gauge size={12} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* [SZEROKOŚĆ KART]
            - 300 Mb/s (2 karty) -> narzucona stała szerokość 360px na
              kartę, wyśrodkowane przez flex + justify-center. Karty NIE
              rosną razem z kontenerem — poszerzanie sekcji (max-w-320)
              zwiększa tylko puste marginesy po bokach.
            - 600 Mb/s (3 karty) -> grid 3-kolumnowy, karty dzielą
              szerokość kontenera po równo (jak w Oferty1k.tsx).

            Na mobile (poniżej md) obie ścieżki dają karty na pełną
            szerokość, ułożone jedna pod drugą.

            `items-stretch` + `h-full` w Offercard trzymają równą wysokość
            niezależnie od liczby benefitów. */}
        {aktywneOferty.length === 2 ? (
          <div className="flex flex-wrap justify-center gap-6 items-stretch">
            {aktywneOferty.map((offer) => (
              <div
                key={`${offer.speed}-${offer.pkg}`}
                className="w-full md:w-[360px] md:shrink-0"
              >
                <OfferCard offer={offer} onPokazInfo={handlePokazInfo} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {aktywneOferty.map((offer) => (
              <OfferCard
                key={`${offer.speed}-${offer.pkg}`}
                offer={offer}
                onPokazInfo={handlePokazInfo}
              />
            ))}
          </div>
        )}

        {/* [USUNIĘTE] Blok <SzczegolyOferty> z przypisem prawnym (warunki
            promocji, opłata aktywacyjna, rabaty za e-fakturę i zgody
            marketingowe, wzrost ceny po 24 mies., zasięg sieci).

            UWAGA: dla oferty telekomunikacyjnej te informacje są zwykle
            wymagane przy prezentowaniu ceny promocyjnej — upewnij się, że
            są dostępne gdzie indziej na stronie (np. w stopce albo pod
            linkiem "Szczegóły oferty"), zanim wypuścisz to na produkcję.
            Import `SzczegolyOferty` został usunięty z góry pliku — jeśli
            przywracasz ten blok, dodaj go z powrotem. */}
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
    </section>
  );
}