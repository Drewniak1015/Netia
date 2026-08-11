"use client";

import { PhoneCall, Users, FileCheck, Headset, Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";
import DottedBackground from "../ui/DottedBackground";

/* ---------------------------------------------------------------------- */
/*  Value Prop #3 ("WIIFM") — druga wersja, inny kąt niż poprzednia.       */
/*  Oparta na insighcie z Avatar_Sheet: "This audience buys peace of      */
/*  mind, not megabits" oraz na realnych frustracjach z badania:          */
/*    - stres przed ważnym callem, gdy łącze może zawieść                 */
/*    - kłótnie w domu, gdy kilka osób jest online naraz                  */
/*    - strach przed niejasnymi warunkami cenowymi (belief #2/#3)         */
/*    - support dający sprzeczne informacje (pain point z avatara)        */
/*                                                                        */
/*  Styl spójny z resztą strony (tło #0B2A3D, karty #0d1f31, akcent teal),*/
/*  bez animacji, zgodnie z wcześniejszymi ustaleniami.                   */
/*                                                                        */
/*  [POPRAWKA] Czwarty benefit (wsparcie) wcześniej był jedyną pozycją    */
/*  w gridzie bez żadnego sprawdzalnego dowodu — sama deklaracja          */
/*  "słucha za pierwszym razem", nic pod spodem. Trzy pozostałe benefity  */
/*  mają twardy mechanizm (monitoring 24/7, cena w umowie). Podmienione   */
/*  na konkretny, już istniejący na stronie fakt: "oddzwaniamy w 3        */
/*  minuty" (ten sam co w Hero.tsx i mikrocopy pod CTA w kartach ofert),  */
/*  żeby żaden z czterech kwadratów nie był głośniejszą obietnicą bez     */
/*  pokrycia — dokładnie to, przed czym ostrzega beliefes.docx w          */
/*  przekonaniu #3.                                                       */
/*                                                                        */
/*  UWAGA: <img src="/images/value-prop-3.jpg" .../> to placeholder —     */
/*  podmień na docelową ścieżkę. Prompt do zdjęcia AI jest pod kodem.     */
/* ---------------------------------------------------------------------- */

interface Benefit {
  icon: typeof PhoneCall;
  headline: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: PhoneCall,
    headline: "Bez stresu przed ważnym callem",
    description: "Stabilne łącze, które nie zawiedzie akurat wtedy, gdy najbardziej Ci zależy.",
  },
  {
    icon: Users,
    headline: "Koniec kłótni o bufor",
    description: "Dzieciaki oglądają, Ty pracujesz — kilka osób online naraz i wszystko działa.",
  },
  {
    icon: FileCheck,
    headline: "Cena zapisana w umowie, nie w gwiazdce",
    description: "Wiesz dokładnie, ile zapłacisz, zanim podpiszesz — bez podchwytliwych warunków.",
  },
  {
    icon: Headset,
    headline: "Ten sam numer, ten sam człowiek",
    description: "Oddzwaniamy w 3 minuty, bez przekierowań między działami — nie tłumaczysz tego samego problemu od nowa.",
  },
];

export default function ValueProp3() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <DottedBackground variant="dots-accent" size={22} />
      <div className="relative max-w-305 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Lewa kolumna: tekst + benefity + CTA */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Nie sprzedajemy megabitów. <span className="text-teal-400">Sprzedajemy spokój głowy.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Prawdziwa wartość internetu to nie liczba na wykresie — to pewność,
            że zadziała dokładnie wtedy, gdy najbardziej Ci na tym zależy.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.headline}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400/15">
                    <Icon className="h-5 w-5 text-teal-300" strokeWidth={2.25} />
                  </span>
                  <p className="mt-3 text-base font-bold text-white">{benefit.headline}</p>
                  <p className="mt-1 text-sm text-slate-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          <a
            href={`tel:${PHONE_HREF}`}
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 text-sm font-bold text-white hover:bg-teal-600"
          >
            <Phone className="h-4 w-4" />
            SPRAWDŹ DOSTĘPNOŚĆ — {PHONE}
          </a>
        </div>

        {/* Prawa kolumna: zdjęcie/wideo — patrz prompt AI w wiadomości pod kodem */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d1f31]">
          <img
            src="/images/value-prop-3.webp"
            alt="Spokojny wieczór w domu z działającym internetem — rodzina online razem, bez stresu"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}