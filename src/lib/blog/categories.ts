// lib/blog/categories.ts
import {
  ShieldCheck,
  Wifi,
  Newspaper,
  PlayCircle,
  Smartphone,
  Tv,
  type LucideIcon,
} from "lucide-react";

export type CategorySlug =
  | "bezpieczenstwo"
  | "internet"
  | "ogolne"
  | "serwisy-streamingowe"
  | "telefony"
  | "telewizja";

export interface Category {
  slug: CategorySlug;
  label: string;
  /** Ścieżka kategorii na Twojej stronie — dostosuj, jeśli Twój routing
   *  wygląda inaczej niż zakładane tu /blog/kategoria/[slug]. */
  href: string;
  icon: LucideIcon;
}

export const CATEGORIES: Record<CategorySlug, Category> = {
  bezpieczenstwo: {
    slug: "bezpieczenstwo",
    label: "Bezpieczeństwo",
    href: "/blog/kategoria/bezpieczenstwo",
    icon: ShieldCheck,
  },
  internet: {
    slug: "internet",
    label: "Internet",
    href: "/blog/kategoria/internet",
    icon: Wifi,
  },
  ogolne: {
    slug: "ogolne",
    label: "Ogólne",
    href: "/blog/kategoria/ogolne",
    icon: Newspaper,
  },
  "serwisy-streamingowe": {
    slug: "serwisy-streamingowe",
    label: "Serwisy streamingowe",
    href: "/blog/kategoria/serwisy-streamingowe",
    icon: PlayCircle,
  },
  telefony: {
    slug: "telefony",
    label: "Telefony",
    href: "/blog/kategoria/telefony",
    icon: Smartphone,
  },
  telewizja: {
    slug: "telewizja",
    label: "Telewizja",
    href: "/blog/kategoria/telewizja",
    icon: Tv,
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

export function isValidCategory(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, value);
}