"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Users,
  Wifi,
  ShieldCheck,
  Zap,
} from "lucide-react";

const TvMockup = dynamic(() => import("./Tvmockup"), {
  ssr: false,
  loading: () => null,
});

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

/* Smooth custom easing — delikatny ease-out, bez "szarpania" na końcu */
const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

/* Wariant fade-up z lekkim skalowaniem — mniej "sztywny" niż czysty translate */
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: SMOOTH_EASE },
  },
};

/* Kontener do stagger'owania dzieci (badges, ikony) */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: SMOOTH_EASE },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans pt-26"
      >
        <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:py-28">
          {/* Kolumna tekstowa */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Badge */}
            <m.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: 0 }}
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 lg:mx-0"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                Światłowód Netii oparty o sieć Orange
              </span>
            </m.div>

            {/* LCP element: h1 zostaje "lekki" (brak scale/blur), ale ma płynne wejście */}
            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: SMOOTH_EASE }}
              className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl"
            >
              Internet i telewizja, które po prostu działają.
            </m.h1>

            <m.h2
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.65, ease: SMOOTH_EASE, delay: 0.12 }}
              className="mt-2.5 text-base font-normal leading-snug text-white/75 sm:text-lg"
            >
              Bez awarii —{" "}
              <span className="font-semibold text-teal-300">
                już w kilka dni od instalacji
              </span>
              .
            </m.h2>

            <m.h3
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.65, ease: SMOOTH_EASE, delay: 0.22 }}
              className="mx-auto mt-5 max-w-xl text-sm font-normal text-white/65 sm:text-base lg:mx-0"
            >
              Światłowód Netii oparty o sieć Orange oraz telewizja dla całej
              rodziny —{" "}
              <span className="font-semibold text-white">
                jedna stała opłata
              </span>{" "}
              przez cały okres umowy.
            </m.h3>

            {/* Trust badges — stagger po jednym elemencie, płynniej niż wspólny fade */}
            <m.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={staggerContainer}
              className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
            >
              <m.span
                variants={staggerItem}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm"
              >
                <Users size={14} className="text-teal-300" />
                <span className="font-bold text-teal-300">2,4 mln</span> klientów w Polsce
              </m.span>
              <m.span
                variants={staggerItem}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm"
              >
                <Zap size={14} className="text-teal-300" />
                Instalacja w kilka dni
              </m.span>
              <m.span
                variants={staggerItem}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm"
              >
                <ShieldCheck size={14} className="text-teal-300" />
                Bez zobowiązań na start
              </m.span>
            </m.div>

            {/* CTA */}
            <m.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: SMOOTH_EASE, delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <m.a
                href="tel:+48883334124"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }
                whileTap={
                  reduceMotion
                    ? undefined
                    : { scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 25 } }
                }
                className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Phone size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                    <span className="block text-xs text-white/85">+48 883 334 124</span>
                  </span>
                </span>
                <m.span
                  whileHover={reduceMotion ? undefined : { x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ChevronRight size={18} className="text-white/70" />
                </m.span>
              </m.a>

              <m.a
                href="sms:+48883334124?body=INTERNET"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }
                whileTap={
                  reduceMotion
                    ? undefined
                    : { scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 25 } }
                }
                className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">WYŚLIJ SMS</span>
                    <span className="block text-xs text-white/70">Oddzwonimy w kilka minut</span>
                  </span>
                </span>
                <m.span
                  whileHover={reduceMotion ? undefined : { x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ChevronRight size={18} className="text-white/50" />
                </m.span>
              </m.a>
            </m.div>
          </div>

          {isDesktop && <TvMockup />}
        </div>
      </section>
    </LazyMotion>
  );
}