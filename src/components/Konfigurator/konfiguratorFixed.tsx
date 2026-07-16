"use client";

/* ---------------------------------------------------------------------- */
/*  PodsumowanieMini                                                       */
/*  Zwykły element w przepływie strony (NIE fixed/floating) — karta,       */
/*  która pojawia się w miejscu, gdzie ją wstawisz w JSX (np. na dole      */
/*  sekcji konfiguratora, tuż nad stopką). Pokazuje się dopiero, gdy       */
/*  user wybrał chociaż pakiet internetowy (maWybor === true).            */
/*  Podlicza sumę na żywo z KonfiguratorProvider. Jedyne CTA prowadzi do   */
/*  osobnej strony checkoutu /konfigurator/podsumowanie.                  */
/*                                                                          */
/*  Animacje: karta wjeżdża z fadeUp, pozycje (chipy) pojawiają się ze      */
/*  stagger (jedna po drugiej), CTA ma hover/tap scale.                    */
/* ---------------------------------------------------------------------- */

import Link from "next/link";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Wifi, Tv, Smartphone, Gift } from "lucide-react";
import { useKonfigurator } from "@/components/Konfigurator/konfigurator";

interface PodsumowanieMiniProps {
  /** Dokąd prowadzi CTA — domyślnie strona checkoutu /konfigurator/podsumowanie */
  podsumowanieHref?: string;
}

const kontener = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const chip = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export default function PodsumowanieMini({
  podsumowanieHref = "/konfigurator/podsumowanie",
}: PodsumowanieMiniProps) {
  const { maWybor, suma, pakiet, tv, uslugi5g, dodatki } = useKonfigurator();
  const reduceMotion = useReducedMotion();

  const pozycje = [
    pakiet && { etykieta: pakiet.nazwa, ikona: <Wifi size={13} className="text-teal-300" /> },
    tv && { etykieta: tv.nazwa, ikona: <Tv size={13} className="text-teal-300" /> },
    uslugi5g && { etykieta: uslugi5g.nazwa, ikona: <Smartphone size={13} className="text-teal-300" /> },
    dodatki.length > 0 && {
      etykieta: `${dodatki.length} ${dodatki.length === 1 ? "dodatek" : "dodatki"}`,
      ikona: <Gift size={13} className="text-teal-300" />,
    },
  ].filter(Boolean) as { etykieta: string; ikona: React.ReactNode }[];

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {maWybor && (
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-teal-400/25 p-5 font-sans sm:p-6"
            style={{
              backgroundColor: "rgba(11,42,61,0.9)",
              boxShadow: "0 0 0 1px rgba(45,212,191,0.08)",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  Twoja oferta
                </span>
                <m.div
                  variants={reduceMotion ? undefined : kontener}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5"
                >
                  <AnimatePresence mode="popLayout">
                    {pozycje.map((p) => (
                      <m.span
                        key={p.etykieta}
                        layout
                        variants={reduceMotion ? undefined : chip}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 text-xs font-medium text-white/70"
                      >
                        {p.ikona}
                        {p.etykieta}
                      </m.span>
                    ))}
                  </AnimatePresence>
                </m.div>
              </div>

              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                <m.span
                  key={suma}
                  initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-2xl font-extrabold text-teal-300"
                >
                  {suma} <span className="text-sm font-semibold text-white/60">zł/mies.</span>
                </m.span>
              </div>
            </div>

            <m.div
              whileHover={reduceMotion ? undefined : { scale: 1.015 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-5"
            >
              <Link
                href={podsumowanieHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-400"
              >
                Zobacz pełne podsumowanie
                <ArrowRight size={16} />
              </Link>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}