"use client";

import { memo, useCallback, useMemo } from "react";
import { m } from "framer-motion";
import { Check, Info, MessageCircle, Phone, Shield } from "lucide-react";
import { trackContact, slugify } from "@/lib/meta-track";
import { PHONE, PHONE_HREF, type MaxOffer } from "@/components/home/Offersdata";
import { HOVER_SPRING, TAP_SPRING, cardVariants } from "@/components/home/Motionconfig";
import { PromoCena } from "@/components/home/Promocena";

/* ---------------------------------------------------------------------- */
/*  Karta MAX.                                                            */
/* ---------------------------------------------------------------------- */
const MaxOfferCard = memo(function MaxOfferCard({
  offer,
  reduceMotion,
  onPokazInfo,
}: {
  offer: MaxOffer;
  reduceMotion: boolean;
  onPokazInfo: (infoId: string) => void;
}) {
  // Treść SMS-a z nazwą konkretnej oferty MAX (np. "MAX 2000"), liczona
  // raz na zmianę `offer` zamiast przy każdym renderze.
  const { smsBody, contentName } = useMemo(() => {
    const body = encodeURIComponent(
      `Interesuje mnie oferta: ${offer.name} (${offer.speed}). Oddzwońcie do mnie.`
    );
    const name = `oferta_max_${slugify(offer.name)}`;
    return { smsBody: body, contentName: name };
  }, [offer.name, offer.speed]);

  const handlePhoneClick = useCallback(
    () => trackContact(`${contentName}_tel`),
    [contentName]
  );
  const handleSmsClick = useCallback(
    () => trackContact(`${contentName}_sms`),
    [contentName]
  );

  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={HOVER_SPRING}
      className={`relative flex flex-col rounded-2xl p-6 bg-[#183648] ${
        offer.featured
          ? "border-2 border-pink-400/70 shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(236,72,153,0.45)]"
          : "border border-white/10"
      }`}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B2A3D] shadow-sm">
          Najczęściej wybierany
        </span>
      )}

      <span className="block text-2xl font-black tracking-tight text-pink-400 sm:text-3xl">
        {offer.name}
      </span>

      <PromoCena
        promoLabel={offer.monthsPill}
        regularPrice={offer.price}
        regularPriceNote={`Od 13. do 24. miesiąca: ${offer.price}`}
        accent="pink"
        leadWithZero={true}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <ul className="space-y-3">
          <li className="flex items-center gap-2.5 text-sm text-white">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
              <Check size={12} strokeWidth={3} />
            </span>
            Internet do <b className="font-bold">{offer.speed}</b>
          </li>
          {offer.features.map((f) => (
            <li key={f.label} className="flex items-start gap-2.5 text-sm text-white">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
                <Check size={12} strokeWidth={3} />
              </span>
              {f.infoId ? (
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className="inline-flex items-center gap-1 cursor-pointer text-left underline decoration-dotted decoration-pink-300/40 underline-offset-4 transition-colors hover:text-pink-300"
                >
                  {f.label}
                  <Info size={12} className="shrink-0 opacity-60" />
                </button>
              ) : f.label === "Bezpieczny Internet Ultra" ? (
                <span>
                  {f.label}
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/55">
                    <Shield size={11} className="text-pink-300" />
                    Ochrona 5 urządzeń + CyberEkspert
                  </span>
                </span>
              ) : (
                <span>{f.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <m.a
        href={`tel:${PHONE_HREF}`}
        onClick={handlePhoneClick}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)]"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </m.a>

      <m.a
        href={`sms:${PHONE_HREF}?body=${smsBody}`}
        onClick={handleSmsClick}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-black/20"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </m.a>
    </m.article>
  );
});

export default MaxOfferCard;