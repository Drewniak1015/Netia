"use client";

import { memo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { Check, MessageCircle, Phone, Router, Tv, Gamepad2 } from "lucide-react";

type Feature = {
  label: string;
};

type Offer = {
  speed: string;
  pkg: string;
  price: string;
  priceNote: string;
  features: Feature[];
  featured?: boolean;
};

const offers: Offer[] = [
  {
    speed: "1000 Mb/s",
    pkg: "TV S",
    price: "70 zł",
    priceNote: "Przez 24 miesiące z rabatami",
    features: [
      { label: "Router z Wi-Fi 6 w cenie" },
      { label: "Dekoder 4K w cenie" },
      { label: "Netia GO w cenie" },
    ],
  },
  {
    speed: "1000 Mb/s",
    pkg: "TV M",
    price: "80 zł",
    priceNote: "Przez 24 miesiące z rabatami",
    featured: true,
    features: [
      { label: "Router z Wi-Fi 6 w cenie" },
      { label: "Dekoder 4K w cenie" },
      { label: "Netia GO w cenie" },
      { label: "Gigangrywarka Basic" },
    ],
  },
  {
    speed: "2000 Mb/s",
    pkg: "TV L",
    price: "125 zł",
    priceNote: "Przez 24 miesiące z rabatami",
    features: [
      { label: "Router Combo z ONT Wi-Fi 7" },
      { label: "Dekoder 4K w cenie" },
      { label: "Netia GO w cenie" },
      { label: "Gigangrywarka Basic" },
    ],
  },
];

const PHONE = "+48 883 334 124";

// Variants defined once at module scope so they aren't re-created every render.
// Only `opacity` and `transform` (y) are animated — both run on the GPU
// compositor and never trigger layout/paint, keeping scroll-linked
// animation cheap even on low-end devices.
// Uwaga: nagłówek h2 nie ma już własnego wariantu wejścia — patrz niżej,
// dlaczego renderuje się statycznie.
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Memoized so a re-render of the parent (e.g. from unrelated state elsewhere
// on the page) doesn't re-render every card — each only re-renders if its
// own `offer` prop reference changes, and `offers` is a static module-level
// array, so in practice these mount once.
const OfferCard = memo(function OfferCard({ offer, reduceMotion }: { offer: Offer; reduceMotion: boolean }) {
  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex flex-col rounded-2xl border p-6 will-change-transform ${
        offer.featured
          ? "border-teal-400/50 bg-[#0f2436] shadow-[0_0_24px_-8px_rgba(45,212,191,0.25)]"
          : "border-white/10 bg-[#0d1f31] hover:border-white/20"
      }`}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a2b] text-center">
          Najczęściej wybierana
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      <p className="mt-1 text-2xl font-extrabold text-white leading-tight">
        {offer.speed} <span className="text-lg font-bold text-slate-300">+ {offer.pkg}</span>
      </p>

      <div className="mt-4 pb-4 border-b border-white/10">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          Abonament
        </p>
        <p className="text-lg font-extrabold text-orange-300 leading-tight">
          6 miesięcy za 0 zł
        </p>
        <p className="text-[11px] text-slate-500">+ po rabatach</p>
      </div>

      <ul className="mt-4 space-y-3 flex-1">
        {offer.features.map((f) => (
          <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15">
              <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
        <p className="text-3xl font-extrabold text-white">
          {offer.price} <span className="text-sm font-medium text-slate-400">/ VAT</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{offer.priceNote}</p>
      </div>

      <m.button
        type="button"
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-bold text-[#0a1a2b] transition-colors hover:bg-teal-300"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </m.button>

      <m.a
        href={`tel:${PHONE.replace(/\s/g, "")}`}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </m.a>
    </m.article>
  );
});

export default function Oferty() {
  // Respects the OS-level "reduce motion" preference — when set, we skip
  // hover/tap transforms and let entrance animations fall back to a plain
  // opacity fade (still declared via variants, just near-instant).
  const reduceMotion = useReducedMotion();

  return (
    // LazyMotion + the `m` component (instead of `motion`) trims framer-motion's
    // client bundle down to ~6kb by loading only the "domAnimation" feature
    // set (transform/opacity/gestures) instead of the full animation engine.
    <LazyMotion features={domAnimation} strict>
      <section className="relative w-full bg-[#0a1a2b] py-20 px-6 overflow-hidden">
        {/* ambient background lines, consistent with hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              ŚWIATŁOWÓD NETII OPARTY O SIEĆ ORANGE
            </span>
            {/* Renderowany statycznie: jeśli ta sekcja kiedykolwiek trafi */}
            {/* above-the-fold (np. inny landing bez Hero), ten h2 stanie  */}
            {/* się elementem LCP — nie może więc czekać na hydrację JS.   */}
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
              Popularne <span className="text-teal-400">oferty</span>
            </h2>
            <p className="mt-3 text-slate-400 text-base">
              Jedna stała opłata przez cały okres umowy — bez ukrytych kosztów.
            </p>
          </div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {offers.map((offer) => (
              <OfferCard key={`${offer.speed}-${offer.pkg}`} offer={offer} reduceMotion={!!reduceMotion} />
            ))}
          </m.div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={footerVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400"
          >
            <span className="flex items-center gap-2">
              <Router className="h-4 w-4 text-teal-400" /> Router w cenie abonamentu
            </span>
            <span className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-teal-400" /> 200+ kanałów, HBO Max i Netflix
            </span>
            <span className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-teal-400" /> Giangrywarka w wybranych pakietach
            </span>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}