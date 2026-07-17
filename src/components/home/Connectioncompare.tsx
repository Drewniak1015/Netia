"use client";

import { m, useReducedMotion } from "framer-motion";
import { WifiOff, Wifi, Loader2, Video, CheckCircle2 } from "lucide-react";

/**
 * Split-screen "przed / po" — wizualizuje dokładnie ból z headline'a
 * ("internet, który pada w najgorszym momencie") kontra obietnicę.
 * Lewo: zerwane połączenie wideo, kręcący się loader.
 * Prawo: płynna rozmowa wideo, stabilne połączenie.
 */
export default function ConnectionCompare() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Porównanie: po lewej zerwane połączenie internetowe podczas rozmowy wideo, po prawej płynne i stabilne połączenie"
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30"
    >
      {/* Eyebrow — nadaje kontekst, że to nie ikonografia tylko realny test */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
          test połączenia · rozmowa wideo
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2">
        {/* LEWO — Twój obecny internet */}
        <div className="relative flex flex-col items-center justify-center gap-4 border-r border-white/10 bg-white/[0.02] px-4 py-10 sm:py-14">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
            <m.span
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1.4, repeat: Infinity, ease: "linear" }
              }
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 size={30} className="text-white/30" />
            </m.span>
            <WifiOff size={20} className="text-white/40" />
          </div>

          <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1">
            <Video size={12} className="text-white/40" />
            <span className="text-[11px] font-medium text-white/40">
              połączenie przerwane
            </span>
          </div>

          <div className="mt-1 text-center">
            <p className="text-sm font-semibold text-white/60">
              Twój obecny internet
            </p>
            <p className="mt-1 text-xs text-white/35">
              buforowanie w najgorszym momencie
            </p>
          </div>
        </div>

        {/* PRAWO — Z nami: mocniejsza waga wizualna, ta strona ma "wygrać" */}
        <div className="relative flex flex-col items-center justify-center gap-4 bg-teal-400/[0.09] px-4 py-10 sm:py-14">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-teal-400/10">
            <m.span
              animate={reduceMotion ? undefined : { scale: [1, 1.1, 1] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
              className="absolute inset-0 rounded-full ring-1 ring-teal-300/30"
            />
            <Wifi size={28} className="text-teal-300" />
          </div>

          <div className="flex items-center gap-2 rounded-full bg-teal-400/15 px-3 py-1">
            <CheckCircle2 size={12} className="text-teal-300" />
            <span className="text-[11px] font-medium text-teal-200">
              płynnie, bez przerwy
            </span>
          </div>

          <div className="mt-1 text-center">
            <p className="text-base font-bold text-white">Z nami</p>
            <p className="mt-1 text-xs text-teal-200/70">
              stabilne połączenie, cały czas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}