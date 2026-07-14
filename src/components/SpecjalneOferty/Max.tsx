"use client";

import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Check,
  Star,
  Package,
  Tv,
  Search,
  Sparkles,
  Shield,
  Clapperboard,
  PlayCircle,
  Trophy,
  Activity,
  Film,
  Lock,
  Medal,
  type LucideIcon,
} from "lucide-react";

/**
 * OfferMaxSection
 * Sekcja promocyjna "Oferta Max": baner promo, karty pakietów (MAX 1000 / MAX 2000)
 * oraz siatka pakietów telewizyjnych Premium.
 *
 * Animacje dodane w stylu PopularneOferty.tsx: LazyMotion + domAnimation,
 * fadeUp przy wejściu w viewport, whileHover/whileTap na CTA, respekt dla
 * useReducedMotion.
 */

/* Wspólny wariant fade-up — zgodnie z PopularneOferty.tsx */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// TODO: podmień na docelową ścieżkę strony pomocy telewizji, jeśli routing
// wygląda inaczej niż zakładany tu "/pomoc/telewizja".
const POMOC_TV_URL = "/pomoc/Telewizja";

/** Format kotwicy zgodny z anchorIdForPackageKey() w NetiaTelewizjaPomocPage.tsx:
 *  "pakiet-" + klucz z dwukropkiem zamienionym na myślnik. */
function pakietHref(addonKey?: string): string {
  if (!addonKey) return `${POMOC_TV_URL}#pakiety`;
  return `${POMOC_TV_URL}#pakiet-addon-${addonKey}`;
}

interface PackageCardProps {
  name: string;
  speed: string;
  price: string;
  monthsPill: string;
  featured?: boolean;
  index: number;
  reduceMotion: boolean | null;
}

function PackageCard({
  name,
  speed,
  price,
  monthsPill,
  featured,
  index,
  reduceMotion,
}: PackageCardProps) {
  return (
    <m.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={`relative flex flex-col rounded-2xl p-5 pt-5 pb-5 sm:p-7 sm:pt-7 sm:pb-6 ${
        featured
          ? "border-2 border-pink-400/70 bg-gradient-to-b from-pink-400/[0.08] to-white/[0.03] shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(236,72,153,0.45)]"
          : "border border-white/10 bg-white/[0.04]"
      }`}
    >
      {featured && (
        <m.span
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B2A3D] shadow-sm"
        >
          Najczęściej wybierany
        </m.span>
      )}

      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-xl font-extrabold text-pink-400">{name}</span>
        <span className="rounded-full bg-pink-400/10 px-3 py-1 text-xs font-bold text-pink-300">
          {monthsPill}
        </span>
      </div>

      <div className="mb-5 flex items-baseline gap-2 border-b border-white/10 pb-5">
        <span className="text-[13px] text-white/55">od 13 mies.</span>
        <span className="text-2xl font-black leading-none text-white">{price}</span>
      </div>

      <ul className="mb-6 flex-1 list-none space-y-3 p-0">
        <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
            <Check size={14} strokeWidth={3} />
          </span>
          Internet do <b className="font-bold">{speed}</b>
        </li>
        <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
            <Check size={14} strokeWidth={3} />
          </span>
          Telewizja L 4K z Dekoderem
        </li>
        <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
            <Check size={14} strokeWidth={3} />
          </span>
          <span>
            Bezpieczny Internet Ultra
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/55">
              <Shield size={11} className="text-pink-300" />
              Ochrona 5 urządzeń + CyberEkspert
            </span>
          </span>
        </li>
      </ul>

      <div className="flex flex-wrap gap-3">
        <m.a
          href="#"
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-transparent bg-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)]"
        >
          <Phone size={16} />
          Zadzwoń
        </m.a>
        <m.a
          href="#"
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white"
        >
          <MessageCircle size={16} />
          Zamów SMS
        </m.a>
      </div>
    </m.div>
  );
}

interface TvCardProps {
  name: string;
  price: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  /** Klucz dodatku z lib/channels.ts (ADDONS) — steruje przekierowaniem do
   *  konkretnego pakietu na stronie pomocy. Brak = link do ogólnej sekcji "Pakiety". */
  addonKey?: string;
  index: number;
  reduceMotion: boolean | null;
}

function TvCard({
  name,
  price,
  icon: Icon,
  iconColor,
  iconBg,
  addonKey,
  index,
  reduceMotion,
}: TvCardProps) {
  return (
    <m.a
      href={pakietHref(addonKey)}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="flex cursor-pointer flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center no-underline transition-colors hover:border-pink-400/40 sm:p-5"
    >
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-inset ring-white/10"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={19} strokeWidth={2.2} />
      </div>
      <div className="mb-2 min-h-[36px] text-sm font-bold text-white">{name}</div>
      <div className="text-[15px] font-extrabold text-pink-400">{price}</div>
      <div className="mt-0.5 text-[11px] text-white/55">od 13 m-ca</div>
    </m.a>
  );
}

const tvPackages: Omit<TvCardProps, "index" | "reduceMotion">[] = [
  { name: "HBO + HBO Max", price: "+25 zł", icon: Clapperboard, iconColor: "#c084fc", iconBg: "rgba(192,132,252,0.14)", addonKey: "hbo" },
  { name: "Canal+ Prestige", price: "+50 zł", icon: PlayCircle, iconColor: "#fb7185", iconBg: "rgba(251,113,133,0.14)", addonKey: "canal-plus-prestige" },
  { name: "Canal+ Select", price: "+35 zł", icon: PlayCircle, iconColor: "#60a5fa", iconBg: "rgba(96,165,250,0.14)", addonKey: "canal-plus-select" },
  { name: "Polsat Sport Premium", price: "+20 zł", icon: Trophy, iconColor: "#fb923c", iconBg: "rgba(251,146,60,0.14)", addonKey: "polsat-sport-premium" },
  { name: "Eleven Sports", price: "+10 zł", icon: Activity, iconColor: "#34d399", iconBg: "rgba(52,211,153,0.14)", addonKey: "eleven-sports" },
  { name: "FilmBox", price: "+10 zł", icon: Film, iconColor: "#fbbf24", iconBg: "rgba(251,191,36,0.14)", addonKey: "filmbox" },
  { name: "Dla Dorosłych", price: "+10 zł", icon: Lock, iconColor: "#f472b6", iconBg: "rgba(244,114,182,0.14)", addonKey: "dorosli" },
  // Kombinacja dwóch dodatków naraz — brak jednego wspólnego wpisu na stronie
  // pomocy, więc linkujemy do ogólnej sekcji "Pakiety" zamiast do konkretnego akordeonu.
  { name: "Polsat Sport Premium + Eleven Sports", price: "+20 zł", icon: Medal, iconColor: "#2dd4bf", iconBg: "rgba(45,212,191,0.14)" },
];

/** Dekoracyjna ilustracja hero: monitor + laptop z neonowym "MAX". */
function HeroDevices({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
<m.div
  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
  className="relative mx-auto hidden h-[260px] w-[360px] max-w-none shrink-0 sm:block lg:mx-0"
>
      <svg
        viewBox="0 0 360 260"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="maxGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="55%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
          <linearGradient id="maxGlowBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="45%" stopColor="#ec4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="haze" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ambient haze */}
        <ellipse cx="190" cy="120" rx="150" ry="120" fill="url(#haze)" />

        {/* sweeping light arc — animowany rysunek ścieżki */}
        <m.path
          d="M -10 230 C 90 250, 150 90, 260 60 S 360 20 380 -10"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
        />

        {/* laptop (tilted, back-right) */}
        <g transform="translate(150,150) rotate(-6)">
          <rect x="0" y="0" width="150" height="92" rx="8" fill="#0d2f45" stroke="rgba(255,255,255,0.12)" />
          <rect x="8" y="8" width="134" height="76" rx="4" fill="#081f30" />
          <text
            x="75"
            y="55"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="800"
            fontStyle="italic"
            fontSize="26"
            fill="url(#maxGlowBlue)"
            filter="url(#softGlow)"
          >
            max
          </text>
          <rect x="-6" y="90" width="162" height="6" rx="3" fill="#0a2438" />
        </g>

        {/* monitor (front-left, main) */}
        <g transform="translate(70,20)">
          <rect x="0" y="0" width="210" height="130" rx="10" fill="#0d2f45" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="9" y="9" width="192" height="112" rx="5" fill="#081f30" />
          <text
            x="105"
            y="76"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="44"
            fill="url(#maxGlow)"
            filter="url(#softGlow)"
          >
            max
          </text>
          <rect x="95" y="130" width="20" height="18" fill="#0d2f45" />
          <rect x="70" y="148" width="70" height="7" rx="3.5" fill="#0d2f45" />
        </g>
      </svg>
    </m.div>
  );
}

export default function OfferMaxSection() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="overflow-x-hidden bg-[#0B2A3D] font-sans text-white sm:pt-36 pt-36">
        {/* HERO PROMO BANNER */}
        <m.section
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
className="relative mx-auto box-border flex w-[calc(100%-2rem)] max-w-305 flex-col items-center gap-8 overflow-hidden rounded-[20px] border border-white/[0.08] px-4 pb-10 pt-10 text-center sm:w-[calc(100%-3rem)] sm:px-6 sm:pb-12 sm:pt-14 lg:flex-row lg:justify-between lg:gap-10 lg:px-14 lg:text-left"
          style={{
            background:
              "radial-gradient(120% 160% at 15% 0%, rgba(236,72,153,.25), transparent 55%), " +
              "radial-gradient(120% 160% at 85% 100%, rgba(249,168,212,.18), transparent 55%), " +
              "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
          }}
        >
          {/* subtle top accent line */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />

          <div className="max-w-[540px]">
            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(236,72,153,0.7)]"
            >
              <Star size={13} fill="#0B2A3D" />
              Promocja
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Dajemy Maxx!
              <span className="mt-1.5 block bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-[clamp(30px,5vw,52px)] font-black text-transparent">
                12 miesięcy za 0 zł
              </span>
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-4 flex items-center justify-center gap-2 text-base text-white/65 lg:justify-start"
            >
              <Sparkles size={15} className="text-pink-300" />
              Internet Max z Telewizją L 4K + Bezpieczny Internet Ultra
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-start"
            >
              <m.a
                href="tel:+48883334124"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-pink-500 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)]"
              >
                <Phone size={16} />
                ZADZWOŃ +48 883 334 124
              </m.a>
              <m.a
                href="sms:+48883334124?body=MAX"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white"
              >
                <MessageCircle size={16} />
                WYŚLIJ SMS
              </m.a>
            </m.div>
          </div>

          <div className="shrink-0">
            <HeroDevices reduceMotion={reduceMotion} />
          </div>
        </m.section>

        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          {/* SECTION TITLE */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 mb-8 text-center sm:mt-16 sm:mb-10"
          >
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold text-white">
              Wybierz swój pakiet <span className="text-pink-400">Max</span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-300" />
          </m.div>

          {/* PACKAGE CARDS */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 pt-2">
            <PackageCard
              name="MAX 1000"
              speed="1000 Mb/s"
              price="140 zł/mies."
              monthsPill="12 miesięcy za 0 zł!"
              index={0}
              reduceMotion={reduceMotion}
            />
            <PackageCard
              name="MAX 2000"
              speed="2000 Mb/s"
              price="160 zł/mies."
              monthsPill="12 miesięcy za 0 zł!"
              featured
              index={1}
              reduceMotion={reduceMotion}
            />
          </div>

          {/* INFO BAR */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0f3550] px-4 py-4 text-[13px] text-white/65 sm:px-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
                <Package size={17} />
              </span>
              <span>
                <b className="text-white">SoundBox 4K</b> (+30 zł/msc) — opcja do zamówienia, płatny od 1
                miesiąca.
              </span>
            </div>
<m.a
  href="/kanaly"
  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-pink-400 px-4 py-2.5 text-[13px] font-bold text-pink-400 no-underline cursor-pointer"
>
  <Tv size={15} />
  Wyszukiwarka kanałów TV
  <Search size={14} />
</m.a>
          </m.div>

          {/* TV PACKAGES */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-16 mb-8 text-center sm:mt-20"
          >
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold text-white">
              Pakiety telewizyjne <span className="text-pink-400">Premium</span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-300" />
            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mx-auto mt-5 inline-block rounded-full bg-pink-400/10 px-3.5 py-1.5 text-xs font-bold text-pink-300"
            >
              12 miesięcy 0 zł
            </m.span>
          </m.div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 pb-10">
            {tvPackages.map((pkg, index) => (
              <TvCard
                key={pkg.name}
                name={pkg.name}
                price={pkg.price}
                icon={pkg.icon}
                iconColor={pkg.iconColor}
                iconBg={pkg.iconBg}
                addonKey={pkg.addonKey}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          {/* LEGAL DISCLAIMER */}
          <p className="pb-16 text-left text-[11px] leading-relaxed text-white/35">
            Prezentowana oferta Netii S.A.: „Wybierz rabat 12 miesięcy” (PON, HFC, ETTH) obowiązuje
            przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy
            jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W
            przypadku rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10
            zł. Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za
            Internet i 2 zł za Telewizję. Po 24 miesiącach cena abonamentu wzrasta o 10 zł. „Wybierz
            rabat 12 miesięcy” stanowi wyłącznie nazwę marketingową. Usługa Internetowa oparta jest
            na parametrach jakości wynikających z maksymalnych parametrów technicznych danej
            technologii, w jakiej świadczona jest Usługa Internetowa, lub wynikających z ofertowych
            ustawień technicznych łącza. Prędkość 2 Gb/s jest dostępna na technologii PON. Parametry
            świadczenia Usługi Internetowej, w szczególności parametry prędkości oraz wpływu innych
            Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest ograniczona
            terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.
          </p>
        </div>
      </div>
    </LazyMotion>
  );
}