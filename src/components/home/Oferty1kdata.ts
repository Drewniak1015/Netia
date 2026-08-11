/* ---------------------------------------------------------------------- */
/*  Dane dla samodzielnej sekcji ofert (poza Oferty.tsx).                 */
/*  Zgodne 1:1 ze screenami: Internet 1 Gb/s (różowy) i 2 Gb/s (żółty).   */
/* ---------------------------------------------------------------------- */

import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

export type Feature1k = {
  label: string;
  /** Klucz w INFO_ITEMS — jeśli podany, pozycja jest klikalna i otwiera popup */
  infoId?: string;
};

export type Offer1k = {
  speed: string;
  pkg: string;
  price: string;
  monthsPill: string;
  features: Feature1k[];
  featured?: boolean;
};

/* Internet 1 Gb/s + TV — akcent pink */
export const offers1gb: Offer1k[] = [
  {
    speed: "1 Gb/s",
    pkg: "TV S",
    price: "70 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1 Gb/s",
    pkg: "TV M",
    price: "80 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    featured: true,
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1 Gb/s",
    pkg: "TV L",
    price: "110 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" },
    ],
  },
];

/* Internet 2 Gb/s + TV — akcent orange */
export const offers2gb: Offer1k[] = [
  {
    speed: "2 Gb/s",
    pkg: "TV S",
    price: "85 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    features: [
      { label: "Router Combo z ONT i Wi-Fi 7 w cenie", infoId: "router-wifi7" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "2 Gb/s",
    pkg: "TV M",
    price: "95 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    featured: true,
    features: [
      { label: "Router Combo z ONT i Wi-Fi 7 w cenie", infoId: "router-wifi7" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "2 Gb/s",
    pkg: "TV L",
    price: "125 zł",
    monthsPill: "6 MIESIĘCY ZA 0 ZŁ!",
    features: [
      { label: "Router Combo z ONT i Wi-Fi 7 w cenie", infoId: "router-wifi7" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "GigaNagrywarka Maxi w cenie", infoId: "giganagrywarka-maxi" },
    ],
  },
];

export { PHONE, PHONE_HREF };