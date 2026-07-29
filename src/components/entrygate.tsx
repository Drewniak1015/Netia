"use client";

import { useEffect, useState } from "react";
import { Wrench, ShoppingCart, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { dismissEntryGate, isEntryGateDismissed }  from "@/components/Entrygate";

/* ---------------------------------------------------------------------- */
/*  EntryGate — bramka na wejściu, filtrująca ruch na dwie ścieżki:        */
/*                                                                         */
/*  1) "Chcę kupić / zobaczyć ofertę" → strona główna z ofertą (na górze).  */
/*  2) "Mam awarię / problem techniczny" → strona /pomoc/awarie.          */
/*                                                                         */
/*  Podmień AWARIA_HREF, jeśli ścieżka strony pomocy przy awarii się      */
/*  zmieni.                                                               */
/*                                                                         */
/*  Pokazuje się raz na sesję przeglądarki (sessionStorage) — nie za      */
/*  każdym wejściem na stronę, żeby nie irytować powracających userów.    */
/*                                                                         */
/*  [OPTYMALIZACJA] Ten komponent montuje się natychmiast na starcie       */
/*  strony (przed jakąkolwiek interakcją), więc zamiast framer-motion      */
/*  (LazyMotion + AnimatePresence + m.div) używa czystych CSS keyframes.   */
/*  Efekt wizualny (fade + scale in/out) jest identyczny, ale bez          */
/*  dociągania i wykonywania kodu biblioteki animacyjnej w tym miejscu —   */
/*  a to jeden z pierwszych komponentów, które hydrują się na stronie.    */
/* ---------------------------------------------------------------------- */

const AWARIA_HREF = "/pomoc/awarie";
const OFERTA_HREF = "/";

// Musi być zgodne z czasem trwania animacji "is-closing" w CSS poniżej —
// po tylu ms komponent faktycznie znika z DOM (po odegraniu animacji).
const EXIT_DURATION_MS = 200;

export default function EntryGate() {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isEntryGateDismissed()) setMounted(true);
  }, []);

  // Blokada scrolla strony pod modalem, dopóki bramka jest otwarta —
  // ten sam wzorzec co w InfoModal.
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  const close = () => {
    setClosing(true);
    dismissEntryGate();
    window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_DURATION_MS);
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wybierz, w czym możemy pomóc"
      className={`entry-gate-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm ${
        closing ? "is-closing" : ""
      }`}
    >
      <style>{`
        @keyframes entryGateFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes entryGateScaleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .entry-gate-overlay {
          animation: entryGateFadeIn 200ms ease-out both;
        }
        .entry-gate-overlay.is-closing {
          animation: entryGateFadeIn 200ms ease-out reverse both;
        }
        .entry-gate-content {
          animation: entryGateScaleIn 250ms ease-out both;
        }
        .entry-gate-overlay.is-closing .entry-gate-content {
          animation: entryGateScaleIn 200ms ease-out reverse both;
        }
        @media (prefers-reduced-motion: reduce) {
          .entry-gate-overlay,
          .entry-gate-content {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="entry-gate-content relative w-full max-w-md rounded-2xl border border-white/10 p-7 sm:p-8"
        style={{ backgroundColor: "#0B2A3D" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-extrabold text-white sm:text-2xl">
          W czym możemy pomóc?
        </h2>
        <p className="mt-1.5 text-sm text-white/60">
          Wybierz, żebyśmy skierowali Cię do właściwej obsługi.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {/* Ścieżka 1: Sprzedaż / oferta — strona główna, teraz na górze */}
          <Link
            href={OFERTA_HREF}
            onClick={close}
            className="group flex items-center justify-between gap-3 rounded-xl bg-teal-500 px-4 py-4 transition-colors hover:bg-teal-600"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                <ShoppingCart size={18} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold text-white">
                  Chcę kupić internet lub zobaczyć ofertę
                </span>
                <span className="mt-0.5 block text-xs text-white/70">
                  Przejdź do aktualnych planów i cen
                </span>
              </span>
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          {/* Ścieżka 2: Awaria — prowadzi do strony pomocy /pomoc/awarie */}
          <Link
            href={AWARIA_HREF}
            onClick={close}
            className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-4 transition-colors hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                <Wrench size={18} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold text-white">
                  Mam awarię lub problem techniczny
                </span>
                <span className="mt-0.5 block text-xs text-white/50">
                  Zgłoś awarię i sprawdź status pomocy
                </span>
              </span>
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}