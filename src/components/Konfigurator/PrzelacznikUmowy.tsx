import { memo } from "react";
import { m } from "framer-motion";
import type { UmowaType } from "./types";

const PrzelacznikUmowy = memo(function PrzelacznikUmowy({
  umowa,
  setUmowa,
}: {
  umowa: UmowaType;
  setUmowa: (u: UmowaType) => void;
}) {
  const opcje: { id: UmowaType; label: string }[] = [
    { id: "24", label: "24 miesiące" },
    { id: "bez", label: "Bez zobowiązań" },
  ];

  return (
    <div className="inline-flex gap-2 rounded-full border border-white/10 bg-white/5 p-1.5">
      {opcje.map((opcja) => {
        const aktywna = umowa === opcja.id;
        return (
          <button
            key={opcja.id}
            type="button"
            onClick={() => setUmowa(opcja.id)}
            aria-pressed={aktywna}
            className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:text-base"
          >
            {aktywna && (
              <m.span
                layoutId="umowa-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
              />
            )}
            <span
              className={`relative ${
                aktywna ? "text-white" : "text-white/60 hover:text-white/80"
              }`}
            >
              {opcja.label}
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default PrzelacznikUmowy;
