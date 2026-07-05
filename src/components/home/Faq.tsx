"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  ShieldCheck,
  Clock,
  FileX,
  FileText,
  Undo2,
  TrendingDown,
  Zap,
  MapPin,
  Timer,
  Monitor,
  Infinity as InfinityIcon,
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: FileText,
    q: "Czy muszę podpisywać umowę na 2 lata?",
    a: "Nie. Możesz wybrać krótszy okres — dopasowujemy warunki do Twojej sytuacji. Jeśli umowę zawierasz poza lokalem firmy (telefon, online), masz też ustawowe 14 dni na odstąpienie bez podawania przyczyny.",
  },
  {
    icon: FileX,
    q: "Co jeśli mam jeszcze aktywną umowę u obecnego operatora?",
    a: "Sprawdzimy termin jej zakończenia i pomożemy dobrać moment przejścia tak, żebyś nie płacił podwójnie i nie miał przerwy w dostępie do sieci.",
  },
  {
    icon: Clock,
    q: "Czy podczas zmiany zostanę bez internetu?",
    a: "Przełączenie planujemy tak, by przerwa była jak najkrótsza — zwykle to kwestia godzin, nie dni.",
  },
  {
    icon: Undo2,
    q: "Czy mogę zrezygnować, jeśli zmienię zdanie?",
    a: "Tak. Przy umowie zawartej poza lokalem przedsiębiorstwa przysługuje Ci ustawowe prawo odstąpienia w ciągu 14 dni — bez podawania przyczyny.",
  },
  {
    icon: ShieldCheck,
    q: "Czy są jakieś ukryte opłaty?",
    a: "Nie. Wszystkie opłaty są przedstawione przed podpisaniem umowy i zapisane w dokumentach — bez drobnego druczku.",
  },
  {
    icon: TrendingDown,
    q: "Co się stanie po zakończeniu okresu promocyjnego?",
    a: "Cena po promocji jest wskazana w umowie od samego początku, razem z ceną promocyjną. Wiesz, ile zapłacisz, zanim jeszcze podpiszesz.",
  },
  {
    icon: Zap,
    q: "Jakie prędkości internetu oferuje Netia?",
    a: "Do 2 Gbps symetrycznie na światłowodzie Orange (FTTH/XGS-PON) — zarówno pobieranie, jak i wysyłanie danych działa z taką samą prędkością.",
  },
  {
    icon: MapPin,
    q: "Czy mogę sprawdzić dostępność światłowodu w mojej lokalizacji?",
    a: "Tak, sprawdzenie dostępności to pierwszy, niezobowiązujący krok — zajmuje chwilę.",
  },
  {
    icon: InfinityIcon,
    q: "Czy Netia ma limit danych?",
    a: "Nie, internet działa bez limitu transferu.",
  },
  {
    icon: Timer,
    q: "Ile czasu trwa instalacja światłowodu?",
    a: "Zwykle kilka dni od podpisania umowy, w zależności od dostępności terminów techników w Twojej okolicy.",
  },
  {
    icon: Monitor,
    q: "Czy umowę mogę podpisać online?",
    a: "Tak, cały proces — od wyboru oferty do podpisania umowy — możesz przeprowadzić online, bez wizyty w salonie.",
  },
];

export default function NetiaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
      className={`w-full py-20 px-6 font-sans overflow-hidden ${
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

      <div className="max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div
          className="flex justify-center mb-5 faq-animate"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Zanim zadzwonisz
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
          className="faq-animate rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
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
      </div>
    </section>
  );
}