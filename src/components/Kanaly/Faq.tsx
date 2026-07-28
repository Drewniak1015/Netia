"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  BadgeCheck,
  Radio,
  PlayCircle,
  Users,
  Crown,
  Layers,
  MonitorPlay,
  Baby,
  Flag,
  Lock,
  Gem,
  Hash,
  RefreshCw,
  Phone,
  ChevronRight,
  ChevronDown,
  Plus,
  Sliders,
} from "lucide-react";

function trackContact(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Contact", { content_name: contentName });
  }
}

function trackViewContent(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "ViewContent", { content_name: contentName });
  }
}

/* [ZMIENIONO] Lista podzielona na TIER_1 (zawsze widoczne — najczęściej
   szukane odpowiedzi) i EXTRA_ITEMS (widoczne po "Pokaż więcej pytań"),
   ten sam wzorzec co w NetiaFAQ.tsx na stronie głównej. */
const TIER_1 = [
  {
    icon: Search,
    q: "Jak działa wyszukiwarka kanałów?",
    a: "Wpisz minimum 3 znaki z nazwy kanału w polu „Szukaj Kanału” — wyniki aktualizują się na żywo. Możesz dodatkowo zawęzić listę zaznaczając pakiet główny (jeden z XS / S / M / L, opcjonalnie w wariancie 4K) i jeden pakiet dodatkowy (Dla Dzieci, Ukraina, Dla dorosłych). Widok wyników przełączysz przyciskami „Kafelki” i „Lista”.",
  },
  {
    icon: Layers,
    q: "Czym dokładnie różnią się Pakiety XS, S, M i L?",
    a: "Progresja jest narastająca — XS to baza wliczona automatycznie w każdy pakiet główny, S dodaje klasyczny zestaw informacyjno-rozrywkowy, M dodaje sport / filmy / tematyczne, a L dodaje duży zestaw dokumentalnych, muzycznych i dodatkowych sport / film. W liczbach: XS = 35, S = 81, M = 106, L = 185 kanałów. Cena rośnie proporcjonalnie — sprawdź konfigurator na /oferta.",
  },
  {
    icon: Gem,
    q: "Jakie są płatne kanały premium dostępne jako dopłata?",
    a: "Można dopłacić m.in. do: HBO + HBO Max (+25 zł w promocji DAJEMY MAXX), CANAL+ Select (+35 zł), CANAL+ Prestige (+50 zł), Polsat Sport Premium (+20 zł), Eleven Sports (+10 zł), FilmBox (+10 zł), Cinemax. Disney+ i SkyShowtime to streamingi dostępne tylko z konfiguratora.",
  },
  {
    icon: Hash,
    q: "Ile w sumie kanałów ma Netia w ofercie TV?",
    a: "Baza obejmuje 232 unikalne kanały rozproszone po pakietach głównych (XS / S / M / L), wariantach 4K, dodatkach tematycznych oraz pakietach premium. Większość kanałów występuje w więcej niż jednym pakiecie.",
  },
  {
    icon: BadgeCheck,
    q: "Co oznacza „kanał gwarantowany” vs „niegwarantowany”?",
    a: "Gwarantowany to kanał, który Netia zobowiązuje się utrzymać w pakiecie przez czas trwania umowy. Niegwarantowany może zostać czasowo zamieniony bez zmiany ceny — Netia poinformuje o tym mailem przed zmianą.",
  },
  {
    icon: MonitorPlay,
    q: "Czym różni się wariant 4K od standardowego?",
    a: "Wariant 4K (S 4K, M 4K, L 4K) to ten sam zestaw kanałów co odpowiedni pakiet HD — różnica polega na obsłudze dekodera Netia 4K. Wybór 4K wymaga telewizora 4K i dekodera 4K, który bywa dodawany w cenie pakietu w aktualnych promocjach.",
  },
];

const EXTRA_ITEMS = [
  {
    icon: Radio,
    q: "Co zawiera Pakiet XS?",
    a: "Pakiet XS to baza dołączona automatycznie do każdego pakietu głównego. To 35 kanałów: główne ogólnopolskie stacje, kilka kanałów tematycznych i regionalnych oraz kanały regionalne TVP.",
  },
  {
    icon: PlayCircle,
    q: "Co zawiera Pakiet S „Coś na Start”?",
    a: "Pakiet S to 81 kanałów (39 gwarantowanych, 42 niegwarantowane) — główne kanały informacyjne, ogólnotematyczne i rozrywkowe. Wariant „S 4K” zawiera tę samą listę + obsługę dekodera 4K.",
  },
  {
    icon: Users,
    q: "Co zawiera Pakiet M „Najpopularniejszy”?",
    a: "Pakiet M ma 106 kanałów — wszystkie z S plus dodatkowe sportowe, filmowe i tematyczne. Wariant „M 4K” — ta sama lista + dekoder 4K.",
  },
  {
    icon: Crown,
    q: "Co zawiera Pakiet L „Dla Wymagających”?",
    a: "Pakiet L to 185 kanałów — wszystkie z M plus duży zestaw dokumentalnych, filmowych, muzycznych i sportowych. Wariant „L 4K” to praktycznie ta sama lista z dekoderem 4K.",
  },
  {
    icon: Baby,
    q: "Co zawiera dodatek tematyczny „Dla Dzieci”?",
    a: "13 kanałów dziecięcych i młodzieżowych — animacja, kanały edukacyjne, kanały dla nastolatków. Osobny, płatny dodatek do dowolnego pakietu głównego.",
  },
  {
    icon: Flag,
    q: "Co zawiera dodatek „Ukraina”?",
    a: "8 kanałów ukraińskojęzycznych — informacyjne, rozrywkowe i dziecięce. Dopinasz go do dowolnego pakietu głównego.",
  },
  {
    icon: Lock,
    q: "Co zawiera dodatek „Dla dorosłych”?",
    a: "8 kanałów dla widzów 18+. Dopinasz go do dowolnego pakietu głównego.",
  },
  {
    icon: RefreshCw,
    q: "Skąd brane są te liczby? Czy mogą się zmienić?",
    a: "Liczby pochodzą z aktualnej listy kanałów Netii. Kanały gwarantowane są chronione w umowie, niegwarantowane mogą się rotować — sprawdzaj wyszukiwarkę z filtrami na tej stronie.",
  },
];

export default function NetiaFAQKanaly() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

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

  const visibleItems = showAll ? [...TIER_1, ...EXTRA_ITEMS] : TIER_1;

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
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes faq-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.45); }
          50% { box-shadow: 0 0 0 8px rgba(45, 212, 191, 0); }
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
          .faq-animate { animation: none; opacity: 1; transform: none; }
          .faq-cta-pulse { animation: none; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-5 faq-animate" style={{ animationDelay: "0ms" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ — Kanały TV
          </span>
        </div>

        <h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3 faq-animate"
          style={{ animationDelay: "80ms" }}
        >
          Pytania o pakiety i kanały
        </h2>
        <p
          className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65 faq-animate"
          style={{ animationDelay: "160ms" }}
        >
          Wszystko o wyszukiwarce kanałów, różnicach między pakietami XS / S / M / L
          oraz dodatkach tematycznych i premium.
        </p>

        {/* Accordion — skrócony domyślnie (TIER_1), reszta pod "Pokaż więcej" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 items-start">
          {visibleItems.map((item, i) => {
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

        {/* [DODANO] Przycisk rozwijający resztę pytań */}
        {!showAll && (
          <div className="flex justify-center mb-14">
            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                setOpenIndex(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
            >
              Pokaż więcej pytań ({EXTRA_ITEMS.length})
              <ChevronDown size={16} />
            </button>
          </div>
        )}
        {showAll && <div className="mb-14" />}

        {/* Closing CTA — [ZMIENIONO] Zadzwoń jest teraz głównym, wypełnionym
            przyciskiem (bg-teal, pulsujący), a Skonfiguruj pakiet stał się
            drugorzędny (obramowany, bez pulsu). */}
        <div
          className="faq-animate max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          style={{ animationDelay: `${240 + TIER_1.length * 90 + 80}ms` }}
        >
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">
            Nie znalazłeś swojego kanału?
          </h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            Zadzwoń i zapytaj doradcę, a jeśli już wiesz, czego szukasz —
            skonfiguruj pakiet od razu online.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+48887843260"
              onClick={() => trackContact("kanaly_faq_closing_phone")}
              className="faq-cta-pulse flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    ZADZWOŃ
                  </span>
                  <span className="block text-xs text-white/85">
                    +48 887 843 260
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/70" />
            </a>

            <a
              href="/konfigurator?umowa=24"
              onClick={() => trackViewContent("kanaly_faq_closing_configure")}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Sliders size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    SKONFIGURUJ PAKIET
                  </span>
                  <span className="block text-xs text-white/70">
                    Wybierz internet, TV i dodatki
                  </span>
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