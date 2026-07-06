"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Trophy,
  Clapperboard,
  Baby,
  Flag,
  ShieldAlert,
  Tv,
} from "lucide-react";
import type { ElementType } from "react";
import type { Tier } from "@/lib/channels";
type MainPackage = {
  name: string;
  count: number;
  desc: string;
  sub: string;
};

type Channel = {
  name: string;
  count: number;
};

type ThemeGroup = {
  icon: ElementType;
  title: string;
  desc: string;
  channels: Channel[];
};

const MAIN_PACKAGES: MainPackage[] = [
  {
    name: "Pakiet S",
    count: 81,
    desc: "Coś na Start — klasyczny zestaw informacyjno-rozrywkowy.",
    sub: "81 kanałów",
  },
  {
    name: "Pakiet M",
    count: 106,
    desc: "Najpopularniejszy — wszystko z S + dodatkowe sport, filmy, lifestyle.",
    sub: "106 kanałów",
  },
  {
    name: "Pakiet L",
    count: 185,
    desc: "Dla Wymagających — pełna baza: M + dokumentalne, muzyczne, więcej sportu.",
    sub: "185 kanałów",
  },
];

const THEME_GROUPS: ThemeGroup[] = [
  {
    icon: Trophy,
    title: "Sport",
    desc: "Dla kibiców — piłka, koszykówka, MMA, F1, golf.",
    channels: [
      { name: "Polsat Sport Premium", count: 6 },
      { name: "Eleven Sports", count: 5 },
    ],
  },
  {
    icon: Clapperboard,
    title: "Filmy i seriale",
    desc: "Premiery filmowe i seriale od HBO, CANAL+, FilmBox i Cinemax.",
    channels: [
      { name: "HBO + HBO Max", count: 3 },
      { name: "CANAL+ Prestige", count: 10 },
      { name: "CANAL+ Select", count: 8 },
      { name: "FilmBox", count: 5 },
      { name: "Cinemax", count: 2 },
    ],
  },
  {
    icon: Baby,
    title: "Dla dzieci i rodziny",
    desc: "Bajki, programy edukacyjne, kanały dla młodzieży.",
    channels: [{ name: "Pakiet Dla Dzieci", count: 13 }],
  },
  {
    icon: Flag,
    title: "Społeczność ukraińska",
    desc: "Kanały ukraińskojęzyczne — informacyjne, rozrywkowe i dziecięce.",
    channels: [{ name: "Pakiet Ukraina", count: 8 }],
  },
  {
    icon: ShieldAlert,
    title: "Tylko 18+",
    desc: "Pakiet dodatkowy dla widzów dorosłych — wymaga PIN-u w dekoderze.",
    channels: [{ name: "Pakiet Dla dorosłych", count: 8 }],
  },
];

export default function Przewodnik({
  tier,
  onTierChange,
}: {
  tier: Tier;
  onTierChange: (next: Tier) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full py-16 px-6 font-sans overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 mt-20">

        {/* ======================================================== */}
        {/* BANER Z NOWOCZESNĄ GRAFIKĄ SVG                         */}
        {/* ======================================================== */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12 mb-16"
          style={{
            background:
              "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
              "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
              "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
          }}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

          <svg
            className="pointer-events-none absolute -right-4 -top-8 hidden h-56 w-56 sm:block lg:h-72 lg:w-72"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#99F6E4" stopOpacity="0.15" />
              </linearGradient>
              <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Miękka poświata w tle */}
            <circle cx="120" cy="90" r="90" fill="url(#glowGrad)" />

            {/* Fale sygnału — statyczne okręgi */}
            {[24, 42, 60].map((r, idx) => (
              <circle
                key={r}
                cx="120"
                cy="150"
                r={r}
                stroke="url(#tealGrad)"
                strokeWidth="1.5"
                strokeDasharray={idx === 2 ? "3 5" : undefined}
                strokeOpacity={0.35 - idx * 0.06}
                fill="none"
              />
            ))}

            {/* Punkty nadajnika */}
            <circle cx="120" cy="60" r="5" fill="#2DD4BF" />

            {/* Dekoracyjne punkty świetlne */}
            <circle cx="60" cy="50" r="3" fill="#99F6E4" fillOpacity="0.5" />
            <circle cx="175" cy="70" r="2.5" fill="#2DD4BF" fillOpacity="0.5" />
            <circle cx="45" cy="120" r="2" fill="#2DD4BF" fillOpacity="0.35" />
          </svg>

          <motion.span
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
          >
            <Tv size={13} className="fill-current" />
            Przewodnik po pakietach
            <Tv size={13} className="fill-current" />
          </motion.span>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 m-0 text-[clamp(26px,4.2vw,42px)] font-extrabold text-white leading-tight"
          >
            Tematyczne grupy <span className="text-teal-300">kanałów TV Netia</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative z-10 mt-1 max-w-2xl text-sm text-white/65 sm:text-base leading-relaxed"
          >
            W ofercie Netii znajdziesz 232 kanałów rozproszonych po pakietach
            głównych (S, M, L) oraz dodatkach tematycznych i premium. Poniżej
            znajdziesz przewodnik — co tematycznie zawiera każda grupa.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="relative z-10 mt-4"
          >
            <motion.a
              href="#pelna-lista"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-xs sm:text-sm font-bold text-[#0B2A3D] shadow-lg shadow-teal-500/10 transition-transform duration-200"
            >
              Sprawdź pełną listę kanałów
              <ChevronDown size={15} />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ======================================================== */}
        {/* LISTA PAKIETÓW I ELEMENTY SIATKI                         */}
        {/* ======================================================== */}

        <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">
          Pakiety główne — wybierasz jeden
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 auto-rows-fr">
          {MAIN_PACKAGES.map((pkg, i) => {
            return (
              <motion.div
                key={pkg.name}
                whileHover={{ y: -3 }}
                className="card-fade-in h-full flex flex-col rounded-2xl border border-white/10 bg-white/5 px-6 py-6 transition-all duration-200"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                  <span className="font-extrabold text-teal-300 text-xl leading-none">
                    {pkg.count}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-3 flex-1">
                  {pkg.desc}
                </p>
                <span className="text-xs font-semibold text-teal-400">
                  {pkg.sub}
                </span>
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">
          Dodatki tematyczne i pakiety premium
        </p>

        <div
          id="pelna-lista"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 scroll-mt-24 auto-rows-fr"
        >
          {THEME_GROUPS.map((group, i) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.title}
                whileHover={{ y: -3 }}
                className="card-fade-in h-full flex flex-col rounded-2xl border border-white/10 bg-white/5 px-6 py-6 transition-all duration-200"
                style={{ animationDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-teal-400/15 text-teal-300 shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {group.title}
                    </h4>
                    <p className="text-xs text-white/50 leading-snug">
                      {group.desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  {group.channels.map((ch) => (
                    <div
                      key={ch.name}
                      className="flex items-center justify-between border-t border-white/5 pt-2 first:border-t-0 first:pt-0"
                    >
                      <span className="text-sm text-teal-300/90 font-medium">
                        {ch.name}
                      </span>
                      <span className="text-sm text-white/50">
                        {ch.count} kanałów
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .card-fade-in {
          opacity: 0;
          animation: cardFadeIn 0.5s ease-out forwards;
        }
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-fade-in {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}