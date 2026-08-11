"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

interface OffersPanelProps {
  icon: LucideIcon;
  title: string;
  count: number;
  accent: "teal" | "pink";
  children: ReactNode;
}

export default function OffersPanel({
  icon: Icon,
  title,
  count,
  accent,
  children,
}: OffersPanelProps) {
  const [open, setOpen] = useState(true);
  const iconColor = accent === "teal" ? "text-teal-300" : "text-pink-300";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <Icon size={20} className={iconColor} />
          <span className="text-lg font-bold text-white">{title}</span>
          <span className="hidden text-sm font-normal text-white/40 sm:inline">
            {count} propozycje
          </span>
        </span>
        {open ? (
          <ChevronUp size={20} className="shrink-0 text-white/50" />
        ) : (
          <ChevronDown size={20} className="shrink-0 text-white/50" />
        )}
      </button>

      {open && <div className="mt-6">{children}</div>}
    </div>
  );
}