"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { Wrench, ShoppingCart, ChevronRight, X } from "lucide-react";
import Link from "next/link";

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
/* ---------------------------------------------------------------------- */

const AWARIA_HREF = "/pomoc/awarie";
const SESSION_KEY = "netia_entry_gate_dismissed";
const OFERTA_HREF = "/";

export default function EntryGate() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(SESSION_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // Jeśli sessionStorage niedostępny (np. tryb prywatny), pokaż mimo to.
      setVisible(true);
    }
  }, []);

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* no-op */
    }
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {visible && (
          <m.div
            key="entry-gate-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          >
            <m.div
              key="entry-gate-content"
              role="dialog"
              aria-modal="true"
              aria-label="Wybierz, w czym możemy pomóc"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 p-7 sm:p-8"
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}