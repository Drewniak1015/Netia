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

/* ------------------------------------------------------------------ */
/* Leniwie ładowane tło — nie wchodzi do server-rendered HTML (ssr:false)*/
/* i nie blokuje main threadu w trakcie pierwszego malowania LCP.       */
/* ------------------------------------------------------------------ */
const FiberLinesBackground = dynamic(() => import("../home/Fiberlinesbackground"), {
  ssr: false,
  loading: () => null,
});
const TvMockup = dynamic(() => import("./Tvmockup"), {
  ssr: false,
  loading: () => null,
});

/* Leniwie ładowany mockup TV — montowany wyłącznie na desktopie, więc  */
/* na mobile jego kod (i cały użyty tam framer-motion) nigdy nie trafia */
/* do wykonywanego bundla. Patrz useIsDesktop niżej.                    */

/* ------------------------------------------------------------------ */
/* Proste "wjazdy" tekstu (badge, h2, h3, trust badges, CTA) są teraz   */
/* czystym CSS-em (klasa .fade-up + animation-delay), a nie             */
/* framer-motion. Framer-motion zostaje tylko przy h1 (minimalna,       */
/* transform-only animacja — patrz niżej) i przy TvMockup, który i tak  */
/* nie renderuje się na mobile. Redukuje to Script Evaluation w TBT,    */
/* bo silnik animacji JS uruchamia się dla dużo mniejszej liczby        */
/* elementów. Definicje .fade-up / .btn-cta idą do globals.css:         */
/*                                                                       */
/* @keyframes fade-up {                                                 */
/*   from { opacity: 0; transform: translateY(20px); }                  */
/*   to   { opacity: 1; transform: translateY(0); }                     */
/* }                                                                     */
/* .fade-up { animation: fade-up 0.6s ease-out both; }                  */
/*                                                                       */
/* .btn-cta {                                                            */
/*   transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;    */
/* }                                                                     */
/* .btn-cta:hover { transform: scale(1.02); }                            */
/* .btn-cta:active { transform: scale(0.98); }                           */
/*                                                                       */
/* @media (prefers-reduced-motion: reduce) {                            */
/*   .fade-up { animation: none; opacity: 1; transform: none; }         */
/*   .btn-cta:hover, .btn-cta:active { transform: none; }               */
/* }                                                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Hook: renderuj TvMockup tylko na desktopie, nie tylko ukrywaj CSS-em.*/
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Hero główny                                                         */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans"
      >
        {/* Tło z liniami światłowodowymi: ładowane leniwie, pomijane */}
        {/* całkowicie gdy użytkownik woli mniej ruchu na ekranie.     */}
        {!reduceMotion && <FiberLinesBackground />}

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:py-28">
          {/* Kolumna tekstowa */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Badge — czysty CSS, bez framer-motion */}
            <div
              className={`mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 lg:mx-0 ${
                reduceMotion ? "" : "fade-up"
              }`}
              style={reduceMotion ? undefined : { animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                Światłowód Netii oparty o sieć Orange
              </span>
            </div>

            {/* LCP element: w pełni widoczny od pierwszej klatki (brak   */}
            {/* opacity w animacji), animowany jest tylko transform —     */}
            {/* leci na compositorze, nie opóźnia ani nie obciąża LCP.    */}
            <h1
              className="text-2xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              Internet i telewizja, które po prostu działają.
            </h1>

            <h2
              className={`mt-2.5 text-base font-normal leading-snug text-white/75 sm:text-lg ${
                reduceMotion ? "" : "fade-up"
              }`}
              style={reduceMotion ? undefined : { animationDelay: "100ms" }}
            >
              Bez awarii —{" "}
              <span className="font-semibold text-teal-300">
                już w kilka dni od instalacji
              </span>
              .
            </h2>

            <h3
              className={`mx-auto mt-5 max-w-xl text-sm font-normal text-white/65 sm:text-base lg:mx-0 ${
                reduceMotion ? "" : "fade-up"
              }`}
              style={reduceMotion ? undefined : { animationDelay: "200ms" }}
            >
              Światłowód Netii oparty o sieć Orange oraz telewizja dla całej
              rodziny —{" "}
              <span className="font-semibold text-white">
                jedna stała opłata
              </span>{" "}
              przez cały okres umowy.
            </h3>

            {/* Trust badges — czysty CSS */}
            <div
              className={`mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start ${
                reduceMotion ? "" : "fade-up"
              }`}
              style={reduceMotion ? undefined : { animationDelay: "300ms" }}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm">
                <Users size={14} className="text-teal-300" />
                <span className="font-bold text-teal-300">2,4 mln</span> klientów w Polsce
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm">
                <Zap size={14} className="text-teal-300" />
                Instalacja w kilka dni
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm">
                <ShieldCheck size={14} className="text-teal-300" />
                Bez zobowiązań na start
              </span>
            </div>

            {/* CTA — dwa równorzędne przyciski kontaktu. Hover/tap na czystym CSS (.btn-cta w globals.css) zamiast whileHover/whileTap, żeby nie trzymać ich pod framerem. */}
            <div
              className={`mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start ${
                reduceMotion ? "" : "fade-up"
              }`}
              style={reduceMotion ? undefined : { animationDelay: "400ms" }}
            >
              <a
                href="tel:+48883334124"
                className="btn-cta flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-[240px]"
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
                <ChevronRight size={18} className="text-white/70" />
              </a>

              <a
                href="sms:+48883334124?body=INTERNET"
                className="btn-cta flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-[240px]"
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
                <ChevronRight size={18} className="text-white/50" />
              </a>
            </div>
          </div>

          {/* Kolumna wizualna — montowana wyłącznie na desktopie */}
          {isDesktop && <TvMockup />}
        </div>
      </section>
    </LazyMotion>
  );
}