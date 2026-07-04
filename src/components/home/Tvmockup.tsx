"use client";

import { m } from "framer-motion";
import { ShieldCheck, Wifi, Tv } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Prawa strona: mockup TV z realną treścią (kanały, jakość, cena)     */
/* Wydzielony do osobnego pliku i ładowany przez next/dynamic(ssr:false)*/
/* z Hero.tsx — montowany wyłącznie na desktopie, więc jego kod (i cały */
/* framer-motion tu użyty) nigdy nie trafia do bundla wykonywanego      */
/* na mobile.                                                           */
/* ------------------------------------------------------------------ */

export default function TvMockup() {
  return (
    <m.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
      className="relative mx-auto hidden w-full max-w-md lg:block"
    >
      {/* Miękka, duża poświata za telewizorem — czysty CSS, bez zależności od configu */}
      <m.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute -inset-24 rounded-full blur-3xl"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(45,212,191,0.35) 0%, rgba(20,184,166,0.15) 45%, rgba(20,184,166,0) 70%)",
        }}
      />

      {/* Stała opłata — bez podawania konkretnej kwoty (zależna od pakietu) */}
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
        className="absolute -top-5 right-6 z-20 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-xl"
      >
        <ShieldCheck size={18} className="shrink-0 text-teal-600" />
        <p className="text-xs font-bold leading-tight text-[#0B2A3D]">
          Stała opłata
          <span className="block text-[10px] font-medium text-slate-500">
            przez cały okres umowy
          </span>
        </p>
      </m.div>

      <div className="relative z-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F3A52] to-[#0B2A3D] p-4 shadow-2xl">
        <div className="relative flex aspect-video flex-col justify-between overflow-hidden rounded-lg bg-[#081C2A] p-4">
          {/* pasek "na żywo" */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-rose-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-rose-400/70" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
              Test łącza — na żywo
            </span>
          </div>

          {/* środek: prędkość */}
          <div className="flex items-center justify-center gap-4">
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/30"
            >
              <Wifi size={26} />
            </m.div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-white">
                600 <span className="text-sm font-semibold text-white/60">Mb/s</span>
              </p>
              <p className="mt-1 text-[11px] text-teal-300">Stabilne łącze ✓</p>
            </div>
          </div>

          {/* dół: kanały TV */}
          <div className="flex items-center gap-1.5 text-white/40">
            <Tv size={12} />
            <span className="text-[10px]">200+ kanałów, w tym HBO Max i Netflix w pakiecie</span>
          </div>
        </div>
        <div className="mx-auto mt-3 h-1.5 w-1/3 rounded-full bg-white/10" />
      </div>
    </m.div>
  );
}