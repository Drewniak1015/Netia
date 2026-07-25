"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  RotateCcw,
  Headset,
  Wrench,
  BadgeCheck,
  Phone,
  Gauge,
  Clock,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { REVIEWS } from "./homeReviewsData";

// UWAGA: dodaj pole `photoUrl`, `pakiet` oraz `stat` do każdego wpisu w homeReviewsData.ts
// (np. photoUrl: "/images/person1.webp", pakiet: "Internet 600 Mb/s",
//  stat: "Zgłoszenie 20:14 → naprawa 20:47").
// Poniższe tablice to fallbacki na wypadek, gdyby dane nie miały jeszcze tych pól.
const FALLBACK_PHOTOS = ["/images/person4.webp", "/images/person1.webp", "/images/person3.webp"];
const FALLBACK_PAKIETY = ["Internet 300 Mb/s", "Internet 600 Mb/s", "Internet 1 Gb/s"];
// Konkretne liczby > ogólniki typu "szybko" / "kilkanaście minut".
const FALLBACK_STATS = [
  "Zgłoszenie 19:52 → kontakt w 4 min",
  "Zgłoszenie 20:14 → naprawa 20:47",
  "Umowa podpisana w 6 minut",
];

type Review = {
  initials: string;
  name: string;
  age: number;
  city: string;
  date: string;
  text: string;
  photoUrl?: string;
  pakiet?: string;
  stat?: string;
};

const GUARANTEES = [
  {
    icon: Gauge,
    title: "Prędkość zgodna z umową",
    desc: "Gwarantujemy minimum 50% deklarowanej prędkości, zgodnie z prawem. Monitorujemy łącze 24/7.",
  },
  {
    icon: Headset,
    title: "Wsparcie zawsze pod ręką",
    desc: "Infolinia i serwis techniczny gotowe pomóc, gdy coś się zdarzy.",
  },
  {
    icon: Wrench,
    title: "Profesjonalny montaż",
    desc: "Technik podłączy i skonfiguruje wszystko na miejscu.",
  },
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Umowa poza salonem? Masz 14 dni na odstąpienie bez podania przyczyny.",
  },
];

type AdvisorInfo = {
  advisorName?: string;
  advisorRole?: string;
  advisorBio?: string;
  advisorPhotoUrl?: string;
  phoneNumber?: string;
};

// Hook: returns true once the element has scrolled into view (fires once)
function useInView(
  options: IntersectionObserverInit = {}
): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate once, don't repeat on every scroll
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}

export default function NetiaSocialProof({
  advisorName = "Jarosław Sitek",
  advisorRole = "Twój doradca w sprawie internetu",
  advisorBio = "Pomagam klientom bezstresowo zmienić dostawcę internetu.",
  // TODO: podmień ścieżkę, jeśli plik leży gdzie indziej niż /public.
  advisorPhotoUrl = "/images/Jaroslaw.webp",
  phoneNumber = "+48 883 334 124",
}: AdvisorInfo) {
  const [sectionRef, sectionInView] = useInView();

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden w-full py-16 px-6 font-sans"
    >
      <DottedBackground variant="dots-accent" size={22} />
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          opacity: 0;
        }
        .reveal.in-view {
          animation: fadeInUp 0.6s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            opacity: 1;
            animation: none !important;
          }
        }
      `}</style>

      <div className="max-w-305 mx-auto">
        {/* Eyebrow */}
        <div className={`flex justify-center mb-5 reveal ${sectionInView ? "in-view" : ""}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Opinie i gwarancje
          </span>
        </div>

        <h2
          className={`text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-2 reveal ${sectionInView ? "in-view" : ""}`}
          style={{ animationDelay: "80ms" }}
        >
          Dołącz do <span className="text-teal-400">2,4 mln klientów</span>, którzy{" "}
          <br className="hidden sm:block" />
          przestali martwić się o internet
        </h2>

        {/* Podtytuł przejęty z dawnej osobnej sekcji kontaktowej */}
        <p
          className={`text-center text-white/60 text-sm sm:text-base mb-8 reveal ${sectionInView ? "in-view" : ""}`}
          style={{ animationDelay: "120ms" }}
        >
          Szybki kontakt, zero formalności — i internet, który wreszcie działa tak, jak obiecano.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          {/* Reviews column — statyczna kolumna kart, NIE karuzela */}
          <div className="flex flex-col gap-4 h-full">
            {REVIEWS.map((r: Review, i: number) => {
              const stat = r.stat ?? FALLBACK_STATS[i % FALLBACK_STATS.length];
              return (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row items-start sm:items-center lg:items-start text-left gap-4 sm:gap-5 flex-1 rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/5 transition-all duration-300 hover:border-teal-400/30 hover:bg-white/[0.07] hover:-translate-y-0.5 reveal ${sectionInView ? "in-view" : ""}`}
                  style={{ animationDelay: `${160 + i * 100}ms` }}
                >
                  {/* Kolumna ze zdjęciem — na mobile zdjęcie po lewej, opis po prawej; od sm: zdjęcie na górze, opis wyśrodkowany pod spodem; od lg: wyrównanie do góry */}
                  <div className="flex flex-row items-center gap-4 w-full sm:w-28 md:w-32 sm:flex-col sm:items-center shrink-0">
                    <img
                      src={r.photoUrl ?? FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}
                      alt={r.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-xl object-cover border border-white/15 shrink-0"
                    />
                    <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
                      <p className="text-white text-[13px] font-semibold leading-tight m-0 sm:mt-2">
                        {r.name}
                      </p>
                      <p className="text-white/60 text-[11px] leading-tight m-0 mb-1.5">{r.city}</p>
                      <span className="inline-block whitespace-nowrap rounded-full bg-teal-400/15 text-teal-300 text-[10px] font-semibold px-2.5 py-1 leading-none">
                        {r.pakiet ?? FALLBACK_PAKIETY[i % FALLBACK_PAKIETY.length]}
                      </span>
                    </div>
                  </div>

                  {/* Kolumna z treścią */}
                  <div className="flex-1 min-w-0 self-start">
                    {/* Konkretna statystyka zamiast ogólnika — buduje wiarygodność mocniej niż przymiotnik */}
                    {stat && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 mb-3 text-teal-300 text-[11px] font-semibold">
                        <Clock size={12} strokeWidth={2.5} />
                        {stat}
                      </div>
                    )}

                    <p className="text-white/85 text-[15px] sm:text-base leading-relaxed mb-4 sm:mb-5">
                      „{r.text}”
                    </p>

                    <div className="flex items-center justify-start gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-teal-400 text-xs font-semibold">
                        <BadgeCheck size={13} />
                        Zweryfikowany klient
                      </span>
                      <span className="text-white/40 text-xs">· {r.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantees + Advisor contact — scalony panel (dawniej 2 osobne sekcje) */}
          <div
            className={`rounded-2xl p-6 sm:p-7 flex flex-col border border-white/10 bg-white/5 reveal ${sectionInView ? "in-view" : ""}`}
            style={{ animationDelay: "220ms" }}
          >
            <p className="uppercase mb-5 text-teal-400 text-xs font-bold tracking-wide">
              Kupujesz bez ryzyka
            </p>

            <div className="flex flex-col gap-5 mb-6">
              {GUARANTEES.map((g, i) => {
                const Icon = g.icon;
                return (
                  <div key={i} className="group flex gap-3.5">
                    <div className="flex items-center justify-center shrink-0 rounded-xl h-9 w-9 bg-teal-400/12 text-teal-300 transition-transform duration-300 group-hover:scale-110 group-hover:bg-teal-400/20">
                      <Icon size={17} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-white text-[0.9375rem] font-semibold m-0 mb-0.5">
                        {g.title}
                      </p>
                      <p className="text-white/60 text-[0.8438rem] leading-relaxed m-0">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini-profil doradcy — przejęty z dawnej ContactSection, teraz z krótkim bio zaufania */}
            <div className="flex items-center gap-4 pt-5 mb-5 border-t border-white/10">
              <img
                src={advisorPhotoUrl}
                alt={advisorName}
                className="h-16 w-16 shrink-0 rounded-xl object-cover border border-white/15"
              />
              <div>
                <p className="text-white text-lg font-bold leading-tight m-0">{advisorName}</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wide m-0">
                  {advisorRole}
                </p>
                {advisorBio && (
                  <p className="text-white/45 text-xs leading-snug m-0 mt-1">{advisorBio}</p>
                )}
              </div>
            </div>

            {/* Closing CTA — spersonalizowane, telefon doradcy */}
            <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-teal-500 px-4 py-3 text-white transition-transform duration-150 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Phone size={14} />
                  </span>
                  <span className="text-sm font-bold">
                    Zadzwoń
                    <br /> <span className="font-normal">{phoneNumber}</span>
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  className="text-white/70 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href={`sms:${phoneNumber.replace(/\s+/g, "")}?body=INTERNET`}
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white transition-transform duration-150 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={14} />
                  </span>
                  <span className="text-sm font-bold">Wyślij SMS</span>
                </span>
                <ChevronRight
                  size={16}
                  className="text-white/50 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>

            <p className="pt-5 mt-5 border-t border-white/10 text-white/55 text-[13px] leading-relaxed">
              Jeśli po podpisaniu umowy zmienisz zdanie, masz 14 dni na odstąpienie od umowy
              zawartej poza lokalem firmy. Późniejsze rozwiązanie umowy odbywa się zgodnie z jej
              warunkami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}