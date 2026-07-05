"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  ShieldCheck,
  Clock,
  FileX,
  Wrench,
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: Clock,
    q: "Ile trwa przeniesienie numeru i instalacja?",
    a: "Instalację umawiamy najczęściej w ciągu 24 godzin roboczych od potwierdzenia dostępności. Przeniesienie numeru odbywa się równolegle i nie wymaga przerwy w działaniu usług.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7. Jeśli w pierwszych dniach usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie — od razu, telefonicznie.",
  },
  {
    icon: Wrench,
    q: "Czy muszę być w domu podczas instalacji?",
    a: "Tak, potrzebujemy Twojej obecności na czas montażu routera i ewentualnego dekodera — zwykle zajmuje to od 30 do 60 minut. Termin ustalisz bezpośrednio z technikiem po telefonie do nas.",
  },
];

export default function NetiaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full py-20 px-6 font-sans"
    >
      <div className="max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Zanim zadzwonisz
          </span>
        </div>

        <h2 className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3">
          Najczęstsze pytania
        </h2>
        <p className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65">
          Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Accordion */}
        <div className="flex flex-col gap-3 mb-14">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const Icon = item.icon;
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? "bg-teal-400/10 border-teal-400/30"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
                  <div
                    className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 ${
                      isOpen
                        ? "bg-teal-400/15 text-teal-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>

                  <span
                    className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug ${
                      isOpen ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.q}
                  </span>

                  <Plus
                    size={20}
                    className="shrink-0 text-teal-400 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  />
                </div>

                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[calc(2.5rem+1rem)] text-sm sm:text-[0.9375rem] leading-relaxed text-white/60">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing CTA — call or SMS only, styled like Hero buttons */}
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center">
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">
            Wciąż masz pytania?
          </h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            Rozmowa zajmuje ~3 minuty, bez zobowiązań. Doradca odpowie od razu.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+48883334124"
              className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                  <span className="block text-xs text-white/85">+48 883 334 124</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/70" />
            </a>

            <a
              href="sms:+48883334124?body=INTERNET"
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">WYŚLIJ SMS</span>
                  <span className="block text-xs text-white/70">Oddzwonimy w kilka minut</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/50" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}