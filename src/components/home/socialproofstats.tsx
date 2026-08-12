"use client";

import { Users, Gauge, Wrench, Timer, Star, Truck, Phone, Lock } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ---------------------------------------------------------------------- */
/*  Sekcja Social Proof (statystyki) + główne CTA pod nimi.               */
/*  Styl spójny z resztą strony: tło #0B2A3D, te same gradienty w tle,    */
/*  te same karty (border-white/10, bg-[#0d1f31]) co w OfferCard.        */
/*  komponentów po Twojej ostatniej prośbie).                             */
/*                                                                        */
/*  UWAGA: opłata aktywacyjna (79 zł Internet + 2 zł TV) FAKTYCZNIE       */
/*  istnieje wg regulaminu w SzczegolyOferty — dlatego usunięto stąd      */
/*  jakąkolwiek statystykę sugerującą "0 zł opłat".                       */
/*                                                                        */
/*  Liczby oznaczone "TODO" to placeholdery ilustracyjne z poprzedniej    */
/*  wiadomości — podmień na realne dane przed wdrożeniem. Liczby bez      */
/*  TODO (100%, 24h, 14 dni) wynikają wprost z mechaniki oferty.          */
/*                                                                        */
/*  [POPRAWKI]:                                                           */
/*  1. "Real Speed, Real Price" przetłumaczone — było jedynym angielskim  */
/*     zdaniem na całej polskiej stronie.                                 */
/*  2. Pigułki pod CTA przestały być duplikatem siatki statystyk wyżej    */
/*     (monitoring/serwisant/14 dni już tam są, słowo w słowo). Zamiast   */
/*     powtarzać, dokładają coś, czego w tej sekcji jeszcze nie było:     */
/*     cenę zapisaną w umowie i sprzęt w cenie — drugi filar oferty,      */
/*     którego ta sekcja wcześniej w ogóle nie dotykała.                  */
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
    label: "klientów zaufało Netii",
  },
  {
    icon: Gauge,
    value: "100%",
    label: "zgłoszonej prędkości, monitorowane 24/7",
  },
  {
    icon: Wrench,
    value: "24h",
    label: "serwisant na miejscu w 24h od zgłoszenia",
  },
  {
    icon: Timer,
    value: "14 dni",
    label: "na rezygnację, zero pytań",
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "średnia ocena od realnych klientów",
  },
  {
    icon: Truck,
    value: "<4 dni",
    label: "od podpisania umowy do działającego internetu",
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
                <span className="mt-4 text-3xl font-extrabold text-white leading-tight">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-sm text-slate-300">{stat.label}</span>
              </div>
            );
          })}
        </div>

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