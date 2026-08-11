"use client";

import { memo, useCallback, useMemo } from "react";
import { Check, Info, MessageCircle, Phone } from "lucide-react";
import { PHONE, PHONE_HREF, type Offer1k } from "@/components/home/Oferty1kdata";
import { PromoCena } from "@/components/home/Promocena";

type Accent = "pink" | "orange";

/* ---------------------------------------------------------------------- */
/*  Karta dla samodzielnej sekcji ofert (1 Gb/s / 2 Gb/s).                */
/*  Bez animacji: brak hover-lift, brak scale na przyciskach.             */
/*  UWAGA: przycisk "Zadzwoń" jest zawsze teal, niezależnie od akcentu    */
/*  karty — tak jak na obu screenach referencyjnych.                      */
/* ---------------------------------------------------------------------- */
const ACCENT_STYLES: Record<
  Accent,
  {
    border: string;
    borderFeatured: string;
    badgeBg: string;
    badgeText: string;
    check: string;
    checkBg: string;
    infoDecoration: string;
    sideBar: string;
  }
> = {
  pink: {
    border: "border-white/10",
    borderFeatured: "border-pink-400/70",
    badgeBg: "bg-gradient-to-r from-pink-500 to-pink-400",
    badgeText: "text-white",
    check: "text-pink-400",
    checkBg: "bg-pink-400/15",
    infoDecoration: "decoration-pink-300/40",
    sideBar: "before:bg-pink-400",
  },
  orange: {
    border: "border-white/10",
    borderFeatured: "border-amber-400/70",
    badgeBg: "bg-gradient-to-r from-amber-500 to-amber-400",
    badgeText: "text-[#2b1a05]",
    check: "text-amber-400",
    checkBg: "bg-amber-400/15",
    infoDecoration: "decoration-amber-300/40",
    sideBar: "before:bg-amber-400",
  },
};

const Plan1kCard = memo(function Plan1kCard({
  offer,
  accent,
  onPokazInfo,
}: {
  offer: Offer1k;
  accent: Accent;
  onPokazInfo: (infoId: string) => void;
}) {
  const smsBody = useMemo(
    () =>
      encodeURIComponent(
        `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
      ),
    [offer.speed, offer.pkg]
  );

  const handlePhoneClick = useCallback(() => {}, []);
  const handleSmsClick = useCallback(() => {}, []);

  const styles = ACCENT_STYLES[accent];

  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-[#0d1f31] pl-6 pr-5 pt-6 pb-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:rounded-full ${styles.sideBar} ${
        offer.featured ? styles.borderFeatured : styles.border
      }`}
    >
      {offer.featured && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-center ${styles.badgeBg} ${styles.badgeText}`}
        >
          Najczęściej wybierana
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      <p className="mt-1 text-2xl font-extrabold text-white leading-tight">
        {offer.speed} <span className="text-lg font-bold text-slate-300">+ {offer.pkg}</span>
      </p>

      <PromoCena
        promoLabel={offer.monthsPill}
        regularPrice={offer.price}
        regularPriceNote={`Od 7. do 24. miesiąca: ${offer.price}/mies.`}
        accent={accent}
        leadWithZero={false}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <ul className="space-y-3">
          {offer.features.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${styles.checkBg}`}
              >
                <Check className={`h-3 w-3 ${styles.check}`} strokeWidth={3} />
              </span>
              {f.infoId ? (
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className={`inline-flex items-center gap-1 cursor-pointer text-left underline decoration-dotted underline-offset-4 ${styles.infoDecoration}`}
                >
                  {f.label}
                  <Info size={12} className="shrink-0 opacity-60" />
                </button>
              ) : (
                <span>{f.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Zadzwoń: zawsze teal, niezależnie od akcentu karty — jak na screenach */}
      <a
        href={`tel:${PHONE_HREF}`}
        onClick={handlePhoneClick}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] hover:bg-teal-600"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </a>

      <a
        href={`sms:${PHONE_HREF}?body=${smsBody}`}
        onClick={handleSmsClick}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] hover:bg-black/20"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </a>
    </article>
  );
});

export default Plan1kCard;