"use client";

import { Phone, MonitorSmartphone, PhoneCall, SearchCheck, Wrench } from "lucide-react";
import { INSTALL_TIMING, SERVICE_SLA } from "@/lib/guarantees";

type Step = {
  number: string;
  title: string;
  description: string;
  Icon: React.ElementType;
};

/* KROK 1 — opis mówił wyłącznie o telefonie i SMS-ie, mimo że główny
   przycisk pod sekcją to "Skonfiguruj online". Ścieżka online jest teraz
   wymieniona jako pierwsza, żeby etykieta przycisku nie zaprzeczała
   opisowi kroku.

   KROK 3 — usunięte "nawet następnego dnia roboczego". Dwa powody:
   (a) "nawet" to ta sama konstrukcja co "do X Mb/s", którą strona
   krytykuje w sekcji porównawczej, więc podważała własny przekaz;
   (b) wzór umowy Netii mówi o aktywacji w terminie 21 dni od podpisania,
   więc obietnica jednego dnia nie miała pokrycia w dokumencie, który
   klient podpisuje. Obietnica przeniesiona na kontrolę nad terminem.
   Serwis to osobna, ROZŁĄCZNA obietnica: 24 h od zgłoszenia awarii.
   Brzmienie obu pochodzi z lib/guarantees.ts — nie wpisuj go tutaj. */
const steps: Step[] = [
  {
    number: "1",
    title: "Skontaktuj się z nami",
    description:
      "Skonfiguruj ofertę online albo zadzwoń, a resztą się zajmiemy. Zamówisz pakiet Internet Netia w kilka chwil.",
    Icon: PhoneCall,
  },
  {
    number: "2",
    title: "Sprawdzimy dostępność",
    description:
      "Weryfikujemy technologię i dostępne prędkości Internetu Netia pod Twoim adresem.",
    Icon: SearchCheck,
  },
  {
    number: "3",
    title: "Instalacja i aktywacja",
    description:
      `${INSTALL_TIMING.short} A jeśli coś się zepsuje, ${SERVICE_SLA.short.charAt(0).toLowerCase()}${SERVICE_SLA.short.slice(1)}`,
    Icon: Wrench,
  },
];

/* [KOPIA] Ten sam wzorzec trackingu co w Hero.tsx / Oferty.tsx —
   odpalanie zdarzenia Meta Pixel "Contact" przy kliknięciu w link telefonu. */
function trackContact(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Contact", { content_name: contentName });
  }
}

/* [KOPIA] Bez framer-motion — LazyMotion/m/variants/whileHover/whileTap
   usunięte. Sekcja renderuje się od razu w pełnej formie, hover na
   przyciskach i krążkach zostaje jako czyste Tailwind (transition/hover). */
export default function HowToOrderSection() {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto max-w-320 px-5 py-16 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Jak zamówić <span className="text-teal-300">Internet Netia</span>?
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base">
            Zamówienie Internetu Netia jest proste — wystarczą 3 kroki
          </p>
        </div>

        {/* Kroki */}
        <div className="relative mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6">
          {/* linia łącząca kropki — tylko od sm w górę */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t-2 border-dashed border-teal-400/40 sm:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* krążek z ikoną jako głównym elementem */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white ring-4 ring-[#0B2A3D] transition-transform duration-200 ease-out hover:scale-105">
                <step.Icon size={26} strokeWidth={2.25} />
              </div>
              {/* numerek kroku pod ikoną */}
              <span className="relative z-10 mt-3 text-xs font-bold uppercase tracking-wide text-teal-300">
                Krok {step.number}
              </span>
              <h3 className="relative z-10 mt-1 text-base font-bold text-white sm:text-lg">
                {step.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-[240px] text-sm text-white/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="tel:+48887843260"
            onClick={() => trackContact("how_to_order_phone_button")}
            className="flex items-center justify-center gap-2 rounded-xl border border-teal-400/40 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-all duration-150 hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98]"
          >
            <Phone size={18} className="text-teal-300" />
            Skontaktuj się
          </a>
          <a
            href="/konfigurator"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition-all duration-150 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
          >
            <MonitorSmartphone size={18} />
            Skonfiguruj online
          </a>
        </div>
      </div>
    </section>
  );
}