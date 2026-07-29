/* ---------------------------------------------------------------------- */
/*  Dane ofert — Podstawa i MAX. Wydzielone z Oferty.tsx: to statyczne,   */
/*  proste obiekty, więc zostają w głównym bundlu (są tanie), w          */
/*  przeciwieństwie do dużego INFO_ITEMS z InfoModal/infoItems.ts.       */
/* ---------------------------------------------------------------------- */

export type Feature = {
  label: string;
  /** Klucz w INFO_ITEMS — jeśli podany, pozycja jest klikalna i otwiera popup */
  infoId?: string;
};

export type Offer = {
  speed: string;
  pkg: string;
  price: string;
  features: Feature[];
  featured?: boolean;
};

export const offers: Offer[] = [
  {
    speed: "1000 Mb/s",
    pkg: "TV S",
    price: "70 zł",
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1000 Mb/s",
    pkg: "TV M",
    price: "80 zł",
    featured: true,
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "Gigangrywarka Basic", infoId: "giganagrywarka" },
    ],
  },
  {
    speed: "2000 Mb/s",
    pkg: "TV L",
    price: "125 zł",
    features: [
      { label: "Router Combo z ONT Wi-Fi 7", infoId: "router-wifi7" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "Gigangrywarka Basic", infoId: "giganagrywarka" },
    ],
  },
];

export type MaxOffer = {
  name: string;
  speed: string;
  price: string;
  monthsPill: string;
  featured?: boolean;
  features: Feature[];
};

export const maxOffers: MaxOffer[] = [
  {
    name: "MAX 1000",
    speed: "1000 Mb/s",
    price: "140 zł/mies.",
    monthsPill: "Abonament 12 miesięcy za 0 zł po rabatach",
    features: [
      { label: "Telewizja L 4K z Dekoderem" },
      { label: "Bezpieczny Internet Ultra" },
    ],
  },
  {
    name: "MAX 2000",
    speed: "2000 Mb/s",
    price: "160 zł/mies.",
    monthsPill: "Abonament 12 miesięcy za 0 zł po rabatach",
    featured: true,
    features: [
      { label: "Telewizja L 4K z Dekoderem" },
      { label: "Bezpieczny Internet Ultra" },
    ],
  },
];

export const PHONE = "+48 887 843 260";
export const PHONE_HREF = PHONE.replace(/\s/g, "");