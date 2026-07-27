// src/lib/seo/pages-metadata.ts
//
// Centralny rejestr title + description dla wszystkich statycznych
// podstron serwisu. Każdy page.tsx importuje stąd swój klucz zamiast
// definiować metadata lokalnie — dzięki temu wszystkie teksty SEO
// edytuje się w jednym miejscu.
//
// Strony dynamiczne (blog posty, miasta) MAJĄ WŁASNE źródło prawdy:
//   - blog:   src/app/content/blog/posts (POSTS) + generateMetadata()
//   - miasta: src/lib/cities.ts (CITIES) + generateMetadata()
// Nie duplikuj ich tutaj — patrz komentarz na końcu pliku.

import type { Metadata } from "next";

export const pagesMetadata: Record<string, Metadata> = {
  // 1. Strona główna
  home: {
    title: "Internet Netia – Światłowód do 2 Gb/s, Stała Cena 24 mies.",
    description:
      "Internet Netia od 40 zł/mies. Światłowód do 2 Gb/s, TV 4K w cenie, 6 miesięcy za 0 zł. Instalacja nawet nazajutrz. Zaufało nam 2,4 mln klientów.",
  },

  // 2. /oferty/max
  ofertyMax: {
    title: "Internet Max + TV L 4K – 12 Miesięcy za 0 zł | Netia",
    description:
      "Internet do 2000 Mb/s + Telewizja L 4K + Bezpieczny Internet Ultra. 12 miesięcy za 0 zł, potem od 140 zł/mies. Sprawdź ofertę Max już dziś.",
  },

  // 3. /oferty/popularne
  ofertyPopularne: {
    title: "Popularne Oferty Netia – Internet + TV już od 40 zł",
    description:
      "Internet światłowodowy z telewizją 4K od 40 zł/mies. Router, dekoder i Netia GO w cenie. Prędkości do 2 Gb/s, 6 miesięcy za 0 zł. Sprawdź ofertę.",
  },

  // 4. /konfigurator
  konfigurator: {
    title: "Konfigurator Ofert Netia – Zbuduj Własny Pakiet Internetu",
    description:
      "Wybierz prędkość do 2 Gb/s, pakiet TV S/M/L i dodatki: Disney+, Bezpieczny Internet, 5G. Skonfiguruj ofertę Netia online w kilka minut, bez telefonu.",
  },

  // 5. /kanaly
  kanaly: {
    title: "Lista Kanałów TV Netia – 233 Kanały w Pakietach S, M, L",
    description:
      "Sprawdź 233 kanały TV Netia w pakietach S (81), M (106) i L (185) oraz dodatkach: sport, filmy, kanały dla dzieci i Ukraina. Wyszukaj swój ulubiony kanał.",
  },

  // 6. /pomoc/faq
  pomocFaq: {
    title: "FAQ Netia – Najczęstsze Pytania o Internet, TV i Umowę",
    description:
      "43 odpowiedzi na pytania o Internet, telewizję, mobile i rozliczenia Netii. Instalacja, aktywacja, zmiana pakietu – wszystko w jednym miejscu.",
  },

  // 7. /pomoc/Telewizja
  pomocTelewizja: {
    title: "Telewizja Netia – Dekodery 4K, Pakiety S, M, L i Multiroom",
    description:
      "Poznaj telewizję IPTV Netii: dekodery Soundbox 4K, EvoBox 4K i HD, pakiety S/M/L z dodatkami premium (HBO, Canal+) oraz funkcję Multiroom do 3 ekranów.",
  },

  // 8. /pomoc/internet
  pomocInternet: {
    title: "Technologie Internetu Netia – PON, ETTH, HFC i Routery",
    description:
      "Poznaj technologie internetu światłowodowego Netia: PON, ETTH i HFC. Sprawdź routery Huawei HG8245Q, HG8245X6-10 i HG8145B7N z Wi-Fi 6/7 do 2 Gb/s.",
  },

  // 9. /pomoc/telefon
  pomocTelefon: {
    title: "Netia Mobile 5G – Plany SUPER, VIP, GIGA na Sieci Plus",
    description:
      "Telefonia komórkowa Netii na sieci Plus 5G. Plany od 60 do 200 GB, 6 miesięcy za 0 zł, potem od 30 zł/mies. Nielimitowane rozmowy i SMS. Sprawdź ofertę.",
  },

  // 10. /pomoc/awarie
  pomocAwarie: {
    title: "Zgłoś Awarię Netia – Infolinia 24/7, 793 800 300",
    description:
      "Awaria internetu lub TV? Sprawdź 6 kroków naprawczych i zadzwoń na infolinię techniczną Netii, czynną całodobowo pod numerem 793 800 300.",
  },

  // 11. /blog
  blog: {
    title: "Blog Netia – Poradniki o Internecie, TV i Technologii",
    description:
      "Praktyczne poradniki: jak wybrać prędkość internetu, internet dla graczy, konfiguracja Wi-Fi i więcej. Sprawdź najnowsze artykuły Netii.",
  },

  // 14. /polityka-prywatnosci
  politykaPrywatnosci: {
    title: "Polityka Prywatności – Netia S.A. | Ochrona Danych",
    description:
      "Zasady przetwarzania danych osobowych w serwisie Netii zgodnie z RODO: cele, okres przechowywania, pliki cookie oraz Twoje prawa. Obowiązuje od 05.02.2021.",
  },

  // 16. /konfigurator/podsumowanie — celowo bez title/description,
  //     strona ma unikać indeksowania (dynamiczna, per-sesja treść)
  konfiguratorPodsumowanie: {
    title: "Podsumowanie Konfiguracji – Netia",
    robots: { index: false, follow: true },
  },

  // 17. /oferty/dobierz — sekcja OfferQuizSection ("Dwa pytania i gotowe")
  ofertyDobierz: {
    title: "Dobierz Ofertę Netia – Internet + TV w 2 Pytania | Kalkulator",
    description:
      "Odpowiedz na 2 pytania i sprawdź dopasowaną ofertę Internetu i TV Netii – od 40 zł/mies., światłowód do 2 Gb/s, TV 4K w cenie. Bez zobowiązań, 3 min przez telefon.",
  },

  // 18. /oferty/internet-tv — sekcja OfferInternetTvSection ("Internet + TV XS")
  //     PODMIEŃ klucz i ścieżkę page.tsx, jeśli realna trasa jest inna.
  ofertyInternetTv: {
    title: "Internet + Telewizja XS Netia – już od 30 zł/mies.",
    description:
      "Internet światłowodowy do 2 Gb/s z Telewizją XS od 30 zł/mies. Router i Netia GO w cenie, do 6 miesięcy za 0 zł. Sprawdź pakiety 300/600/1000/2000 Mb/s.",
  },
};

/* -------------------------------------------------------------------- */
/*  NIE dodawaj tutaj:                                                    */
/*                                                                        */
/*  #12, #13 — /blog/[slug] (posty)                                      */
/*    Źródło: src/app/content/blog/posts (POSTS), pole meta.title/        */
/*    meta.excerpt. Generowane przez generateMetadata({ params }) w       */
/*    src/app/blog/[slug]/page.tsx na podstawie POSTS.find(slug).         */
/*                                                                        */
/*  #15 — /internet-miasta/[slug] (miasta)                               */
/*    Źródło: src/lib/cities.ts (CITIES). Generowane przez                */
/*    generateMetadata({ params }) w                                      */
/*    src/app/internet-miasta/[slug]/page.tsx wg szablonu:                */
/*      title: `Internet Netia ${city.name} – już od ${city.priceFrom}    */
/*              zł/mies. | Oferta 2026`                                   */
/*      description: `Światłowód Netia w ${city.name} od                 */
/*              ${city.priceFrom} zł/mies. ...`                          */
/*                                                                        */
/*  Trzymanie ich w jednym miejscu z resztą stworzyłoby dwa źródła         */
/*  prawdy dla tych samych danych — zostają tam, gdzie już żyją.          */
/* -------------------------------------------------------------------- */