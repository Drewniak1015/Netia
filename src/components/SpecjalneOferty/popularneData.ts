import React from "react";
import {
  Router,
  Tv,
  ShieldCheck,
  Gauge,
  CreditCard,
  CalendarClock,
} from "lucide-react";

export type Offer = {
  id: string;
  eyebrow: string;
  speedBold: string;
  speedSuffix?: string;
  promoEyebrow?: string;
  promoHeadline?: string;
  promoNote?: string;
  badgeLabel: string;
  features: { icon: React.ReactNode; label: string; infoId?: string }[];
  price: string;
  priceUnit: string;
  priceNote: string;
  highlighted?: boolean;
};

export const offers: Offer[] = [
  {
    id: "net-300-tv-s",
    eyebrow: "Internet do",
    speedBold: "300 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "UMOWA",
    promoHeadline: "24 miesiące",
    promoNote: "*po rabatach",
    badgeLabel: "Umowa na 24 miesiące *po rabatach",
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router z Wi-Fi w cenie", infoId: "router-wifi" },
      { icon: React.createElement(ShieldCheck, { size: 14 }), label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "40",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-300-tv-s-4k",
    eyebrow: "Internet do",
    speedBold: "300 Mb/s",
    speedSuffix: "+ TV S 4K",
    promoEyebrow: "UMOWA",
    promoHeadline: "24 miesiące",
    promoNote: "*po rabatach",
    badgeLabel: "Umowa na 24 miesiące *po rabatach",
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router z Wi-Fi w cenie", infoId: "router-wifi" },
      { icon: React.createElement(Tv, { size: 14 }), label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: React.createElement(ShieldCheck, { size: 14 }), label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "45",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-1000",
    eyebrow: "Internet do",
    speedBold: "1000 Mb/s",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router Combo z ONT Wi-Fi 6", infoId: "router-wifi6" },
    ],
    price: "65",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-1000-tv-s",
    eyebrow: "Internet do",
    speedBold: "1000 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { icon: React.createElement(Tv, { size: 14 }), label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: React.createElement(ShieldCheck, { size: 14 }), label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "70",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-2000-tv-s",
    eyebrow: "Internet do",
    speedBold: "2000 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    highlighted: true,
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router Combo z ONT z Wi-Fi 7", infoId: "router-wifi7" },
      { icon: React.createElement(Tv, { size: 14 }), label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: React.createElement(ShieldCheck, { size: 14 }), label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "85",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-2000-tv-l",
    eyebrow: "Internet do",
    speedBold: "2000 Mb/s",
    speedSuffix: "+ TV L",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: React.createElement(Router, { size: 14 }), label: "Router Combo z ONT Wi-Fi 7", infoId: "router-wifi7" },
      { icon: React.createElement(Tv, { size: 14 }), label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: React.createElement(ShieldCheck, { size: 14 }), label: "Netia GO w cenie", infoId: "netia-go" },
      { icon: React.createElement(Gauge, { size: 14 }), label: "Giganagrywarka Basic", infoId: "giganagrywarka" },
    ],
    price: "125",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
];

export type FaqItem = { icon: React.ReactNode; q: string; a: string };

export const faqs: FaqItem[] = [
  {
    icon: React.createElement(Router, { size: 19, strokeWidth: 2 }),
    q: "Co dokładnie dostaję w wybranym pakiecie?",
    a: "Każdy pakiet zawiera internet światłowodowy Netii oparty o sieć Orange, telewizję z dekoderem oraz router w cenie abonamentu. Szczegółowa lista sprzętu i usług znajduje się przy każdej ofercie powyżej.",
  },
  {
    icon: React.createElement(CreditCard, { size: 19, strokeWidth: 2 }),
    q: "Ile naprawdę zapłacę przez pierwsze miesiące?",
    a: "W pakietach oznaczonych jako „Abonament 6 miesięcy za 0 zł” przez pierwsze 6 miesięcy nie płacisz nic — opłata w wysokości podanej przy ofercie nalicza się od kolejnego okresu rozliczeniowego, zgodnie z regulaminem promocji.",
  },
  {
    icon: React.createElement(CalendarClock, { size: 19, strokeWidth: 2 }),
    q: "Na jak długo zawierana jest umowa?",
    a: "W zależności od wybranej oferty umowa obowiązuje przez 24 pełne okresy rozliczeniowe. Dokładny czas trwania i warunki znajdziesz w regulaminie danej promocji.",
  },
  {
    icon: React.createElement(Gauge, { size: 19, strokeWidth: 2 }),
    q: "Czy prędkość internetu jest gwarantowana?",
    a: "Prędkości podane w ofertach to prędkości maksymalne dostępne w danej technologii i lokalizacji. Realna prędkość może zależeć od parametrów łącza dostępnych pod konkretnym adresem.",
  },
  {
    icon: React.createElement(Tv, { size: 19, strokeWidth: 2 }),
    q: "Czy mogę dokupić dodatkowe pakiety telewizyjne?",
    a: "Tak, do każdej oferty możesz dokupić pakiety premium, takie jak kanały sportowe czy filmowe, a także dodatkowy dekoder do kolejnego telewizora.",
  },
  {
    icon: React.createElement(ShieldCheck, { size: 19, strokeWidth: 2 }),
    q: "Jak szybko mogę zamówić wybraną ofertę?",
    a: "Wystarczy zadzwonić lub wysłać SMS z tego miejsca — nasz doradca oddzwoni w kilka minut i przeprowadzi Cię przez cały proces zamówienia.",
  },
];