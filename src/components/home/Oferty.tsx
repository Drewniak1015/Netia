"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Shield, Gauge, Clock } from "lucide-react";
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
   więc wyleciał. Zostaje tylko wybór prędkości. */

/* ---------------------------------------------------------------------- */
/*  [NOWE] ELEMENT PILNOŚCI                                                */
/*                                                                         */
/*  Research wymienia brak pilności jako jedną z pięciu barier konwersji,   */
/*  ale klasyczny mechanizm ("promocja tylko do końca miesiąca") jest tu    */
/*  niedostępny i niewskazany:                                             */
/*                                                                         */
/*   (a) nie mamy potwierdzonej daty wygaśnięcia promocji,                 */
/*   (b) strona krytykuje operatorów za promocje z ukrytym terminem, więc  */
/*       fałszywy licznik zniszczyłby jedyną przewagę tej oferty w jedną   */
/*       sekundę u każdego, kto odświeży stronę i zobaczy zegar od nowa.   */
/*       A sceptyk to nasz główny segment — on to zrobi.                   */
/*                                                                         */
/*  Zamiast tego: koszt czekania jest po stronie KLIENTA, nie po naszej.   */
/*  Nie twierdzimy nic o sobie ("nasza oferta zniknie"), tylko opisujemy   */
/*  jego sytuację, która pogarsza się sama: promocja u obecnego operatora  */
/*  wygasa, umowa przedłuża się automatycznie, cena rośnie przez           */
/*  waloryzację. To Promo-Cliff z Offer_Brief obrócony przeciwko           */
/*  konkurencji, czyli ten sam mechanizm, na którym stoi cała oferta.      */
/*  Zero ryzyka prawnego, bo każde zdanie dotyczy rynku, nie nas.          */
/*                                                                         */
/*  DLACZEGO POD CENNIKIEM: to jedyne miejsce na stronie, gdzie klient ma  */
/*  przed oczami dwie kwoty naraz — swoją i naszą. Zdanie o rachunku po    */
/*  starej cenie działa tylko wtedy, gdy jest co porównać.                 */
/*                                                                         */
/*  JEŚLI regulamin promocji (SzczegolyOferty) zawiera datę "oferta        */
/*  obowiązuje do…", podmień to na zwykłe "Promocja obowiązuje dla umów    */
/*  podpisanych do [data]". Prawdziwy termin jest mocniejszy niż wszystko  */
/*  poniżej i nic nie kosztuje, bo to przepisanie dokumentu, który klient  */
/*  i tak dostaje.                                                         */
/* ---------------------------------------------------------------------- */

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

        {/* [NOWE] Pilność oparta na koszcie czekania po stronie klienta.
            Patrz obszerny komentarz na górze pliku — kluczowe: żadne z tych
            zdań nie twierdzi niczego o naszej ofercie, więc nie da się go
            podważyć odświeżeniem strony. */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center sm:px-6">
          <p className="flex flex-col items-center justify-center gap-2 text-sm text-white/70 sm:flex-row sm:text-[0.9375rem]">
            <Clock size={16} className="shrink-0 text-teal-300" />
            <span>
              Twoja obecna promocja kiedyś się skończy i dowiesz się o tym z faktury,
              nie wcześniej.
            </span>
          </p>
          <p className="mt-2 text-xs text-white/45 sm:text-[13px]">
            Każdy miesiąc zwłoki to jeden rachunek więcej po starej cenie. Sprawdzenie
            adresu zajmuje 3 minuty i do niczego nie zobowiązuje.
          </p>
        </div>

        {/* [PRZYWRÓCONE] Blok SzczegolyOferty — wymagany prawnie przy
            prezentowaniu ceny promocyjnej (art. 5 ustawy o
            przeciwdziałaniu nieuczciwym praktykom rynkowym).

            UWAGA — TO NIE JEST GOTOWA TREŚĆ. Wzorowałem strukturę na
            bloku z Oferty1k.tsx, ale NIE skopiowałem stamtąd liczb ani
            nazwy promocji 1:1, bo:
              - ta oferta dotyczy 300/600 Mb/s, nie "1/2 Gb/s" — nazwa
                promocji musi być inna i musi być prawdziwa,
              - z Offersdata.ts wynika, że 300 Mb/s ma INNY mechanizm
                (noFreeMonths: true, priceAfter24) niż 1k/2k (rabaty za
                e-fakturę/zgody marketingowe), a 600 Mb/s ma jeszcze
                inny (promoMonths: 3, czyli najpewniej miesiące gratis).
              - wpisanie tu kwot z oferty 1k/2k byłoby nieprawdziwe i
                tworzyłoby dokładnie to ryzyko prawne, któremu ten blok
                ma zapobiegać.

            WSTAW przed wdrożeniem, osobno dla 300 i dla 600 — realne
            dane z regulaminu/warunków promocji (ten sam dokument, z
            którego ktoś wziął treść dla Oferty1k.tsx, ale dla wariantu
            300/600, nie 1/2 Gb/s):
              [NAZWA PROMOCJI 300/600]
              [KWOTA OPŁATY AKTYWACYJNEJ — Internet / TV]
              [WARUNKI RABATÓW, jeśli dotyczą tego wariantu — e-faktura,
               zgody marketingowe, kwota wzrostu przy rezygnacji z nich]
              [KWOTA WZROSTU CENY PO 24 MIESIĄCACH — osobno dla 300 i 600,
               bo Offersdata.ts pokazuje różne priceAfter24 dla wariantów
               XS/M w 300 Mb/s]
              [ZASIĘG TERYTORIALNY — jeśli inny niż PON/HFC/ETTH z 1k/2k] */}
        <SzczegolyOferty>
          Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje
          inna oferta. Prezentowana oferta Netii S.A.: „[NAZWA PROMOCJI — Internet 300/600 Mb/s]”
          obowiązuje przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych.
          [TODO: warunki rabatów właściwe dla tego wariantu — jeśli 300/600 Mb/s nie korzysta z
          rabatów za e-fakturę i zgody marketingowe tak jak oferta 1/2 Gb/s, usuń to zdanie i opisz
          faktyczny mechanizm zgodny z polami `noFreeMonths` / `priceAfter24` / `promoMonths` z
          Offersdata.ts]. Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w wysokości
          [TODO: kwota] zł za Internet [i TODO: kwota zł za Telewizję, jeśli dotyczy]. Po 24
          miesiącach cena abonamentu wzrasta o [TODO: kwota] zł. Usługa Internetowa oparta jest na
          parametrach jakości wynikających z maksymalnych parametrów technicznych danej technologii,
          w jakiej świadczona jest Usługa Internetowa lub wynikających z ofertowych ustawień
          technicznych łącza. Parametry świadczenia Usługi Internetowej, w szczególności parametry
          prędkości oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie netia.pl.
          Oferta jest ograniczona terytorialnie do zasięgu stacjonarnej sieci [TODO: potwierdź
          technologię — PON/HFC/ETTH czy inna] Operatora.
        </SzczegolyOferty>
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
    </section>
  );
}