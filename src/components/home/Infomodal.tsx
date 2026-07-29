"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Info, X } from "lucide-react";
import { INFO_ITEMS, type SectionContent } from "@/components/home/Infoitems";
import { BANNER_AKCENTY } from "@/components/home/Motionconfig";

/* ---------------------------------------------------------------------- */
/*  Popupy "Szczegóły" — routery, dekoder, Netia GO, Giganagrywarka       */
/*  Ten komponent jest ładowany przez `next/dynamic` z Oferty.tsx — nie   */
/*  trafia do initial JS bundle strony głównej, tylko do osobnego chunku, */
/*  pobieranego dopiero po kliknięciu w pozycję z `infoId`.                */
/* ---------------------------------------------------------------------- */

/* Zdjęcie produktu na białym tle (routery) — next/image zamiast <img>:
   automatyczna optymalizacja/kompresja, leniwe ładowanie i brak layout
   shiftu dzięki `fill` + rodzicowi o stałej wysokości. */
function IkonaProduktu({ zdjecie, model }: { zdjecie: string; model: string }) {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-white p-4 sm:h-48">
      <Image
        src={zdjecie}
        alt={model}
        fill
        sizes="(min-width: 640px) 42rem, 100vw"
        className="object-contain"
      />
    </div>
  );
}

function TrescSekcji({
  content,
  akcent,
}: {
  content: SectionContent;
  akcent: { text: string; soft: string };
}) {
  switch (content.type) {
    case "paragraphs":
      return (
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
          {content.items.map((akapit, i) => (
            <p key={i}>{akapit}</p>
          ))}
        </div>
      );

    case "bullets":
      return (
        <ul className="mt-3 space-y-2">
          {content.items.map((cecha, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/75">
              <Check size={15} className={`mt-0.5 shrink-0 ${akcent.text}`} />
              {cecha}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mt-3 space-y-2.5">
          {content.items.map((krok, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/75">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${akcent.soft} ${akcent.text}`}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{krok}</span>
            </li>
          ))}
        </ol>
      );

    case "specTable":
      return (
        <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
          {content.items.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
            >
              <span className={`text-xs font-semibold ${akcent.text}`}>{spec.label}</span>
              <span className="text-sm text-white/75">{spec.value}</span>
            </div>
          ))}
        </div>
      );

    case "compareTable":
      return (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                <th className="px-4 py-2.5 font-semibold">Funkcja</th>
                <th className={`px-4 py-2.5 font-semibold ${akcent.text}`}>Basic</th>
                <th className={`px-4 py-2.5 font-semibold ${akcent.text}`}>Maxi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {content.rows.map((row) => (
                <tr key={row.funkcja} className="align-top">
                  <td className="px-4 py-3 text-white/75">{row.funkcja}</td>
                  <td className="px-4 py-3 text-white/75">{row.basic}</td>
                  <td className="px-4 py-3 text-white/75">{row.maxi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "box":
      return (
        <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/75">{content.text}</p>
        </div>
      );

    default:
      return null;
  }
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
    <LazyMotion features={domAnimation} strict>
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
              {(() => {
                const akcent = BANNER_AKCENTY[item.bannerAkcent ?? "teal"];

                return (
                  <>
                    <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
                      <div className={`flex items-center gap-2 ${akcent.text}`}>
                        <Info size={18} />
                        <span className="text-xs font-bold uppercase tracking-wide">Szczegóły</span>
                      </div>
                      <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{item.model}</h3>
                      {item.podtytul && <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>}
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
                      {item.zdjecie && <IkonaProduktu zdjecie={item.zdjecie} model={item.model} />}

                      {item.banner && (
                        <div
                          className={`mb-6 overflow-hidden rounded-2xl border ${akcent.border} px-5 py-7 text-center sm:px-8 sm:py-9`}
                          style={{ background: akcent.background }}
                        >
                          <p className="text-xl font-extrabold leading-snug text-white sm:text-2xl">
                            {item.banner}
                          </p>
                        </div>
                      )}

                      {item.sections.map((section, i) => {
                        const Ikona = section.icon;

                        if (section.content.type === "box") {
                          return (
                            <div
                              key={section.title}
                              className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
                            >
                              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                                <Ikona size={14} className={akcent.text} />
                                {section.title}
                              </h4>
                              <p className="mt-1.5 text-sm text-white/75">{section.content.text}</p>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={section.title}
                            className={
                              i === 0 && !item.zdjecie && !item.banner
                                ? "mt-0"
                                : "mt-6 border-t border-white/10 pt-6"
                            }
                          >
                            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                              <Ikona size={15} className={akcent.text} />
                              {section.title}
                            </h4>
                            <TrescSekcji content={section.content} akcent={akcent} />
                          </div>
                        );
                      })}

                      {item.uwaga && (
                        <p className="mt-6 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/40">
                          {item.uwaga}
                        </p>
                      )}

                      {item.instrukcjaUrl && (
                        <a
                          href={item.instrukcjaUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-900/40 hover:border-teal-300/50"
                        >
                          Instrukcja użytkownika {item.model}
                          <ChevronRight size={16} />
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}

              <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-black/20 hover:text-white"
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