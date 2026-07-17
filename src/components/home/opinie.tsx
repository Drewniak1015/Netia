"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  RotateCcw,
  Headset,
  Wrench,
  FileText,
  BadgeCheck,
  Phone,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
type Review = {
  initials: string;
  name: string;
  age: number;
  city: string;
  date: string;
  text: string;
};

const REVIEWS: Review[] = [
  {
    initials: "TW",
    name: "Tomasz W.",
    age: 47,
    city: "Poznań",
    date: "czerwiec 2026",
    text: "Dostałem SMS o kolejnej podwyżce od dotychczasowego operatora i tyle mi wystarczyło. U Netii cena w umowie to cena, którą płacę — bez niespodzianek co pół roku.",
  },
  {
    initials: "KD",
    name: "Kamila D.",
    age: 33,
    city: "Gdańsk",
    date: "maj 2026",
    text: "Pracuję zdalnie i prowadzę spotkania online codziennie — nie mogę sobie pozwolić na to, żeby internet 'akurat teraz' odmówił posłuszeństwa. Od kiedy mam Netię, po prostu o tym nie myślę.",
  },
  {
    initials: "RJ",
    name: "Rafał J.",
    age: 41,
    city: "Łódź",
    date: "kwiecień 2026",
    text: "U poprzedniego operatora awaria potrafiła trwać kilka dni, a infolinia odsyłała mnie z kwitkiem. Przy Netii jeszcze nie miałem sytuacji, żebym został bez pomocy dłużej niż kilka godzin.",
  },
];

const GUARANTEES = [
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Umowa poza salonem? Masz 14 dni na odstąpienie bez podania przyczyny.",
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
    icon: FileText,
    title: "Jasne warunki umowy",
    desc: "Wszystkie opłaty i zasady po okresie promocyjnym opisane wprost w umowie.",
  },
];

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

export default function NetiaSocialProof() {
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
        <div
          className={`flex justify-center mb-5 reveal ${sectionInView ? "in-view" : ""}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Opinie i gwarancje
          </span>
        </div>

        <h2
          className={`text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-8 reveal ${sectionInView ? "in-view" : ""}`}
          style={{ animationDelay: "80ms" }}
        >
          Zaufało nam <span className="text-teal-400">2,4 mln klientów</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          {/* Reviews column */}
          <div className="flex flex-col gap-4 h-full">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className={`flex-1 flex flex-col justify-between rounded-2xl p-6 border border-white/10 bg-white/5 transition-all duration-300 hover:border-teal-400/30 hover:bg-white/[0.07] hover:-translate-y-0.5 reveal ${sectionInView ? "in-view" : ""}`}
                style={{ animationDelay: `${160 + i * 100}ms` }}
              >
                <p className="text-white/85 text-base leading-relaxed mb-5">
                  „{r.text}”
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center shrink-0 rounded-full h-9.5 w-9.5 bg-teal-400/15 text-teal-300 text-[13px] font-semibold">
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-white text-[0.9375rem] font-semibold m-0">
                        {r.name}, {r.age} lat
                      </p>
                      <p className="text-white/60 text-[13px] m-0">{r.city}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-teal-400 text-xs font-semibold">
                      <BadgeCheck size={13} />
                      Zweryfikowany klient
                    </span>
                    <span className="text-white/40 text-xs">{r.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees column */}
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

            <p className="pt-5 mb-6 border-t border-white/10 text-white/55 text-[13px] leading-relaxed">
              Jeśli po podpisaniu umowy zmienisz zdanie, masz 14 dni na odstąpienie od umowy
              zawartej poza lokalem firmy. Późniejsze rozwiązanie umowy odbywa się zgodnie z jej
              warunkami.
            </p>

            {/* Closing CTA — call or SMS only, styled like Hero buttons */}
            <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
              <a
                href="tel:+48883334124"
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-teal-500 px-4 py-3 text-white transition-transform duration-150 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Phone size={14} />
                  </span>
                  <span className="text-sm font-bold">Zadzwoń<br/> <span className="font-normal">+48 883 883 883</span></span>
                </span>
                <ChevronRight
                  size={16}
                  className="text-white/70 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href="sms:+48883334124?body=INTERNET"
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
          </div>
        </div>
      </div>
    </section>
  );
}