"use client";

import { memo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { Check, Wifi, Cable, Smartphone } from "lucide-react";

type Column = {
  icon: typeof Wifi;
  title: string;
  points: string[];
  note: string;
  featured?: boolean;
};

const columns: Column[] = [
  {
    icon: Wifi,
    title: "Światłowód (PON / ETTH)",
    points: [
      "Prędkość pobierania do 2 Gb/s w technologii PON — wysyłanie zależy od wybranego pakietu.",
      "Opóźnienia 1–5 ms — różnica zauważalna w grach, wideokonferencjach i transmisjach na żywo.",
      "Stabilność niezależna od pory dnia — łącze nie zwalnia w godzinach szczytu w bloku.",
      "Brak limitów transferu — streamuj i synchronizuj dane bez obawy o przekroczenie pakietu.",
    ],
    note: "Najlepszy wybór do pracy zdalnej, oglądania w 4K i grania. To główna technologia oferty Netii.",
    featured: true,
  },
  {
    icon: Cable,
    title: "Kabel koncentryczny (HFC)",
    points: [
      "Pobieranie do 1 Gb/s w nowszych sieciach w standardzie DOCSIS 3.1.",
      "Szeroka dostępność w miastach o starszej infrastrukturze, gdzie światłowód jeszcze nie dotarł.",
    ],
    note: "Sensowny kompromis — wysyłanie jest wolniejsze niż pobieranie, a sygnał bardziej wrażliwy na warunki pogodowe.",
  },
  {
    icon: Smartphone,
    title: "Mobilny internet 5G / LTE",
    points: [
      "Zero instalacji — wystarczy karta SIM lub router LTE z anteną.",
      "Możesz zabrać go ze sobą — drugie mieszkanie, praca zdalna w podróży.",
    ],
    note: "Dobre rozwiązanie jako backup albo tam, gdzie nie ma jeszcze łącza stacjonarnego. Prędkość zależy od pory dnia i liczby osób podłączonych do tego samego nadajnika.",
  },
];

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
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex flex-col rounded-2xl border p-6 will-change-transform ${
        column.featured
          ? "border-teal-400/50 bg-[#0f2436] shadow-[0_0_24px_-8px_rgba(45,212,191,0.25)]"
          : "border-white/10 bg-[#0d1f31]"
      }`}
    >
      {column.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a2b]">
          Technologia Netii
        </span>
      )}

      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${
          column.featured ? "bg-teal-400/15 text-teal-300" : "bg-white/5 text-slate-400"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="text-lg font-bold text-white leading-snug mb-4">{column.title}</h3>

      <ul className="space-y-3 flex-1">
        {column.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
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

      <p className="mt-5 pt-4 border-t border-white/10 text-xs text-slate-500 leading-relaxed">
        {column.note}
      </p>
    </m.article>
  );
});

export default function PoradnikTechnologie() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-20 px-8" style={sectionBgStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              KRÓTKI PRZEWODNIK
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-white">
              Dlaczego światłowód, <span className="text-teal-400">a nie LTE czy kabel?</span>
            </h2>
            <p className="mt-4 text-slate-400 text-base max-w-2xl mx-auto">
              Wybierając internet, masz do wyboru trzy główne technologie: światłowód (PON, ETTH),
              kabel koncentryczny (HFC) oraz internet mobilny 5G/LTE. Poniżej krótkie porównanie —
              co daje światłowód i kiedy alternatywy mają sens.
            </p>
          </div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {columns.map((column) => (
              <ColumnCard key={column.title} column={column} reduceMotion={!!reduceMotion} />
            ))}
          </m.div>

          <p className="mt-10 text-center text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Do codziennego użytku w domu lub biurze światłowód zwykle wygrywa stosunkiem jakości do
            ceny.{" "}
            <span className="text-white font-semibold">
              Pakiety Netii zaczynają się od 40 zł/mies.
            </span>{" "}
            — sprawdź dostępność światłowodu pod swoim adresem.
          </p>
        </div>
      </section>
    </LazyMotion>
  );
}