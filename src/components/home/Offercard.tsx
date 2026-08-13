"use client";

import { memo, useCallback, useMemo } from "react";
import { Check, MessageCircle, Phone } from "lucide-react";
import { trackContact, slugify } from "@/lib/meta-track";
import { PHONE, PHONE_HREF, type Offer } from "@/components/home/Offersdata";
import { PromoCena } from "@/components/home/Promocena";

/* ---------------------------------------------------------------------- */
/*  Karta Podstawa.                                                        */
/*                                                                         */
/*  ZMIANY W TEJ WERSJI:                                                   */
/*  1. [RÓWNA WYSOKOŚĆ] <article> dostał `h-full`. W połączeniu z          */
/*     `items-stretch` na kontenerze w Oferty.tsx wszystkie karty w rzędzie */
/*     mają teraz identyczną wysokość niezależnie od liczby benefitów.      */
/*     Lista benefitów jest w `flex-1`, więc rozciąga się i wypycha CTA na  */
/*     dół — przyciski "ZADZWOŃ"/"WYŚLIJ SMS" lądują w jednej linii we      */
/*     wszystkich kartach.                                                  */
/*                                                                         */
/*  2. [KOLOR AKCENTU] Zamiast zahardkodowanego `isPink` (który po          */
/*     usunięciu wariantu 1 Gb/s i tak był martwy) kolor bierze się teraz   */
/*     z `offer.accentColor` z danych. 300 Mb/s -> #00d5be,                 */
/*     600 Mb/s -> #00be81. Fallback to #00be81, gdyby pole było puste.     */
/*     Kolory idą przez `style`, nie przez klasy Tailwind, bo wartości są   */
/*     dynamiczne (Tailwind nie generuje klas z runtime'owych stringów).    */
/*                                                                         */
/*  3. [FIX PROMOCJI 300 Mb/s] Wariant 300 Mb/s ma `promoMonths: 0` i      */
/*     `noFreeMonths: true` — nie ma darmowego okresu, tylko podwyżkę po   */
/*     24 miesiącach (30 zł -> 60 zł). Poprzedni kod bezwarunkowo składał  */
/*     label "Abonament {promoMonths} miesięcy za 0 zł", co dla 300 Mb/s   */
/*     dałoby nieprawdziwy komunikat "Abonament 0 miesięcy za 0 zł po      */
/*     rabatach" oraz "Od 1. do 24. miesiąca". Teraz jest osobna gałąź.    */
/*                                                                         */
/*  4. [CTA] Przycisk "ZADZWOŃ" miał na sztywno `bg-teal-500` mimo         */
/*     komentarza, że przełącza kolor — teraz faktycznie używa koloru      */
/*     akcentu danej oferty.                                                */
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

/** Domyślny akcent, gdy oferta nie ma ustawionego `accentColor`. */
const DEFAULT_ACCENT = "#00be81";

const OfferCard = memo(function OfferCard({
  offer,
  onPokazInfo,
}: {
  offer: Offer;
  onPokazInfo: (infoId: string) => void;
}) {
  /* Kolor akcentu z danych — dotyczy paska po lewej, badge, checkmarków,
     hoveru na klikalnych benefitach i przycisku "ZADZWOŃ". */
  const accent = offer.accentColor ?? DEFAULT_ACCENT;

  const { smsBody, contentName } = useMemo(() => {
    const body = encodeURIComponent(
      `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
    );
    const name = `oferta_podstawa_${slugify(offer.speed)}_${slugify(offer.pkg)}`;
    return { smsBody: body, contentName: name };
  }, [offer.speed, offer.pkg]);

  const { promoLabel, regularPriceNote } = useMemo(() => {
    /* [FIX] Wariant bez darmowych miesięcy (300 Mb/s): cena obowiązuje od
       1. miesiąca, a po 24. rośnie do `priceAfter24`. Nie wolno tu pokazać
       komunikatu o "0 zł", bo taka promocja w tym wariancie nie istnieje. */
    if (offer.noFreeMonths) {
      return {
        promoLabel: "Cena zapisana w umowie na 24 miesiące",
        regularPriceNote: offer.priceAfter24
          ? `Od 25. miesiąca: ${offer.priceAfter24} zł/mies.`
          : `Cena obowiązuje przez 24 miesiące.`,
      };
    }

    const label = `Abonament ${offer.promoMonths} ${odmienMiesiace(offer.promoMonths)} za 0 zł po rabatach`;
    const note = `Od ${offer.promoMonths + 1}. do 24. miesiąca: ${offer.price} zł/mies.`;
    return { promoLabel: label, regularPriceNote: note };
  }, [offer.promoMonths, offer.price, offer.noFreeMonths, offer.priceAfter24]);

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
      /* [RÓWNA WYSOKOŚĆ] h-full — karta wypełnia całą wysokość wrappera,
         który jest rozciągnięty przez items-stretch w Oferty.tsx. */
      className={`relative flex h-full flex-col rounded-2xl border p-6 ${
        offer.featured ? "bg-[#0f2436]" : "bg-[#0d1f31] border-white/10"
      }`}
      style={
        offer.featured
          ? {
              borderColor: `${accent}80`,
              boxShadow: `0 0 24px -8px ${accent}40`,
            }
          : undefined
      }
    >
      {/* Pasek akcentu po lewej — 80% wysokości karty, nie 100%,
          wyśrodkowany w pionie, osobno od bordera. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[10%] h-4/5 w-1 rounded-full"
        style={{ backgroundColor: accent }}
      />

      {offer.featured && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-center text-[#0a1a2b]"
          style={{ backgroundColor: accent }}
        >
          {/* `badgeLabel` z danych, z fallbackiem na dotychczasowy tekst —
              dzięki temu 300 Mb/s może mieć "NAJLEPSZY STOSUNEK CENY DO
              PAKIETU", a 600 Mb/s zostaje przy "Najczęściej wybierana". */}
          {offer.badgeLabel ?? "Najczęściej wybierana"}
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
        accent="orange"
        leadWithZero={false}
      />

      {/* [RÓWNA WYSOKOŚĆ] flex-1 na tym kontenerze zjada całą nadmiarową
          przestrzeń, więc karty z mniejszą liczbą benefitów rozciągają się
          w tym miejscu, a CTA poniżej zawsze siedzi na dole karty.
          `justify-start` zamiast `justify-center`, żeby listy benefitów
          zaczynały się na tej samej wysokości we wszystkich kartach —
          przy `justify-center` krótsza lista wisiała na środku i wyglądała
          na rozjechaną względem sąsiedniej karty. */}
      <div className="mt-4 flex flex-1 flex-col justify-start">
        <ul className="space-y-3">
          {offer.features.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accent}26` }}
              >
                <Check className="h-3 w-3" strokeWidth={3} style={{ color: accent }} />
              </span>
              {f.infoId ? (
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className="cursor-pointer text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors hover:[color:var(--accent)] hover:[text-decoration-color:var(--accent)]"
                  style={{ ["--accent" as string]: accent }}
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
        className="mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#0a1a2b] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
        style={{ backgroundColor: accent }}
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