"use client";

import { Phone, Shield } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ---------------------------------------------------------------------- */
/*  Sekcja gwarancji — odpowiednik "Money Back Guarantee" ze screena,     */
/*  ale dopasowany do realnej oferty: to nie jest sprzedaż produktu       */
/*  fizycznego, więc gwarancją jest 14 dni na rezygnację bez pytań        */
/*  (to samo, co pigułka w Oferty.tsx i mikro-benefit w SocialProofStats).*/
/*  Adresuje belief #4 z beliefes.docx: "switching jest low-risk".        */
/*                                                                        */
/*  [POPRAWKA] To już 5. miejsce na stronie z tym samym zdaniem "14 dni   */
/*  na rezygnację, zero pytań" (Oferty.tsx, Oferty1k.tsx, SocialProof-    */
/*  Stats, mikrocopy w kartach, PoradnikTechnologie). Nagłówek zostaje —  */
/*  to nazwa gwarancji, ma być rozpoznawalna. Ale body nie powtarza już   */
/*  tego samego zdania jeszcze raz, tylko opisuje SAM PROCES rezygnacji   */
/*  (jeden telefon, zero kar, zero tłumaczenia się) — czegoś, czego       */
/*  nigdzie indziej na stronie nie było. To zamienia gołą deklarację      */
/*  w coś bliższego przekonaniu #3 (mechanizm weryfikowalny, nie tylko    */
/*  głośniejszy), zastosowanemu tym razem do samej gwarancji.             */
/*                                                                        */
/*  Styl spójny z resztą strony: tło #0B2A3D, teal CTA, bez animacji.     */
/* ---------------------------------------------------------------------- */
export default function GuaranteeSection() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <div className="relative max-w-2xl mx-auto text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/15">
          <Shield className="h-7 w-7 text-teal-300" strokeWidth={2} />
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          14 dni na rezygnację, zero pytań
        </h2>
        <p className="mt-4 text-slate-400 text-base">
          Nie musisz się tłumaczyć ani czekać tygodniami na infolinii. Jeden
          telefon w ciągu 14 dni od podpisania umowy — rezygnujesz, nie
          płacisz kar, sprawa zamknięta tego samego dnia. Nie wierz nam na
          słowo: sprawdź internet u siebie, zanim zdecydujesz się na stałe.
        </p>

        <a
          href={`tel:${PHONE_HREF}`}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-600"
        >
          <Phone className="h-5 w-5" />
          SPRAWDŹ DOSTĘPNOŚĆ — {PHONE}
        </a>
      </div>
    </section>
  );
}