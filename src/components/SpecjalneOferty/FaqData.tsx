// BEZ "use client" — to zwykły plik z danymi, używany zarówno przez
// komponent kliencki (Faq.tsx) jak i przez Server Component (page.tsx).

import {
  Package,
  Wallet,
  TrendingUp,
  FileCheck,
  FileText,
  Tv,
  XCircle,
  Gauge,
} from "lucide-react";
import type { ElementType } from "react";

export type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    icon: Package,
    q: "Co dokładnie dostaję w pakiecie Max 1000 i Max 2000?",
    a: "Max 1000: Internet do 1000 Mb/s + Telewizja L 4K z Dekoderem + Bezpieczny Internet Ultra (ochrona 5 urządzeń + CyberEkspert). Max 2000: to samo, ale z Internetem do 2000 Mb/s (technologia PON). W obu opcjonalnie SoundBox 4K za +30 zł/mies.",
  },
  {
    icon: Wallet,
    q: "Ile naprawdę zapłacę przez pierwsze 12 miesięcy?",
    a: "Przez pierwsze 12 miesięcy abonament wynosi 0 zł. Płatne są jedynie opłaty aktywacyjne na pierwszej fakturze: 79 zł za Internet i 2 zł za Telewizję (łącznie 81 zł jednorazowo).",
  },
  {
    icon: TrendingUp,
    q: "Ile kosztuje pakiet od 13. miesiąca?",
    a: "Max 1000 = 140 zł/mies., Max 2000 = 160 zł/mies. — te ceny obowiązują od 13. do 24. miesiąca. Po 24 miesiącach cena abonamentu rośnie o 10 zł zgodnie z regulaminem.",
  },
  {
    icon: FileCheck,
    q: "Czy muszę spełnić jakieś warunki, żeby cena pozostała na poziomie 140/160 zł?",
    a: "Tak — wymagana jest e-faktura (rabat 5 zł) i zgody marketingowe (rabat 5 zł). Jeśli zrezygnujesz z tych zgód lub e-faktury, cena wzrośnie o 10 zł.",
  },
  {
    icon: FileText,
    q: "Na jak długo jest umowa?",
    a: "Umowa zawierana jest na czas określony 24 pełnych okresów rozliczeniowych. Pierwsze 12 mies. abonamentu za 0 zł, kolejne 12 mies. według tabeli cen.",
  },
  {
    icon: Tv,
    q: "Czy mogę dokupić pakiety filmowe lub sportowe?",
    a: "Tak — dostępne dopłaty: HBO + HBO Max (+25 zł), Canal+ Prestige (+50 zł), Canal+ Select (+35 zł), Polsat Sport Premium (+20 zł), Eleven Sports (+10 zł), Polsat Sport Premium + Eleven Sports (+20 zł), FilmBox (+10 zł), Dla Dorosłych (+10 zł).",
  },
  {
    icon: XCircle,
    q: "Czy w ofercie jest Disney+ lub SkyShowtime?",
    a: "Nie. W tej promocji nie ma usług streamingowych Disney+ i SkyShowtime. Dostępne są klasyczne pakiety telewizyjne i premium opisane wyżej.",
  },
  {
    icon: Gauge,
    q: "W jakiej technologii dostępna jest prędkość 2 Gb/s?",
    a: "Maksymalna prędkość 2 Gb/s dostępna jest w technologii PON. W technologiach HFC lub ETTH maksymalna prędkość może być inna — sprawdź dostępność pod swoim adresem przed zamówieniem.",
  },
];