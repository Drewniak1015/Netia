import { useEffect } from "react";
import { m, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Check,
  Wifi,
  X,
  FileText,
  ListChecks,
  Gauge,
  Wallet,
} from "lucide-react";
import { ROUTERY } from "./routery";
import IkonaRoutera from "./IkonaRoutera";

export default function RouterModal({
  routerId,
  onClose,
}: {
  routerId: string | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const router = routerId ? ROUTERY[routerId] : null;

  useEffect(() => {
    if (!router) return;
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
  }, [router]);

  return (
    <AnimatePresence>
      {router && (
        <m.div
          key="router-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="router-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={router.model}
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
                <Wifi size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Szczegóły dołączonego routera
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {router.model}
              </h3>
              <p className="mt-1 text-sm text-white/60">{router.podtytul}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <IkonaRoutera zdjecie={router.zdjecie} model={router.model} />

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <FileText size={15} className="text-teal-300" />
                  Opis urządzenia
                </h4>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
                  {router.opis.map((akapit, i) => (
                    <p key={i}>{akapit}</p>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <ListChecks size={15} className="text-teal-300" />
                  Specyfikacja techniczna
                </h4>
                <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                  {router.specyfikacja.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
                    >
                      <span className="text-xs font-semibold text-teal-300">
                        {spec.label}
                      </span>
                      <span className="text-sm text-white/75">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <Wifi size={15} className="text-teal-300" />
                  Technologia Wi-Fi 5
                </h4>
                <ul className="mt-3 space-y-2">
                  {router.wifi5Cechy.map((cecha, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-teal-300" />
                      {cecha}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <Gauge size={14} className="text-teal-300" />
                  Prędkość Internetu Światłowodowego Netia
                </h4>
                <p className="mt-1.5 text-sm text-white/75">{router.predkosci}</p>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <Wallet size={14} className="text-teal-300" />
                  Koszt routera zawarty w umowie
                </h4>
                <p className="mt-1.5 text-sm text-white/75">{router.kosztInfo}</p>
              </div>

              <a
                href={router.instrukcjaUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-300/20"
              >
                Instrukcja użytkownika {router.model}
                <ChevronRight size={16} />
              </a>
            </div>

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
  );
}
