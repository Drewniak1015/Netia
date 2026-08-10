"use client";

import { Phone, MessageCircle, ChevronRight, Check } from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { useEffect,useState } from "react";
type ContactSectionProps = {
  phoneNumber?: string;
};

/* [KOPIA] Zamiast zdjęcia doradcy — wizualizacja "gwarancji na piśmie".
   Pasuje bezpośrednio do treści (recap 3 value propów + redukcja FUD
   na dole), więc obraz robi tę samą robotę co tekst: "to nie slogan,
   to zapisane warunki". Bez animacji wejścia — sekcja renderuje się od
   razu w pełnej formie (useIsDesktop zostaje, bo steruje tym, czy
   kolumna ze zdjęciem w ogóle się montuje, nie animacją). */

const recapPoints = [
  "Gwarancja min. 50% deklarowanej prędkości",
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
  phoneNumber = "+48 887 843 260",
}: ContactSectionProps) {
  const isDesktop = useIsDesktop();

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <DottedBackground variant="dots-accent" size={22} />

      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8 lg:py-16">
        {/* Kolumna tekstowa */}
        <div className="relative z-10 text-center lg:text-left">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Dziś wieczorem internet może{" "}
            <span className="text-teal-300">znowu zwolnić.</span> Albo już nie.
          </h2>

          <h3 className="mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base lg:mx-0">
            Sprawdź, zanim Twoja obecna umowa przedłuży się automatycznie albo zanim dostaniesz
            kolejny SMS o podwyżce. Rozmowa zajmuje 3 minuty, a doradca odbiera od razu.
          </h3>

          {/* Recap 3 value propów */}
          <ul className="mx-auto mt-6 flex max-w-xl flex-col gap-2.5 text-left lg:mx-0">
            {recapPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15">
                  <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
              className="group flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 active:translate-y-0 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-110">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                  <span className="block text-xs text-white/85">{phoneNumber}</span>
                </span>
              </span>
              <ChevronRight
                size={18}
                className="text-white/70 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href={`sms:${phoneNumber.replace(/\s+/g, "")}?body=INTERNET`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 active:translate-y-0 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZOSTAW SMS</span>
                  <span className="block text-xs text-white/70">Oddzwonimy w kilka minut</span>
                </span>
              </span>
              <ChevronRight
                size={18}
                className="text-white/50 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Redukcja FUD */}
          <p className="mx-auto mt-6 max-w-xl text-xs text-white/50 lg:mx-0">
            Jeśli po zmianie okaże się gorzej niż u obecnego dostawcy, masz 14 dni na
            odstąpienie i pełny zwrot. Bez pytań.
          </p>
        </div>

        {/* Kolumna wizualna — zdjęcie zamiast powielania treści z lewej kolumny */}
        {isDesktop && (
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-[460px] transition-transform duration-500 hover:-translate-y-1">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-2xl bg-teal-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              />

              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/images/final-cta-wieczor.webp"
                  alt="Rodzina spokojnie ogląda film wieczorem, internet działa bez zacięć"
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