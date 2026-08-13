/* ------------------------------------------------------------------ */
/*  Offersdata.ts — dane dla kart oferty (sekcja Oferty, 300/600 Mb/s)  */
/*                                                                      */
/*  FIX (ten commit): ujednolicono infoId z Oferty1kdata.ts, żeby obie   */
/*  sekcje (Oferty.tsx dla 300/600 i Oferty1k.tsx dla 1/2 Gb/s) trafiały */
/*  w te same klucze w jednym, współdzielonym INFO_ITEMS w              */
/*  Infomodal.tsx:                                                      */
/*                                                                      */
/*    - "dekoder-4k" -> "dekoder-evobox"                                */
/*      W Oferty1kdata.ts dekoder ma infoId "dekoder-evobox" — to        */
/*      najpewniej ten sam sprzęt (Netia EvoBox 4K, wspomniany też w     */
/*      researchu), więc klucz powinien być identyczny, inaczej          */
/*      Infomodal.tsx pokaże pusty/martwy popup dla połowy ofert w       */
/*      serwisie. JEŚLI to faktycznie DWA różne urządzenia (inny model    */
/*      dekodera dla 300/600 niż dla 1/2 Gb/s) — cofnij tę zmianę i       */
/*      zamiast tego dodaj OSOBNY wpis w INFO_ITEMS z innym kluczem i     */
/*      inną treścią. Nie mam wglądu w Twoją ofertę sprzętową, więc       */
/*      zakładam, że to ten sam dekoder — sprawdź to.                    */
/*                                                                      */
/*    - "giganagrywarka-maxi" — literówka z poprzedniej wersji           */
/*      ("gignagrywarka-maxi") już poprawiona i teraz zgadza się 1:1      */
/*      z Oferty1kdata.ts.                                               */
/*                                                                      */
/*    - "router-wifi6", "netia-go" — bez zmian, już zgodne z              */
/*      Oferty1kdata.ts.                                                 */
/*                                                                      */
/*  Reszta bez zmian względem poprzedniej wersji (promoMonths, featured, */
/*  PHONE_HREF bez "tel:", wariant 300 z priceAfter24/noFreeMonths).      */
/* ------------------------------------------------------------------ */

export interface OfferBenefit {
  id: string;
  label: string;
  /** Id do InfoModal — patrz sekcja INFO_ITEMS_TO_ADD niżej w komentarzu */
  infoId?: string;
}

export interface Offer {
  speed: string;
  pkg: "XS" | "M" | "L";
  price: number;
  /** Długość promo w miesiącach (3 dla 600 Mb/s, 6 dla 1 Gb/s) —
   *  Offercard.tsx liczy z tego label promo i "od X. miesiąca".
   *  DLA WARIANTU 300: ustaw 0 (brak darmowego okresu) i użyj
   *  `priceAfter24` + `noFreeMonths` zamiast tego mechanizmu. */
  promoMonths: number;
  /** [NOWE, opcjonalne] Cena obowiązująca PO 24. miesiącu, gdy oferta
   *  nie ma darmowego okresu, tylko podwyżkę po 2 latach (wariant 300).
   *  Dla 600/1000 zostaw undefined — tam cena po 24 mies. liczona jest
   *  inaczej (jeśli w ogóle) przez Offercard.tsx. */
  priceAfter24?: number;
  /** [NOWE, opcjonalne] true = ten wariant NIE ma darmowych miesięcy;
   *  Offercard.tsx powinien to sprawdzić przed wyrenderowaniem etykiety
   *  "X miesiące za 0 zł", żeby nie pokazać nieprawdziwej promocji. */
  noFreeMonths?: boolean;
  featured?: boolean;
  /** [NOWE] Kolor akcentu dla karty oznaczonej jako `featured` (obramowanie,
   *  badge, ewentualnie kolor przycisku CTA) — np. "#00d5be". WAŻNE: to
   *  pole samo w sobie NIC nie zrobi, dopóki Offercard.tsx go nie odczyta
   *  i nie użyje (np. style={{ borderColor: offer.accentColor }}). */
  accentColor?: string;
  /** [NOWE, opcjonalne] Badge nad kartą, np. "NAJLEPSZY STOSUNEK CENY
   *  DO PAKIETU". */
  badgeLabel?: string;
  features: OfferBenefit[];
}

export type SpeedTier = "300" | "600";

/* Numer telefonu. PHONE do wyświetlenia, PHONE_HREF do linków tel:/sms: —
   BEZ prefiksu "tel:", bo Offercard.tsx sam go doklada w obu miejscach. */
export const PHONE = "+48 887 843 260";
export const PHONE_HREF = "+48887843260";

/* Benefity są identyczne dla obu prędkości poza etykietą samej prędkości —
   wspólna definicja, żeby nie duplikować "monitorowana prędkość 24/7" i
   "cena zapisana w umowie" cztery razy. Etykiety dopasowane do realnego
   brzmienia z Twojego screena. infoId ujednolicone z Oferty1kdata.ts. */
function buildFeatures(pkg: "XS" | "M" | "L"): OfferBenefit[] {
  const base: OfferBenefit[] = [
    { id: "router", label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
    { id: "dekoder", label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
    { id: "go", label: "Netia GO w cenie", infoId: "netia-go" },
  ];
  if (pkg === "L") {
    base.push({ id: "nagrywarka", label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" });
  }
  return base;
}

/* [NOWE] Osobna funkcja dla wariantu 300 Mb/s — zestaw cech jest węższy
   niż w buildFeatures() dla 600/1000 (brak "Dekoder 4K" w pakiecie XS,
   "Netia Player/Evobox 4K" zamiast "Dekoder 4K w cenie" w pakiecie M,
   brak sekcji "Monitorowana prędkość 24/7" / "Cena zapisana w umowie"
   na samym zrzucie — jeśli te dwie pozycje MAJĄ się pojawiać też tutaj
   dla spójności z resztą oferty, odkomentuj blok na końcu funkcji). */
function buildFeatures300(pkg: "XS" | "M"): OfferBenefit[] {
  if (pkg === "XS") {
    return [
      { id: "router", label: "Router w cenie abonamentu", infoId: "router-wifi6" },
      { id: "go", label: "Aplikacja Netia GO w cenie", infoId: "netia-go" },
    ];
  }
  return [
    /* [FIX] "player-4k" -> "dekoder-evobox": to najpewniej ten sam
       Netia Player/EvoBox 4K, który w Oferty1kdata.ts ma infoId
       "dekoder-evobox" — ujednolicone, żeby jeden wpis w INFO_ITEMS
       obsługiwał wszystkie warianty tego dekodera w serwisie. Jeśli
       "Netia Player" i "EvoBox" to jednak dwa różne urządzenia,
       cofnij tę zmianę i zostaw osobny klucz "player-4k". */
    { id: "player", label: "Netia Player/Evobox 4K", infoId: "dekoder-evobox" },
    { id: "router", label: "Router w cenie abonamentu", infoId: "router-wifi6" },
    { id: "go", label: "Aplikacja Netia GO w cenie", infoId: "netia-go" },
  ];
  // Odkomentuj, jeśli chcesz spójność z 600/1000:
  // base.push(
  //   { id: "monitoring", label: "Monitorowana prędkość 24/7", infoId: "monitoring-24-7" },
  //   { id: "cena-lock", label: "Cena zapisana w umowie", infoId: "cena-zapisana-w-umowie" }
  // );
}

export const offersBySpeed: Record<SpeedTier, Offer[]> = {
  "300": [
    {
      speed: "300 Mb/s",
      pkg: "XS",
      price: 30,
      promoMonths: 0,
      priceAfter24: 60,
      noFreeMonths: true,
      accentColor: "#00d5be",
      features: buildFeatures300("XS"),
    },
    {
      speed: "300 Mb/s",
      pkg: "M",
      price: 40,
      promoMonths: 0,
      priceAfter24: 60,
      noFreeMonths: true,
      featured: true,
      accentColor: "#00d5be",
      badgeLabel: "NAJLEPSZY STOSUNEK CENY DO PAKIETU",
      features: buildFeatures300("M"),
    },
    /* TODO: brak trzeciej oferty (pkg "L") dla 300 Mb/s — na zrzucie są
       tylko 2 karty, a grid w Oferty.tsx jest 3-kolumnowy. Dodaj tu
       wariant L albo dostosuj grid warunkowo dla tej prędkości. */
  ],
  "600": [
    { speed: "600 Mb/s", pkg: "XS", price: 55, promoMonths: 3, features: buildFeatures("XS") },
    { speed: "600 Mb/s", pkg: "M", price: 70, promoMonths: 3, featured: true, accentColor: "#00be81", features: buildFeatures("M") },
    { speed: "600 Mb/s", pkg: "L", price: 100, promoMonths: 3, features: buildFeatures("L") },
  ],
  /* [USUNIĘTE] Wariant "1000" (1 Gb/s) — na żądanie. Jeśli trzeba go
     kiedyś przywrócić, poprzednia definicja to:
     { speed: "1 Gb/s", pkg: "XS", price: 70, promoMonths: 6, features: buildFeatures("XS") },
     { speed: "1 Gb/s", pkg: "M", price: 80, promoMonths: 6, featured: true, features: buildFeatures("M") },
     { speed: "1 Gb/s", pkg: "L", price: 110, promoMonths: 6, features: buildFeatures("L") },
     — dodaj z powrotem "1000" do SpeedTier i do TABS w Oferty.tsx.
     UWAGA: sekcja Oferty1k.tsx / Oferty1kdata.ts już obsługuje 1 Gb/s
     (i 2 Gb/s) osobno — sprawdź, czy przywracanie "1000" tutaj nie
     zdubluje tej samej prędkości w dwóch miejscach na stronie. */
};

/* Zachowane dla wstecznej kompatybilności, gdyby coś jeszcze importowało
   płaski "offers" bezpośrednio (np. metadane SEO, disclaimery) —
   domyślnie wskazuje na tańszą paczkę 600 Mb/s. Jeśli nic tego nie
   importuje poza Oferty.tsx, możesz to bezpiecznie usunąć. */
export const offers = offersBySpeed["600"];

/** Alias zachowany dla kompatybilności — komponent karty importuje ten typ
 *  jako "MaxOffer". Jeśli w przyszłości okaże się, że MaxOffer powinien mieć
 *  inny kształt niż Offer (np. dodatkowe pole), zamień na osobny interface
 *  zamiast aliasu. */
export type MaxOffer = Offer;

/* ------------------------------------------------------------------ */
/*  INFO_ITEMS — jeden wspólny słownik dla Oferty.tsx (300/600) I        */
/*  Oferty1k.tsx (1/2 Gb/s), bo obie sekcje importują ten sam            */
/*  Infomodal.tsx. Poniższe klucze muszą istnieć w INFO_ITEMS TAM, nie    */
/*  tutaj — ten plik ich nie definiuje, tylko z nich korzysta przez       */
/*  infoId.                                                              */
/*                                                                        */
/*  Wymagane klucze używane w TYM pliku (Offersdata.ts):                 */
/*    - "router-wifi6"                                                   */
/*    - "dekoder-evobox"   [ZMIENIONE z "dekoder-4k" / "player-4k" —      */
/*                           dopisz ten klucz w INFO_ITEMS, jeśli go       */
/*                           jeszcze nie ma; jeśli MASZ tam wciąż          */
/*                           "dekoder-4k", zmień nazwę klucza albo dodaj   */
/*                           alias, inaczej dekoder w kartach 600/300      */
/*                           znów będzie martwy]                          */
/*    - "netia-go"                                                       */
/*    - "giganagrywarka-maxi"                                            */
/*                                                                        */
/*  Dodatkowe klucze używane w Oferty1kdata.ts, ale NIE w tym pliku       */
/*  (dla porównania / spójności całego INFO_ITEMS):                      */
/*    - "router-wifi7" (tylko warianty 2 Gb/s)                           */
/*                                                                        */
/*  Opcjonalne (odkomentowane w buildFeatures300, jeśli chcesz spójność   */
/*  300 Mb/s z resztą oferty):                                           */
/*    - "monitoring-24-7"                                                */
/*    - "cena-zapisana-w-umowie"                                         */
/*                                                                        */
/*  Przykładowe treści (skopiuj do INFO_ITEMS w Infomodal.tsx, jeśli      */
/*  jeszcze ich nie masz):                                               */
/*                                                                        */
/*  "dekoder-evobox": {                                                  */
/*    title: "Dekoder EvoBox 4K",                                        */
/*    body: "Aktualny model dekodera z obsługą 4K — bez powracających     */
/*           problemów z zawieszaniem się obrazu czy koniecznością        */
/*           restartowania urządzenia przez wyciąganie z prądu."          */
/*  },                                                                    */
/*  "giganagrywarka-maxi": {                                             */
/*    title: "GigaNagrywarka Maxi",                                     */
/*    body: "Dekoder z dużym dyskiem nagrywa programy TV automatycznie   */
/*           lub na żądanie — nagrywasz mecz czy serial i oglądasz,      */
/*           kiedy Ci pasuje, nawet gdy nikogo nie ma w domu w trakcie   */
/*           emisji."                                                    */
/*  },                                                                    */
/*  "monitoring-24-7": {                                                 */
/*    title: "Monitorowana prędkość 24/7",                               */
/*    body: "Nie musisz zgłaszać awarii, żeby ktoś się dowiedział, że     */
/*           coś nie działa. Monitorujemy Twoje łącze non-stop — jeśli    */
/*           prędkość spadnie poniżej gwarantowanego minimum, wiemy o     */
/*           tym najczęściej zanim Ty zadzwonisz."                        */
/*  },                                                                    */
/*  "cena-zapisana-w-umowie": {                                          */
/*    title: "Cena zapisana w umowie",                                  */
/*    body: "Kwota, którą widzisz teraz, to kwota, którą zapłacisz za    */
/*           12 i za 24 miesiąc. Żadnych klauzul waloryzacyjnych ani     */
/*           cichych podwyżek po okresie promocyjnym."                   */
/*  },                                                                    */
/* ------------------------------------------------------------------ */