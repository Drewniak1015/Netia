"use client";

import { memo, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Wifi, ChevronDown } from "lucide-react";

type InternetOffer = {
  tech: string;
  speed: string;
  desc: string;
  price: string;
};

const internetOffers: InternetOffer[] = [
  {
    tech: "HFC / PON / ETTH",
    speed: "300 Mb/s",
    desc: "Stabilne łącze dla domu — streaming, praca zdalna i nauka online bez opóźnień.",
    price: "40 zł",
  },
  {
    tech: "PON / HFC / ETTH",
    speed: "1000 Mb/s",
    desc: "Szybki światłowód dla wymagających — gry online, 4K i wiele urządzeń jednocześnie.",
    price: "65 zł",
  },
  {
    tech: "PON",
    speed: "2000 Mb/s",
    desc: "Maksymalna prędkość Netii — technologia PON dla profesjonalistów i dużych gospodarstw.",
    price: "85 zł",
  },
];

// Hoisted to module scope — same rationale as in Oferty.tsx: avoid
// reallocating object/array literals on every render.
const sectionBgStyle = { backgroundColor: "#0B2A3D" } as const;

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const panelVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } },
};

const InternetCard = memo(function InternetCard({
  offer,
  reduceMotion,
}: {
  offer: InternetOffer;
  reduceMotion: boolean;
}) {
  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col rounded-2xl border border-white/10 bg-[#0d1f31] p-6 hover:border-teal-400/30 transition-colors will-change-transform"
    >
      <span className="inline-flex w-fit items-center rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-300">
        {offer.tech}
      </span>

      <p className="mt-4 text-xl font-extrabold text-white leading-tight">
        Internet do {offer.speed}
      </p>

      <p className="mt-2 text-sm text-slate-400 leading-relaxed flex-1">
        {offer.desc}
      </p>

      <p className="mt-5 text-lg font-bold text-teal-400">
        od {offer.price}
        <span className="text-sm font-medium text-slate-400"> /mies.</span>
      </p>
    </m.article>
  );
});

export default function OfertyInternet() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <LazyMotion features={domAnimation} strict>
      <div style={sectionBgStyle} className="pb-6">
        <div className="pt-6 flex justify-center">
          <m.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-teal-300 transition-colors hover:bg-white/10"
          >
            <Wifi className="h-4 w-4" />
            {open ? "Ukryj oferty samego internetu" : "Zobacz oferty samego internetu"}
            <m.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </m.span>
          </m.button>
        </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="internet-offers"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={panelVariants}
            className="overflow-hidden"
          >
            <section className="pt-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                    Internet Netia <span className="text-teal-400">— szybki światłowód dla domu</span>
                  </h3>
                  <p className="mt-3 text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                    Netia oferuje internet światłowodowy w technologii PON, ETTH i HFC z prędkościami
                    od 150 Mb/s do 2000 Mb/s. Wybierz pakiet dopasowany do Twoich potrzeb — z umową
                    na 24, 12 lub 9 miesięcy albo bez zobowiązań.
                  </p>
                </div>

                <m.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={gridVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {internetOffers.map((offer) => (
                    <InternetCard key={offer.speed} offer={offer} reduceMotion={!!reduceMotion} />
                  ))}
                </m.div>

                <p className="mt-6 text-center text-xs text-slate-500">
                  * ceny z rabatami przy umowie 24 miesiące
                </p>

         <div className="mt-6 flex justify-center">
  <m.a
    href="tel:+48883334124"
    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
    transition={{ duration: 0.15 }}
    className="flex items-center justify-center rounded-xl bg-teal-400 px-8 py-2.5 text-sm font-bold text-[#0a1a2b] transition-colors hover:bg-teal-300"
  >
    Sprawdź ofertę Internet Netia
  </m.a>
</div>
              </div>
            </section>
          </m.div>
        )}
      </AnimatePresence>
      </div>
    </LazyMotion>
  );
}