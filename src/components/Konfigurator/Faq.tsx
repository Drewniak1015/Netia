"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  Gauge,
  Tv,
  Package,
  Smartphone,
  FileCheck,
  Wallet,
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: Gauge,
    q: "Jakie prędkości Internetu są dostępne?",
    a: "Konfigurator obsługuje pięć prędkości stacjonarnych: 150 Mb/s, 300 Mb/s, 600 Mb/s, 1000 Mb/s i 2000 Mb/s. Najwyższa (2 Gb/s) dostępna jest w technologii PON. Faktyczna dostępność prędkości zależy od technologii pokrycia pod Twoim adresem.",
  },
  {
    icon: Tv,
    q: "Czym różnią się pakiety telewizyjne S, M i L?",
    a: "Pakiet S „Coś na Start” to wybór podstawowy, M „Najpopularniejszy” zawiera szerszy zestaw kanałów (sport, filmy), L „Dla Wymagających” to najbogatszy pakiet z największą liczbą kanałów. Pełna lista kanałów jest dostępna na stronie „Lista Kanałów”.",
  },
  {
    icon: Package,
    q: "Jakie dodatki mogę dodać do pakietu?",
    a: "Konfigurator obsługuje: Multiroom (standardowy i 4K), Giga Nagrywarka Maxi, Bezpieczny Internet, Stałe IP, kanały premium (HBO + MAX, Canal+ Select, Canal+ Prestige, Eleven Sports, Polsat Sport Premium, FilmBox, Cinemax, Dla Dorosłych, Dla Dzieci, Pakiet Ukraina) oraz streaming Disney+ i SkyShowtime.",
  },
  {
    icon: Smartphone,
    q: "Jak działają usługi mobilne 5G?",
    a: "Trzy plany 5G: SUPER (60 GB w PL + 8,5 GB roaming UE, 30 zł po 6 mies. 0 zł), VIP (100 GB + 11 GB, 40 zł), GIGA (200 GB + 15 GB, 60 zł). Wszystkie z nielimitowanymi połączeniami i SMS w kraju, umową na 24 miesiące i bez opłaty aktywacyjnej.",
  },
  {
    icon: FileCheck,
    q: "Czy mogę zmienić pakiet w trakcie umowy?",
    a: "Podwyższenie prędkości lub rozszerzenie pakietu TV (np. dodanie kanałów premium) jest możliwe w trakcie umowy bez jej wydłużania. Obniżenie pakietu może wiązać się z dodatkowymi warunkami — sprawdź to u konsultanta.",
  },
  {
    icon: Wallet,
    q: "Czy montaż jest płatny?",
    a: "Tak — w cenniku istnieje jednorazowa opłata aktywacyjna (osobne pozycje dla Internetu, Telewizji, Multiroom, usług mobilnych i HBO Max). Konfigurator pokazuje sumę aktywacji dla wybranych usług w sekcji „Opłata aktywacyjna (jednorazowa)”.",
  },
];

/* Ten sam wzorzec animacji co w Footer.tsx/Header.tsx — whileInView +
   stagger przez custom index. Tylko opacity (bez translateY), żeby żaden
   element nigdy nie zmieniał swojej pozycji w viewporcie podczas wejścia. */
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.06 },
  }),
};

export default function KonfiguratorFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="w-full py-6 px-6 font-sans overflow-hidden"
      >
        {/*
          FIX (CLS): sekcja wcześniej używała ręcznego IntersectionObserver +
          wstrzykniętego <style>{`@keyframes ...`}</style> do animacji wejścia
          (jedyny komponent na stronie zrobiony w ten sposób — Header, Footer
          i Konfigurator używają framer-motion). Przepisane na dokładnie ten
          sam wzorzec co reszta strony: m.div + whileInView + warianty, tylko
          opacity (bez translateY) — element się pojawia, ale nigdy nie
          zmienia swojej pozycji w viewporcie, więc nie ma czego liczyć jako
          layout shift.

          .faq-cta-pulse (pulsujący pierścień na przycisku ZADZWOŃ) zostaje
          jako czyste CSS — to osobna, ciągła animacja na pseudo-elemencie
          ::before, absolutnie pozycjonowanym, więc nie wpływa na layout
          niczego dookoła.
        */}
        <style>{`
          .faq-cta-pulse {
            position: relative;
            isolation: isolate;
          }
          .faq-cta-pulse::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background-color: rgba(45, 212, 191, 0.45);
            opacity: 0.45;
            transform: scale(1);
            animation: faq-pulse-ring 2.4s ease-out infinite;
            pointer-events: none;
            z-index: -1;
            will-change: transform, opacity;
          }
          @keyframes faq-pulse-ring {
            0% { opacity: 0.45; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.12); }
          }
          @media (prefers-reduced-motion: reduce) {
            .faq-cta-pulse::before { animation: none; opacity: 0; }
          }
        `}</style>

        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeIn}
            className="flex justify-center mb-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-teal-300)" }}
              />
              KONFIGURATOR — FAQ
            </span>
          </m.div>

          <m.h2
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeIn}
            className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3"
          >
            Najczęstsze pytania o konfigurator
          </m.h2>
          <m.p
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={2}
            variants={fadeIn}
            className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65"
          >
            Wszystko, co warto wiedzieć przed samodzielnym złożeniem pakietu.
            Masz dodatkowe pytanie? Doradca pomoże w 3 minuty przez telefon.
          </m.p>

          {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14 items-start">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              const Icon = item.icon;
              return (
                <m.div
                  key={i}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={3 + i}
                  variants={fadeIn}
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
                      ? "bg-teal-400/10"
                      : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                  }`}
                  style={{ borderColor: isOpen ? "var(--color-teal-300)" : "" }}
                >
                  <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
                    <div
                      className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 transition-colors duration-300 ${
                        isOpen ? "bg-teal-400/15" : "bg-white/10 text-white/60"
                      }`}
                      style={{ color: isOpen ? "var(--color-teal-300)" : "" }}
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
                      className="shrink-0 transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        color: "var(--color-teal-300)",
                      }}
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
                </m.div>
              );
            })}
          </div>

          {/* Closing CTA — call or SMS only, styled like Hero buttons */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={3 + FAQ_ITEMS.length}
            variants={fadeIn}
            className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
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
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}