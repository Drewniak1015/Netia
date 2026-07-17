"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  Wifi,
  CreditCard,
  Clock,
  Gauge,
  MapPin,
  FileText,
  LifeBuoy,
  Plus,
  Phone,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import type { ElementType } from "react";
import type { FaqItem } from "@/lib/cityHelpers";

/**
 * Ikony przypisane po KOLEJNOŚCI do 8 pytań zwracanych przez
 * generateCityFaq() w lib/cityHelpers.ts. Jeśli zmienisz tam liczbę lub
 * kolejność pytań, zaktualizuj też tę tablicę.
 */
const FAQ_ICONS: ElementType[] = [
  Wallet, // Ile kosztuje Internet Netia w X?
  Wifi, // Czy w X jest dostępny światłowód Netia?
  CreditCard, // Ile wynosi opłata aktywacyjna?
  Clock, // Jak długo trwa instalacja?
  Gauge, // Jakie prędkości są dostępne?
  MapPin, // W których dzielnicach X działa Netia?
  FileText, // Na jaki okres można podpisać umowę?
  LifeBuoy, // Co zrobić w razie awarii?
];

interface CityFaqProps {
  /** Mianownik, np. "Kielce" — do zdania "mieszkańcy {cityName}" */
  cityName: string;
  /** Miejscownik, np. "Kielcach" — do nagłówka sekcji */
  cityLocative: string;
  faq: FaqItem[];
}

export default function CityFaq({ cityName, cityLocative, faq }: CityFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full py-6 font-sans overflow-hidden ${inView ? "faq-in-view" : ""}`}
    >
      <style>{`
        @keyframes faq-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes faq-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.45);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(45, 212, 191, 0);
          }
        }
        .faq-animate {
          opacity: 0;
          transform: translateY(14px);
        }
        .faq-in-view .faq-animate {
          animation: faq-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .faq-cta-pulse {
          animation: faq-pulse 2.4s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-animate {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .faq-cta-pulse {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-5 faq-animate" style={{ animationDelay: "0ms" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </div>

        <h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3 faq-animate"
          style={{ animationDelay: "80ms" }}
        >
          Najczęstsze pytania o Internet Netia w {cityLocative}
        </h2>
        <p
          className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65 faq-animate"
          style={{ animationDelay: "160ms" }}
        >
          Odpowiedzi na pytania, które najczęściej zadają mieszkańcy {cityName}. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14 items-start">
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            const Icon = FAQ_ICONS[i] ?? FileText;
            return (
              <div
                key={item.question}
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
                className={`faq-animate cursor-pointer rounded-2xl overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? "bg-teal-400/10 border-teal-400/30"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
                style={{ animationDelay: `${240 + i * 90}ms` }}
              >
                <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
                  <div
                    className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 transition-colors duration-300 ${
                      isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>

                  <span
                    className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug transition-colors duration-300 ${
                      isOpen ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.question}
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
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing CTA — telefon/SMS, ten sam styl co Hero i NetiaFAQ.tsx */}
        <div
          className="faq-animate max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          style={{ animationDelay: `${240 + faq.length * 90 + 80}ms` }}
        >
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">Wciąż masz pytania?</h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            Rozmowa zajmuje ~3 minuty, bez zobowiązań. Doradca odpowie od razu.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+48883334124"
              className="faq-cta-pulse flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
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