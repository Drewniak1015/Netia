import type { Pakiet } from "./types";

/* ---------------------------------------------------------------------- */
/*  Dane pakietów internetowych — umowa 24 mies.                           */
/*  UWAGA: pakiety "Internet do 150Mb/s" oraz "Internet do 300Mb/s" zostały*/
/*  usunięte na życzenie — nie są już częścią oferty.                    */
/*                                                                          */
/*  NOWOŚĆ: każdy pakiet ma domyślnie wliczoną Telewizję XS (`tvDomyslny`) */
/*  — konfigurator pokazuje to jako informację nad sekcją Telewizja. Dla   */
/*  600 Mb/s dodatkowo ograniczono wybór do Pakietów M i L (`dostepneTV`)  */
/*  — Pakiet S nie jest pokazywany jako opcja, bo XS jest już bazowo w    */
/*  cenie.                                                                 */
/* ---------------------------------------------------------------------- */
export const PAKIETY_24: Pakiet[] = [
  {
    id: "24-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
    tvDomyslny: "Telewizja XS w pakiecie",
    dostepneTV: ["m", "l"],
  },
  {
    id: "24-1000",
    nazwa: "Internet do 1000Mb/s",
    predkosc: "1000 Mb/s",
    upload: "Upload do 300 Mb/s",
    wyposazenie: "Router WiFi 6",
    routerId: "szablon-1",
    cena: 80,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
    wyrozniony: true,
    tvDomyslny: "Telewizja XS w pakiecie",
  },
  {
    id: "24-2000",
    nazwa: "Internet do 2000Mb/s",
    predkosc: "2000 Mb/s",
    upload: "Upload do 1000 Mb/s",
    wyposazenie: "Router Combo z ONT WiFi 7",
    routerId: "szablon-2",
    cena: 100,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
    tvDomyslny: "Telewizja XS w pakiecie",
  },
];

/* ---------------------------------------------------------------------- */
/*  Dane pakietów internetowych — bez zobowiązań                          */
/*  UWAGA: od teraz w UI dostępna jest wyłącznie umowa 24-miesięczna      */
/*  (patrz index.tsx — przełącznik umowy zastąpiony statycznym badge'em). */
/*  Ten zbiór zostaje w kodzie jako dead code / na wypadek przywrócenia   */
/*  opcji "bez zobowiązań" w przyszłości — nieużywany, tree-shaking i tak */
/*  go wytnie z bundla.                                                   */
/*  TODO: podmień na realne nazwy / opisy / ceny dla oferty bez umowy     */
/* ---------------------------------------------------------------------- */
export const PAKIETY_BEZ: Pakiet[] = [
  {
    id: "bez-150",
    nazwa: "Internet do 150Mb/s",
    predkosc: "150 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "bez-300",
    nazwa: "Internet do 300Mb/s",
    predkosc: "300 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "bez-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 75,
    wyrozniony: true,
  },
  {
    id: "bez-1000",
    nazwa: "Internet do 1000Mb/s",
    predkosc: "1000 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi 6",
    routerId: "szablon-1",
    cena: 90,
  },
];

/* ---------------------------------------------------------------------- */
/*  UWAGA (dead code): ten zbiór był zdefiniowany w oryginalnym pliku, ale */
/*  nigdzie nie był importowany/używany (KonfiguratorZawartosc korzysta   */
/*  wyłącznie z PAKIETY_24 / PAKIETY_BEZ). Zostawiony na wypadek, gdyby    */
/*  była to zamierzona treść "bez zobowiązań" dla innego wariantu — jeśli */
/*  faktycznie nieużywany, można bezpiecznie usunąć (0 wpływu na bundle,  */
/*  bo tree-shaking i tak go wytnie, jeśli nic go nie importuje).         */
/* ---------------------------------------------------------------------- */
export const PAKIETY_24_BEZ: Pakiet[] = [
  {
    id: "24-150",
    nazwa: "Internet 150",
    predkosc: "150 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "24-300",
    nazwa: "Internet 300",
    predkosc: "300 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "24-600",
    nazwa: "Internet 600",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 75,
  },
  {
    id: "24-1000",
    nazwa: "Internet 1000",
    predkosc: "1000 Mb/s",
    upload: "Upload do 300 Mb/s",
    wyposazenie: "Router WiFi 6",
    routerId: "domyslny",
    cena: 90,
  },
];