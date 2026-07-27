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
  /** Informacja, że pakiet domyślnie zawiera bazowy pakiet TV (np. "Telewizja XS w pakiecie"). */
  tvDomyslny?: string;
  /**
   * Tiery Pakietów TV dostępne do wyboru/dokupienia przy tym pakiecie
   * internetowym. Jeśli brak (undefined), dostępne są wszystkie pakiety
   * z `OFERTY_TV`. Np. dla 600 Mb/s tylko "m" i "l" — "s" nie jest
   * pokazywane jako opcja, bo Telewizja XS jest już wliczona domyślnie
   * (patrz `tvDomyslny`).
   */
  dostepneTV?: Tier[];
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
  /**
   * Cena dodatku zależna od wybranego pakietu TV (tier "s" | "m" | "l").
   * Jeśli dla aktywnego tieru istnieje wpis, zastępuje on `cena` przy
   * wyświetlaniu w konfiguratorze (np. Giga Nagrywarka Maxi: 5 zł przy
   * Pakiecie S, 0 zł — czyli w cenie — przy Pakietach M i L).
   * Wartość 0 oznacza, że dodatek jest wliczony w pakiet TV i kafelek
   * powinien pokazać "Już w Twoim pakiecie" zamiast ceny (patrz
   * Konfigurator.tsx: cenaDodatku / jestWliczony).
   */
  cenaPerTier?: Partial<Record<Tier, number>>;
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