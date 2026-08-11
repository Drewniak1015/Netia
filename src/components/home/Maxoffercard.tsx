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
   *  Offercard.tsx liczy z tego label promo i "od X. miesiąca". */
  promoMonths: number;
  featured?: boolean;
  features: OfferBenefit[];
  /** FIX (TS2339): komponent karty czyta "offer.name" jako wyświetlaną
   *  nazwę pakietu. Wyliczane niżej jako `Internet do ${speed} + ${pkg}`,
   *  zgodnie z brzmieniem na screenie. Jeśli komponent oczekuje innego
   *  formatu (np. bez "Internet do"), podmień string w `buildOffer` niżej. */
  name: string;
}

export type SpeedTier = "600" | "1000";

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

/** Buduje pojedynczą ofertę wraz z wyliczonym `name`, żeby nie powtarzać
 *  tego stringa ręcznie przy każdym wpisie w offersBySpeed. */
function buildOffer(params: {
  speed: string;
  pkg: "XS" | "M" | "L";
  price: number;
  promoMonths: number;
  featured?: boolean;
}): Offer {
  const { speed, pkg, price, promoMonths, featured } = params;
  return {
    speed,
    pkg,
    price,
    promoMonths,
    featured,
    features: buildFeatures(pkg),
    name: `Internet do ${speed} + ${pkg}`,
  };
}

export const offersBySpeed: Record<SpeedTier, Offer[]> = {
  "600": [
    buildOffer({ speed: "600 Mb/s", pkg: "XS", price: 55, promoMonths: 3 }),
    buildOffer({ speed: "600 Mb/s", pkg: "M", price: 70, promoMonths: 3, featured: true }),
    buildOffer({ speed: "600 Mb/s", pkg: "L", price: 100, promoMonths: 3 }),
  ],
  "1000": [
    buildOffer({ speed: "1 Gb/s", pkg: "XS", price: 70, promoMonths: 6 }),
    buildOffer({ speed: "1 Gb/s", pkg: "M", price: 80, promoMonths: 6, featured: true }),
    buildOffer({ speed: "1 Gb/s", pkg: "L", price: 110, promoMonths: 6 }),
  ],
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
/*           cichych podwyżek po okresie promocyjnym."                   */
/*  },                                                                   */
/* ------------------------------------------------------------------ */