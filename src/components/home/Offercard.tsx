"use client";

import { memo, useCallback, useMemo } from "react";
import { Check, MessageCircle, Phone } from "lucide-react";
import { trackContact, slugify } from "@/lib/meta-track";
import { PHONE, PHONE_HREF, type Offer } from "@/components/home/Offersdata";
import { PromoCena } from "@/components/home/Promocena";

/* ---------------------------------------------------------------------- */
/*  Karta oferty — wersja mobile-first.                                    */
/*                                                                         */
/*  ZMIANY W TEJ WERSJI (wszystkie pod telefon):                           */
/*                                                                         */
/*  1. [FIX: BADGE WYCHODZIŁ POZA KARTĘ]                                   */
/*     Badge "NAJLEPSZY STOSUNEK CENY DO PAKIETU" miał                     */
/*     `absolute left-1/2 -translate-x-1/2 whitespace-nowrap`. Ten tekst    */
/*     ma ~34 znaki — przy 11px to ~230px w jednej linii, a karta na        */
/*     telefonie 360px ma ~300px szerokości wewnątrz paddingu. Mieściło się */
/*     ledwo, a przy dłuższym badge'u albo większej czcionce systemowej     */
/*     (ustawienia dostępności!) wychodziło poza kartę w obie strony i      */
/*     powodowało poziomy scroll całej strony.                              */
/*     Teraz: na telefonie badge jest ZWYKŁYM elementem w przepływie na     */
/*     górze karty (zawija się, nie nachodzi na tytuł), a dopiero od `sm`   */
/*     wraca do pływającej pigułki nad krawędzią.                           */
/*                                                                         */
/*  2. [TAP TARGETY] Oba CTA mają `min-h-[52px]` — wcześniej wysokość       */
/*     zależała od paddingu i przy 14px tekstu schodziła poniżej 44px       */
/*     zalecanych przez wytyczne iOS/Android. Klikalne benefity dostały     */
/*     `py-1 -my-1` (powiększony obszar dotyku bez zmiany wyglądu).         */
/*                                                                         */
/*  3. [HOVER NA DOTYKU] `hover:scale-*` przeniesione za `sm:` — na         */
/*     telefonie hover "przykleja się" po tapnięciu i przycisk zostaje      */
/*     powiększony aż do tapnięcia gdzie indziej. Zostaje `active:scale`,   */
/*     które na dotyku działa poprawnie.                                     */
/*                                                                         */
/*  4. [TYPOGRAFIA] Prędkość: `text-xl` na telefonie zamiast `text-2xl`,    */
/*     a "+ TV XS" schodzi do własnej linii poniżej `sm` — inaczej          */
/*     "300 Mb/s + TV XS" łamie się w losowym miejscu.                      */
/*                                                                         */
/*  5. [CTA] Numer telefonu w przycisku łamał się na wąskich ekranach.      */
/*     Teraz `tabular-nums` + mniejszy tekst na telefonie + `leading-tight` */
/*     trzymają go w jednej linii na 320px.                                  */
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
  const accent = offer.accentColor ?? DEFAULT_ACCENT;

  /* [GRADIENT AKCENTU] Jeśli oferta ma `accentGradient`, idzie on na pasek
     po lewej i na badge. NIE na przycisk CTA — patrz komentarz przy nim.
     Elementy małe (checkmarki 20×20 px, hover benefitów, poświata karty)
     zostają przy płaskim `accent`: gradient rozciągnięty na 20 px i tak
     wygląda jak jednolity kolor, a komplikuje kod.

     `backgroundImage` zamiast `background`, żeby `backgroundColor` mógł
     działać jako fallback tam, gdzie gradientu nie ma. */
  const powierzchniaAkcentu = offer.accentGradient
    ? { backgroundImage: offer.accentGradient }
    : { backgroundColor: accent };

  const { smsBody, contentName } = useMemo(() => {
    const body = encodeURIComponent(
      `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
    );
    const name = `oferta_podstawa_${slugify(offer.speed)}_${slugify(offer.pkg)}`;
    return { smsBody: body, contentName: name };
  }, [offer.speed, offer.pkg]);

  const { promoLabel, regularPriceNote } = useMemo(() => {
    /* [ETYKIETA PROMOCJI] Krótka formuła zamiast zdania.
       Było: "Abonament 6 miesięcy za 0 zł po rabatach" (37 znaków, łamało
       się na dwie linie na telefonie i gubiło rytm ceny).
       Jest: "6 MIESIĘCY ZA 0 ZŁ!" — liczba na początku, zero dopisków.

       DLACZEGO "ZA 0 ZŁ", A NIE "ZA DARMO":
       "darmo" sugeruje brak jakichkolwiek zobowiązań, a promocja wymaga
       umowy na 24 pełne Okresy Rozliczeniowe i po 6. miesiącu klient
       płaci pełną stawkę. "0 zł" mówi dokładnie to samo o kwocie, ale
       nie obiecuje niczego ponad nią — przy ofercie, która całą swoją
       przewagę buduje na "bez ukrytych warunków", to nie jest detal.
       Jeśli mimo to chcesz "ZA DARMO", zmień tylko ten jeden string.

       ZNIKŁO "po rabatach": to zastrzeżenie ma sens tylko wtedy, gdy
       rabaty faktycznie warunkują cenę (e-faktura, zgody marketingowe).
       W danych dla 1 i 2 Gb/s nie ma takiego mechanizmu, więc dopisek
       tylko osłabiał komunikat. Jeśli rabaty jednak obowiązują, wróć z
       tym zastrzeżeniem — to warunek ceny, nie ozdobnik. */
    if (offer.noFreeMonths) {
      /* [BRAK ETYKIETY] Warianty bez darmowych miesięcy (300 Mb/s) nie mają
         czym wypełnić tego miejsca. Stało tu "CENA BEZ ZMIAN PRZEZ 24
         MIESIĄCE", co dublowało notę w nagłówku grupy w Oferty.tsx, a przy
         okazji brzmiało jak pocieszenie tam, gdzie sąsiednia karta krzyczy
         "6 MIESIĘCY ZA 0 ZŁ!". Lepiej nic niż słabsza wersja tego samego
         miejsca — cena mówi wtedy sama za siebie, a warunek 24 miesięcy
         niesie `regularPriceNote` pod spodem.

         UWAGA: nie widziałem Promocena.tsx. Jeśli PromoCena renderuje
         `promoLabel` bezwarunkowo, pusty string zostawi pustą linię albo
         margines nad ceną — wtedy trzeba dodać tam guard
         (`{promoLabel && <span…>}`). Wrzuć mi ten plik, to poprawię. */
      return {
        promoLabel: "",
        regularPriceNote: offer.priceAfter24
          ? `Od 25. miesiąca: ${offer.priceAfter24} zł/mies.`
          : `Cena obowiązuje przez 24 miesiące.`,
      };
    }

    const label = `${offer.promoMonths} ${odmienMiesiace(offer.promoMonths).toUpperCase()} ZA 0 ZŁ!`;
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

  const badgeLabel = offer.badgeLabel ?? "Najczęściej wybierana";

  return (
    <article
      /* [MOBILE] p-5 zamiast p-6 — na 360px każde 8px paddingu z obu stron
         to 16px mniej na treść. `overflow-hidden` to zabezpieczenie: gdyby
         cokolwiek w środku (długi badge, długa nazwa pakietu) chciało wyjść
         poza kartę, zostanie przycięte zamiast rozpychać stronę w poziomie. */
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 sm:overflow-visible sm:p-6 ${
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
      {/* [PASEK AKCENTU] Wygaszany na obu końcach maską zamiast twardego
          ucięcia. Wcześniej pasek miał 80% wysokości karty i kończył się
          ostrą krawędzią w przypadkowym miejscu — teraz biegnie przez całą
          wysokość i rozpływa się w tle na górze i na dole.

          `mask-image` działa na dowolnym tle, więc ten sam kod obsługuje
          karty z płaskim kolorem i tę jedną z gradientem 2 Gb/s — przy
          gradiencie efekt składa się z dwóch przejść naraz (bursztyn ->
          pomarańcz w kolorze, pełne -> przezroczyste w kryciu).

          `WebkitMaskImage` jest potrzebne dla Safari — bez prefiksu maska
          nie zadziała i pasek dostanie ostre końce zamiast wygaszenia. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-1 rounded-full"
        style={{
          ...powierzchniaAkcentu,
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
        }}
      />

      {offer.featured && (
        /* [FIX MOBILE] Poniżej `sm`: normalny element w przepływie, może się
           zawinąć do dwóch linii, nie nachodzi na tytuł i nie wychodzi poza
           kartę. Od `sm`: pływająca pigułka nad górną krawędzią, jak było. */
        <span
          className="mb-3 block rounded-full px-3 py-1 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-[#0a1a2b]
                     sm:absolute sm:-top-3 sm:left-1/2 sm:mb-0 sm:w-auto sm:max-w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:whitespace-nowrap"
          style={powierzchniaAkcentu}
        >
          {badgeLabel}
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      {/* [MOBILE] Pakiet w osobnej linii poniżej `sm` — "300 Mb/s + TV XS"
          w jednej linii przy text-2xl nie mieści się na 320px i łamie się
          w przypadkowym miejscu, np. po samym "+". */}
      <p className="mt-1 text-xl font-extrabold leading-tight text-white sm:text-2xl">
        {offer.speed}{" "}
        <span className="block text-base font-bold text-slate-300 sm:inline sm:text-lg">
          + {offer.pkg}
        </span>
      </p>

      <PromoCena
        promoLabel={promoLabel}
        regularPrice={String(offer.price)}
        regularPriceNote={regularPriceNote}
        accent="orange"
        leadWithZero={false}
      />

      {/* Lista benefitów w flex-1 — wypycha CTA na dół, żeby przyciski
          stały w jednej linii we wszystkich kartach rzędu. */}
      <div className="mt-4 flex flex-1 flex-col justify-start">
        <ul className="space-y-2.5 sm:space-y-3">
          {offer.features.map((f) => (
            <li
              key={f.label}
              className="flex items-center gap-2.5 text-[0.9375rem] leading-snug text-slate-200 sm:text-sm"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accent}26` }}
              >
                <Check className="h-3 w-3" strokeWidth={3} style={{ color: accent }} />
              </span>
              {f.infoId ? (
                /* [TAP TARGET] py-1 -my-1 powiększa obszar dotyku o 8px
                   w pionie, nie zmieniając odstępów wizualnie. */
                <button
                  type="button"
                  onClick={() => onPokazInfo(f.infoId!)}
                  className="-my-1 cursor-pointer py-1 text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors sm:hover:[color:var(--accent)] sm:hover:[text-decoration-color:var(--accent)]"
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

      {/* [CTA] min-h-[52px] = pewny tap target. `hover:scale` tylko od sm,
          bo na dotyku hover zostaje przyklejony po tapnięciu. */}
      <a
        href={`tel:${PHONE_HREF}`}
        onClick={handlePhoneClick}
        className="mt-5 flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-3 text-[13px] font-bold leading-tight text-[#0a1a2b] transition-transform duration-150 active:scale-[0.97] sm:mt-6 sm:px-4 sm:text-sm sm:hover:scale-[1.03]"
        /* [JEDNOLITY KOLOR] Przycisk celowo bez gradientu, nawet gdy oferta
           ma `accentGradient`. Gradient na CTA konkuruje z paskiem akcentu i
           rozmywa hierarchię — pasek ma być ozdobą, przycisk ma być
           przyciskiem. Płaska plama koloru czyta się też stabilniej pod
           palcem w trakcie przewijania. */
        style={{ backgroundColor: accent }}
      >
        <Phone className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap tabular-nums">ZADZWOŃ {PHONE}</span>
      </a>

      <a
        href={`sms:${PHONE_HREF}?body=${smsBody}`}
        onClick={handleSmsClick}
        className="mt-2.5 flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.03] sm:hover:bg-black/20"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        WYŚLIJ SMS
      </a>
    </article>
  );
});

export default OfferCard;