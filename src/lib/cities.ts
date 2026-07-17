export interface City {
  /** Mianownik – forma podstawowa, np. "Warszawa" */
  name: string;
  /** Miejscownik – forma po "w/we", np. "Warszawie", używana w H1 i meta danych */
  locative: string;
  /** Slug do adresu URL, np. "warszawa", "zielona-gora" */
  slug: string;
  /** Populacja jako liczba */
  population: number;
  /** Opcjonalny opis marketingowy dedykowany dla danego miasta */
  description?: string;
}

export const CITIES: City[] = [
  { 
    name: "Warszawa", 
    locative: "Warszawie", 
    slug: "warszawa", 
    population: 1862402,
    description: "Tempo stolicy wymaga pewnego łącza: Netia dostarcza szybki światłowód i TV 4K z instalacją w 1–3 dni — idealnie do pracy hybrydowej i streamingu po spacerze przez Zamek, Łazienki czy Muzeum Powstania. W Warszawie technologia PON pokrywa większość Śródmieścia, Mokotowa, Ursynowa, Woli, Pragi i Bemowa, oferując prędkości do 2 Gb/s. W aktualnej kampanii pakiety zaczynają się od 40 zł/mies. za Internet 300 Mb/s + Telewizję S na 24 miesiące, 65 zł/mies. za sam Internet 1 Gb/s w wariancie „6 miesięcy za 0 zł\", a dla wymagających pakiet Max z TV L 4K przez pierwsze 12 miesięcy za 0 zł. W cenie abonamentu router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla wyższych prędkości), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Kraków", 
    locative: "Krakowie", 
    slug: "krakow", 
    population: 807644,
    description: "Miasto smoka, Wawel i Sukiennice — a w domu szybki światłowód Netii i TV 4K. Elastyczne umowy pod najem i montaż w 1–3 dni roboczych. Kraków ma rozwiniętą sieć PON w Starym Mieście, Krowodrzy, Podgórzu, Dębnikach i Nowej Hucie — większość lokali ma dostęp do prędkości 1 Gb/s lub 2 Gb/s. W aktualnej kampanii Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24 miesiące, a Internet 1 Gb/s sam — 65 zł/mies. po 6-miesięcznym okresie za 0 zł. Dla rodzin oglądających 4K dostępny jest pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł). Umowy 9-miesięczne sprawdzają się przy wynajmie mieszkań pod Wawelem i w Kazimierzu."
  },
  { 
    name: "Wrocław", 
    locative: "Wrocławiu", 
    slug: "wroclaw", 
    population: 675531,
    description: "Miasto stu mostów i krasnali łączy się szybko: światłowód Netii do 2 Gb/s + TV 4K, bez buforowania i z jasnymi warunkami umowy. Wrocław ma dobrze rozwiniętą sieć PON na Krzykach, w Fabrycznej, na Psim Polu, w Śródmieściu i Biskupinie — większość lokali mieszkalnych ma dostęp do prędkości 1 Gb/s lub 2 Gb/s. W aktualnej kampanii Internet 300 Mb/s + TV S dostępny jest od 40 zł/mies. (24 miesiące), a sam Internet 1 Gb/s za 65 zł/mies. w wariancie „6 miesięcy za 0 zł\". Dla mieszkańców pracujących zdalnie lub w branży IT pakiet Max 2000 z TV L 4K i ochroną CyberEkspert kosztuje 0 zł przez pierwsze 12 miesięcy (potem 160 zł). Montaż 1–3 dni robocze, w cenie router Wi-Fi 6 lub Combo z ONT Wi-Fi 7 oraz Dekoder 4K."
  },
  { 
    name: "Łódź", 
    locative: "Łodzi", 
    slug: "lodz", 
    population: 648711,
    description: "Piotrkowska, EC1 i Szkoła Filmowa — a w mieszkaniu stabilny światłowód Netii i TV 4K. Prosta aktywacja, montaż w 1–3 dni roboczych, taryfy dla domu i biura. Łódź ma gęstą zabudowę kamienic w Śródmieściu oraz duże osiedla blokowe (Teofilów, Retkinia, Widzew, Bałuty) — światłowód Netii pokrywa większość mieszkań, oferując prędkości 300–2000 Mb/s na PON. Aktualnie Internet 300 Mb/s + TV S dostępny jest od 40 zł/mies. na 24 miesiące, sam Internet 1 Gb/s za 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K + Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (potem 140 zł). Każdy pakiet zawiera router Wi-Fi 6 lub Combo z ONT Wi-Fi 7, Dekoder 4K oraz aplikację Netia GO do oglądania na smartfonie i tablecie."
  },
  { 
    name: "Poznań", 
    locative: "Poznaniu", 
    slug: "poznan", 
    population: 536818,
    description: "Od koziołków po Targi — w domu śmiga światłowód Netii i TV 4K. Wybierz umowę 24, 12 lub 9 miesięcy, instalacja w 1–3 dni i bez ukrytych kosztów. Poznań ma rozległą sieć PON w Starym Mieście, na Jeżycach, Grunwaldzie, Wildzie i Łazarzu — większość kamienic i bloków obsługuje 1 Gb/s, a wybrane lokale 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. (24 miesiące), sam Internet 1 Gb/s — 65 zł/mies. po 6-miesięcznym okresie za 0 zł. Pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra dla 5 urządzeń przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł zależnie od prędkości). 9-miesięczna umowa idealnie pasuje pod akademiki UAM i Politechniki Poznańskiej."
  },
  { 
    name: "Gdańsk", 
    locative: "Gdańsku", 
    slug: "gdansk", 
    population: 487834,
    description: "Długi Targ, morze i stabilny net w domu: Netia dostarcza światłowód + TV 4K z montażem w 1–3 dni — idealnie do pracy zdalnej i filmu po plaży. Gdańsk ma rozwinięte pokrycie PON w Śródmieściu, Wrzeszczu, Oliwie, Przymorzu, Zaspie i Jasieniu — większość lokali obsługuje 1 Gb/s, a w nowszych blokach również 2 Gb/s. W aktualnej kampanii Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. (24 miesiące), Internet 1 Gb/s sam — 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K + Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (potem 140 zł). Dla najemców mieszkań pod wynajem krótkoterminowy 9-miesięczna umowa z fakturą VAT pasuje pod sezon Airbnb. W cenie: router Wi-Fi 6, Dekoder 4K, Netia GO, Giganagrywarka Basic."
  },
  { 
    name: "Szczecin", 
    locative: "Szczecinie", 
    slug: "szczecin", 
    population: 387700,
    description: "Wały Chrobrego, port i pewne łącze w gwiaździstym mieście: Netia — światłowód + bogata TV 4K, stała jakość na obu brzegach Odry. Szczecin ma sieć PON na Centrum, Pogodno, Niebuszewo, Prawobrzeżu, Gumieńcach i Warszewie — większość lokali obsługuje 1 Gb/s, a w nowszych osiedlach również 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K i Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (potem 140–160 zł). Bliskość granicy z Niemcami sprawia, że obsługa po angielsku i niemiecku jest dostępna pod numerem +48 883 334 124. W cenie router Wi-Fi 6, Dekoder 4K i Netia GO."
  },
  { 
    name: "Bydgoszcz", 
    locative: "Bydgoszczy", 
    slug: "bydgoszcz", 
    population: 336796,
    description: "Wyspa Młyńska, Opera Nova — w mieszkaniu 4K i szybki światłowód Netii. Montaż w 1–3 dni roboczych, proste zasady, zero komplikacji. Bydgoszcz ma sieć PON w Fordonie, Bartodziejach, Śródmieściu, Szwederowie, na Os. Leśnym i Kapuściskach — większość bloków i kamienic obsługuje 1 Gb/s, a w nowszych lokalach również 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24 miesiące, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K + Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (potem 140–160 zł zależnie od prędkości). Studentom UKW i UMK pasuje 9-miesięczna umowa. W cenie: router Wi-Fi 6, Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Lublin", 
    locative: "Lublinie", 
    slug: "lublin", 
    population: 328868,
    description: "Miasto akademickie potrzebuje niezawodności: Netia zapewnia szybki światłowód i TV 4K, wygodny montaż w 1–3 dni i koszty bez niespodzianek. Lublin ma sieć PON w Śródmieściu, na Czechowie, Felinie, LSM, Kalinowszczyźnie, Bronowicach i Tatarach — większość lokali obsługuje 1 Gb/s, w nowszych blokach również 2 Gb/s. W kampanii Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. (24 miesiące), sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł. Dla studentów KUL, UMCS i Politechniki Lubelskiej dostępna jest 9-miesięczna umowa, która kończy się przed wakacjami — idealnie pod akademik lub stancję. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Katowice", 
    locative: "Katowicach", 
    slug: "katowice", 
    population: 280190,
    description: "Sercu GZM przyda się mocny net. Pomiędzy Spodkiem, Strefą Kultury (NOSPR, Muzeum Śląskie) a kolonią robotniczą Nikiszowiec ludzie pracują, oglądają mecze i streamują seriale — Netia dostarcza światłowód do 2 Gb/s i TV 4K do mieszkań w typowych dzielnicach Katowic. PON pokrywa Śródmieście, Ligotę-Panewniki, Brynów, Dąb, Załęże, Piotrowice-Ochojec, Giszowiec, Wełnowiec i Zawodzie — w większości bloków montaż w 1–3 dni roboczych. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6-miesięcznym okresie za 0 zł. Dla rodzin oglądających 4K w blokach pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra dla 5 urządzeń przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł zależnie od prędkości). Stabilne łącze ma znaczenie szczególnie w gęstej zabudowie śląskiej, gdzie sieci radiowe potrafią dzielić pasmo z 30+ mieszkaniami na piętrze — światłowód PON to dedykowane medium do każdego lokalu. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Białystok", 
    locative: "Białymstoku", 
    slug: "bialystok", 
    population: 299101,
    description: "Wersal Północy i nowoczesne łącze: Netia — światłowód + TV 4K z montażem w 1–3 dni roboczych. Stabilnie do pracy i rozrywki. Białystok ma sieć PON w Centrum, na Antoniuku, Wysokim Stoczku, Piaskach, Bacieczkach, Sienkiewicza i w Leśnej Dolinie — większość lokali obsługuje 1 Gb/s, w nowych blokach 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24 miesiące, sam Internet 1 Gb/s — 65 zł/mies. po 6-miesięcznym okresie za 0 zł, a pakiet Max z TV L 4K i Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (potem 140–160 zł). W mieście z dużą społecznością ukraińską dostępny jest Pakiet Ukraina (8 kanałów ukraińskojęzycznych) jako dopłata do dowolnego pakietu TV. Obsługa po polsku, angielsku i ukraińsku — pod numerem +48 883 334 124."
  },
  { name: "Częstochowa", locative: "Częstochowie", slug: "czestochowa", population: 208282, description: "Jasna Góra i spokój w domu: Netia zapewnia stabilny Internet i TV 4K — czytelna umowa, bez drobnego druku." },
  { name: "Radom", locative: "Radomiu", slug: "radom", population: 197848, description: "Miasto usług rośnie — a wraz z nim potrzeba dobrego łącza. Netia: szybki światłowód i korzystne pakiety TV 4K, gotowe w kilka dni." },
  { name: "Toruń", locative: "Toruniu", slug: "torun", population: 196364, description: "Miasto Kopernika i pierników — a w domu stabilny światłowód Netii + TV 4K. Niski ping, równa prędkość, bezproblemowa instalacja." },
  { name: "Kielce", locative: "Kielcach", slug: "kielce", population: 190273, description: "Góry Świętokrzyskie za oknem, a w domu szybki net. Netia: światłowód i TV 4K w świetnej cenie, jasne zasady i pewny serwis." },
  { name: "Rzeszów", locative: "Rzeszowie", slug: "rzeszow", population: 198968, description: "Lotnicze i IT serce Podkarpacia — u Ciebie szybki światłowód Netii dla domu i firmy + TV 4K. Montaż bez przestojów, jakość bez wahań." },
  { name: "Gliwice", locative: "Gliwicach", slug: "gliwice", population: 176987, description: "Radiostacja i Politechnika — a w mieszkaniu łącze, które dotrzymuje kroku. Netia: stabilny światłowód + TV 4K bez zrywów." },
  { name: "Olsztyn", locative: "Olsztynie", slug: "olsztyn", population: 169793, description: "Kraina jezior wymaga płynnego streamingu: Netia — szybki światłowód + TV 4K, idealne do pracy zdalnej i rozrywki bez buforowania." },
  { name: "Zabrze", locative: "Zabrzu", slug: "zabrze", population: 155917, description: "Dziedzictwo przemysłowe, nowoczesne łącze. Netia: szybki światłowód + TV 4K, montaż bez zbędnego czekania i bez niespodzianek." },
  { name: "Bytom", locative: "Bytomiu", slug: "bytom", population: 154636, description: "Opera Śląska i pewny Internet w domu. Netia: stabilny światłowód i TV 4K dla rodzin — proste plany, uczciwe warunki." },
  { 
    name: "Zielona Góra", 
    locative: "Zielonej Górze", 
    slug: "zielona-gora", 
    population: 141222,
    description: "Stolica winiarstwa i miasto akademickie — Uniwersytet Zielonogórski, Park Naukowo-Technologiczny i Bachanalia. Netia: szybki światłowód i TV 4K, idealnie pod kampus, stancję i pracę zdalną. Zielona Góra ma sieć PON w Centrum, na Łężycy, Os. Pomorskim, Os. Śląskim, Chynowie, Jędrzychowie i Przylepie — większość bloków obsługuje 1 Gb/s, w nowszych również 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla studentów UZ pasuje 9-miesięczna umowa, która kończy się przed wakacjami — idealnie pod stancję lub akademik na Chynowie i w Centrum. Z opcjonalnym 5G jako backup mobilny przy egzaminach online lub awarii sieci stacjonarnej. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { name: "Ruda Śląska", locative: "Rudzie Śląskiej", slug: "ruda-slaska", population: 134984, description: "W sercu GZM liczy się niezawodność: Netia — stabilny Internet i TV 4K, czytelne koszty, szybka instalacja." },
  { name: "Tychy", locative: "Tychach", slug: "tychy", population: 126871, description: "Miasto ogrodów i sportu — w domu stabilny Internet Netii. Dołóż TV 4K; umowy czytelne, instalacja sprawna i terminowa." },
  { name: "Dąbrowa Górnicza", locative: "Dąbrowie Górniczej", slug: "dabrowa-gornicza", population: 117459, description: "Pogorie na weekend, a w domu szybki światłowód. Netia: Internet + TV 4K, montaż na czas i wsparcie bez kolejek." },
  { name: "Elbląg", locative: "Elblągu", slug: "elblag", population: 118341, description: "Kanał Elbląski i statki na trawie, a w domu streaming bez buforu. Netia: stabilny Internet i TV 4K, wygodny montaż i prosta obsługa." },
  { name: "Płock", locative: "Płocku", slug: "plock", population: 118268, description: "Wzgórze Tumskie i przemysł — w domu łącze, które nie zwalnia. Netia: szybki Internet + TV 4K dla pracy i relaksu." },
  { name: "Opole", locative: "Opolu", slug: "opole", population: 126118, description: "Stolica polskiej piosenki zasługuje na wyraźny obraz: Netia — szybki światłowód + TV 4K, instalacja bez stresu i na czas." },
  { name: "Gdynia", locative: "Gdyni", slug: "gdynia", population: 242874, description: "Modernistyczne miasto z morza — i szybki światłowód Netii. Dołóż TV 4K, instalację zrobimy sprawnie i przejrzyście." },
  { name: "Tarnów", locative: "Tarnowie", slug: "tarnow", population: 106147, description: "Perła renesansu Małopolski i nowoczesny światłowód: Netia — szybki Internet + TV 4K, sprawny montaż i uczciwe warunki." },
  { 
    name: "Wałbrzych", 
    locative: "Wałbrzychu", 
    slug: "walbrzych", 
    population: 108882,
    description: "Zamek Książ, Stara Kopalnia i Palmiarnia — miasto z gęstą architekturą poprzemysłową i kamienicami z XIX wieku, w którym instalacja światłowodu wymaga delikatności wobec zabytków. Netia w Wałbrzychu: światłowód do 2 Gb/s i TV 4K, montaż w 1–3 dni roboczych z poszanowaniem zabytkowych elewacji — bez kucia frontowych ścian. PON pokrywa Śródmieście, Biały Kamień, Sobięcin, Podgórze, Piaskową Górę, Nowe Miasto, Szczawienko i Podzamcze — większość lokali obsługuje 1 Gb/s, w nowszych blokach 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla firm w Wałbrzyskiej Specjalnej Strefie Ekonomicznej i właścicieli wynajmu turystycznego pod Książem dostępna faktura VAT i 9-miesięczna umowa. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Rybnik", 
    locative: "Rybniku", 
    slug: "rybnik", 
    population: 136653,
    description: "Zielone miasto GZM, dawne zagłębie węglowe — między kopalnią Chwałowice, Bazyliką św. Antoniego a osiedlami górniczymi Boguszowic i Niedobczyc ludzie pracują zmianowo i potrzebują stabilnego netu w blokach. Netia w Rybniku: światłowód do 2 Gb/s i TV 4K do mieszkań w typowej zabudowie GZM. PON pokrywa Śródmieście, Boguszowice, Chwałowice, Niedobczyce, Paruszowiec, Popielów, Kamień i Maroko-Nowiny — w większości bloków montaż w 1–3 dni roboczych bez kucia ścian. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6-miesięcznym okresie za 0 zł, a pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). W gęstej zabudowie blokowej Boguszowic czy Niedobczyc, gdzie sieci radiowe konkurentów dzielą pasmo z dziesiątkami mieszkań na piętrze, światłowód PON to dedykowane medium do każdego lokalu — bez spowolnień wieczorem. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { name: "Gorzów Wielkopolski", locative: "Gorzowie Wielkopolskim", slug: "gorzow-wielkopolski", population: 121229, description: "Bulwary nad Wartą i szybki net w mieszkaniu. Netia: Internet + TV 4K, montaż w krótkich terminach i bez formalności." },
  { name: "Koszalin", locative: "Koszalinie", slug: "koszalin", population: 107519, description: "Blisko Bałtyku, blisko do prędkości. Netia: szybki Internet i TV 4K, montaż bez zwłoki i z pełną przejrzystością." },
  { name: "Chorzów", locative: "Chorzowie", slug: "chorzow", population: 105628, description: "Park Śląski, Legendia i niezawodny net w domu. Netia: stabilny Internet + TV 4K, bez zbędnych formalności i z jasnym cennikiem." },
  { name: "Włocławek", locative: "Włocławku", slug: "wloclawek", population: 103227, description: "Zapora na Wiśle, w domu stabilna sieć. Netia: Internet + TV 4K, jasne zasady i wygodna obsługa online." },
  { name: "Kalisz", locative: "Kaliszu", slug: "kalisz", population: 100236, description: "Najstarsze miasto, nowoczesne łącze. Netia: stabilny Internet + TV 4K, proste taryfy i szybka instalacja." },
  { 
    name: "Legnica", 
    locative: "Legnicy", 
    slug: "legnica", 
    population: 98997,
    description: "Miasto miedzi i Legnickiego Pola, ze stabilnym łączem dla pracy zmianowej. Netia w Legnicy: światłowód do 2 Gb/s i TV 4K, sprawdzane szczególnie przez pracowników KGHM, Strefy Ekonomicznej i przemysłu okołomiedziowego. PON pokrywa Śródmieście, Piekary, Os. Kopernik, Fabryczną, Tarninów, Zosinek i Bielany — w większości bloków montaż w 1–3 dni roboczych, z możliwością wyboru godzin pracy technika pod harmonogram zmian. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6-miesięcznym okresie za 0 zł, a pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla osób wracających z nocnej zmiany liczy się niezawodne łącze 24/7 do filmu, gier i komunikatorów bez resetów routera — światłowód PON nie traci synchronizacji jak miedź. W cenie dwupasmowy router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { 
    name: "Grudziądz", 
    locative: "Grudziądzu", 
    slug: "grudziadz", 
    population: 94622,
    description: "Spichrze nad Wisłą i przemysłowe Strzemięcin — miasto pracy zmianowej w fabrykach, na kolei i w logistyce. Netia w Grudziądzu: stabilny światłowód do 2 Gb/s i TV 4K, dopasowany do harmonogramu pracy 24/7 — montaż w 1–3 dni roboczych z możliwością wyboru godzin wizyty technika pod zmiany. PON pokrywa Śródmieście, Rządz, Tarpno, Strzemięcin, Mniszek, Kopernika, Chełmińskie i Nową Wieś — większość lokali obsługuje 1 Gb/s, w nowszych blokach 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, a pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla osób wracających z nocnej zmiany istotne jest niezawodne łącze do filmu, gier i wideorozmów bez resetów — światłowód PON nie traci synchronizacji jak miedź. W cenie dwupasmowy router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { name: "Słupsk", locative: "Słupsku", slug: "slupsk", population: 89640, description: "Dolina Słupi i szybki streaming. Netia: Internet + TV 4K, bez zacięć i z czytelną umową." },
  { name: "Jastrzębie-Zdrój", locative: "Jastrzębiu-Zdroju", slug: "jastrzebie-zdroj", population: 86583, description: "Uzdrowisko i sport — a w domu stabilne łącze. Netia: Internet + TV 4K, przyjazne warunki i szybka aktywacja." },
  { name: "Nowy Sącz", locative: "Nowym Sączu", slug: "nowy-sacz", population: 82995, description: "Brama w Beskid Sądecki i niezawodny net w domu. Netia: stabilny Internet + TV 4K, gotowe do pracy i rozrywki." },
  { name: "Siedlce", locative: "Siedlcach", slug: "siedlce", population: 77661, description: "Mazowieckie centrum akademickie z pewnym łączem. Netia: stabilny Internet + TV 4K, jasne zasady i łatwa obsługa." },
  { 
    name: "Jelenia Góra", 
    locative: "Jeleniej Górze", 
    slug: "jelenia-gora", 
    population: 74636,
    description: "Brama do Karkonoszy, Cieplice Śląskie i kamienice rynku — turyści sezonowo wypełniają pensjonaty, mieszkańcy potrzebują stabilnego netu cały rok. Netia w Jeleniej Górze: światłowód do 2 Gb/s i TV 4K, instalacja w 1–3 dni z poszanowaniem zabytkowych elewacji — montaż prowadzony niewidoczną trasą, bez kucia ścian frontowych. PON pokrywa Centrum, Cieplice Śląskie, Sobieszów, Zabobrze, Maciejową, Strupice i Park Sudecki — większość lokali obsługuje 1 Gb/s, w nowszych blokach 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla właścicieli pensjonatów i apartamentów pod wynajem turystyczny dostępna faktura VAT i 9-miesięczna umowa pasująca pod sezon Karkonoszy. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { name: "Mysłowice", locative: "Mysłowicach", slug: "myslowice", population: 74286, description: "Trójkąt Trzech Cesarzy i szybki Internet Netii. TV 4K w pakiecie — prosto, jasno, bez drobnego druku." },
  { name: "Piła", locative: "Pile", slug: "pila", population: 73268, description: "Miasto zieleni z płynnym netem: Netia — szybki Internet + TV 4K, komfort na co dzień i spokój wieczorem." },
  { name: "Inowrocław", locative: "Inowrocławiu", slug: "inowroclaw", population: 72563, description: "Uzdrowisko i tężnie — w domu świeże łącze. Netia: stabilny Internet + TV 4K, bez zacięć i z prostą obsługą." },
  { name: "Lubin", locative: "Lubinie", slug: "lubin", population: 72010, description: "Zagłębie Miedziowe z mocnym łączem. Netia: szybki Internet + TV 4K, montaż na czas, prosta umowa i pewny serwis." },
  { name: "Piotrków Trybunalski", locative: "Piotrkowie Trybunalskim", slug: "piotrkow-trybunalski", population: 71969, description: "Trybunalska tradycja, nowoczesny internet. Netia: szybki światłowód + TV 4K, montaż bez zbędnej zwłoki." },
  { name: "Ostrów Wielkopolski", locative: "Ostrowie Wielkopolskim", slug: "ostrow-wielkopolski", population: 71830, description: "Koszykarskie emocje, stabilny net. Netia: Internet + TV 4K, bez zwiech podczas meczów i z jasnym cennikiem." },
  { name: "Konin", locative: "Koninie", slug: "konin", population: 69422, description: "Energia miasta i energia sieci. Netia: szybki Internet + TV 4K, terminowa instalacja i przejrzyste koszty." },
  { 
    name: "Suwałki", 
    locative: "Suwałkach", 
    slug: "suwalki", 
    population: 68510,
    description: "Polski biegun zimna, brama do Wigier i pas suwalski przy granicy z Litwą — miasto, w którym mieszają się polska, litewska i ukraińska społeczność. Netia w Suwałkach: stabilny światłowód do 2 Gb/s i TV 4K, obsługa po polsku, angielsku i ukraińsku pod numerem +48 883 334 124 — istotne przy pracy zdalnej dla firm zagranicznych i w obsłudze klientów transgranicznych. PON pokrywa Centrum, Północ, Kamenę, Hańczę, Papiernię, Zastawie i Sobolewo — większość lokali obsługuje 1 Gb/s, w nowszych blokach 2 Gb/s. Aktualnie Internet 300 Mb/s + TV S kosztuje od 40 zł/mies. na 24-miesięcznej umowie, sam Internet 1 Gb/s — 65 zł/mies. po 6 miesiącach za 0 zł, pakiet Max z TV L 4K i ochroną Bezpieczny Internet Ultra przez pierwsze 12 miesięcy za 0 zł (od 13. miesiąca 140 zł lub 160 zł). Dla społeczności ukraińskojęzycznej dostępny Pakiet Ukraina (8 kanałów ukraińskich) jako dopłata do dowolnego pakietu TV. W cenie router Wi-Fi 6 (Combo z ONT Wi-Fi 7 dla 1000/2000 Mb/s), Dekoder 4K, Netia GO i Giganagrywarka Basic."
  },
  { name: "Stargard", locative: "Stargardzie", slug: "stargard", description: "Brama Młyńska i nowoczesne łącze. Netia: stabilny Internet + TV 4K, komfort dla domu i biura na Pomorzu Zachodnim.", population: 67957 },
  { name: "Głogów", locative: "Głogowie", slug: "glogow", population: 66767, description: "Odbudowane Stare Miasto i net, który się nie kruszy. Netia: szybki Internet + TV 4K, prosta instalacja i wsparcie." },
  { name: "Siemianowice Śląskie", locative: "Siemianowicach Śląskich", slug: "siemianowice-slaskie", population: 66570, description: "Między Katowicami a Chorzowem — pewny Internet. Netia: szybki światłowód + TV 4K, wygodne pakiety i sprawny montaż." },
  { name: "Gniezno", locative: "Gnieźnie", slug: "gniezno", population: 66564, description: "Pierwsza stolica z szybkim łączem. Netia: Internet + TV 4K, spokój dla pracy, nauki i wieczornego streamu." },
  { name: "Ostrowiec Świętokrzyski", locative: "Ostrowcu Świętokrzyskim", slug: "ostrowiec-swietokrzyski", population: 66250, description: "Przemysłowe serce regionu. Internet stacjonarny Netii w Ostrowcu — stabilne łącze, szybki montaż i wygodna oferta z TV 4K." },
  { name: "Leszno", locative: "Lesznie", slug: "leszno", population: 63945, description: "Żużel i szybkie łącze: Netia — stabilny Internet + TV 4K, montaż w krótkim czasie i bez zbędnych formalności." },
  { name: "Zamość", locative: "Zamościu", slug: "zamosc", population: 62745, description: "Perła renesansu w jakości 4K. Netia: szybki Internet + TV 4K, montaż bez zbędnych formalności i bez opóźnień." },
  { name: "Pabianice", locative: "Pabianicach", slug: "pabianice", population: 62637, description: "Włókiennicze tradycje — nowoczesna sieć. Netia: stabilny Internet + TV 4K, prędkości bez wahań i proste rozliczenia." },
  { name: "Tarnowskie Góry", locative: "Tarnowskich Górach", slug: "tarnowskie-gory", population: 60917, description: "Sztolnie UNESCO, nowoczesny światłowód. Netia: stabilny Internet + TV 4K, idealny do pracy i streamingu." },
  { name: "Chełm", locative: "Chełmie", slug: "chelm", population: 60389, description: "Kredowe podziemia — a na powierzchni stabilne łącze. Netia: Internet + TV 4K, wygodnie i przejrzyście." },
  { name: "Łomża", locative: "Łomży", slug: "lomza", population: 59476, description: "Miasto nad Narwią. Internet domowy Netii w Łomży — pewne łącze, szybka aktywacja i umowy idealne pod wynajem lub pracę zdalną." },
  { name: "Przemyśl", locative: "Przemyślu", slug: "przemysl", population: 58435, description: "Twierdza i pogranicze kultur — w domu pewny net. Netia: szybki Internet + TV 4K, terminowo i bez nerwów." },
  { name: "Świdnica", locative: "Świdnicy", slug: "swidnica", population: 55400, description: "Miasto z zabytkami UNESCO. Internet stacjonarny Netii w Świdnicy — stabilne łącze, szybki montaż i komfort dla domu i biura." },
  { name: "Piekary Śląskie", locative: "Piekarach Śląskich", slug: "piekary-slaskie", population: 53676, description: "Bazylika i niezawodny Internet w domu. Netia: stabilny światłowód + TV 4K, montaż w krótkim terminie." },
  { name: "Będzin", locative: "Będzinie", slug: "bedzin", population: 53586, description: "Miasto zamku i historii Zagłębia. Internet domowy Netii w Będzinie — pewne łącze, montaż nawet następnego dnia i wygodne pakiety TV 4K." },
  { name: "Ostrołęka", locative: "Ostrołęce", slug: "ostroleka", population: 51650, description: "Kurpie, Narew i solidne łącze w domu. Netia: szybki Internet + TV 4K, start bezproblemowy i wygodny." },
  { name: "Bolesławiec", locative: "Bolesławcu", slug: "boleslawiec", population: 37000, description: "Miasto ceramiki i wyjątkowego rzemiosła. Internet domowy Netii w Bolesławcu — szybka instalacja, elastyczne umowy i stabilne łącze do pracy i rozrywki." },
  { name: "Zgorzelec", locative: "Zgorzelcu", slug: "zgorzelec", population: 29800, description: "Miasto nadbrzeżne i graniczne. Internet stacjonarny Netii w Zgorzelcu — stabilna sieć światłowodowa, szybki montaż i pakiety idealne dla pracowników transgranicznych." }
];

/** Zwraca dane miasta na podstawie slugu z adresu URL, np. z /internet/[slug] */
export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}
