/* ------------------------------------------------------------------ */
/*  Offersdata.ts — dane dla kart oferty (sekcja Oferty)                */
/*                                                                      */
/*  ZMIANA (ten commit): koniec podziału na prędkości.                  */
/*                                                                      */
/*  BREAKING CHANGE — usunięte eksporty:                                */
/*    • `offersBySpeed` (Record<SpeedTier, Offer[]>)                    */
/*    • `SpeedTier`                                                      */
/*  Zamiast nich jest jedna płaska tablica `offers`. Wszystko, co       */
/*  importowało `offersBySpeed` albo `SpeedTier`, wywali się przy        */
/*  buildzie — to celowe, żeby nic po cichu nie zostało przy starym      */
/*  podziale. Znane miejsca: Oferty.tsx (przepisane razem z tym          */
/*  plikiem). Sprawdź też, czy nie importuje ich coś w metadanych SEO.   */
/*                                                                      */
/*  Uwaga: `offers` był wcześniej aliasem na paczkę 600 Mb/s. Teraz to   */
/*  pełna lista 7 ofert. Jeśli coś importowało `offers` licząc na 3      */
/*  karty 600 Mb/s (disclaimery, SEO), dostanie teraz wszystkie.         */
/*                                                                      */
/*  DUBLET DO ROZSTRZYGNIĘCIA — WAŻNE:                                   */
/*  Warianty 1 Gb/s i 2 Gb/s są tutaj z powrotem, ale Oferty1k.tsx /     */
/*  Oferty1kdata.ts nadal obsługują te same prędkości osobno. Na stronie */
/*  one-page obie sekcje wylądują pod sobą i klient zobaczy 1 Gb/s dwa   */
/*  razy, prawdopodobnie z różnymi cenami i różnymi warunkami. Wybierz   */
/*  jedno źródło: albo usuń sekcję Oferty1k ze strony, albo wytnij       */
/*  stąd cztery wpisy światłowodowe.                                     */
/*                                                                      */
/*  Wariant 600 Mb/s USUNIĘTY — nie ma go na liście cen. Poprzednia      */
/*  definicja, gdyby wracał:                                             */
/*    { speed: "600 Mb/s", pkg: "TV XS", price: 55, promoMonths: 3, ... }*/
/*    { speed: "600 Mb/s", pkg: "TV M", price: 70, promoMonths: 3, ... } */
/*    { speed: "600 Mb/s", pkg: "TV L", price: 100, promoMonths: 3, ... }*/
/*  UWAGA przy ewentualnym powrocie: 600 Mb/s + TV XS kosztowało 55 zł,  */
/*  czyli tyle samo co teraz 300 Mb/s + TV M. Dwie karty w tej samej     */
/*  cenie, jedna z dwukrotnie szybszym łączem — do wyjaśnienia przed     */
/*  przywróceniem.                                                       */
/*                                                                      */
/*  Zachowane: nazwy "TV XS"/"TV S"/"TV M"/"TV L" w `pkg`, telewizja     */
/*  jako pierwszy benefit, ujednolicone infoId, PHONE_HREF bez "tel:".   */
/* ------------------------------------------------------------------ */

export interface OfferBenefit {
  id: string;
  label: string;
  /** Id do InfoModal — patrz sekcja INFO_ITEMS na końcu pliku */
  infoId?: string;
}

/** Nazwa pakietu telewizyjnego. Wartości zawierają prefiks "TV", bo
 *  trafiają wprost do tytułu karty — samo "XS" nie komunikowało, że w
 *  abonamencie jest telewizja. */
export type PackageName = "TV XS" | "TV S" | "TV M" | "TV L";

export interface Offer {
  speed: string;
  /** Nazwa pakietu — używana ZARÓWNO w warunkach, JAK I do wyświetlania
   *  w tytule karty. */
  pkg: PackageName;
  price: number;
  /** Długość promo w miesiącach (6 dla 1 i 2 Gb/s) — Offercard.tsx liczy
   *  z tego label promo i "od X. miesiąca".
   *  DLA WARIANTU 300: ustaw 0 (brak darmowego okresu) i użyj
   *  `priceAfter24` + `noFreeMonths` zamiast tego mechanizmu. */
  promoMonths: number;
  /** Cena obowiązująca PO 24. miesiącu, gdy oferta nie ma darmowego
   *  okresu, tylko podwyżkę po 2 latach (wariant 300 Mb/s). */
  priceAfter24?: number;
  /** true = ten wariant NIE ma darmowych miesięcy; Offercard.tsx sprawdza
   *  to przed wyrenderowaniem etykiety "X miesięcy za 0 zł". */
  noFreeMonths?: boolean;
  featured?: boolean;
  /** Kolor akcentu karty (pasek, badge, checkmarki, CTA). */
  accentColor?: string;
  /** [NOWE, opcjonalne] Gradient akcentu — używany zamiast `accentColor` na
   *  pasku po lewej, na CTA i na badge'u. `accentColor` MUSI zostać ustawiony
   *  także wtedy, gdy jest gradient: idzie na checkmarki, hover benefitów i
   *  poświatę karty `featured`, gdzie gradient by się nie skleił. Podawaj
   *  gotowy string CSS, np.
   *  "linear-gradient(180deg, #FECC2B 0%, #E27300 100%)". */
  accentGradient?: string;
  /** Badge nad kartą, np. "NAJLEPSZY STOSUNEK CENY DO PAKIETU". */
  badgeLabel?: string;
  features: OfferBenefit[];
}

/* Numer telefonu. PHONE do wyświetlenia, PHONE_HREF do linków tel:/sms: —
   BEZ prefiksu "tel:", bo Offercard.tsx sam go dokłada w obu miejscach. */
export const PHONE = "+48 887 843 260";
export const PHONE_HREF = "+48887843260";

/* Kolory akcentu: turkus dla 300 Mb/s, zieleń dla światłowodu. Dzięki temu
   na jednej siatce widać na pierwszy rzut oka, gdzie kończy się jedna
   rodzina ofert, a zaczyna druga — bez żadnego nagłówka czy separatora. */
const ACCENT_300 = "#00d5be";
const ACCENT_FIBER = "#00be81";

/* [2 Gb/s] Bursztyn -> pomarańcz. Wartości skrajne spróbkowane z podanego
   wzorca: góra #FECC2B, dół #E27300. ACCENT_2GB to środek tego przejścia —
   patrz komentarz przy ofercie 2 Gb/s niżej. */
const GRADIENT_2GB = "linear-gradient(180deg, #FECC2B 0%, #E27300 100%)";
const ACCENT_2GB = "#F5A017";

/* Benefit telewizyjny — pierwsza pozycja na liście w każdym wariancie.
   infoId budowany z nazwy pakietu: "TV XS" -> "tv-xs", "TV S" -> "tv-s". */
function tvFeature(pkg: PackageName): OfferBenefit {
  return {
    id: "tv",
    label: `Telewizja ${pkg} w cenie`,
    infoId: pkg.toLowerCase().replace(" ", "-"),
  };
}

/* Benefity dla wariantów światłowodowych (1 i 2 Gb/s). `routerInfoId`
   rozdziela Wi-Fi 6 od Wi-Fi 7 — zgodnie z Oferty1kdata.ts routery Wi-Fi 7
   idą tylko z 2 Gb/s. */
function buildFeatures(
  pkg: PackageName,
  routerInfoId: "router-wifi6" | "router-wifi7" = "router-wifi6"
): OfferBenefit[] {
  const base: OfferBenefit[] = [
    tvFeature(pkg),
    {
      id: "router",
      label: routerInfoId === "router-wifi7" ? "Router z Wi-Fi 7 w cenie" : "Router z Wi-Fi 6 w cenie",
      infoId: routerInfoId,
    },
    { id: "dekoder", label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
    { id: "go", label: "Netia GO w cenie", infoId: "netia-go" },
  ];
  if (pkg === "TV L") {
    base.push({ id: "nagrywarka", label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" });
  }
  return base;
}

/* Wariant 300 Mb/s — węższy zestaw cech niż światłowód.

   [NOWE] Gałąź "TV M" dla trzeciej karty (55 zł). Zestaw benefitów
   skopiowałem z TV S i dołożyłem GigaNagrywarkę — to ZGADYWANIE, bo nie
   mam cennika dla tego wariantu. SPRAWDŹ przed wdrożeniem:
     • czy TV M na 300 Mb/s ma dekoder w cenie (zakładam, że tak),
     • czy dochodzi GigaNagrywarka Maxi — jeśli nie, usuń tę pozycję,
       bo obiecuje sprzęt, za który klient dostanie fakturę.
   Karta za 55 zł musi pokazywać KONKRETNY powód dopłaty 15 zł względem
   TV S, inaczej trzy karty 300 Mb/s różnią się tylko literką. */
function buildFeatures300(pkg: "TV XS" | "TV S" | "TV M"): OfferBenefit[] {
  if (pkg === "TV XS") {
    return [
      tvFeature("TV XS"),
      { id: "router", label: "Router w cenie abonamentu", infoId: "router-wifi6" },
      { id: "go", label: "Aplikacja Netia GO w cenie", infoId: "netia-go" },
    ];
  }

  const base: OfferBenefit[] = [
    tvFeature(pkg),
    { id: "player", label: "Netia Player/Evobox 4K", infoId: "dekoder-evobox" },
    { id: "router", label: "Router w cenie abonamentu", infoId: "router-wifi6" },
    { id: "go", label: "Aplikacja Netia GO w cenie", infoId: "netia-go" },
  ];

  if (pkg === "TV M") {
    // TODO: potwierdź w cenniku. Jeśli GigaNagrywarka NIE wchodzi w ten
    // wariant, usuń tę linię i wpisz faktyczną różnicę względem TV S.
    base.push({ id: "nagrywarka", label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" });
  }

  return base;
}

/* ------------------------------------------------------------------ */
/*  Jedna płaska lista — kolejność = kolejność na siatce.               */
/*  Od najtańszej do najdroższej, żeby wzrok szedł w jedną stronę:      */
/*  30 -> 40 -> 55 -> 70 -> 80 -> 110, z 2 Gb/s za 85 zł na końcu jako  */
/*  osobna kategoria (najszybsze łącze, podstawowa telewizja).          */
/* ------------------------------------------------------------------ */
export const offers: Offer[] = [
  {
    speed: "300 Mb/s",
    pkg: "TV XS",
    price: 30,
    promoMonths: 0,
    priceAfter24: 60,
    noFreeMonths: true,
    accentColor: ACCENT_300,
    features: buildFeatures300("TV XS"),
  },
  {
    speed: "300 Mb/s",
    pkg: "TV S",
    price: 40,
    promoMonths: 0,
    priceAfter24: 60,
    noFreeMonths: true,
    featured: true,
    accentColor: ACCENT_300,
    badgeLabel: "NAJLEPSZY STOSUNEK CENY DO PAKIETU",
    features: buildFeatures300("TV S"),
  },
  {
    /* [NOWE] Trzecia karta 300 Mb/s — domyka TODO z poprzedniej wersji
       pliku i zgadza się z kafelkiem "300 Mb/s + TV M od 55 zł" w
       AdditionalOffers.tsx, więc ta sprzeczność znika sama.

       TODO: `priceAfter24`. Dla XS i S jest 60 zł, ale przy abonamencie
       55 zł podwyżka o 5 zł wygląda na pomyłkę, a nie na dane z cennika.
       Bez tego pola karta pokaże "Cena obowiązuje przez 24 miesiące"
       zamiast konkretnej kwoty od 25. miesiąca — czyli mniej informacji
       niż dwie sąsiednie karty. Uzupełnij realną wartość z regulaminu. */
    speed: "300 Mb/s",
    pkg: "TV M",
    price: 55,
    promoMonths: 0,
    noFreeMonths: true,
    accentColor: ACCENT_300,
    features: buildFeatures300("TV M"),
  },
  {
    /* [FEATURED] Wyróżniona karta w rzędzie światłowodowym. Badge świadomie
       inny niż przy 300 Mb/s + TV S: tamten mówi o relacji ceny do pakietu,
       ten o popularności. Dwa razy ten sam tekst na jednym ekranie znaczy
       tyle co żaden.

       UWAGA: `badgeLabel` jest renderowany z `uppercase`, więc zapis małymi
       literami i tak wyjdzie wersalikami — wpisany kapitalikami dla
       spójności z drugim wpisem w tym pliku. */
    speed: "1 Gb/s",
    pkg: "TV XS",
    price: 70,
    promoMonths: 6,
    featured: true,
    accentColor: ACCENT_FIBER,
    badgeLabel: "NAJCZĘŚCIEJ WYBIERANY",
    features: buildFeatures("TV XS"),
  },
  {
    speed: "1 Gb/s",
    pkg: "TV M",
    price: 80,
    promoMonths: 6,
    accentColor: ACCENT_FIBER,
    features: buildFeatures("TV M"),
  },
  {
    speed: "1 Gb/s",
    pkg: "TV L",
    price: 110,
    promoMonths: 6,
    accentColor: ACCENT_FIBER,
    features: buildFeatures("TV L"),
  },
  {
    /* 2 Gb/s + TV XS za 85 zł. Router Wi-Fi 7 zgodnie z Oferty1kdata.ts —
       jeśli w tym wariancie idzie zwykły Wi-Fi 6, zmień drugi argument.

       [KOLOR] Jedyna karta poza turkusem i zielenią: bursztyn przechodzący
       w pomarańcz. Uzasadnienie nie jest wyłącznie estetyczne — to jedyna
       oferta 2 Gb/s w całym cenniku i jedyny element ostatniego rzędu, więc
       kolor robi to samo co jej pozycja: mówi, że to osobna kategoria, a nie
       kolejny wariant światłowodu.

       ACCENT_2GB (solid) jest środkiem tego gradientu i idzie na elementy,
       na których gradient by się nie skleił: checkmarki 20×20 px, hover
       benefitów, poświata karty. Zmieniając gradient, przelicz też ten
       kolor, inaczej checkmarki odjadą od paska. */
    speed: "2 Gb/s",
    pkg: "TV XS",
    price: 85,
    promoMonths: 6,
    accentColor: ACCENT_2GB,
    accentGradient: GRADIENT_2GB,
    features: buildFeatures("TV XS", "router-wifi7"),
  },
];

/** Alias zachowany dla kompatybilności — komponent karty importuje ten typ
 *  jako "MaxOffer". */
export type MaxOffer = Offer;

/* ------------------------------------------------------------------ */
/*  DO ZROBIENIA W INNYCH PLIKACH                                       */
/*                                                                      */
/*  1. Oferty1k.tsx / Oferty1kdata.ts — patrz "DUBLET" na górze pliku.  */
/*     Na one-page 1 Gb/s nie może być w dwóch sekcjach naraz.          */
/*                                                                      */
/*  2. AdditionalOffers.tsx — kafel "300 Mb/s + TV M od 55 zł" jest     */
/*     teraz zgodny z danymi. Jeśli sekcja i tak dubluje karty z tej    */
/*     siatki, rozważ jej usunięcie przy przejściu na one-page.         */
/*                                                                      */
/*  3. Kreacje Google Ads — nagłówek "300 Mb/s + TV za 40 zł" powinien  */
/*     brzmieć "+ TV S"; warianty mówiące "+ TV M za 40 zł" wycofać.    */
/*                                                                      */
/*  4. Infomodal.tsx — INFO_ITEMS potrzebuje klucza "tv-s" oraz         */
/*     "router-wifi7" (używanego tu przy 2 Gb/s).                       */
/*                                                                      */
/*  Wymagane klucze INFO_ITEMS używane w tym pliku:                     */
/*    "tv-xs", "tv-s", "tv-m", "tv-l", "router-wifi6", "router-wifi7",  */
/*    "dekoder-evobox", "netia-go", "giganagrywarka-maxi"               */
/* ------------------------------------------------------------------ */