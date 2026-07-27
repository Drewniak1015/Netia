"use client";

import { memo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { Check, Wifi, Cable, Smartphone, ChevronRight } from "lucide-react";
import Link from "next/link";
import DottedBackground from "@/components/ui/DottedBackground";

type Column = {
  icon: typeof Wifi;
  title: string;
  points: string[]; // max 2 short points now
  note: string; // one short line
  featured?: boolean;
  speedLabel: string;
  speedPct: number; // relative to fiber = 100%
  speedVariable?: boolean;
};

// Skrócone treści: max 2 krótkie punkty + 1 zwięzła notka na kolumnę
// Notki celowo przetłumaczone na "co to znaczy dla Ciebie", nie na żargon techniczny
const columns: Column[] = [
  {
    icon: Wifi,
    title: "Światłowód (PON / ETTH)",
    points: ["Do 2 Gb/s, opóźnienia 1–5 ms", "Stała prędkość o każdej porze dnia"],
    note: "Cała rodzina online w tym samym czasie, zero kłótni o pasmo.",
    featured: true,
    speedLabel: "do 2 Gb/s",
    speedPct: 100,
  },
  {
    icon: Cable,
    title: "Kabel koncentryczny (HFC)",
    points: ["Do 1 Gb/s (DOCSIS 3.1)", "Szeroka dostępność w starszej zabudowie"],
    note: "Sensowny kompromis tam, gdzie nie ma jeszcze światłowodu.",
    speedLabel: "do 1 Gb/s",
    speedPct: 50,
  },
  {
    icon: Smartphone,
    title: "Mobilny internet 5G / LTE",
    points: ["Zero instalacji — sama karta SIM", "Możesz zabrać go ze sobą"],
    note: "Dobry backup lub rozwiązanie tymczasowe.",
    speedLabel: "zmienna",
    speedPct: 30,
    speedVariable: true,
  },
];

const sectionBgStyle = { backgroundColor: "#0B2A3D" } as const;

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ColumnCard = memo(function ColumnCard({
  column,
  reduceMotion,
}: {
  column: Column;
  reduceMotion: boolean;
}) {
  const Icon = column.icon;
  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex flex-col rounded-2xl border p-5 will-change-transform ${
        column.featured
          ? "border-teal-400/50 bg-[#0f2436] shadow-[0_0_24px_-8px_rgba(45,212,191,0.25)]"
          : "border-white/10 bg-[#0d1f31]"
      }`}
    >
      {column.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a2b] text-center">
          Technologia Netii
        </span>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            column.featured ? "bg-teal-400/15 text-teal-300" : "bg-white/5 text-slate-400"
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>

        <div className="flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            {column.speedVariable ? (
              <div
                className="h-full rounded-full"
                style={{
                  width: `${column.speedPct}%`,
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(148,163,184,0.6) 0 3px, transparent 3px 6px)",
                }}
              />
            ) : (
              <div
                className={`h-full rounded-full ${column.featured ? "bg-teal-400" : "bg-slate-400/70"}`}
                style={{ width: `${column.speedPct}%` }}
              />
            )}
          </div>
          <span className="mt-1 block text-[11px] font-semibold text-slate-400">
            pobieranie: <span className="text-white">{column.speedLabel}</span>
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold text-white leading-snug mb-3">{column.title}</h3>

      <ul className="space-y-2 flex-1">
        {column.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300 leading-snug">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                column.featured ? "bg-teal-400/15" : "bg-white/10"
              }`}
            >
              <Check
                className={`h-2.5 w-2.5 ${column.featured ? "text-teal-400" : "text-slate-400"}`}
                strokeWidth={3}
              />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <p
        className={`mt-3 pt-3 border-t text-xs leading-snug ${
          column.featured
            ? "border-teal-400/20 text-teal-300 font-semibold"
            : "border-white/10 text-slate-500"
        }`}
      >
        {column.note}
      </p>
    </m.article>
  );
});

export default function PoradnikTechnologie() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative overflow-hidden py-10 px-8" style={sectionBgStyle}>
        <DottedBackground variant="grid-fade" size={40} opacity={0.15} focusY="50%" />

        <div className="max-w-305 mx-auto">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={headerVariants}
            className="text-center mb-8"
          >
            <m.span
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-teal-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              KRÓTKI PRZEWODNIK
            </m.span>
            <m.h2 variants={fadeUpVariants} className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
              Dlaczego światłowód, <span className="text-teal-400">a nie LTE czy kabel?</span>
            </m.h2>
            {/* Skrócony lead — jedno zdanie zamiast trzech */}
            <m.p variants={fadeUpVariants} className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              Światłowód Netii jest dostępny w wybranych lokalizacjach — sprawdź, która technologia działa pod Twoim adresem.
            </m.p>
          </m.div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"
          >
            {columns.map((column) => (
              <ColumnCard key={column.title} column={column} reduceMotion={!!reduceMotion} />
            ))}
          </m.div>

          {/* Zamiast osobnego bloku CTA (Zadzwoń/SMS) — sticky header już to pokrywa.
              Zostaje tylko lekki link tekstowy, żeby nie duplikować przycisków. */}
          <m.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUpVariants}
            className="mt-6 text-center text-sm text-slate-400"
          >
            Pakiety Netii zaczynają się od 30 zł/mies. —{" "}
            <Link
              href="/oferty/NajlepszaCena#pakiety"
              className="inline-flex items-center gap-1 font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
            wybierz ofertę i sprawdź dostępność pod swoim adresem
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </m.p>
        </div>
      </section>
    </LazyMotion>
  );
}