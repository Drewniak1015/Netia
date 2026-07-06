"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  Package,
  Wallet,
  TrendingUp,
  FileCheck,
  FileText,
  Tv,
  XCircle,
  Gauge,
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: Package,
    q: "Co dokładnie dostaję w pakiecie Max 1000 i Max 2000?",
    a: "Max 1000: Internet do 1000 Mb/s + Telewizja L 4K z Dekoderem + Bezpieczny Internet Ultra (ochrona 5 urządzeń + CyberEkspert). Max 2000: to samo, ale z Internetem do 2000 Mb/s (technologia PON). W obu opcjonalnie SoundBox 4K za +30 zł/mies.",
  },
  {
    icon: Wallet,
    q: "Ile naprawdę zapłacę przez pierwsze 12 miesięcy?",
    a: "Przez pierwsze 12 miesięcy abonament wynosi 0 zł. Płatne są jedynie opłaty aktywacyjne na pierwszej fakturze: 79 zł za Internet i 2 zł za Telewizję (łącznie 81 zł jednorazowo).",
  },
  {
    icon: TrendingUp,
    q: "Ile kosztuje pakiet od 13. miesiąca?",
    a: "Max 1000 = 140 zł/mies., Max 2000 = 160 zł/mies. — te ceny obowiązują od 13. do 24. miesiąca. Po 24 miesiącach cena abonamentu rośnie o 10 zł zgodnie z regulaminem.",
  },
  {
    icon: FileCheck,
    q: "Czy muszę spełnić jakieś warunki, żeby cena pozostała na poziomie 140/160 zł?",
    a: "Tak — wymagana jest e-faktura (rabat 5 zł) i zgody marketingowe (rabat 5 zł). Jeśli zrezygnujesz z tych zgód lub e-faktury, cena wzrośnie o 10 zł.",
  },
  {
    icon: FileText,
    q: "Na jak długo jest umowa?",
    a: "Umowa zawierana jest na czas określony 24 pełnych okresów rozliczeniowych. Pierwsze 12 mies. abonamentu za 0 zł, kolejne 12 mies. według tabeli cen.",
  },
  {
    icon: Tv,
    q: "Czy mogę dokupić pakiety filmowe lub sportowe?",
    a: "Tak — dostępne dopłaty: HBO + HBO Max (+25 zł), Canal+ Prestige (+50 zł), Canal+ Select (+35 zł), Polsat Sport Premium (+20 zł), Eleven Sports (+10 zł), Polsat Sport Premium + Eleven Sports (+20 zł), FilmBox (+10 zł), Dla Dorosłych (+10 zł).",
  },
  {
    icon: XCircle,
    q: "Czy w ofercie jest Disney+ lub SkyShowtime?",
    a: "Nie. W tej promocji nie ma usług streamingowych Disney+ i SkyShowtime. Dostępne są klasyczne pakiety telewizyjne i premium opisane wyżej.",
  },
  {
    icon: Gauge,
    q: "W jakiej technologii dostępna jest prędkość 2 Gb/s?",
    a: "Maksymalna prędkość 2 Gb/s dostępna jest w technologii PON. W technologiach HFC lub ETTH maksymalna prędkość może być inna — sprawdź dostępność pod swoim adresem przed zamówieniem.",
  },
];


export default function NetiaFAQ() {
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
      style={{ backgroundColor: "#0B2A3D" }}
      className={`w-full py-6 px-6 font-sans overflow-hidden ${
        inView ? "faq-in-view" : ""
      }`}
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
        <div
          className="flex justify-center mb-5 faq-animate"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </div>

        <h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3 faq-animate"
          style={{ animationDelay: "80ms" }}
        >
          Najczęstsze pytania
        </h2>
        <p
          className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65 faq-animate"
          style={{ animationDelay: "160ms" }}
        >
          Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14 items-start">
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
                      isOpen
                        ? "bg-teal-400/15 text-teal-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>

                  <span
                    className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug transition-colors duration-300 ${
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
        <div
          className="faq-animate max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          style={{ animationDelay: `${240 + FAQ_ITEMS.length * 90 + 80}ms` }}
        >
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">
            Wciąż masz pytania?
          </h3>
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

        {/* Legal disclaimer */}
      </div>
    </section>
  );
}