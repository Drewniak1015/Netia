"use client";

import { memo, useCallback, useMemo } from "react";
import { Check, MessageCircle, Phone } from "lucide-react";
import { trackContact, slugify } from "@/lib/meta-track";
import { PHONE, PHONE_HREF, type Offer } from "@/components/home/Offersdata";
import { PromoCena } from "@/components/home/Promocena";

/* ---------------------------------------------------------------------- */
/*  Karta Podstawa.                                                       */
/*                                                                          */
/*  ZMIANY W TEJ WERSJI:                                                   */
/*  1. Ikona "Info" obok klikalnych pozycji USUNIĘTA — klikalność sygnal-  */
/*     izuje tylko podkreślenie (decoration-dotted), zgodnie z Twoją       */
/*     uwagą "rzeczy które da się kliknąć mają być tylko podkreślone".     */
/*  2. Lewy pasek koloru NIE jest już częścią border-l karty (co dawało    */
/*     100% wysokości) — to osobny, absolutnie pozycjonowany element na    */
/*     80% wysokości karty, wyśrodkowany w pionie.                        */
/*  3. Różowy akcent jaśniejszy: pink-400 -> [#fb64b6] wszędzie.            */
/*  4. Przycisk "Zadzwoń" też przełącza kolor: teal dla 600 Mb/s,          */
/*     jasny róż dla 1 Gb/s (wcześniej był zawsze teal).                  */
/*  5. GigaNagrywarka Maxi ma infoId w danych (Offersdata.ts), więc        */
/*     automatycznie renderuje się jako klikalna — nic dodatkowego nie    */
/*     trzeba było tu zmieniać, upewnij się tylko że Infomodal.tsx ma      */
/*     wpis dla "gignagrywarka-maxi".                                     */
/* ---------------------------------------------------------------------- */

function odmienMiesiace(n: number): string {
  if (n === 1) return "miesiąc";
  const ostatniaCyfra = n % 10;
  const dziesiatki = n % 100;
  if (ostatniaCyfra >= 2 && ostatniaCyfra <= 4 && !(dziesiatki >= 12 && dziesiatki <= 14)) {
    return "miesiące";
  }
  return "miesięcy";
}

const OfferCard = memo(function OfferCard({
  offer,
  onPokazInfo,
}: {
  offer: Offer;
  onPokazInfo: (infoId: string) => void;
}) {
  // Akcent kolorystyczny zależny od paczki prędkości — teal dla 600 Mb/s,
  // jasny pink dla 1 Gb/s. Dotyczy paska po lewej, badge, checkmarków,
  // pigułki promo (PromoCena) i teraz też przycisku "Zadzwoń".
  const isPink = offer.speed === "1 Gb/s";

  const { smsBody, contentName } = useMemo(() => {
    const body = encodeURIComponent(
      `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
    );
    const name = `oferta_podstawa_${slugify(offer.speed)}_${slugify(offer.pkg)}`;
    return { smsBody: body, contentName: name };
  }, [offer.speed, offer.pkg]);

  const { promoLabel, regularPriceNote } = useMemo(() => {
    const label = `Abonament ${offer.promoMonths} ${odmienMiesiace(offer.promoMonths)} za 0 zł po rabatach`;
    const note = `Od ${offer.promoMonths + 1}. do 24. miesiąca: ${offer.price} zł/mies.`;
    return { promoLabel: label, regularPriceNote: note };
  }, [offer.promoMonths, offer.price]);

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
      className={`relative flex flex-col rounded-2xl border p-6 ${
        offer.featured
          ? `bg-[#0f2436] ${
              isPink
                ? "border-[#fb64b6]/50 shadow-[0_0_24px_-8px_rgba(251,100,182,0.25)]"
                : "border-[#00be81]/50 shadow-[0_0_24px_-8px_rgba(0,190,129,0.25)]"
            }`
          : "bg-[#0d1f31] border-white/10"
      }`}
    >
      {/* Pasek akcentu po lewej — 80% wysokości karty, nie 100%,
          wyśrodkowany w pionie, osobno od bordera. */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[10%] h-4/5 w-1 rounded-full ${
          isPink ? "bg-[#fb64b6]" : "bg-[#00be81]"
        }`}
      />

      {offer.featured && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-center ${
            isPink ? "bg-[#fb64b6] text-[#2b0f22]" : "bg-[#00be81] text-[#0a1a2b]"
          }`}
        >
          Najczęściej wybierana
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      <p className="mt-1 text-2xl font-extrabold text-white leading-tight">
        {offer.speed} <span className="text-lg font-bold text-slate-300">+ {offer.pkg}</span>
      </p>

      <PromoCena
        promoLabel={promoLabel}
        regularPrice={String(offer.price)}
        regularPriceNote={regularPriceNote}
        accent={isPink ? "pink" : "orange"}
        leadWithZero={false}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <ul className="space-y-3">
          {offer.features.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  isPink ? "bg-[#fb64b6]/15" : "bg-[#00be81]/15"
                }`}
              >
                <Check
                  className={`h-3 w-3 ${isPink ? "text-[#fb64b6]" : "text-[#00be81]"}`}
                  strokeWidth={3}
                />
              </span>
              {f.infoId ? (
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className={`cursor-pointer text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors ${
                    isPink ? "hover:text-[#fb64b6] hover:decoration-[#fb64b6]" : "hover:text-[#00be81] hover:decoration-[#00be81]"
                  }`}
                >
                  {f.label}
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