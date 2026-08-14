"use client";

import { ArrowRight, Wifi, Tv } from "lucide-react";
import DottedBackground from "../ui/DottedBackground";

/* ---------------------------------------------------------------------- */
/*  Additional Offers — 2 karty, zdjęcie w tle jako overlay, teal CTA.    */
/*                                                                        */
/*  [FIX — zgodność z kreacją reklamową]                                  */
/*  Poprzednia wersja lewej karty mówiła "Sam internet od 30 zł/mies.".   */
/*  To nieprawda: pakiet TV XS jest w każdej ofercie internetowej i jest  */
/*  wliczony w cenę. Kreacja reklamowa obiecuje "300 Mb/s + TV za 30 zł", */
/*  więc user z reklamy trafiał na stronę, która wyglądała, jakby mu to   */
/*  odbierała ("30 zł = sam internet, TV dopiero od 55 zł"). Klasyczny    */
/*  bait-and-switch w odbiorze + ryzyko zarzutu wprowadzania w błąd.      */
/*                                                                        */
/*  Rozwiązanie: karta dalej mówi do osoby, która nie chce telewizji      */
/*  (cytat z Avatar_Sheet: "I don't need traditional TV — I already have  */
/*  Netflix and YouTube"), ale przez pryzmat "to paczka głównie o         */
/*  internecie, TV XS dostajesz w cenie", a nie "tu nie ma TV".           */
/*  Różnica XS vs M jest teraz nazwana wprost, więc skok 30 → 55 zł ma    */
/*  uzasadnienie, zamiast wyglądać na dopłatę za to samo.                 */
/*                                                                        */
/*  [NOWE] Pole `badge` — plakietka "TV XS w cenie" nad tytułem, żeby     */
/*  informacja była widoczna przed przeczytaniem opisu.                   */
/*  [NOWE] Przypis pod gridem — jedno zdanie domykające temat dla obu     */
/*  kart, żeby nie powtarzać go w każdym opisie.                          */
/*                                                                        */
/*  Zachowane z poprzedniej wersji: cena w tekście CTA, mikrocopy pod     */
/*  CTA, ścieżki względne, h-full + flex-col + flex-1 na opisie           */
/*  (wyrównanie CTA między kartami). Bez animacji.                        */
/*                                                                        */
/*  UWAGA 1: obrazy w tle to placeholdery — podmień na docelowe.          */
/*  UWAGA 2: liczby kanałów w opisie karty TV M są opisowe                */
/*  ("setki kanałów"). Jeśli masz twardą liczbę z cennika, wstaw ją —     */
/*  konkret konwertuje lepiej niż "setki".                                */
/*  UWAGA 3: ten sam fix trzeba zrobić w karcie cenowej na górze strony   */
/*  ("300 Mb/s + XS" → "300 Mb/s + TV XS") oraz w kreacji reklamowej,     */
/*  inaczej rozjazd zostaje, tylko przesunięty w inne miejsce.            */
/* ---------------------------------------------------------------------- */

interface AdditionalOffer {
  icon: typeof Wifi;
  image: string;
  badge: string;
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
    badge: "TV XS w cenie",
    title: "Internet 300 Mb/s + TV XS",
    priceFrom: 30,
    description:
      "Masz już Netflixa i YouTube'a? Ta paczka jest przede wszystkim o łączu — podstawowy pakiet TV XS jest w niej zawsze i nie podnosi ceny. Płacisz 30 zł za internet, telewizję dostajesz przy okazji.",
    cta: "Sprawdź Internet 300 Mb/s + TV XS — od 30 zł/mies.",
    href: "/oferty/NajlepszaCena#pakiety",
  },
  {
    icon: Tv,
    image: "/images/offer-internet-tv.jpg",
    badge: "Większy pakiet kanałów",
    title: "Internet 300 Mb/s + TV M",
    priceFrom: 55,
    description:
      "To samo łącze, ale zamiast podstawowego XS dostajesz setki kanałów na żywo, dekoder 4K i Netia GO — jeden abonament na cały dom, bez dodatkowych umów.",
    cta: "Sprawdź Internet 300 Mb/s + TV M — od 55 zł/mies.",
    href: "/konfigurator/InternetOrazTelewizja",
  },
];

export default function AdditionalOffers() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <DottedBackground variant="dots-accent" size={22} />
      <div className="relative max-w-305 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* [NOWE] Plakietka — informacja o zawartości pakietu
                      widoczna przed opisem, nie dopiero w trzecim zdaniu. */}
                  <span className="mb-3 inline-flex w-fit items-center rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300">
                    {offer.badge}
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

                  <p className="mt-2.5 text-xs text-slate-400">
                    Cena widoczna od razu, bez zbędnych formalności.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* [NOWE] Przypis wspólny dla obu kart — domyka temat raz, zamiast
            powtarzać go w każdym opisie. Kluczowy dla zgodności z reklamą. */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Pakiet TV XS jest wliczony w cenę każdej oferty internetowej — nie płacisz za niego osobno
          i nie musisz z niego korzystać.
        </p>
      </div>
    </section>
  );
}