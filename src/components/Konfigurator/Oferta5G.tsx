"use client";

import { useEffect } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Check, X } from "lucide-react";
import type { Oferta } from "@/components/Konfigurator/konfigurator";

/* ---------------------------------------------------------------------- */
/*  Rozszerzenie bazowego typu Oferta o dane potrzebne w tym modalu:       */
/*  gradient (tło nagłówka) oraz listę punktów ze szczegółami oferty 5G.  */
/*  Zaimportuj ten typ tam, gdzie budujesz tablicę OFERTY_5G.             */
/* ---------------------------------------------------------------------- */
export interface Oferta5G extends Oferta {
  gradient: string;
  szczegoly: string[];
}

interface Uslugi5GModalProps {
  oferta: Oferta5G | null;
  onClose: () => void;
}

export default function Uslugi5GModal({ oferta, onClose }: Uslugi5GModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!oferta) return;
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
  }, [oferta]);

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {oferta && (
          <m.div
            key="uslugi-5g-modal-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
            onClick={onClose}
          >
            <m.div
              key="uslugi-5g-modal-content"
              role="dialog"
              aria-modal="true"
              aria-label={oferta.nazwa}
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
              style={{ backgroundColor: "#0B2A3D" }}
            >
              {/* Nagłówek — gradient zależny od wariantu (SUPER / VIP / GIGA) */}
              <div
                className={`shrink-0 bg-gradient-to-br ${oferta.gradient} px-6 pb-5 pt-6 sm:px-8 sm:pt-8`}
              >
                <span className="text-xs font-bold uppercase tracking-wide text-white/80">
                  Internet mobilny z nielimitowanymi połączeniami
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                  {oferta.nazwa}
                </h3>
              </div>

              {/* Środkowa część — jedyny scrollowalny fragment okna */}
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
                <ul className="space-y-3">
                  {oferta.szczegoly.map((punkt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <Check size={15} className="mt-0.5 shrink-0 text-teal-300" />
                      {punkt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stopka — zawsze na dole, jedyny przycisk zamknięcia */}
              <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                  Zamknij
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}