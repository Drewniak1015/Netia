"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileDown } from "lucide-react";
import {
  CHANNELS,
  ADDONS,
  TIER_ORDER,
  TIER_LABELS,
  type Tier,
} from "@/lib/channels";

type Props = {
  tier: Tier;
  onTierChange: (tier: Tier) => void;
};

export default function Wyszukiwarka({ tier, onTierChange }: Props) {
  const [query, setQuery] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kafelki" | "lista">("kafelki");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CHANNELS.filter((ch) => {
      if (q.length >= 3 && !ch.name.toLowerCase().includes(q)) return false;

      if (selectedAddon) {
        return ch.addon === selectedAddon;
      }

      return TIER_ORDER[ch.tier] <= TIER_ORDER[tier] && !ch.addon;
    }).sort((a, b) => a.number - b.number);
  }, [query, tier, selectedAddon]);

  const handleDownload = () => {
    const header = "Numer,Nazwa,Pakiet\n";
    const rows = results
      .map((ch) => `${ch.number},${ch.name},${ch.tier}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista-kanalow-netia.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section style={{ backgroundColor: "#0B2A3D" }} className="w-full py-16 px-6 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div className="flex justify-center mb-5" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Wyszukiwarka kanałów
          </span>
        </motion.div>

        <motion.h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          Szukaj Kanału
        </motion.h2>

        <motion.p
          className="text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base text-white/65"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
        >
          Filtruj po nazwie kanału albo przełączaj pakiety, żeby zobaczyć, co w nich znajdziesz.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Wpisz minimum 3 znaki..."
                aria-label="Szukaj kanału po nazwie"
                className="w-full rounded-full bg-white/10 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-teal-400/60 transition-shadow"
              />
            </div>
            <button
              onClick={() => setQuery("")}
              aria-label="Wyczyść wyszukiwanie"
              className="flex items-center justify-center shrink-0 h-11 w-11 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-white/40 mb-7">Filtruj po nazwie. Możesz też przełączać pakiety.</p>

          <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Pakiety główne</p>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {(Object.keys(TIER_LABELS) as Tier[]).map((t) => {
              const active = tier === t && !selectedAddon;
              return (
                <motion.button
                  key={t}
                  onClick={() => {
                    setSelectedAddon(null);
                    onTierChange(t);
                  }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "border-teal-400/60 bg-teal-400/10 text-teal-300"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/[0.08]"
                  }`}
                >
                  {TIER_LABELS[t]}
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-white/40 mb-7">Wybierz jeden z pakietów głównych (S, M, L)</p>

          <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Pakiety dodatkowe</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {ADDONS.map((a) => {
              const active = selectedAddon === a.key;
              return (
                <motion.button
                  key={a.key}
                  onClick={() => setSelectedAddon(active ? null : a.key)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "border-teal-400/60 bg-teal-400/10 text-teal-300"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/[0.08]"
                  }`}
                >
                  {a.label}
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-white/40 mb-8">Wybierz jeden z pakietów dodatkowych.</p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${viewMode === "kafelki" ? "text-white" : "text-white/40"}`}>Kafelki</span>
              <button
                onClick={() => setViewMode(viewMode === "kafelki" ? "lista" : "kafelki")}
                aria-label="Przełącz widok"
                className="relative w-11 h-6 rounded-full bg-white/15 transition-colors"
              >
                <motion.span
                  className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white"
                  animate={{ x: viewMode === "lista" ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${viewMode === "lista" ? "text-white" : "text-white/40"}`}>Lista</span>
            </div>

            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <FileDown size={16} />
              Pobierz listę kanałów (PDF)
            </motion.button>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50" aria-live="polite">
            Znaleziono <span className="font-semibold text-white">{results.length}</span>{" "}
            {results.length === 1 ? "kanał" : "kanałów"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "kafelki" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {results.map((ch) => (
                <motion.div
                  key={ch.number}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 flex items-center gap-3 transition-colors duration-200 hover:bg-white/[0.08]"
                >
                  <span style={{ backgroundColor: ch.color }} className="flex items-center justify-center shrink-0 h-10 w-10 rounded-xl text-white text-sm font-bold">
                    {ch.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{ch.name}</p>
                    <p className="text-xs text-white/40">Kanał {ch.number}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {results.map((ch, i) => (
                <motion.div key={ch.number} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-4 px-5 py-3 ${i !== 0 ? "border-t border-white/5" : ""}`}>
                  <span className="text-xs font-semibold text-white/40 w-8 shrink-0">{ch.number}</span>
                  <span style={{ backgroundColor: ch.color }} className="flex items-center justify-center shrink-0 h-8 w-8 rounded-lg text-white text-xs font-bold">
                    {ch.name.charAt(0)}
                  </span>
                  <span className="font-medium text-white text-sm">{ch.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="text-center py-16 text-white/40 text-sm">Brak kanałów pasujących do wybranych filtrów.</div>
        )}
      </div>
    </section>
  );
}