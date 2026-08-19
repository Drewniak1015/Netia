"use client";

import { Phone, MessageCircle, PhoneCall, SearchCheck, Wrench } from "lucide-react";
import { INSTALL_TIMING, SERVICE_SLA } from "@/lib/guarantees";
import { trackContact } from "@/lib/meta-track";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

type Step = {
  number: string;
  title: string;
  description: string;
  Icon: React.ElementType;
};

/* ---------------------------------------------------------------------- */
/*  [ONE PAGE] Ta sekcja obsługuje JEDNĄ pozycję z Headera:                */
/*    • id="jak-zamowic" na <section> — kroki zamawiania.                  */
/*  scroll-mt-[96px] zgodne ze stałą SCROLL_OFFSET w Headerze; zmieniasz   */
/*  wysokość paska — zmień oba miejsca razem.                              */
/*                                                                         */
/*  Kotwica "Kontakt" NIE jest tutaj. Prowadzi do ContactSection na dole   */
/*  strony, czyli do finalnego CTA z pełnym domknięciem (recap gwarancji,  */
/*  14 dni na odstąpienie). Blok z przyciskami poniżej to skrót dla kogoś, */
/*  kto jest gotowy już po przeczytaniu trzech kroków — nie cel nawigacji. */
/*                                                                         */
/*  [USUNIĘTE] Przycisk "Skonfiguruj online" -> /konfigurator. Ta podstrona */
/*  na one-page nie istnieje, więc główny, wyróżniony kolorem przycisk     */
/*  sekcji prowadziłby na 404. W jego miejsce SMS — ta sama para CTA co w  */
/*  Hero i na kartach ofert, więc cała strona mówi jednym głosem.          */
/*                                                                         */
/*  [KROK 1] Opis przepisany razem z przyciskami. Poprzedni zaczynał się   */
/*  od "Skonfiguruj ofertę online", żeby nie zaprzeczać etykiecie          */
/*  przycisku — skoro przycisku nie ma, opis wraca do tego, co faktycznie  */
/*  się dzieje: dzwonisz albo piszesz SMS z adresem.                       */
/*                                                                         */
/*  [KROK 3] Bez zmian: obietnica dotyczy KONTROLI nad terminem montażu,   */
/*  nie liczby dni (wzór umowy mówi o aktywacji w terminie 21 dni od       */
/*  podpisania). Serwis to osobna, rozłączna obietnica — 24 h od           */
/*  zgłoszenia. Brzmienie obu pochodzi z lib/guarantees.ts, nie wpisuj go  */
/*  tutaj na sztywno.                                                      */
/*                                                                         */
/*  [TRACKING] Lokalna kopia funkcji trackContact usunięta na rzecz        */
/*  importu z @/lib/meta-track — tak jak w Hero, Headerze i kartach ofert. */
/*  Dwie implementacje tego samego zdarzenia to dwa miejsca, w których     */
/*  trzeba pamiętać o zmianie przy modyfikacji pixela.                     */
/*                                                                         */
/*  [NUMER] PHONE / PHONE_HREF z Offersdata.ts zamiast wpisanego w href.   */
/*  W tym projekcie numery już raz się rozjechały między sekcjami.         */
/* ---------------------------------------------------------------------- */

const SMS_ADRES = encodeURIComponent(
  "Proszę o sprawdzenie dostępności usług pod adresem: "
);

const steps: Step[] = [
  {
    number: "1",
    title: "Zadzwoń lub napisz",
    description:
      "Zadzwoń albo wyślij SMS z adresem. Nie musisz nic wypełniać ani zakładać konta.",
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
    description: `${INSTALL_TIMING.short} A jeśli coś się zepsuje, ${SERVICE_SLA.short
      .charAt(0)
      .toLowerCase()}${SERVICE_SLA.short.slice(1)}`,
    Icon: Wrench,
  },
];

export default function HowToOrderSection() {
  return (
    <section
      id="jak-zamowic"
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden scroll-mt-[96px] font-sans"
    >
      <div className="relative z-10 mx-auto max-w-320 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Nagłówek */}
        <div className="text-center">
          <h2 className="text-balance text-[26px] font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Jak zamówić <span className="text-teal-300">Internet Netia</span>?
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-pretty text-[0.9375rem] font-normal text-white/65 sm:text-base">
            Zamówienie Internetu Netia jest proste — wystarczą 3 kroki
          </p>
        </div>

        {/* Kroki. Na telefonie gap-10 zamiast gap-12: trzy kroki jeden pod
            drugim to i tak prawie cały ekran, każdy odstęp się liczy. */}
        <div className="relative mt-10 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t-2 border-dashed border-teal-400/40 sm:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white ring-4 ring-[#0B2A3D] transition-transform duration-200 ease-out sm:hover:scale-105">
                <step.Icon size={26} strokeWidth={2.25} />
              </div>
              <span className="relative z-10 mt-3 text-xs font-bold uppercase tracking-wide text-teal-300">
                Krok {step.number}
              </span>
              <h3 className="relative z-10 mt-1 text-base font-bold text-white sm:text-lg">
                {step.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-[260px] text-pretty text-sm leading-relaxed text-white/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* [BEZ KOTWICY] Ten blok NIE ma już `id="kontakt"` — kotwica z
            Headera prowadzi do ContactSection na dole strony, czyli do
            finalnego CTA. Dwa elementy z tym samym id to niepoprawny HTML,
            a przeglądarka skakałaby do pierwszego, czyli tutaj: w środek
            strony, z pominięciem całego domknięcia.

            Przyciski zostają, bo człowiek gotowy po przeczytaniu trzech
            kroków nie powinien musieć scrollować dalej, żeby zadzwonić.
            Zmieniony jest tylko nagłówek — dwa razy "Kontakt" na jednej
            stronie kazałoby się zastanawiać, który jest tym właściwym. */}
        <div className="mt-12 sm:mt-14">
          <h3 className="text-center text-lg font-extrabold text-white sm:text-xl">
            Zacznij od telefonu
          </h3>
          <p className="mx-auto mt-2 max-w-md text-center text-pretty text-[0.9375rem] leading-relaxed text-white/65">
            Odbieramy w godzinach 8:00–20:00. Jeśli wolisz SMS — napisz adres,
            oddzwonimy z konkretną odpowiedzią.
          </p>

          <div className="mx-auto mt-5 flex max-w-2xl flex-col gap-2.5 sm:flex-row">
            <a
              href={`tel:${PHONE_HREF}`}
              onClick={() => trackContact("how_to_order_phone_button")}
              className="flex min-h-[56px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl bg-teal-500 px-4 text-[13px] font-bold text-[#0a1a2b] transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02]"
            >
              <Phone size={17} className="shrink-0" />
              <span className="whitespace-nowrap tabular-nums">ZADZWOŃ {PHONE}</span>
            </a>
            <a
              href={`sms:${PHONE_HREF}?body=${SMS_ADRES}`}
              onClick={() => trackContact("how_to_order_sms_button")}
              className="flex min-h-[56px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl border border-teal-400/40 px-4 text-[13px] font-bold text-white transition-all duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02] sm:hover:bg-white/5"
            >
              <MessageCircle size={17} className="shrink-0 text-teal-300" />
              WYŚLIJ SMS Z ADRESEM
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}