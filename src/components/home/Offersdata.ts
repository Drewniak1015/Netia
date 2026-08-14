/* ------------------------------------------------------------------ */
/*  Offersdata.ts — dane dla kart oferty (sekcja Oferty, 300/600 Mb/s)  */
/*                                                                      */
/*  FIX (ten commit): pakiet nazywa się teraz "TV XS" / "TV M" / "TV L"  */
/*  zamiast samego "XS" / "M" / "L" — w typie, w danych i na liście      */
/*  benefitów. Nigdzie w tym pliku nie zostało już gołe "XS".            */
/*                                                                      */
/*  Powód: karta 300 Mb/s + XS za 30 zł nie mówiła nigdzie, że zawiera   */
/*  telewizję — ani w tytule ("+ XS" nic nie znaczy dla kogoś z          */
/*  zewnątrz), ani na liście benefitów (były tam tylko router i Netia    */
/*  GO). Jednocześnie kreacja reklamowa obiecuje "300 Mb/s + TV za       */
/*  30 zł", a sekcja AdditionalOffers mówiła "Sam internet od 30 zł".    */
/*  Trzy różne komunikaty o tej samej paczce.                            */
/*                                                                      */
/*  Zmiana jest w SAMEJ WARTOŚCI `pkg`, nie w dodatkowym polu — dzięki   */
/*  temu Offercard.tsx nie wymaga żadnej zmiany: jeśli renderuje         */
/*  `{offer.speed} + {offer.pkg}`, od razu pokaże "300 Mb/s + TV XS".    */
/*                                                                      */
/*  UWAGA — BREAKING CHANGE. Union type zmienił się z                    */
/*    "XS" | "M" | "L"  ->  "TV XS" | "TV M" | "TV L"                    */
/*  Jeśli GDZIEKOLWIEK poza tym plikiem porównujesz pakiet po wartości   */
/*  (np. `offer.pkg === "L"`, filtrowanie, sortowanie, warunkowe         */
/*  renderowanie GigaNagrywarki), TypeScript to wyłapie przy buildzie —  */
/*  popraw te miejsca na "TV L". W tym pliku poprawione już jest.        */
/*  Podejrzane miejsca do sprawdzenia: Oferty.tsx, Offercard.tsx,        */
/*  Oferty1kdata.ts, Oferty1k.tsx.                                       */
/*                                                                      */
/*  Druga zmiana: telewizja jako PIERWSZA pozycja na liście benefitów    */
/*  w każdym wariancie ("Telewizja TV XS w cenie"). To ważniejsze niż    */
/*  tytuł — user skanuje checkboxy, a tam telewizji nie było w ogóle.    */
/*                                                                      */
/*  Trzecia: infoId "tv-xs" / "tv-m" / "tv-l" — dopisz je do             */
/*  INFO_ITEMS w Infomodal.tsx (przykładowe treści na końcu pliku).      */
/*                                                                      */
/*  Zachowane z poprzedniego commita: ujednolicone infoId z              */
/*  Oferty1kdata.ts ("dekoder-evobox", "giganagrywarka-maxi",            */
/*  "router-wifi6", "netia-go"), promoMonths, featured, PHONE_HREF bez   */
/*  "tel:", wariant 300 z priceAfter24/noFreeMonths.                     */
/* ------------------------------------------------------------------ */

export interface OfferBenefit {
  id: string;
  label: string;
  /** Id do InfoModal — patrz sekcja INFO_ITEMS na końcu pliku */
  infoId?: string;
}

/** [ZMIENIONE] Nazwa pakietu telewizyjnego. Wartości zawierają prefiks
 *  "TV", bo trafiają wprost do tytułu karty — samo "XS" nie komunikowało,
 *  że w abonamencie jest telewizja. */
export type PackageName = "TV XS" | "TV M" | "TV L";

export interface Offer {
  speed: string;
  /** Nazwa pakietu — używana ZARÓWNO w warunkach, JAK I do wyświetlania
   *  w tytule karty. Patrz komentarz o breaking change na górze pliku. */
  pkg: PackageName;
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

/* [NOWE] Benefit telewizyjny — pierwsza pozycja na liście w każdym
   wariancie. Bez tego pakiet TV XS wyglądał na ofertę bez telewizji.
   infoId budowany z nazwy pakietu: "TV XS" -> "tv-xs". */
function tvFeature(pkg: PackageName): OfferBenefit {
  return {
    id: "tv",
    label: `Telewizja ${pkg} w cenie`,
    infoId: pkg.toLowerCase().replace(" ", "-"),
  };
}

/* Benefity są identyczne dla obu prędkości poza etykietą samej prędkości —
   wspólna definicja, żeby nie duplikować "monitorowana prędkość 24/7" i
   "cena zapisana w umowie" cztery razy. Etykiety dopasowane do realnego
   brzmienia z Twojego screena. infoId ujednolicone z Oferty1kdata.ts. */
function buildFeatures(pkg: PackageName): OfferBenefit[] {
  const base: OfferBenefit[] = [
    tvFeature(pkg),
    { id: "router", label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
    { id: "dekoder", label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
    { id: "go", label: "Netia GO w cenie", infoId: "netia-go" },
  ];
  if (pkg === "TV L") {
    base.push({ id: "nagrywarka", label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" });
  }
  return base;
}

/* [NOWE] Osobna funkcja dla wariantu 300 Mb/s — zestaw cech jest węższy
   niż w buildFeatures() dla 600/1000 (brak "Dekoder 4K" w pakiecie TV XS,
   "Netia Player/Evobox 4K" zamiast "Dekoder 4K w cenie" w pakiecie TV M,
   brak sekcji "Monitorowana prędkość 24/7" / "Cena zapisana w umowie"
   na samym zrzucie — jeśli te dwie pozycje MAJĄ się pojawiać też tutaj
   dla spójności z resztą oferty, odkomentuj blok na końcu funkcji).

   [ZMIANA] Telewizja dodana jako pierwsza pozycja w OBU wariantach.
   W TV XS to najważniejsza zmiana w całym pliku: karta za 30 zł nie
   wspominała o telewizji ani słowem, więc czytało się to jako ofertę
   samego internetu — dokładnie odwrotnie niż mówi reklama.

   UWAGA: w TV XS nie ma pozycji o dekoderze. Jeśli pakiet TV XS wymaga
   dekodera, a ten NIE jest w cenie, dopisz to tutaj wprost (np. "Dekoder
   do TV XS — X zł/mies."), bo inaczej klient dowie się o dopłacie dopiero
   przez telefon, a to najgorszy moment na taką informację. Nie mam
   wglądu w Twój cennik sprzętowy. */
function buildFeatures300(pkg: "TV XS" | "TV M"): OfferBenefit[] {
  if (pkg === "TV XS") {
    return [
      tvFeature("TV XS"),
      { id: "router", label: "Router w cenie abonamentu", infoId: "router-wifi6" },
      { id: "go", label: "Aplikacja Netia GO w cenie", infoId: "netia-go" },
    ];
  }
  return [
    tvFeature("TV M"),
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
      pkg: "TV XS",
      price: 30,
      promoMonths: 0,
      priceAfter24: 60,
      noFreeMonths: true,
      accentColor: "#00d5be",
      features: buildFeatures300("TV XS"),
    },
    {
      speed: "300 Mb/s",
      pkg: "TV M",
      price: 40,
      promoMonths: 0,
      priceAfter24: 60,
      noFreeMonths: true,
      featured: true,
      accentColor: "#00d5be",
      badgeLabel: "NAJLEPSZY STOSUNEK CENY DO PAKIETU",
      features: buildFeatures300("TV M"),
    },
    /* TODO: brak trzeciej oferty (pkg "TV L") dla 300 Mb/s — na zrzucie są
       tylko 2 karty, a grid w Oferty.tsx jest 3-kolumnowy. Dodaj tu
       wariant TV L albo dostosuj grid warunkowo dla tej prędkości. */
  ],
  "600": [
    { speed: "600 Mb/s", pkg: "TV XS", price: 55, promoMonths: 3, features: buildFeatures("TV XS") },
    { speed: "600 Mb/s", pkg: "TV M", price: 70, promoMonths: 3, featured: true, accentColor: "#00be81", features: buildFeatures("TV M") },
    { speed: "600 Mb/s", pkg: "TV L", price: 100, promoMonths: 3, features: buildFeatures("TV L") },
  ],
  /* [USUNIĘTE] Wariant "1000" (1 Gb/s) — na żądanie. Jeśli trzeba go
     kiedyś przywrócić, poprzednia definicja to:
     { speed: "1 Gb/s", pkg: "TV XS", price: 70, promoMonths: 6, features: buildFeatures("TV XS") },
     { speed: "1 Gb/s", pkg: "TV M", price: 80, promoMonths: 6, featured: true, features: buildFeatures("TV M") },
     { speed: "1 Gb/s", pkg: "TV L", price: 110, promoMonths: 6, features: buildFeatures("TV L") },
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
/*  DO ZROBIENIA W INNYCH PLIKACH                                       */
/*                                                                      */
/*  1. Sprawdź porównania po wartości pakietu — TypeScript wyrzuci błąd  */
/*     wszędzie, gdzie stoi `pkg === "L"` zamiast `pkg === "TV L"`.      */
/*     Jeśli build przechodzi bez błędów, znaczy że nic poza tym plikiem */
/*     nie porównuje pakietu i jesteś czysty.                            */
/*                                                                      */
/*  2. Oferty1kdata.ts — ta sama zmiana dla 1/2 Gb/s, inaczej połowa    */
/*     strony mówi "TV XS", a połowa "XS".                              */
/*                                                                      */
/*  3. AdditionalOffers.tsx — kafel "Sam internet od 30 zł" jest         */
/*     sprzeczny z tą kartą (ta sama paczka, dwa różne opisy).           */
/*                                                                      */
/*  4. Kreacja reklamowa — "Internet 300 Mb/s + TV" powinno brzmieć      */
/*     "+ TV XS", żeby obietnica z reklamy i tytuł karty zgadzały się    */
/*     co do znaku.                                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  INFO_ITEMS — jeden wspólny słownik dla Oferty.tsx (300/600) I        */
/*  Oferty1k.tsx (1/2 Gb/s), bo obie sekcje importują ten sam            */
/*  Infomodal.tsx. Poniższe klucze muszą istnieć w INFO_ITEMS TAM, nie    */
/*  tutaj — ten plik ich nie definiuje, tylko z nich korzysta przez       */
/*  infoId.                                                              */
/*                                                                        */
/*  Wymagane klucze używane w TYM pliku (Offersdata.ts):                 */
/*    - "tv-xs", "tv-m", "tv-l"   [NOWE — dopisz, inaczej kliknięcie w    */
/*                                  pozycję "Telewizja TV XS w cenie"     */
/*                                  otworzy pusty modal]                  */
/*    - "router-wifi6"                                                   */
/*    - "dekoder-evobox"                                                 */
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
/*  Przykładowe treści (skopiuj do INFO_ITEMS w Infomodal.tsx):          */
/*                                                                        */
/*  "tv-xs": {                                                           */
/*    title: "Pakiet TV XS",                                             */
/*    body: "Podstawowy pakiet telewizyjny wliczony w cenę abonamentu —   */
/*           nie płacisz za niego osobno. [UZUPEŁNIJ: ile kanałów, czy    */
/*           dekoder jest w cenie, czy działa też w Netia GO.] Bez tych   */
/*           konkretów user nie wie, czym TV XS różni się od TV M, a to   */
/*           jest dokładnie ta różnica, za którą ma dopłacić 10 zł."      */
/*  },                                                                    */
/*  "tv-m": {                                                            */
/*    title: "Pakiet TV M",                                              */
/*    body: "[UZUPEŁNIJ: ile kanałów więcej niż TV XS i jakich — sport,   */
/*           filmy, dla dzieci.] Napisz to jako różnicę względem TV XS,   */
/*           nie jako osobną listę: człowiek porównuje dwie karty obok    */
/*           siebie i szuka jednego powodu, żeby wybrać droższą."         */
/*  },                                                                    */
/*  "tv-l": {                                                            */
/*    title: "Pakiet TV L",                                              */
/*    body: "[UZUPEŁNIJ: co dochodzi ponad TV M.] W wariantach TV L       */
/*           dochodzi też GigaNagrywarka Maxi — opisana osobno."          */
/*  },                                                                    */
/*  "dekoder-evobox": {                                                  */
/*    title: "Dekoder EvoBox 4K",                                        */
/*    body: "Aktualny model dekodera z obsługą 4K — bez powracających     */
/*           problemów z zawieszaniem się obrazu czy koniecznością        */
/*           restartowania urządzenia przez wyciąganie z prądu."          */
/*  },                                                                    */
/*  "giganagrywarka-maxi": {                                             */
/*    title: "GigaNagrywarka Maxi",                                      */
/*    body: "Dekoder z dużym dyskiem nagrywa programy TV automatycznie    */
/*           lub na żądanie — nagrywasz mecz czy serial i oglądasz,       */
/*           kiedy Ci pasuje, nawet gdy nikogo nie ma w domu w trakcie    */
/*           emisji."                                                     */
/*  },                                                                    */
/*  "monitoring-24-7": {                                                 */
/*    title: "Monitorowana prędkość 24/7",                               */
/*    body: "Nie musisz zgłaszać awarii, żeby ktoś się dowiedział, że     */
/*           coś nie działa. Monitorujemy Twoje łącze non-stop — jeśli    */
/*           prędkość spadnie poniżej gwarantowanego minimum, wiemy o     */
/*           tym najczęściej zanim Ty zadzwonisz."                        */
/*  },                                                                    */
/*  "cena-zapisana-w-umowie": {                                          */
/*    title: "Cena zapisana w umowie",                                   */
/*    body: "Kwota, którą widzisz teraz, to kwota, którą zapłacisz za     */
/*           12 i za 24 miesiąc. Żadnych klauzul waloryzacyjnych ani      */
/*           cichych podwyżek po okresie promocyjnym."                    */
/*  },                                                                    */
/* ------------------------------------------------------------------ */