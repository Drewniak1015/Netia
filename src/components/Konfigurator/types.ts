import type { ElementType } from "react";
import type { Tier } from "@/lib/channels";

/* ---------------------------------------------------------------------- */
/*  Stan wyboru (kontekst)                                                 */
/* ---------------------------------------------------------------------- */
export type UmowaType = "24" | "bez";

export interface WybranaPozycja {
  id: string;
  nazwa: string;
  cena: number;
}

export interface KonfiguratorState {
  umowa: UmowaType;
  pakiet: WybranaPozycja | null;
  tv: WybranaPozycja | null;
  uslugi5g: WybranaPozycja | null;
  dodatki: WybranaPozycja[];
}

/* ---------------------------------------------------------------------- */
/*  Pakiety internetowe                                                    */
/* ---------------------------------------------------------------------- */
export interface Pakiet {
  id: string;
  nazwa: string;
  predkosc: string;
  upload: string;
  wyposazenie: string;
  routerId: string;
  cena: number;
  promoBadge?: string;
  wyrozniony?: boolean;
}

/* ---------------------------------------------------------------------- */
/*  Oferty dodatkowe (TV / 5G / Dodatki)                                   */
/* ---------------------------------------------------------------------- */
export interface Oferta {
  id: string;
  nazwa: string;
  opis: string;
  cena: number;
}

/** Pakiet TV — jak Oferta, ale z dodatkową liczbą kanałów (chip na karcie) */
export interface OfertaTV extends Oferta {
  /** Który tier z lib/channels.ts odpowiada temu pakietowi (do listy kanałów) */
  tier: Tier;
}

export interface OfertaDodatek extends Oferta {
  /** Klucz z lib/channels.ts (pole ADDONS[].key) — jeśli podany, kafelek
   *  pokaże dodatkowy przycisk "Zobacz kanały" otwierający listę kanałów. */
  addonKey?: string;
}

/* ---------------------------------------------------------------------- */
/*  Routery                                                                 */
/* ---------------------------------------------------------------------- */
export interface RouterSpec {
  label: string;
  value: string;
}

export interface RouterInfo {
  id: string;
  model: string;
  podtytul: string;
  zdjecie?: string;
  opis: string[];
  specyfikacja: RouterSpec[];
  wifi5Cechy: string[];
  predkosci: string;
  kosztInfo: string;
  instrukcjaUrl: string;
}

/* ---------------------------------------------------------------------- */
/*  Popupy "Szczegóły" (na razie dekoder)                                  */
/* ---------------------------------------------------------------------- */
export type SectionContent =
  | { type: "paragraphs"; items: string[] }
  | { type: "specTable"; items: { label: string; value: string }[] };

export interface InfoSection {
  title: string;
  icon: ElementType;
  content: SectionContent;
}

export interface InfoItem {
  id: string;
  model: string;
  podtytul?: string;
  zdjecie?: string;
  sections: InfoSection[];
  instrukcjaUrl?: string;
}
