import type { Oferta5G } from "@/components/Konfigurator/Oferta5G";
import type { Oferta, OfertaTV, OfertaDodatek } from "./types";

/* ---------------------------------------------------------------------- */
/*  Telewizja                                                              */
/* ---------------------------------------------------------------------- */
export const OFERTY_TV: OfertaTV[] = [
  { id: "tv-s", nazwa: "Pakiet S", opis: "Coś na Start", cena: 5, tier: "s" },
  { id: "tv-m", nazwa: "Pakiet M", opis: "Najpopularniejszy", cena: 15, tier: "m" },
  { id: "tv-l", nazwa: "Pakiet L", opis: "Dla Wymagających", cena: 45, tier: "l" },
];

/* ---------------------------------------------------------------------- */
/*  Usługi mobilne 5G — umowa 24 mies.                                     */
/* ---------------------------------------------------------------------- */
export const OFERTY_5G: Oferta5G[] = [
  {
    id: "5g-super",
    nazwa: "SUPER (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 60 GB internetu mobilnego w Polsce.",
    cena: 30,
    gradient: "from-teal-500 to-teal-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "60 GB Internetu mobilnego w Polsce",
      "8,5 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 30 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
  {
    id: "5g-vip",
    nazwa: "VIP (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 100 GB internetu mobilnego w Polsce.",
    cena: 40,
    gradient: "from-pink-500 to-purple-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "100 GB Internetu mobilnego w Polsce",
      "11 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 40 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
  {
    id: "5g-giga",
    nazwa: "GIGA (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 200 GB internetu mobilnego w Polsce.",
    cena: 60,
    gradient: "from-lime-500 to-green-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "200 GB Internetu mobilnego w Polsce",
      "15 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 60 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
];

/* ---------------------------------------------------------------------- */
/*  Usługi dodatkowe — umowa 24 mies.                                      */
/*  TODO: nazwa tej sekcji nie została podana — zmień na docelową         */
/* ---------------------------------------------------------------------- */
export const OFERTY_DODATKOWE: OfertaDodatek[] = [
  { id: "multiroom", nazwa: "Multiroom", opis: "Oglądaj telewizję na dodatkowym telewizorze w innym pokoju.", cena: 10 },
  { id: "multiroom-4k", nazwa: "Multiroom 4K", opis: "Dodatkowy dekoder 4K w innym pomieszczeniu.", cena: 15 },
  { id: "giga-nagrywarka-maxi", nazwa: "Giga Nagrywarka Maxi", opis: "Więcej miejsca na nagrania programów w chmurze.", cena: 15 },
  { id: "bezpieczny-internet", nazwa: "Bezpieczny Internet", opis: "Ochrona urządzeń i bezpieczeństwo podczas korzystania z internetu.", cena: 10 },
  { id: "stale-ip", nazwa: "Stałe IP", opis: "Publiczny, niezmienny adres IP do zdalnego dostępu i serwerów.", cena: 10 },
  { id: "hbo", nazwa: "HBO + MAX", opis: "Kanały HBO oraz dostęp do platformy streamingowej Max.", cena: 25, addonKey: "hbo" },
  { id: "canal-plus-select", nazwa: "CANAL+ Select", opis: "Pakiet kanałów sportowych i filmowych Canal+ Select.", cena: 35, addonKey: "canal-plus-select" },
  { id: "canal-plus-prestige", nazwa: "CANAL+ Prestige", opis: "Najszerszy pakiet Canal+ — sport, filmy, seriale i dokumenty.", cena: 50, addonKey: "canal-plus-prestige" },
  { id: "eleven-sports", nazwa: "Eleven Sports", opis: "Kanały sportowe Eleven Sports, w tym transmisje w 4K.", cena: 10, addonKey: "eleven-sports" },
  { id: "filmbox", nazwa: "FilmBox", opis: "Pakiet kanałów filmowych FilmBox+.", cena: 10, addonKey: "filmbox" },
  { id: "cinemax", nazwa: "Cinemax", opis: "Kanały filmowe Cinemax HD i Cinemax 2 HD.", cena: 10, addonKey: "cinemax-hd" },
  { id: "polsat-sport-premium", nazwa: "Polsat Sport Premium", opis: "Pakiet kanałów sportowych Polsat Sport Premium.", cena: 20, addonKey: "polsat-sport-premium" },
  { id: "dorosli", nazwa: "Dla Dorosłych", opis: "Pakiet kanałów dla dorosłych, chroniony kodem PIN.", cena: 10, addonKey: "dorosli" },
  { id: "ukraina", nazwa: "Pakiet Ukraina", opis: "Kanały informacyjne, rozrywkowe i sportowe w języku ukraińskim.", cena: 10, addonKey: "ukraina" },
  { id: "dzieci", nazwa: "Dla Dzieci", opis: "Bajki, programy edukacyjne i kanały dla najmłodszych.", cena: 10, addonKey: "dzieci" },
];

/* ---------------------------------------------------------------------- */
/*  Wariant "bez zobowiązań" — 5G i dodatki (uproszczone)                  */
/*  TODO: osobne oferty 5G / Dodatki dla wariantu bez zobowiązań (jeśli   */
/*  mają się różnić bardziej niż tylko brakiem TV)                        */
/* ---------------------------------------------------------------------- */
export const OFERTY_5G_BEZ: Oferta[] = [
  {
    id: "5g-super",
    nazwa: "SUPER (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 60 GB internetu mobilnego w Polsce.",
    cena: 30,
  },
  {
    id: "5g-vip",
    nazwa: "VIP (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 100 GB internetu mobilnego w Polsce.",
    cena: 40,
  },
  {
    id: "5g-giga",
    nazwa: "GIGA (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 200 GB internetu mobilnego w Polsce.",
    cena: 60,
  },
];

export const OFERTY_DODATKOWE_BEZ: Oferta[] = [
  {
    id: "bezpieczny-internet",
    nazwa: "Bezpieczny Internet",
    opis: "Ochrona urządzeń i bezpieczeństwo podczas korzystania z internetu.",
    cena: 10,
  },
  {
    id: "stale-ip",
    nazwa: "Stałe IP",
    opis: "Publiczny, niezmienny adres IP do zdalnego dostępu i serwerów.",
    cena: 10,
  },
];
