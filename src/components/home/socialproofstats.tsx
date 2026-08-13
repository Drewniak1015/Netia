"use client";

import { Users, Gauge, Wrench, Timer, Truck, Phone, Lock } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";
import { ATTRIBUTION } from "@/lib/guarantees";

/* ---------------------------------------------------------------------- */
/*  Sekcja Social Proof (statystyki) + główne CTA pod nimi.               */
/*  Styl spójny z resztą strony: tło #0B2A3D, te same gradienty w tle,    */
/*  te same karty (border-white/10, bg-[#0d1f31]) co w OfferCard.        */
/*                                                                        */
/*  UWAGA: opłata aktywacyjna (79 zł Internet + 2 zł TV) FAKTYCZNIE       */
/*  istnieje wg regulaminu w SzczegolyOferty — dlatego usunięto stąd      */
/*  jakąkolwiek statystykę sugerującą "0 zł opłat".                       */
/*                                                                        */
/*  Liczby oznaczone "TODO" to placeholdery ilustracyjne — podmień na     */
/*  realne dane przed wdrożeniem. Liczby bez TODO (24h, 14 dni) wynikają  */
/*  wprost z mechaniki oferty.                                            */
/*                                                                        */
/*  [POPRAWKI]:                                                           */
/*  1. "Real Speed, Real Price" przetłumaczone — było jedynym angielskim  */
/*     zdaniem na całej polskiej stronie.                                 */
/*  2. Pigułki pod CTA przestały być duplikatem siatki statystyk wyżej    */
/*     (monitoring/serwisant/14 dni już tam są, słowo w słowo). Zamiast   */
/*     powtarzać, dokładają coś, czego w tej sekcji jeszcze nie było:     */
/*     cenę zapisaną w umowie i sprzęt w cenie — drugi filar oferty,      */
/*     którego ta sekcja wcześniej w ogóle nie dotykała.                  */
/*  3. Kafelek "<4 dni" wycofany — patrz punkt 6 niżej.                   */
/*  4. Kafelek serwisowy powtarzał "24h" dwa razy w jednym kaflu (raz     */
/*     jako wartość, raz w opisie). Opis doprecyzowany do "od zgłoszenia  */
/*     awarii", żeby serwis nie mylił się czytelnikowi z instalacją.      */
/*                                                                        */
/*  5. Kafelek "100% zgłoszonej prędkości" USUNIĘTY. Przy umownej         */
/*     gwarancji 50% (NetiaSocialProof.tsx, jeden scroll dalej) było to    */
/*     twierdzenie nieprawdziwe, nie tylko niespójne — dawało się obalić   */
/*     przez zestawienie dwóch sekcji tej samej strony. W jego miejsce     */
/*     monitoring 24/7: rzecz, którą realnie robimy i której konkurencja   */
/*     nie komunikuje (największa biała plama z researchu).                */
/*  6. Kafelek z terminem montażu przeniesiony z liczby dni na            */
/*     potwierdzenie terminu. Wzór umowy Netii mówi o 21 dniach na        */
/*     aktywację, więc żadna z krążących po stronie liczb (3 dni /        */
/*     następny dzień roboczy / <4 dni / 1-3 dni w FAQ) nie miała         */
/*     pokrycia. Obietnica przeniesiona na to, co kontrolujemy.           */
/*     JEŚLI masz własne dane z realizacji (mediana, n, okres) —          */
/*     wróć do wariantu z liczbą, bo liczba sprawdzalna bije obietnicę.   */
/* ---------------------------------------------------------------------- */

interface Stat {
  icon: typeof Users;
  value: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: "2,4 mln",
    label: "klientów w sieci Netia",
  },
  {
    icon: Gauge,
    value: "24/7",
    label: "monitoring łącza, awarię zgłaszamy, zanim zadzwonisz",
  },
  {
    icon: Wrench,
    value: "24h",
    label: "serwisant na miejscu od zgłoszenia awarii",
  },
  {
    icon: Timer,
    value: "14 dni",
    label: "na rezygnację, zero pytań",
  },
  {
    icon: Truck,
    value: "SMS",
    label: "potwierdzony termin montażu, instalator dzwoni dzień wcześniej",
  },
];

export default function SocialProofStats() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <div className="relative max-w-305 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Zaufało nam już tysiące domów
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Liczby, które stoją za tą obietnicą — nie za sloganem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0d1f31] p-6 text-center hover:border-white/20"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400/15">
                  <Icon className="h-5 w-5 text-teal-300" strokeWidth={2.25} />
                </span>
                {/* text-balance: część wartości jest dłuższa niż jedno słowo
                    i łamie się na dwie linie na wąskich telefonach */}
                <span className="mt-4 text-3xl font-extrabold text-white leading-tight text-balance">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-sm text-slate-300">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* [ATRYBUCJA] Siatka miesza liczby operatorskie (2,4 mln klientów,
            sieć) z obietnicami partnerskimi (serwis, monitoring, 14 dni).
            Bez tej noty czytelnik nie wie, kto za co odpowiada — a to
            jednocześnie kwestia zaufania i odpowiedzialności za własne
            materiały reklamowe. Patrz ATTRIBUTION w lib/guarantees.ts. */}
        <p className="mt-6 text-center text-xs text-slate-400/80">
          {ATTRIBUTION.statsNote}
        </p>

        <div className="mt-12 flex justify-center">
          <a
            href={`tel:${PHONE_HREF}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-600"
          >
            <Phone className="h-5 w-5" />
            SPRAWDŹ DOSTĘPNOŚĆ — {PHONE}
          </a>
        </div>

        {/* Mikro-benefity pod CTA — NIE powtarzają już statystyk z siatki
            wyżej (monitoring/serwisant/14 dni tam już są). Dokładają drugi
            filar oferty (cena + sprzęt), którego ta sekcja wcześniej
            w ogóle nie poruszała. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
            <Lock size={13} className="text-teal-300" />
            Cena zapisana w umowie — bez podwyżek w trakcie jej trwania
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
            <Gauge size={13} className="text-teal-300" />
            Router i dekoder w cenie — bez dokupowania sprzętu
          </span>
        </div>
      </div>
    </section>
  );
}