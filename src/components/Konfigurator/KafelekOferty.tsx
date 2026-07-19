import { memo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Info, LayoutGrid, Check } from "lucide-react";
import type { Oferta } from "./types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const KafelekOferty = memo(function KafelekOferty({
  oferta,
  wybrana,
  onWybierz,
  onPokazSzczegoly,
  onPokazKanaly,
  gradient,
  delay,
}: {
  oferta: Oferta;
  wybrana: boolean;
  onWybierz: () => void;
  onPokazSzczegoly?: () => void;
  onPokazKanaly?: () => void;
  gradient?: string;
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
      <div className="flex flex-1 flex-col text-left">
        <h3 className="text-lg font-extrabold text-white">{oferta.nazwa}</h3>
        <p className="mt-2 text-sm leading-snug text-white/65">{oferta.opis}</p>
        <div className="mt-4 flex items-end gap-1.5">
          <span className="text-2xl font-extrabold text-white">{oferta.cena} zł</span>
          <span className="mb-0.5 text-xs text-white/60">/mies.</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onPokazSzczegoly && (
          <m.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPokazSzczegoly();
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className={`flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${
              gradient ?? "from-teal-600 to-teal-800"
            } px-3 py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90`}
          >
            <Info size={13} />
            Szczegóły
          </m.button>
        )}

        {onPokazKanaly && (
          <m.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPokazKanaly();
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            <LayoutGrid size={13} />
            Zobacz kanały
          </m.button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWybierz();
          }}
          className={`flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
            wybrana
              ? "border border-teal-400 bg-teal-400 text-[#0B2A3D]"
              : "border border-teal-300/50 bg-teal-300/5 text-teal-200"
          }`}
        >
          {wybrana && <Check size={14} />}
          {wybrana ? "Wybrano" : "Wybierz"}
        </button>
      </div>
    </m.div>
  );
});

export default KafelekOferty;
