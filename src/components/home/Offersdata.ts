/* ------------------------------------------------------------------ */
/*  Offersdata.ts — dane dla kart oferty (sekcja Oferty)                */
/*                                                                      */
/*  ZMIANA: etykiety features poprawione na dokładne brzmienie z         */
/*  Twojego realnego screena ("Router z Wi-Fi 6 w cenie", nie "Router    */
/*  Wi-Fi 6 w cenie" — brakowało "z"). Reszta bez zmian względem         */
/*  poprzedniej wersji (promoMonths, featured, PHONE_HREF bez "tel:").  */
/*                                                                      */
/*  FIX (build error TS2305): dodano alias `MaxOffer = Offer` na końcu   */
/*  pliku, bo inny plik importował `type MaxOffer`, którego tu nie      */
/*  było. Zero zmian w kształcie danych — tylko dodatkowa nazwa typu.    */
/*                                                                      */
/*  [NOWE] Dodano wariant "300" (300 Mb/s) — UWAGA: ten wariant ma       */
/*  INNY kształt promocji niż 600/1000. Tam promoMonths = liczba          */
/*  miesięcy ZA DARMO (0 zł), a cena docelowa jest stała od 4. do 24.     */
/*  miesiąca. Tu, wg zrzutu ekranu, nie ma darmowego okresu — cena        */
/*  obowiązuje od 1. miesiąca, a PO 24 miesiącach ROŚNIE do innej,        */
/*  wyższej kwoty (np. 30 zł -> 60 zł od 25. miesiąca). To wymaga         */
/*  osobnego pola `priceAfter24`, bo `promoMonths` (miesiące za darmo)    */
/*  nie ma tu zastosowania — ustawiam je na 0.                           */
/*                                                                      */
/*  WAŻNE: nie mam wglądu w Offercard.tsx, więc nie wiem na pewno, jak    */
/*  komponent renderuje label ceny. Jeśli Offercard.tsx liczy etykietę    */
/*  WYŁĄCZNIE z promoMonths (np. zawsze pokazuje "X miesiące za 0 zł"),   */
/*  to dla wariantu 300 trzeba będzie dodać w Offercard.tsx osobną        */
/*  gałąź renderowania dla `noFreeMonths === true`, bo inaczej pokaże     */
/*  się nieprawdziwy komunikat o darmowym okresie. Sprawdź to przed       */
/*  wdrożeniem.                                                          */
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
   *  i nie użyje (np. style={{ borderColor: offer.accentColor }}). Nie mam
   *  wglądu w Offercard.tsx, więc nie mogę zagwarantować, że kolor faktycznie
   *  się zmieni bez edycji tamtego pliku — sprawdź, czy karta featured ma
   *  tam obecnie zahardkodowany kolor (np. klasę Tailwind typu
   *  border-teal-400) i podmień go na odczyt z tego pola. */
  accentColor?: string;
  /** [NOWE, opcjonalne] Badge nad kartą, np. "NAJLEPSZY STOSUNEK CENY
   *  DO PAKIETU" (widoczny na zrzucie dla WYBIERZ 40). Jeśli Offercard.tsx
   *  już ma pole na to pod inną nazwą (np. `featured` renderuje własny
   *  stały tekst badge'a), zmień/scal z tamtym mechanizmem zamiast
   *  dodawać kolejne pole. */
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
   brzmienia z Twojego screena. */
function buildFeatures(pkg: "XS" | "M" | "L"): OfferBenefit[] {
  const base: OfferBenefit[] = [
    { id: "router", label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
    { id: "dekoder", label: "Dekoder 4K w cenie", infoId: "dekoder-4k" },
    { id: "go", label: "Netia GO w cenie", infoId: "netia-go" },
  ];
  if (pkg === "L") {
    base.push({ id: "nagrywarka", label: "GigaNagrywarka Maxi w cenie", infoId: "gignagrywarka-maxi" });
  }
  base.push(
    { id: "monitoring", label: "Monitorowana prędkość 24/7", infoId: "monitoring-24-7" },
    { id: "cena-lock", label: "Cena zapisana w umowie", infoId: "cena-zapisana-w-umowie" }
  );
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
    { id: "player", label: "Netia Player/Evobox 4K", infoId: "player-4k" },
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
     — dodaj z powrotem "1000" do SpeedTier i do TABS w Oferty.tsx. */
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
/*  INFO_ITEMS DO DODANIA w Infomodal.tsx (bez zmian względem           */
/*  poprzedniej wersji, treść nie zależy od paczki prędkości):          */
/*                                                                      */
/*  "monitoring-24-7": {                                                */
/*    title: "Monitorowana prędkość 24/7",                              */
/*    body: "Nie musisz zgłaszać awarii, żeby ktoś się dowiedział, że    */
/*           coś nie działa. Monitorujemy Twoje łącze non-stop — jeśli   */
/*           prędkość spadnie poniżej gwarantowanego minimum, wiemy o    */
/*           tym najczęściej zanim Ty zadzwonisz."                       */
/*  },                                                                   */
/*  "cena-zapisana-w-umowie": {                                          */
/*    title: "Cena zapisana w umowie",                                  */
/*    body: "Kwota, którą widzisz teraz, to kwota, którą zapłacisz za    */
/*           12 i za 24 miesiąc. Żadnych klauzul waloryzacyjnych ani     */
/*           cichych podwyżek po okresie promocyjnym."                   */
/*  },                                                                   */
/*  [NOWE] "router-wifi6" oraz "netia-go" (i "player-4k") są już          */
/*  używane w innych wariantach, więc powinny istnieć w INFO_ITEMS —      */
/*  nie trzeba dodawać nowych wpisów dla wariantu 300, jeśli infoId       */
/*  się pokrywają z tymi z 600/1000.                                     */
/* ------------------------------------------------------------------ */