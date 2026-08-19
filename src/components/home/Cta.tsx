"use client";

import { Phone, MessageCircle, ChevronRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { SPEED_GUARANTEE } from "@/lib/guarantees";
import { trackContact } from "@/lib/meta-track";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ---------------------------------------------------------------------- */
/*  Finalne CTA — wersja mobile-first.                                     */
/*                                                                         */
/*  1. [KOTWICA #kontakt] Ta sekcja przejmuje kotwicę "Kontakt" z Headera. */
/*     UWAGA: usuń wtedy `id="kontakt"` z HowToOrderSection.tsx — dwa      */
/*     elementy z tym samym id to niepoprawny HTML, a przeglądarka i tak   */
/*     skoczy do pierwszego, czyli w środek strony zamiast na finalne CTA. */
/*     Zostaw tam samo `id="jak-zamowic"`.                                 */
/*                                                                         */
/*  2. [BRAK ŚLEDZENIA KLIKNIĘĆ — FIX] To jedyna sekcja z CTA, w której    */
/*     linki `tel:` i `sms:` NIE odpalały zdarzenia Meta Pixel. Ostatni    */
/*     ekran przed telefonem, więc akurat tu brak danych boli najbardziej: */
/*     kampania nie widziała konwersji z domknięcia strony.                */
/*                                                                         */
/*  3. [NUMER] `phoneNumber` jako prop z domyślną wartością wpisaną na     */
/*     sztywno zastąpiony importem PHONE/PHONE_HREF z Offersdata.ts —      */
/*     jedno źródło numeru dla całej strony. Prop nadal działa, ale jego   */
/*     domyślna wartość idzie już ze wspólnej stałej.                      */
/*                                                                         */
/*  4. [PADDINGI] px-5 -> px-4, py-16/20 -> py-12 na telefonie.            */
/*                                                                         */
/*  5. [PRZYCISKI] `min-h-[64px]`, pełna szerokość na telefonie, równe     */
/*     szerokości od `sm` (flex-1 basis-0). `hover:-translate-y` schowany  */
/*     za `sm:` — na dotyku hover przykleja się po tapnięciu.              */
/*     Strzałka ChevronRight zostaje: przy dwóch linijkach tekstu w        */
/*     przycisku sygnalizuje, że to akcja, a nie etykieta.                 */
/*                                                                         */
/*  6. [KOLUMNA ZE ZDJĘCIEM] `useIsDesktop` zostaje — dzięki temu obrazek  */
/*     w ogóle nie montuje się na telefonie i nie kosztuje transferu.      */
/*     To jest tu ważniejsze niż zwykłe `hidden lg:block`, które i tak     */
/*     pobrałoby plik.                                                      */
/* ---------------------------------------------------------------------- */

type ContactSectionProps = {
  phoneNumber?: string;
};

const recapPoints = [
  SPEED_GUARANTEE.bullet,
  "Cena zapisana w umowie na cały okres",
  "14 dni na zmianę zdania, zero pytań",
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function ContactSection({
  phoneNumber = PHONE,
}: ContactSectionProps) {
  const isDesktop = useIsDesktop();
  const telHref = phoneNumber === PHONE ? PHONE_HREF : phoneNumber.replace(/\s+/g, "");

  const smsBody = encodeURIComponent(
    "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
  );

  return (
    <section
      id="kontakt"
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden scroll-mt-[96px] font-sans"
    >
      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8">
        {/* Kolumna tekstowa */}
        <div className="relative z-10 text-center lg:text-left">
          <h2 className="text-balance text-[26px] font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Dziś wieczorem internet może{" "}
            <span className="text-teal-300">znowu zwolnić.</span> Albo już nie.
          </h2>

          {/* [SEMANTYKA] <h3> zamienione na <p>. To podtytuł, nie nagłówek
              podsekcji — <h3> bez własnej sekcji psuje strukturę dokumentu
              i myli czytniki ekranu. Ten sam błąd był naprawiony w Hero. */}
          <p className="mx-auto mt-2.5 max-w-xl text-pretty text-[0.9375rem] font-normal leading-relaxed text-white/65 sm:text-base lg:mx-0">
            Ostatnia awaria w złym momencie, koniec promocji za kilka miesięcy,
            a może po prostu ktoś nowy zacznie pracować albo uczyć się zdalnie
            w Twoim domu — to zwykle wtedy ludzie w końcu sprawdzają inną
            opcję. Rozmowa zajmuje 3 minuty, a doradca odbiera od razu.
          </p>

          <ul className="mx-auto mt-6 flex max-w-xl flex-col gap-2.5 text-left lg:mx-0">
            {recapPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-pretty text-sm leading-snug text-white/80"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15">
                  <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          {/* CTA — na telefonie jeden pod drugim na pełną szerokość. */}
          <div className="mx-auto mt-7 flex max-w-xl flex-col gap-2.5 sm:flex-row lg:mx-0">
            <a
              href={`tel:${telHref}`}
              onClick={() => trackContact("final_cta_phone_button")}
              className="group flex min-h-[64px] flex-1 basis-0 items-center justify-between gap-3 rounded-xl bg-teal-500 px-4 text-white transition-all duration-200 active:scale-[0.98] sm:px-5 sm:hover:-translate-y-0.5 sm:hover:bg-teal-400 sm:hover:shadow-lg sm:hover:shadow-teal-500/30"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                  <span className="block whitespace-nowrap text-xs tabular-nums text-white/85">
                    {phoneNumber}
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/70" />
            </a>

            <a
              href={`sms:${telHref}?body=${smsBody}`}
              onClick={() => trackContact("final_cta_sms_button")}
              className="group flex min-h-[64px] flex-1 basis-0 items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 text-white transition-all duration-200 active:scale-[0.98] sm:px-5 sm:hover:-translate-y-0.5 sm:hover:border-white/25 sm:hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZOSTAW SMS</span>
                  <span className="block text-xs text-white/70">Oddzwonimy w 3 minuty</span>
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/50" />
            </a>
          </div>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-xs leading-relaxed text-white/50 lg:mx-0">
            Jeśli po zmianie okaże się gorzej niż u obecnego dostawcy, masz 14 dni na
            odstąpienie i pełny zwrot, bez pytań. Sprawdzenie dostępności zajmuje 3 minuty —
            zrób to teraz, zanim znów o tym zapomnisz.
          </p>
        </div>

        {/* [6] Kolumna wizualna montowana tylko na desktopie — na telefonie
            plik nie jest w ogóle pobierany. */}
        {isDesktop && (
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-[460px] transition-transform duration-500 hover:-translate-y-1">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-2xl bg-teal-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              />
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/images/final-cta-wieczor.avif"
                  alt="Rodzina spokojnie ogląda film wieczorem, internet działa bez zacięć"
                  width={920}
                  height={1150}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/5 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2A3D]/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}