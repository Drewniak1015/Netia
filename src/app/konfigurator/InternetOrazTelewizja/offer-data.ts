// src/app/konfigurator/InternetOrazTelewizja/offer-data.ts
//
// Czyste dane (typy + stałe), BEZ dyrektywy "use client". Wydzielone z
// Offerquizsection.tsx specjalnie po to, żeby OfferQuizSchema.tsx (używany
// w serwerowym page.tsx) mógł je zaimportować jako zwykłe tablice/obiekty,
// a nie jako nieprzezroczyste referencje komponentu klienckiego.
//
// Offerquizsection.tsx importuje stąd OFFER_SECTIONS i QUIZ_FAQ_ITEMS
// zamiast definiować je lokalnie.

import {
  Banknote,
  Clock,
  Crown,
  FileX,
  Rocket,
  ShieldCheck,
  Star,
  Undo2,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ======================================================================
   TYPY
   ====================================================================== */

export type SectionKey = "internet300" | "internet600" | "internet1000" | "internet2000";
export type AccentKey = "teal" | "emerald" | "pink" | "amber";
export type TvSize = "XS" | "S" | "M" | "L";

export interface OfferFeature {
  label: string;
  infoId?: string; // klucz do INFO_ITEMS w Offerquizsection.tsx — jeśli obecny, cecha jest klikalna
}

export interface OfferCardData {
  name: string;
  price: string;
  pricePrefix?: string;
  priceNote: string;
  features: OfferFeature[];
  badge?: string;
  tvSize: TvSize;
  promoMonths: number;
}

export interface OfferSectionData {
  key: SectionKey;
  title: string;
  icon: LucideIcon;
  accent: AccentKey;
  offers: OfferCardData[];
}

export interface QuizFaqItem {
  icon: LucideIcon;
  q: string;
  a: string;
}

/* ======================================================================
   CECHY WSPÓŁDZIELONE PRZEZ OFERTY
   ====================================================================== */

const FEATURE_ROUTER_BASIC: OfferFeature = { label: "Router Wi-Fi w cenie", infoId: "router-wifi" };
const FEATURE_ROUTER_WIFI6: OfferFeature = { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" };
const FEATURE_ROUTER_WIFI7: OfferFeature = {
  label: "Router Combo z ONT i Wi-Fi 7 w cenie",
  infoId: "router-wifi7",
};
const FEATURE_DEKODER_4K: OfferFeature = { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" };
const FEATURE_DEKODER_BASIC: OfferFeature = { label: "Dekoder w cenie" };
const FEATURE_NETIA_GO: OfferFeature = { label: "Netia GO w cenie", infoId: "netia-go" };
const FEATURE_GIGANAGRYWARKA: OfferFeature = {
  label: "GigaNagrywarka Maxi w cenie",
  infoId: "giganagrywarka",
};

/* ======================================================================
   OFERTY — sekcje pogrupowane wg prędkości internetu
   ====================================================================== */

export const OFFER_SECTIONS: OfferSectionData[] = [
  {
    key: "internet300",
    title: "Internet 300 Mb/s + TV",
    icon: Star,
    accent: "teal",
    offers: [
      {
        name: "Internet 300 Mb/s + TV S",
        price: "40",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 0,
      },
      {
        name: "Internet 300 Mb/s + TV M",
        price: "55",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 0,
      },
    ],
  },
  {
    key: "internet600",
    title: "Internet 600 Mb/s + TV",
    icon: Wifi,
    accent: "emerald",
    offers: [
      {
        name: "Internet 600 Mb/s + TV XS",
        price: "55",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_BASIC, FEATURE_NETIA_GO],
        tvSize: "XS",
        promoMonths: 3,
      },
      {
        name: "Internet 600 Mb/s + TV M",
        price: "70",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 3,
      },
      {
        name: "Internet 600 Mb/s + TV L",
        price: "100",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 3,
      },
    ],
  },
  {
    key: "internet1000",
    title: "Internet 1 Gb/s + TV",
    icon: Crown,
    accent: "pink",
    offers: [
      {
        name: "Internet 1 Gb/s + TV S",
        price: "70",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 6,
      },
      {
        name: "Internet 1 Gb/s + TV M",
        price: "80",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 6,
      },
      {
        name: "Internet 1 Gb/s + TV L",
        price: "110",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 6,
      },
    ],
  },
  {
    key: "internet2000",
    title: "Internet 2 Gb/s + TV",
    icon: Rocket,
    accent: "amber",
    offers: [
      {
        name: "Internet 2 Gb/s + TV S",
        price: "85",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 6,
      },
      {
        name: "Internet 2 Gb/s + TV M",
        price: "95",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 6,
      },
      {
        name: "Internet 2 Gb/s + TV L",
        price: "125",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 6,
      },
    ],
  },
];

/* ======================================================================
   FAQ — 6 najważniejszych pytań/obiekcji
   ====================================================================== */

export const QUIZ_FAQ_ITEMS: QuizFaqItem[] = [
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
  },
  {
    icon: Undo2,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy — termin ustalasz indywidualnie z technikiem. Sama instalacja w lokalu trwa około 1,5 godziny. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł. Router, Dekoder 4K i aplikacja Netia GO są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
];