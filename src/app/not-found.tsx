"use client";

// app/not-found.tsx
//
// Strona 404 w Next.js (App Router) — renderowana automatycznie, gdy
// trasa nie istnieje, lub ręcznie przez notFound() z next/navigation.
//
// STYL: 1:1 z resztą serwisu (NetiaHeader, OfferInternetTvSection,
// OfferQuizSection) — ciemne tło #0B2A3D, radialne gradienty teal,
// dekoracyjne SVG w rogu (ten sam wzór "sieć kropek" co w PromoBanner),
// framer-motion z tym samym easingiem (SMOOTH_EASE), te same CTA
// Zadzwoń / SMS oraz pasek zaufania.
//
// Zamiast losowego "ups, coś poszło nie tak" strona kieruje użytkownika
// z powrotem do sensownych miejsc konwersji (Dopasuj Ofertę, Specjalne
// Oferty, Lista Kanałów, Pomoc) — 404 to wciąż szansa na lead, nie
// ślepy zaułek.

import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  Gauge,
  Headset,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Tv,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const PHONE_DISPLAY = "+48 883 334 124";
const PHONE_HREF = "tel:+48883334124";
const SMS_HREF = "sms:+48883334124?body=POMOC";

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

interface QuickLink {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Dopasuj Ofertę",
    desc: "Internet, Internet + Telewizja albo pakiet szyty na miarę.",
    icon: Wifi,
    href: "/konfigurator/Internet#pakiety-internet-tv",
  },
  {
    title: "Specjalne Oferty",
    desc: "Aktualne promocje — nawet 12 miesięcy za 0 zł.",
    icon: Sparkles,
    href: "/oferty/max#pakiety-max",
  },
  {
    title: "Lista Kanałów",
    desc: "Sprawdź, co znajdziesz w każdym pakiecie TV.",
    icon: Tv,
    href: "/kanaly?tier=m",
  },
  {
    title: "Najczęstsze Pytania",
    desc: "Umowa, opłaty, instalacja — gotowe odpowiedzi.",
    icon: Search,
    href: "/pomoc/faq",
  },
];

interface TrustItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: Gauge,
    title: "Prędkość zgodna z umową",
    desc: "Minimum 50% deklarowanej prędkości, zgodnie z prawem.",
  },
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Odstąpienie od umowy bez podania przyczyny.",
  },
  {
    icon: Headset,
    title: "Wsparcie zawsze pod ręką",
    desc: "Infolinia i serwis techniczny gotowe pomóc.",
  },
];

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="overflow-x-hidden bg-[#0B2A3D] font-sans text-white">
        <div className="mx-auto max-w-[1140px] px-4 pt-28 sm:px-6 sm:pt-32">
          {/* HERO — ten sam wzorzec co PromoBanner: wyśrodkowany kontener,
              radialne gradienty teal, dekoracyjne SVG w prawym górnym rogu */}
          <m.section
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: SMOOTH_EASE }}
            className="relative mx-auto flex max-w-[820px] flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-12 text-center sm:py-16"
            style={{
              background:
                "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

            <svg
              className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="150" cy="55" r="5" fill="#2DD4BF" />
              <circle cx="150" cy="55" r="28" stroke="#2DD4BF" strokeOpacity="0.55" strokeWidth="2" />
              <circle cx="150" cy="55" r="52" stroke="#2DD4BF" strokeOpacity="0.32" strokeWidth="2" />
              <circle cx="150" cy="55" r="76" stroke="#99F6E4" strokeOpacity="0.18" strokeWidth="2" />
              <path
                d="M35 165 L85 118 L115 136 L165 78"
                stroke="#99F6E4"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 7"
              />
              <circle cx="35" cy="165" r="3.5" fill="#99F6E4" />
              <circle cx="85" cy="118" r="3.5" fill="#99F6E4" />
              <circle cx="115" cy="136" r="3.5" fill="#99F6E4" />
              <circle cx="165" cy="78" r="3.5" fill="#2DD4BF" />
            </svg>

            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
            >
              Błąd 404
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 m-0 text-[clamp(56px,12vw,110px)] font-black leading-none text-white"
            >
              4
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-teal-500 bg-clip-text text-transparent">
                0
              </span>
              4
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative z-10 max-w-md text-sm text-white/65 sm:text-base"
            >
              Tej strony nie znaleźliśmy — mogła zniknąć albo link jest
              nieaktualny. Sprawdź poniżej, może trafimy szybciej niż
              wsparcie techniczne.
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative z-10 mt-3"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(20,184,166,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Wróć na stronę główną
                <ChevronRight size={16} />
              </Link>
            </m.div>
          </m.section>

          {/* QUICK LINKS — zamiast ślepego zaułka, skieruj użytkownika do
              najważniejszych sekcji serwisu (ten sam wzorzec kart co
              SimplePanel w NetiaHeader) */}
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="mt-12 sm:mt-16"
          >
            <h2 className="text-center text-lg font-bold text-white sm:text-xl">
              Może szukasz jednego z tych miejsc?
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors duration-200 hover:border-teal-400/40 hover:bg-white/[0.08]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300 transition-colors duration-200 group-hover:bg-teal-400 group-hover:text-[#0B2A3D]">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                        {item.title}
                        <ChevronRight
                          size={14}
                          className="text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-teal-300"
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/55">
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </m.div>

          {/* TRUST BAR — ten sam wzorzec co pod każdą sekcją ofertową */}
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-2.5 sm:grid-cols-3 sm:mt-16"
          >
            {TRUST_ITEMS.map((item) => {
              const TrustIcon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-2.5 rounded-xl px-3.5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70">
                    <TrustIcon size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/90">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </m.div>

          {/* CLOSING CTA — Zadzwoń / SMS, ten sam styl co w QuizFaqSection */}
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="mx-auto mb-16 mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center sm:px-10 sm:py-10"
          >
            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Wolisz porozmawiać?
            </h3>
            <p className="mb-6 text-sm text-white/65 sm:text-[0.9375rem]">
              Doradca pomoże znaleźć to, czego szukasz — bez zobowiązań, ~3
              minuty rozmowy.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={PHONE_HREF}
                className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Phone size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                    <span className="block text-xs text-white/85">{PHONE_DISPLAY}</span>
                  </span>
                </span>
                <ChevronRight size={18} className="text-white/70" />
              </a>

              <a
                href={SMS_HREF}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">WYŚLIJ SMS</span>
                    <span className="block text-xs text-white/70">Oddzwonimy w 3 minuty</span>
                  </span>
                </span>
                <ChevronRight size={18} className="text-white/50" />
              </a>
            </div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}