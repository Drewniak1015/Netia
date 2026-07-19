import { useEffect, useMemo } from "react";
import { m, useReducedMotion, AnimatePresence } from "framer-motion";
import { X, LayoutGrid } from "lucide-react";
import {
  channelsForTier,
  TIER_LABELS,
  TIER_CHANNEL_COUNTS,
  channelId,
  type Tier,
} from "@/lib/channels";
import KafelekKanalu from "./KafelekKanalu";

export default function KanalyModal({ tier, onClose }: { tier: Tier | null; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const kanaly = useMemo(() => (tier ? channelsForTier(tier) : []), [tier]);

  useEffect(() => {
    if (!tier) return;
    const poprzednieOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = poprzednieOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  return (
    <AnimatePresence>
      {tier && (
        <m.div
          key="kanaly-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="kanaly-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={TIER_LABELS[tier]}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
            style={{ backgroundColor: "#0B2A3D" }}
          >
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <LayoutGrid size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Lista kanałów</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {TIER_LABELS[tier]}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {TIER_CHANNEL_COUNTS[tier]} kanałów w cenie pakietu
                {tier === "xs" && " (+ 16 kanałów regionalnych TVP)"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {kanaly.map((channel) => (
                  <KafelekKanalu key={channelId(channel)} channel={channel} />
                ))}
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-white/40">
                * kanał gwarantowany — zawsze dostępny w ramach pakietu. Lista kanałów
                może ulec zmianie zgodnie z aktualną ofertą Netii.
              </p>
            </div>

            <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
                Zamknij
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
