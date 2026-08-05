// internet-tv-data.ts
//
// Czyste dane (typy + stałe), BEZ dyrektywy "use client". Wydzielone z
// OfferInternetTvSection.tsx z tego samego powodu co przy OfferQuizSection:
// import PLANS/FAQ_ITEMS z pliku "use client" do serwerowego page.tsx (przez
// komponent schema) powoduje, że tablice przestają być zwykłymi tablicami
// (Next.js traktuje eksporty klienckiego modułu jako nieprzezroczystą
// referencję), stąd błędy typu ".map is not a function".
//
// UMIEŚĆ TEN PLIK W TYM SAMYM FOLDERZE co OfferInternetTvSection.tsx.

import {
  FileCheck,
  Gauge,
  Headset,
  type LucideIcon,
  Infinity as InfinityIcon,
  Lock,
  MapPin,
  Truck,
  Wifi,
  Zap,
} from "lucide-react";

/* ======================================================================
   TYPY
   ====================================================================== */

export type AccentKey = "teal" | "emerald" | "pink" | "amber";

export interface OfferFeature {
  label: string;
  /** Jeśli obecne, cecha jest klikalna i otwiera popup ze szczegółami z INFO_ITEMS. */
  infoId?: string;
}

export interface Plan {
  speed: string;
  price: string;
  tag: string;
  /** Liczba darmowych miesięcy promocji — jeśli brak, karta pokazuje zwykłą plakietkę `tag`. */
  promoMonths?: number;
  featured?: boolean;
  icon: LucideIcon;
  /** Klucz do INFO_ITEMS — klikalna prędkość otwiera modal z gwarancją i technologią. */
  speedInfoId: string;
  /** Cechy karty — te z `infoId` są klikalne. */
  features: OfferFeature[];
  /** Kolor akcentu karty (pasek, liczba, checklista) — różny dla każdej prędkości. */
  accent: AccentKey;
}

export interface FaqItem {
  icon: LucideIcon;
  question: string;
  answer: string;
}

/* ======================================================================
   PLANY
   ====================================================================== */

export const plans: Plan[] = [
  {
    speed: "300 Mb/s",
    price: "30",
    tag: "Na start",
    icon: Wifi,
    speedInfoId: "predkosc-300",
    accent: "teal",
    features: [
      { label: "Internet do 300 Mb/s" },
      { label: "Router Wi-Fi w cenie", infoId: "router-wifi" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "600 Mb/s",
    price: "55",
    tag: "Wybór rodziny",
    promoMonths: 3,
    icon: Gauge,
    speedInfoId: "predkosc-600",
    accent: "emerald",
    features: [
      { label: "Internet do 600 Mb/s" },
      { label: "Router Wi-Fi w cenie", infoId: "router-wifi" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1000 Mb/s",
    price: "65",
    tag: "Moc dla wymagających",
    promoMonths: 6,
    icon: Zap,
    speedInfoId: "predkosc-1000",
    accent: "pink",
    features: [
      { label: "Internet do 1000 Mb/s" },
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "2000 Mb/s",
    price: "80",
    tag: "Najczęściej wybierany",
    promoMonths: 6,
    featured: true,
    icon: InfinityIcon,
    speedInfoId: "predkosc-2000",
    accent: "amber",
    features: [
      { label: "Internet do 2000 Mb/s" },
      { label: "Router Combo z ONT Wi-Fi 7 w cenie", infoId: "router-wifi7" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
];

/* ======================================================================
   FAQ — 6 najczęstszych obiekcji klientów
   ====================================================================== */

export const faqItems: FaqItem[] = [
  {
    icon: FileCheck,
    question: "Czy muszę podpisywać kolejną długą umowę?",
    answer:
      "Umowa jest na czas określony 24 miesięcy, z warunkami jasnymi od pierwszego dnia — bez ukrytych zapisów w regulaminie.",
  },
  {
    icon: Lock,
    question: "Czy po jakimś czasie pojawią się ukryte opłaty?",
    answer:
      "Nie. Cenę obowiązującą po zakończeniu promocji znasz już w momencie podpisania umowy — żadnych niespodzianek na fakturze.",
  },
  {
    icon: Gauge,
    question: "Co jeśli internet będzie wolniejszy niż obiecane?",
    answer:
      "Prędkość jest zgodna z umową. Jeśli coś działa nie tak jak powinno, nasz serwis reaguje szybko — nie zostajesz z tym sam.",
  },
  {
    icon: Truck,
    question: "Czy przejście do Netii będzie skomplikowane?",
    answer:
      "Nie musisz martwić się formalnościami — pomagamy w całym procesie przeniesienia numeru i usług, krok po kroku.",
  },
  {
    icon: MapPin,
    question: "Czy w moim miejscu w ogóle jest zasięg?",
    answer:
      "Sprawdzimy dostępność usługi pod Twoim adresem jeszcze przed podpisaniem umowy — zero ryzyka z Twojej strony.",
  },
  {
    icon: Headset,
    question: "A jeśli coś się zepsuje — jak szybko dostanę pomoc?",
    answer:
      "Wsparcie techniczne działa 24/7, każdego dnia — również wieczorami i w weekendy.",
  },
];