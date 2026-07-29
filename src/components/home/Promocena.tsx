"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  PromoCena — wspólny blok ceny dla obu typów kart.                      */
/* ---------------------------------------------------------------------- */
export function PromoCena({
  promoLabel,
  regularPrice,
  regularPriceNote,
  accent,
  leadWithZero,
}: {
  promoLabel: string;
  regularPrice: string;
  regularPriceNote: string;
  accent: "orange" | "pink";
  leadWithZero: boolean;
}) {
  const labelColor = accent === "pink" ? "text-pink-300" : "text-orange-300";

  if (leadWithZero) {
    return (
      <div className="mt-4 pb-4 border-b border-white/10">
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl font-black leading-none text-white">0 zł</span>
          <span className="text-base font-semibold text-white/35 line-through">{regularPrice}</span>
        </div>
        <p className={`mt-1.5 text-sm font-semibold ${labelColor}`}>{promoLabel}</p>
        <p className="mt-0.5 text-xs text-white/40">{regularPriceNote}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pb-4 border-b border-white/10">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black leading-none text-white">{regularPrice}</span>
        <span className="text-sm font-medium text-slate-400">/ mies.</span>
      </div>
      <p className={`mt-1.5 text-sm font-semibold ${labelColor}`}>{promoLabel}</p>
      <p className="mt-0.5 text-xs text-white/40">{regularPriceNote}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  SzczegolyOferty — rozwijany blok z regulaminową treścią.               */
/* ---------------------------------------------------------------------- */
export function SzczegolyOferty({ children }: { children: React.ReactNode }) {
  const [otwarte, setOtwarte] = useState(false);

  return (
    <div className="mt-10 pt-6 border-t border-white/10 max-w-4xl mx-auto text-center">
      <button
        type="button"
        onClick={() => setOtwarte((o) => !o)}
        aria-expanded={otwarte}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition-colors hover:text-white/75"
      >
        {otwarte ? "Ukryj szczegóły oferty" : "Zobacz szczegóły oferty"}
        <ChevronRight
          size={13}
          className={`transition-transform duration-200 ${otwarte ? "rotate-90" : "rotate-0"}`}
        />
      </button>

      {otwarte && (
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{children}</p>
      )}
    </div>
  );
}