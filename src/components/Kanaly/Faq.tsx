"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  BadgeCheck,
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
  Download,
  ChevronRight,
  Plus,
  Sliders,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    icon: Search,
    q: "Jak działa wyszukiwarka kanałów?",
    a: "Wpisz minimum 3 znaki z nazwy kanału w polu „Szukaj Kanału” — wyniki aktualizują się na żywo. Możesz dodatkowo zawęzić listę zaznaczając pakiet główny (jeden z S / M / L, opcjonalnie w wariancie 4K) i jeden pakiet dodatkowy (Dla Dzieci, Ukraina, Dla dorosłych). Widok wyników przełączysz przyciskami „Kafelki” (z logo kanałów) i „Lista” (kompaktowa). Aktualną listę pobierzesz w PDF przyciskiem „Pobierz listę kanałów (PDF)”.",
  },
  {
    icon: BadgeCheck,
    q: "Co oznacza „kanał gwarantowany” vs „niegwarantowany”?",
    a: "Gwarantowany to kanał, który Netia zobowiązuje się utrzymać w pakiecie przez czas trwania Twojej umowy. Niegwarantowany może zostać czasowo zamieniony lub usunięty z pakietu bez zmiany ceny — w takim przypadku Netia poinformuje Cię mailem przed zmianą. Większość kanałów premium (HBO, Cinemax, FilmBox) ma status gwarantowany; w pakietach głównych proporcja to około 1/3 gwarantowanych do 2/3 niegwarantowanych.",
  },
  {
    icon: PlayCircle,
    q: "Co zawiera Pakiet S „Coś na Start”?",
    a: "Pakiet S to baza: 81 kanałów (39 gwarantowanych, 42 niegwarantowane). Znajdziesz tu główne kanały informacyjne, ogólnotematyczne i rozrywkowe (TVN, Polsat, TVP, TTV, Discovery, History, kanały dziecięce w wersji podstawowej, kilka kanałów filmowych). Idealny dla osób, którym wystarczy klasyczny zestaw bez dopłaty za premium. Wariant „S 4K” zawiera tę samą listę kanałów + obsługę dekodera 4K.",
  },
  {
    icon: Users,
    q: "Co zawiera Pakiet M „Najpopularniejszy”?",
    a: "Pakiet M ma 106 kanałów (52 gwarantowane, 54 niegwarantowane) — wszystkie kanały z S plus dodatkowe sportowe, filmowe i tematyczne (Eurosport, Polsat Sport, Discovery+, kanały kobiece, podróżnicze). To środkowy poziom dla typowej rodziny chcącej oprócz informacji oglądać sport rekreacyjny i filmy w szerszym wyborze. Wariant „M 4K” — ta sama lista + dekoder 4K.",
  },
  {
    icon: Crown,
    q: "Co zawiera Pakiet L „Dla Wymagających”?",
    a: "Pakiet L to najbogatszy zestaw: 185 kanałów (65 gwarantowanych, 120 niegwarantowanych). Zawiera wszystkie kanały z M plus duży zestaw kanałów dokumentalnych (National Geographic, History HD, Discovery Science), filmowych, muzycznych i sportowych. To pakiet wybierany przez fanów telewizji, osoby pracujące z domu i rodziny chcące mieć szeroki wybór bez doliczania premium. Wariant „L 4K” to praktycznie ta sama lista (różnica 2 kanały) z dekoderem 4K.",
  },
  {
    icon: Layers,
    q: "Czym dokładnie różnią się Pakiety S, M i L?",
    a: "Progresja jest narastająca — M zawiera wszystko co S plus dodatkowe sport / filmy / tematyczne, L zawiera wszystko co M plus duży zestaw dokumentalnych, premium ogólnodostępnych, muzycznych i dodatkowych sport / film. W liczbach: S = 81, M = 106 (+25 vs S), L = 185 (+79 vs M). Cena rośnie proporcjonalnie — sprawdź konfigurator pakietów na /oferta dla aktualnych dopłat.",
  },
  {
    icon: MonitorPlay,
    q: "Czym różni się wariant 4K od standardowego?",
    a: "Wariant 4K (S 4K, M 4K, L 4K) to ten sam zestaw kanałów co odpowiedni pakiet HD — różnica polega na obsłudze dekodera Netia 4K, który pozwala odbierać wybrane kanały i materiały w UHD/4K (kilka kanałów sportowych, filmowych i dokumentalnych emituje treści 4K). Wybór 4K wymaga telewizora 4K (HDMI 2.0+) i dekodera 4K — w aktualnych promocjach dekoder 4K bywa dodawany w cenie pakietu.",
  },
  {
    icon: Baby,
    q: "Co zawiera dodatek tematyczny „Dla Dzieci”?",
    a: "Pakiet „Dla Dzieci” to 13 kanałów dziecięcych i młodzieżowych (3 gwarantowane, 10 niegwarantowanych) — animacja, kanały edukacyjne, kanały dla nastolatków. Jest osobnym, płatnym dodatkiem dopinanym do dowolnego pakietu głównego S / M / L. Filtr „Dla Dzieci” w wyszukiwarce pokazuje pełną listę kanałów objętych tym dodatkiem.",
  },
  {
    icon: Flag,
    q: "Co zawiera dodatek „Ukraina”?",
    a: "Pakiet „Ukraina” zawiera 8 kanałów ukraińskojęzycznych (3 gwarantowane, 5 niegwarantowanych) — kanały informacyjne, rozrywkowe i dziecięce z Ukrainy oraz dla diaspory. Dopinasz go do dowolnego pakietu głównego. Jest szczególnie popularny w miastach z dużą społecznością ukraińską (przygranicze, akademickie, GZM).",
  },
  {
    icon: Lock,
    q: "Co zawiera dodatek „Dla dorosłych”?",
    a: "Pakiet „Dla dorosłych” to 8 kanałów dla widzów 18+ (2 gwarantowane, 6 niegwarantowanych). Dopinasz go do dowolnego pakietu głównego. W wyszukiwarce filtruj filtrem „Dla dorosłych”.",
  },
  {
    icon: Gem,
    q: "Jakie są płatne kanały premium dostępne jako dopłata?",
    a: "Można dopłacić do następujących pakietów kanałów premium (ceny z konfiguratora — sprawdź /oferta dla aktualnych stawek): HBO + HBO Max (3 kanały, wszystkie gwarantowane, +25 zł w promocji DAJEMY MAXX), CANAL+ Select (8 kanałów, 5 gwarantowanych, +35 zł), CANAL+ Prestige (10 kanałów, 6 gwarantowanych, +50 zł), Polsat Sport Premium (6 kanałów, 2 gwarantowane, +20 zł), Eleven Sports (5 kanałów, 3 gwarantowane, +10 zł), FilmBox (5 kanałów, wszystkie gwarantowane, +10 zł), Cinemax (2 kanały, oba gwarantowane). Disney+ i SkyShowtime to streamingi dostępne tylko z konfiguratora, nie z promocji DAJEMY MAXX.",
  },
  {
    icon: Hash,
    q: "Ile w sumie kanałów ma Netia w ofercie TV?",
    a: "Baza obejmuje 232 unikalne kanały rozproszone po pakietach głównych (S / M / L), wariantach 4K, dodatkach tematycznych (Dzieci, Ukraina, Dla dorosłych) oraz pakietach premium kanałowych (HBO, Canal+, Polsat Sport Premium, Eleven, FilmBox, Cinemax). Większość kanałów występuje w więcej niż jednym pakiecie (np. kanał z pakietu S znajdziesz też w M i L), dlatego suma „kanałów w pakiecie” jest większa niż liczba unikalnych pozycji w bazie.",
  },
  {
    icon: RefreshCw,
    q: "Skąd brane są te liczby? Czy mogą się zmienić?",
    a: "Liczby pochodzą z aktualnej listy kanałów Netii (zliczane z danych wyszukiwarki). Zmiany w pakietach (dodanie / usunięcie kanału) mogą wystąpić — kanały gwarantowane są chronione w umowie, niegwarantowane mogą się rotować. Zawsze sprawdzaj aktualną listę przez przycisk „Pobierz listę kanałów (PDF)” oraz wyszukiwarkę z filtrami pakietów na tej stronie.",
  },
];

export default function NetiaFAQKanaly() {
const [openIndex, setOpenIndex] = useState<number | null>(null);
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
          Wszystko o wyszukiwarce kanałów, różnicach między pakietami S / M / L
          oraz dodatkach tematycznych i premium.
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

        {/* Closing CTA — self-service (PDF + Konfigurator wyróżniony), bez telefonu/SMS:
            to sekcja o sprawdzaniu kanałów, nie o sprzedaży — nie chcemy zgłoszeń
            telefonicznych typu "czy macie kanał X". Konfigurator to jedyna ścieżka
            do zakupu i dlatego jest wyraźnie wyróżniony (pełny teal, pulsujący). */}
        <div
          className="faq-animate max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          style={{ animationDelay: `${240 + FAQ_ITEMS.length * 90 + 80}ms` }}
        >
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">
            Nie znalazłeś swojego kanału?
          </h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            Sprawdź pełną listę w PDF, a jeśli już wiesz, czego szukasz —
            skonfiguruj pakiet od razu online.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/pdf/NETIA_Lista_Kanałów.pdf"
              download
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Download size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    POBIERZ LISTĘ
                  </span>
                  <span className="block text-xs text-white/70">
                    Pełna lista kanałów w PDF
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/50" />
            </a>

            <a
              href="/konfigurator?umowa=24"
              className="faq-cta-pulse flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-transform duration-150 hover:scale-[1.02] sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Sliders size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    SKONFIGURUJ PAKIET
                  </span>
                  <span className="block text-xs text-white/85">
                    Wybierz internet, TV i dodatki
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/70" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}