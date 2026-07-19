import { memo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Wifi, Gift, Info, Check } from "lucide-react";
import type { Pakiet, UmowaType } from "./types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* FIX (TBT): owinięty w React.memo — w siatce 5 kart re-render jednej
   karty (np. po jej wybraniu) nie odświeża już pozostałych 4. */
const KafelekPakietu = memo(function KafelekPakietu({
  pakiet,
  umowa,
  wybrany,
  onWybierz,
  onPokazRouter,
  delay,
}: {
  pakiet: Pakiet;
  umowa: UmowaType;
  wybrany: boolean;
  onWybierz: () => void;
  onPokazRouter: (routerId: string) => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-pressed={wybrany}
      onClick={onWybierz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onWybierz();
        }
      }}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`relative flex h-full flex-col rounded-2xl border p-6 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
        wybrany
          ? "border-teal-300 bg-[#183648] shadow-[0_0_0_3px_rgba(45,212,191,0.15)]"
          : "border-white/10 bg-[#183648]"
      }`}
    >
      {pakiet.wyrozniony && (
        <span className="absolute -top-3 left-6 rounded-full bg-teal-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Najczęściej wybierany
        </span>
      )}

      <div className="flex items-center gap-2 text-white/50">
        <Wifi size={15} className="text-teal-300" />
        <span className="text-xs">{pakiet.upload}</span>
      </div>
      <h4 className="mt-1.5 text-xl font-extrabold leading-snug text-white">
        Internet do <span className="text-teal-300">{pakiet.predkosc}</span>
      </h4>

      {pakiet.promoBadge && (
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold text-orange-300">
          <Gift size={12} />
          {pakiet.promoBadge}
        </span>
      )}

      <div className="mt-5 flex items-end gap-1.5">
        <span className="text-3xl font-extrabold text-white">{pakiet.cena} zł</span>
        <span className="mb-1 text-sm text-white/60">z VAT</span>
      </div>
      <span className="mt-0.5 text-xs text-white/45">
        {umowa === "24" ? "Przez 24 mies. z rabatami" : "bez zobowiązań, w każdej chwili możesz zrezygnować"}
      </span>

      <m.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPokazRouter(pakiet.routerId);
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <Info size={14} className="shrink-0 text-white/50" />
        <span>{pakiet.wyposazenie}</span>
        <span className="text-[11px] font-normal text-white/40">(pokaż router)</span>
      </m.button>

      <m.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onWybierz();
        }}
        aria-pressed={wybrany}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
          wybrany
            ? "border-2 border-teal-400 bg-teal-400 text-[#0B2A3D] hover:bg-teal-300"
            : "border-2 border-teal-300/50 bg-teal-300/5 text-teal-200 hover:border-teal-300 hover:bg-teal-300/15"
        }`}
      >
        {wybrany && <Check size={16} />}
        {wybrany ? "Wybrane" : "Wybierz"}
      </m.button>
    </m.div>
  );
});

export default KafelekPakietu;
