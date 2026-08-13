"use client";

import { ArrowRight, Wifi, Tv } from "lucide-react";
import DottedBackground from "../ui/DottedBackground";

/* ---------------------------------------------------------------------- */
/*  Additional Offers — 2 karty, zdjęcie w tle jako overlay (jak na       */
/*  screenie), teal CTA.                                                  */
/*                                                                        */
/*  Podział wg tego, czego faktycznie szuka klient: sam internet vs       */
/*  internet + telewizja. Adresuje wprost cytat z Avatar_Sheet:           */
/*  "I don't need traditional TV — I already have Netflix and YouTube" —  */
/*  część odbiorców wyraźnie nie chce dopłacać za TV, którego nie użyje.  */
/*                                                                        */
/*  [POPRAWKA — mocniejsze CTA]:                                          */
/*  1. Cena dodana wprost do tekstu przycisku ("od 55 zł/mies.") —        */
/*     wcześniej "Zobacz ofertę" nie dawało klientowi żadnego punktu      */
/*     odniesienia przed kliknięciem.                                     */
/*  2. Mikrocopy pod CTA — ten sam wzorzec redukcji ryzyka co w Hero.tsx,  */
/*     kartach ofert i PoradnikTechnologie; wcześniej ta sekcja była      */
/*     jedynym miejscem bez tego wzorca.                                  */
/*  3. Opis "Sam internet" przeformułowany z samych przeczeń na wprost —  */
/*     "płać za to, z czego korzystasz" zamiast tylko "nie oglądasz,      */
/*     nie płać".                                                         */
/*                                                                        */
/*  CTA prowadzą do konfiguratora (nie tel:), bo to nawigacja do wyboru   */
/*  pakietu, nie połączenie telefoniczne.                                 */
/*  [FIX] Linki wskazywały na localhost:3000 — zamienione na ścieżki      */
/*  względne, żeby działały poprawnie na produkcji.                       */
/*                                                                        */
/*  [FIX — równe karty] Grid domyślnie rozciąga kolumny do tej samej      */
/*  wysokości (align-items: stretch), ale wewnątrz kart nie było layoutu  */
/*  flex — więc przy różnej długości opisu CTA i mikrocopy lądowały na    */
/*  różnej wysokości w obu kartach. Karta jest teraz h-full + flex        */
/*  flex-col, opis ma flex-1, więc CTA + mikrocopy zawsze przyklejone do  */
/*  dołu i wyrównane między kartami niezależnie od długości tekstu.       */
/*                                                                        */
/*  UWAGA: obrazy w tle to placeholdery (/images/offer-internet.jpg,      */
/*  /images/offer-internet-tv.jpg) — podmień na docelowe zdjęcia.         */
/*  Bez animacji.                                                        */
/* ---------------------------------------------------------------------- */

interface AdditionalOffer {
  icon: typeof Wifi;
  image: string;
  title: string;
  priceFrom: number;
  description: string;
  cta: string;
  href: string;
}

const offers: AdditionalOffer[] = [
  {
    icon: Wifi,
    image: "/images/offer-internet.jpg",
    title: "Sam internet",
    priceFrom: 30,
    description:
      "Masz już Netflixa i YouTube'a? Płać za to, z czego faktycznie korzystasz — sam internet, bez kanałów, których nigdy nie odpalisz.",
    cta: "Sprawdź ofertę Internet — od 30 zł/mies.",
    href: "/oferty/NajlepszaCena#pakiety",
  },
  {
    icon: Tv,
    image: "/images/offer-internet-tv.jpg",
    title: "Internet 300 Mb/s + TV M",
    priceFrom: 55,
    description:
      "Dekoder 4K, setki kanałów na żywo i Netia GO w cenie — jeden abonament na cały dom, bez dodatkowych umów.",
    cta: "Sprawdź Internet 300 Mb/s + TV M — od 55 zł/mies.",
    href: "/konfigurator/InternetOrazTelewizja",
  },
];

export default function AdditionalOffers() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <DottedBackground variant="dots-accent" size={22} />
      <div className="relative max-w-305 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
          <div
            key={offer.title}
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-8"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${offer.image})` }}
            />
            <div className="absolute inset-0 bg-[#0d1f31]/80" />

            <div className="relative flex h-full flex-col">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-teal-400/15">
                <Icon className="h-5 w-5 text-teal-300" strokeWidth={2.25} />
              </span>
              {/* [UWAGA] h1 na wyraźną prośbę — ale to już drugi/trzeci h1
                  na stronie (obok Hero.tsx). Dwa+ h1 na jednej stronie nie
                  jest poprawne semantycznie/SEO-wo (h1 ma oznaczać główny
                  temat strony). Jeśli to ma znaczenie dla SEO, rozważ h2
                  ze stylem wizualnym h1 zamiast realnego tagu h1. */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {offer.title}{" "}
                <span className="text-teal-300">od {offer.priceFrom} zł/mies.</span>
              </h1>
              <p className="mt-3 flex-1 text-sm text-slate-200 leading-relaxed">
                {offer.description}
              </p>

              <a
                href={offer.href}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-black hover:bg-teal-600"
              >
                {offer.cta}
                <ArrowRight className="h-4 w-4" />
              </a>

              {/* [NOWE] Mikrocopy pod CTA — redukcja ryzyka, ten sam
                  wzorzec co w Hero.tsx i kartach ofert. */}
              <p className="mt-2.5 text-xs text-slate-400">
                Cena widoczna od razu, bez zbędnych formalności.
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}