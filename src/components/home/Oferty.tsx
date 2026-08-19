"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Shield, Clock } from "lucide-react";
import { offers, type Offer } from "@/components/home/Offersdata";
import OfferCard from "@/components/home/Offercard";
import { SzczegolyOferty } from "@/components/home/Promocena";

const InfoModal = dynamic(() => import("@/components/home/Infomodal"), {
  ssr: false,
});

/* ---------------------------------------------------------------------- */
/*  Układ 3-3-1, grupowany po prędkości.                                   */
/*                                                                         */
/*  Rzędy nie są cięte "co trzy karty" — są dzielone po `offer.speed`,      */
/*  co przy obecnych danych daje dokładnie 3 / 3 / 1:                       */
/*    300 Mb/s -> TV XS 30, TV S 40, TV M 55                                */
/*    1 Gb/s   -> TV XS 70, TV M 80, TV L 110                               */
/*    2 Gb/s   -> TV XS 85                                                  */
/*                                                                         */
/*  DLACZEGO PO PRĘDKOŚCI, A NIE NA SZTYWNO 3-3-1:                          */
/*  jeśli dojdzie albo zniknie jedna oferta, sztywny podział rozjedzie się  */
/*  i w jednym rzędzie wylądują dwie różne prędkości. Tu grupy liczą się    */
/*  z danych, więc układ dopasuje się sam (np. po dodaniu 2 Gb/s + TV M     */
/*  ostatni rząd zrobi się dwukartowy i nadal będzie spójny).               */
/*                                                                         */
/*  CO TO DAJE NA TELEFONIE (główny case):                                  */
/*  przy 7 kartach w jednej kolumnie użytkownik przewija ~6 ekranów bez     */
/*  żadnego punktu odniesienia. Nagłówki grup są jedynym sygnałem "to już   */
/*  inna półka cenowa" — bez nich skok z 55 zł na 70 zł wygląda jak         */
/*  podwyżka za nic, a nie jak zmiana z 300 Mb/s na światłowód.             */
/*                                                                         */
/*  OSTATNI RZĄD: pojedyncza karta jest wyśrodkowana (`lg:col-start-2`),    */
/*  nie dosunięta do lewej. Karta samotnie stojąca w lewym rogu wygląda     */
/*  jak błąd renderowania albo jak coś, co się nie doczytało.               */
/*                                                                         */
/*  RESZTA OPTYMALIZACJI MOBILNYCH bez zmian względem poprzedniej wersji:   */
/*  px-4 zamiast px-8, nagłówek 28px, gradient tła wyłączony poniżej sm,    */
/*  overflow-x-hidden jako bezpiecznik, gap-4 na telefonie.                 */
/* ---------------------------------------------------------------------- */

/** Podpisy grup. Klucz = wartość `offer.speed` z Offersdata.ts (musi się
 *  zgadzać co do znaku). Brakujący klucz => fallback na samą prędkość,
 *  więc dodanie nowej prędkości niczego nie wywali, tylko pokaże ją bez
 *  noty. `note` to jednozdaniowa różnica handlowa danej półki. */
const GROUP_META: Record<string, { title: string; note?: string }> = {
  "300 Mb/s": {
    title: "Internet 300 Mb/s",
    note: "Cena zapisana w umowie na 24 miesiące",
  },
  "1 Gb/s": {
    title: "Światłowód 1 Gb/s",
    note: "6 miesięcy za 0 zł",
  },
  "2 Gb/s": {
    title: "Światłowód 2 Gb/s",
    note: "6 miesięcy za 0 zł",
  },
};

/** Grupuje oferty po prędkości, ZACHOWUJĄC kolejność z Offersdata.ts —
 *  kolejność tablicy jest tam świadoma (od najtańszej), więc nie sortujemy
 *  niczego dodatkowo. */
function grupujPoPredkosci(lista: Offer[]): { speed: string; oferty: Offer[] }[] {
  const grupy: { speed: string; oferty: Offer[] }[] = [];
  for (const offer of lista) {
    const ostatnia = grupy[grupy.length - 1];
    if (ostatnia && ostatnia.speed === offer.speed) {
      ostatnia.oferty.push(offer);
    } else {
      grupy.push({ speed: offer.speed, oferty: [offer] });
    }
  }
  return grupy;
}

interface OfertyProps {
  cityLocative?: string;
}

export default function Oferty({ cityLocative }: OfertyProps = {}) {
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);

  const grupy = useMemo(() => grupujPoPredkosci(offers), []);

  return (
    <section
      id="pakiety"
      className="relative w-full overflow-x-hidden scroll-mt-[88px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      style={{ backgroundColor: "#0B2A3D" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-7 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/70 sm:mb-5 sm:px-4 sm:text-xs">
            <Shield size={13} className="shrink-0 text-teal-300" />
            14 dni na rezygnację, zero pytań
          </div>
          <h2 className="text-balance text-[28px] font-extrabold leading-[1.15] text-white sm:text-4xl md:text-5xl">
            {cityLocative ? (
              <>
                Internet w <span className="text-teal-400">{cityLocative}</span>, który nie
                zawodzi.
              </>
            ) : (
              <>
                Wszystkie pakiety, <span className="text-teal-400">żadnych zakładek</span>.
              </>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-slate-400 sm:text-base">
            Od <span className="font-semibold text-white/80">30 zł/mies.</span> do 2 Gb/s — każda
            cena i każdy warunek widoczne od razu.
          </p>
        </div>

        {/* [UKŁAD 3-3-1] Każda grupa = jeden rząd na lg. Poniżej lg grupy
            zamieniają się w podpisane bloki jeden pod drugim — na telefonie
            to jedyna nawigacja po cenniku, jaką ma użytkownik.

            `max-w-6xl` zamiast `max-w-304` na kontenerze wyżej: przy trzech
            kolumnach karty na szerokim ekranie robiły się nienaturalnie
            szerokie, a lista benefitów wisiała w pustce po lewej. */}
        <div className="flex flex-col gap-9 sm:gap-11">
          {grupy.map((grupa) => {
            const meta = GROUP_META[grupa.speed] ?? { title: grupa.speed };
            const pojedyncza = grupa.oferty.length === 1;

            return (
              <div key={grupa.speed}>
                {/* Nagłówek grupy: tytuł + nota o mechanizmie promocji.
                    Kreska po prawej tylko od sm — na telefonie zjadałaby
                    szerokość, a i tak nie ma czego rozdzielać. */}
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                    {meta.title}
                  </h3>
                  {meta.note && (
                    <span className="rounded-full border border-teal-400/25 bg-teal-400/10 px-2.5 py-1 text-[11px] font-semibold leading-none text-teal-300">
                      {meta.note}
                    </span>
                  )}
                  <span aria-hidden className="hidden h-px flex-1 bg-white/10 sm:block" />
                </div>

                {/* Siatka grupy. Telefon: 1 kolumna. sm: 2. lg: 3 — czyli
                    dokładnie rząd na grupę. `sm:pt-3` robi miejsce na
                    pływający badge karty `featured` (poniżej sm badge jest
                    w przepływie karty, więc odstęp niepotrzebny). */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:pt-3 lg:grid-cols-3">
                  {grupa.oferty.map((offer, i) => (
                    <div
                      key={`${offer.speed}-${offer.pkg}`}
                      /* Pojedyncza karta w rzędzie ląduje w środkowej
                         kolumnie zamiast w lewym rogu. Na sm (2 kolumny)
                         wyśrodkowanie nie ma sensu przy jednej karcie, więc
                         dotyczy tylko lg. */
                      className={`h-full ${pojedyncza && i === 0 ? "lg:col-start-2" : ""}`}
                    >
                      <OfferCard offer={offer} onPokazInfo={handlePokazInfo} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* [PILNOŚĆ] Koszt czekania po stronie klienta. */}
        <div className="mx-auto mt-9 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center sm:mt-12 sm:px-6">
          <p className="flex flex-col items-center justify-center gap-2 text-pretty text-sm leading-relaxed text-white/70 sm:flex-row sm:text-[0.9375rem]">
            <Clock size={16} className="shrink-0 text-teal-300" />
            <span>
              Twoja obecna promocja kiedyś się skończy i dowiesz się o tym z faktury,
              nie wcześniej.
            </span>
          </p>
          <p className="mt-2 text-pretty text-xs leading-relaxed text-white/45 sm:text-[13px]">
            Każdy miesiąc zwłoki to jeden rachunek więcej po starej cenie. Sprawdzenie
            adresu zajmuje 3 minuty i do niczego nie zobowiązuje.
          </p>
        </div>

        {/* [WYMÓG PRAWNY] Treść nadal do uzupełnienia — dwa mechanizmy
            promocji obok siebie. Nagłówki grup wyżej mówią teraz wprost,
            który wariant ma darmowe miesiące, a który zapisaną cenę, więc
            regulamin ma z czym korespondować — ale nie zastępuje go. */}
        <SzczegolyOferty>
          Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje
          inna oferta. Prezentowana oferta Netii S.A.: „[NAZWA PROMOCJI]” obowiązuje przy zawarciu
          Umowy na czas określony 24 pełnych Okresów Rozliczeniowych. W pakietach 1 Gb/s i 2 Gb/s
          abonament wynosi 0 zł przez pierwsze 6 [TODO: potwierdź — pełnych Okresów
          Rozliczeniowych; doprecyzuj, czy zwolnienie obejmuje cały abonament wraz z Telewizją,
          czy samą Usługę Internetową], a od 7. do 24. Okresu Rozliczeniowego obowiązuje cena
          wskazana na karcie. W pakietach 300 Mb/s darmowy okres nie przysługuje — cena
          obowiązuje od pierwszego Okresu Rozliczeniowego, a po 24 miesiącach wzrasta do
          [TODO: 60 zł dla TV XS i TV S; uzupełnij kwotę dla TV M] zł. [TODO: warunki rabatów,
          jeśli dotyczą — e-faktura, zgody marketingowe.] Wraz z pierwszą fakturą zostanie
          naliczona opłata aktywacyjna w wysokości [TODO: kwota] zł za Internet [i TODO: kwota zł
          za Telewizję, jeśli dotyczy]. Usługa Internetowa oparta jest na parametrach jakości
          wynikających z maksymalnych parametrów technicznych danej technologii, w jakiej
          świadczona jest Usługa Internetowa lub wynikających z ofertowych ustawień technicznych
          łącza. Parametry świadczenia Usługi Internetowej, w szczególności parametry prędkości
          oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta
          jest ograniczona terytorialnie do zasięgu stacjonarnej sieci [TODO: potwierdź
          technologię] Operatora.
        </SzczegolyOferty>
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
    </section>
  );
}