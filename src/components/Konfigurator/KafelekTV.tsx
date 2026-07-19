import { memo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Sparkles, Flame, Check } from "lucide-react";
import { TIER_CHANNEL_COUNTS, type Tier } from "@/lib/channels";
import type { OfertaTV } from "./types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* Kafelek pakietu TV — badge w rogu, pigułka "Abonament...", chipy
   (Dekoder 4K / liczba kanałów) i gradientowy przycisk Wybierz. */
const KafelekTV = memo(function KafelekTV({
  oferta,
  wybrana,
  onWybierz,
  onPokazDekoder,
  onPokazKanaly,
  delay,
}: {
  oferta: OfertaTV;
  wybrana: boolean;
  onWybierz: () => void;
  onPokazDekoder: () => void;
  onPokazKanaly: (tier: Tier) => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-pressed={wybrana}
      onClick={onWybierz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onWybierz();
        }
      }}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`flex h-full flex-col rounded-2xl border p-5 text-left transition-colors ${
        wybrana ? "border-teal-300 bg-[#183648]" : "border-white/10 bg-[#183648]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-extrabold text-white">{oferta.nazwa}</h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-400/40 bg-purple-400/10 px-2.5 py-1 text-[11px] font-semibold text-purple-200">
          <Sparkles size={11} />
          {oferta.opis}
        </span>
      </div>

      <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-semibold text-lime-300">
        <Flame size={12} />
        Abonament 3 mies. 0 zł po rabatach
      </span>

      <div className="mt-4 flex items-end gap-1">
        <span className="text-2xl font-extrabold text-white">+ {oferta.cena}</span>
        <span className="mb-0.5 text-sm font-semibold text-white/70">zł</span>
        <span className="mb-0.5 text-xs text-white/50">z VAT</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPokazDekoder();
          }}
          className="flex cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white/70 transition-colors hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
        >
          Dekoder 4K
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPokazKanaly(oferta.tier);
          }}
          className="flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          {TIER_CHANNEL_COUNTS[oferta.tier]} kanałów
        </button>
      </div>

      <div
        className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
          wybrana
            ? "border border-teal-400 bg-teal-400 text-[#0B2A3D]"
            : "border border-teal-300/50 bg-teal-300/5 text-teal-200"
        }`}
      >
        {wybrana && <Check size={16} />}
        {wybrana ? "Wybrano" : "Wybierz"}
      </div>
    </m.div>
  );
});

export default KafelekTV;
