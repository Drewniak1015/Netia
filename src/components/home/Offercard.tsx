"use client";

import { memo, useCallback, useMemo } from "react";
import { Check, Info, MessageCircle, Phone } from "lucide-react";
import { trackContact, slugify } from "@/lib/meta-track";
import { PHONE, PHONE_HREF, type Offer } from "@/components/home/Offersdata";
import { PromoCena } from "@/components/home/Promocena";

/* ---------------------------------------------------------------------- */
/*  Karta Podstawa.                                                       */
/*  [OPTYMALIZACJA] Bez framer-motion — hover kart i przycisków to teraz  */
/*  Tailwindowe utility (hover:-translate-y-*, hover:scale-*,             */
/*  active:scale-*), animowane przez przeglądarkę na compositorze bez     */
/*  potrzeby JS.                                                          */
/* ---------------------------------------------------------------------- */
const OfferCard = memo(function OfferCard({
  offer,
  onPokazInfo,
}: {
  offer: Offer;
  onPokazInfo: (infoId: string) => void;
}) {
  // Treść SMS-a i content_name liczone raz na zmianę `offer` (useMemo),
  // a nie przy każdym renderze karty.
  const { smsBody, contentName } = useMemo(() => {
    const body = encodeURIComponent(
      `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
    );
    const name = `oferta_podstawa_${slugify(offer.speed)}_${slugify(offer.pkg)}`;
    return { smsBody: body, contentName: name };
  }, [offer.speed, offer.pkg]);

  const handlePhoneClick = useCallback(
    () => trackContact(`${contentName}_tel`),
    [contentName]
  );
  const handleSmsClick = useCallback(
    () => trackContact(`${contentName}_sms`),
    [contentName]
  );

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 transition-transform duration-200 will-change-transform hover:-translate-y-1.5 ${
        offer.featured
          ? "border-teal-400/50 bg-[#0f2436] shadow-[0_0_24px_-8px_rgba(45,212,191,0.25)]"
          : "border-white/10 bg-[#0d1f31] hover:border-white/20"
      }`}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a2b] text-center">
          Najczęściej wybierana
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      <p className="mt-1 text-2xl font-extrabold text-white leading-tight">
        {offer.speed} <span className="text-lg font-bold text-slate-300">+ {offer.pkg}</span>
      </p>

      <PromoCena
        promoLabel="Abonament 6 miesięcy za 0 zł po rabatach"
        regularPrice={offer.price}
        regularPriceNote={`Od 7. do 24. miesiąca: ${offer.price}/mies.`}
        accent="orange"
        leadWithZero={false}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <ul className="space-y-3">
          {offer.features.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15">
                <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
              </span>
              {f.infoId ? (
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className="inline-flex items-center gap-1 cursor-pointer text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors hover:text-teal-300 hover:decoration-teal-300"
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

      <a
        href={`tel:${PHONE_HREF}`}
        onClick={handlePhoneClick}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.03] hover:bg-teal-600 active:scale-[0.97]"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </a>

      <a
        href={`sms:${PHONE_HREF}?body=${smsBody}`}
        onClick={handleSmsClick}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.03] hover:bg-black/20 active:scale-[0.97]"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </a>
    </article>
  );
});

export default OfferCard;