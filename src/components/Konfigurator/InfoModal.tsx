import { useEffect } from "react";
import { m, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronRight, Info, X } from "lucide-react";
import { INFO_ITEMS } from "./infoItems";
import IkonaRoutera from "./IkonaRoutera";
import type { SectionContent } from "./types";

function TrescSekcjiInfo({ content }: { content: SectionContent }) {
  if (content.type === "paragraphs") {
    return (
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
        {content.items.map((akapit, i) => (
          <p key={i}>{akapit}</p>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
      {content.items.map((spec) => (
        <div
          key={spec.label}
          className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
        >
          <span className="text-xs font-semibold text-teal-300">{spec.label}</span>
          <span className="text-sm text-white/75">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function InfoModal({ infoId, onClose }: { infoId: string | null; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const item = infoId ? INFO_ITEMS[infoId] : null;

  useEffect(() => {
    if (!item) return;
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
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <m.div
          key="info-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="info-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={item.model}
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
                <Info size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Szczegóły</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{item.model}</h3>
              {item.podtytul && <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              {item.zdjecie && <IkonaRoutera zdjecie={item.zdjecie} model={item.model} />}

              {item.sections.map((section, i) => {
                const Ikona = section.icon;
                return (
                  <div
                    key={section.title}
                    className={i === 0 && !item.zdjecie ? "mt-0" : "mt-6 border-t border-white/10 pt-6"}
                  >
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                      <Ikona size={15} className="text-teal-300" />
                      {section.title}
                    </h4>
                    <TrescSekcjiInfo content={section.content} />
                  </div>
                );
              })}

              {item.instrukcjaUrl && (
                <a
                  href={item.instrukcjaUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-300/20"
                >
                  Instrukcja użytkownika {item.model}
                  <ChevronRight size={16} />
                </a>
              )}
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
