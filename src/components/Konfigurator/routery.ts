import type { RouterInfo } from "./types";

/* ---------------------------------------------------------------------- */
/*  Dane routerów — wyświetlane w oknie "Szczegóły dołączonego routera"    */
/*  Na razie WSZYSTKIE pakiety wskazują na klucz "domyslny" (ten sam       */
/*  Huawei HG8245Q wszędzie). Dodano też 2 gotowe szablony ("szablon-1",  */
/*  "szablon-2") — podmień w nich dane i przypisz inny routerId do        */
/*  wybranych pakietów w data/pakiety.ts, gdy będziesz mieć informacje    */
/*  o innych routerach (np. do 1000/2000 Mb/s).                          */
/* ---------------------------------------------------------------------- */

const HUAWEI_HG8245Q: RouterInfo = {
  id: "domyslny",
  model: "HUAWEI HG8245Q",
  podtytul:
    "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych",
  // TODO: jeśli plik leży w innym miejscu niż /public, popraw ścieżkę.
  zdjecie: "/images/LowRouter.webp",
  opis: [
    "Huawei HG8245Q to stabilny i sprawdzony terminal optyczny GPON stosowany w instalacjach światłowodowych Netii. Urządzenie łączy funkcję routera Wi-Fi, gigabitowego przełącznika, bramy VoIP i optycznego ONT w jednej obudowie.",
    "Zaprojektowany do pracy ciągłej, oferuje pewne połączenie internetowe, obsługę usług IPTV oraz telefonię VoIP. Dwupasmowe Wi-Fi 2.4 / 5 GHz zapewnia stabilne działanie sieci bezprzewodowej w mieszkaniu, a cztery porty LAN ułatwiają podłączanie telewizora, konsoli lub komputera po kablu.",
    "Model ten świetnie sprawdza się w typowych domowych zastosowaniach, gdzie priorytetem jest pewność działania i stabilność.",
  ],
  specyfikacja: [
    { label: "Światłowód / PON", value: "GPON ITU-T G.984, port optyczny SC/APC" },
    { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL (VoIP), 1× USB, zasilanie DC" },
    { label: "Wi-Fi (2.4 / 5 GHz)", value: "802.11 b/g/n + 802.11 a/n/ac, WPA/WPA2, WPS" },
    { label: "Funkcje", value: "NAT / DHCP / firewall, QoS, IPTV / VLAN, VoIP" },
    { label: "Wymiary", value: "285 × 190 × 85 mm" },
    { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
  ],
  wifi5Cechy: [
    "stabilne działanie 2.4 i 5 GHz",
    "mniejsze zakłócenia niż w starszych standardach",
    "pełna kompatybilność ze wszystkimi urządzeniami domowymi",
  ],
  predkosci:
    "Router Huawei HG8245Q jest instalowany przy prędkościach do 600 Mb/s, do 300 Mb/s, do 150 Mb/s.",
  kosztInfo:
    "Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów.",
  instrukcjaUrl:
    "/pdf/Instrukcja_Router_Huawei_HG8245Q.pdf",
};

export const ROUTERY: Record<string, RouterInfo> = {
  domyslny: HUAWEI_HG8245Q,
  // TODO (szablon do podmiany): router dla pakietów do 1000 Mb/s (WiFi 6).
  // Zdjęcie już podpięte (MidRouter.webp) — reszta danych (model, opis,
  // specyfikacja) to na razie kopia HG8245Q, podmień na docelowy tekst.
  "szablon-1": { ...HUAWEI_HG8245Q, id: "szablon-1", zdjecie: "/images/MidRouter.webp" },
  // TODO (szablon do podmiany): router dla pakietów do 2000 Mb/s (WiFi 7 / ONT combo).
  // Zdjęcie już podpięte (TopRouter.webp) — reszta danych to na razie kopia HG8245Q.
  "szablon-2": { ...HUAWEI_HG8245Q, id: "szablon-2", zdjecie: "/images/TopRouter.webp" },
};
