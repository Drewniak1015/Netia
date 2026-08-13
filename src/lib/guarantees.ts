/* ---------------------------------------------------------------------- */
/*  lib/guarantees.ts                                                      */
/*                                                                         */
/*  JEDYNE miejsce, w którym definiujemy brzmienie gwarancji. Nie wpisuj    */
/*  tych zdań na sztywno w komponentach — termin instalacji rozjechał się   */
/*  na cztery różne liczby dokładnie dlatego, że każdy komponent trzymał    */
/*  własny string. Przy gwarancji prędkości ryzyko jest większe, bo to      */
/*  twierdzenie o charakterze prawnym.                                     */
/*                                                                         */
/*  ===== DLACZEGO TAK BRZMI GWARANCJA PRĘDKOŚCI =====                     */
/*                                                                         */
/*  50% deklarowanej prędkości to ustawowe minimum z Prawa komunikacji      */
/*  elektronicznej, czyli dokładnie ten typ zapisu, który strona krytykuje  */
/*  w sekcji "Stary sposób". Nie chowamy go, bo klient i tak znajdzie ten   */
/*  zapis w umowie — tylko później i z poczuciem oszukania (to jest wprost  */
/*  scenariusz ze skarg w researchu: "przedstawiciel obiecał światłowód,    */
/*  a dostałem starsze rozwiązanie").                                       */
/*                                                                         */
/*  Ciężar przekazu przenosimy więc na to, co realnie robimy i co jest      */
/*  sprawdzalne: mierzymy łącze, zgłaszamy problem pierwsi, pokazujemy      */
/*  zapis PRZED podpisaniem. To realizuje przekonanie #3 z beliefes.docx —  */
/*  sceptycyzm zamienia się w nadzieję tylko wtedy, gdy mechanizm jest      */
/*  weryfikowalny, nie głośniejszy.                                        */
/*                                                                         */
/*  USUNIĘTE: kafelek "100% zgłoszonej prędkości" z SocialProofStats.       */
/*  Przy umownej gwarancji 50% było to twierdzenie nieprawdziwe, nie tylko  */
/*  niespójne, i dawało się obalić w dwie sekundy przez zestawienie dwóch   */
/*  sekcji oddalonych o jeden scroll.                                      */
/*                                                                         */
/*  ROZSTRZYGNIĘTE: NIE obiecujemy obniżki rachunku za czas awarii.        */
/*  Obniżenie opłaty za okres niedziałania usługi wynika z reklamacji       */
/*  i przepisów, a nie z naszej decyzji — jako partner nie możemy tego      */
/*  ustanowić. Obiecujemy więc wyłącznie POMOC w reklamacji, bo to jest     */
/*  dokładnie to, co realnie robimy. Nie dopisuj tu obietnic finansowych    */
/*  bez pisemnego potwierdzenia od operatora.                              */
/* ---------------------------------------------------------------------- */

export const SPEED_GUARANTEE = {
  /** Nagłówek gwarancji — wszędzie identyczny. */
  title: "Prędkość mierzymy, nie deklarujemy",

  /** Wersja pełna — panele gwarancji, sekcje z miejscem na 2–3 zdania. */
  descFull:
    "Monitorujemy Twoje łącze 24/7 i sami zgłaszamy problem, zanim zdążysz zadzwonić. Umowna gwarancja to minimum 50% deklarowanej prędkości i pokażemy Ci ten zapis przed podpisaniem, nie po.",

  /** Wersja skrócona — paski zaufania, miejsca na jedno zdanie. */
  descShort:
    "Monitoring łącza 24/7. Umowne minimum 50% deklarowanej prędkości pokazujemy przed podpisaniem.",

  /** Wersja bulletowa — listy z ikonami, recapy, checklisty. */
  bullet: "Monitoring łącza 24/7, umowne minimum 50% pokazane przed podpisaniem",

  /** Wersja pod FAQ — jedyne miejsce z przestrzenią na pełne wyjaśnienie. */
  faq:
    "Monitorujemy Twoje łącze przez całą dobę, więc spadek prędkości zwykle widzimy przed Tobą i sami się odzywamy. Umowa gwarantuje minimum 50% deklarowanej prędkości, bo tyle wymaga Prawo komunikacji elektronicznej, i pokażemy Ci ten zapis przed podpisaniem, a nie dopiero przy reklamacji. Jeśli łącze nie osiąga tego poziomu, zgłoś to pod +48 793 800 300 — przygotujemy z Tobą reklamację i pomożemy odzyskać część opłaty za czas, w którym usługa nie działała zgodnie z umową.",
} as const;

/* ---------------------------------------------------------------------- */
/*  ===== TERMIN INSTALACJI — WYMAGA TWOJEJ DECYZJI =====                  */
/*                                                                         */
/*  Wzór umowy Netii (netia.pl) mówi o aktywacji usługi w terminie 21 dni   */
/*  od podpisania umowy dla sieci własnej operatora. Żadna z liczb, które   */
/*  krążyły po stronie (3 dni / następny dzień roboczy / <4 dni / 1–3 dni   */
/*  roboczych w FAQ), nie ma pokrycia w tym dokumencie.                     */
/*                                                                         */
/*  Domyślnie ustawiam wariant, który jest prawdziwy niezależnie od liczby: */
/*  obietnicę przenosimy z DŁUGOŚCI czekania na KONTROLĘ nad terminem.      */
/*  Research pokazuje, że klienci narzekają nie tyle na czekanie, co na to, */
/*  że nie wiedzą, kiedy i czy technik przyjdzie.                          */
/*                                                                         */
/*  Jeśli masz własne dane z realizacji (mediana, n, okres), podmień na     */
/*  wariant z liczbą i dopisz źródło — liczba sprawdzalna bije obietnicę.   */
/* ---------------------------------------------------------------------- */

export const INSTALL_TIMING = {
  bullet: "Termin instalacji wybierasz sam, potwierdzamy go SMS-em",
  short: "Termin montażu ustalasz z technikiem, potwierdzamy go SMS-em.",
  faq:
    "Termin montażu ustalasz indywidualnie — potwierdzamy go SMS-em, a instalator dzwoni dzień wcześniej. Umowa przewiduje uruchomienie usługi w terminie do 21 dni od podpisania, w praktyce zwykle jest to znacznie szybciej. Sama instalacja w lokalu trwa około 1,5 godziny: technik podłącza światłowód, konfiguruje router i dekoder, sprawdza prędkość i pokazuje aplikację Netia GO. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
} as const;

/** Serwis to obietnica ROZŁĄCZNA od instalacji — nie mieszaj ich w jednym zdaniu. */
export const SERVICE_SLA = {
  bullet: "Serwisant na miejscu w 24 h od zgłoszenia",
  short: "Serwisant na miejscu w 24 h od zgłoszenia awarii.",
} as const;

/* ---------------------------------------------------------------------- */
/*  ===== TECHNOLOGIA POD ADRESEM =====                                    */
/*                                                                         */
/*  Strona sprzedaje ofertę pod adresami, pod którymi technologia bywa      */
/*  różna (FTTH, HFC, w części przypadków rozwiązania mobilne). Do tej      */
/*  pory mówiła jednocześnie "sieć światłowodowa od podstaw" ORAZ "każde    */
/*  łącze, światłowodowe, kablowe czy mobilne" — dwa zdania oddalone        */
/*  o jeden scroll, które się wykluczają.                                  */
/*                                                                         */
/*  Sceptyczny klient wyłapuje to w kilka sekund, a odkrycie #19            */
/*  z researchu mówi wprost, że lęk przed "światłowodem, który okazuje się  */
/*  hybrydą" jest realny i mocno emocjonalny ("kupienie kota w worku",      */
/*  "przedstawiciel obiecał światłowód, a dostałem starsze rozwiązanie").   */
/*                                                                         */
/*  Rozwiązanie: nie udajemy, że wszędzie jest FTTH. Zamiast tego robimy    */
/*  z ujawnienia technologii ATUT — jesteśmy jedynymi, którzy mówią to      */
/*  PRZED podpisaniem, a nie w dniu montażu. To ta sama logika, co przy     */
/*  gwarancji prędkości: przewagą nie jest sam parametr, tylko moment,      */
/*  w którym klient poznaje prawdę.                                        */
/* ---------------------------------------------------------------------- */

export const TECH_DISCLOSURE = {
  bullet: "Technologię pod Twoim adresem podajemy przed umową, nie w dniu montażu",
  short:
    "Pod Twoim adresem sprawdzamy, jaka technologia jest realnie dostępna, i mówimy to wprost przed podpisaniem umowy.",
  faq:
    "Nie każdy adres w Polsce ma doprowadzone włókno i nie zamierzamy udawać, że jest inaczej. Podczas sprawdzania dostępności weryfikujemy, jaka technologia jest realnie dostępna pod Twoim adresem (FTTH, HFC lub inna), i podajemy ją wprost, zanim cokolwiek podpiszesz. Jeśli to nie jest światłowód doprowadzony do mieszkania, dowiesz się tego od nas, a nie od technika w dniu montażu. Prędkości maksymalne zależą od technologii, dlatego ostateczny wariant oferty potwierdzamy dopiero po sprawdzeniu adresu.",
} as const;

/* ---------------------------------------------------------------------- */
/*  ===== KTO CO OBIECUJE: OPERATOR vs PARTNER =====                       */
/*                                                                         */
/*  Strona miesza dwa podmioty i dwa poziomy obietnic:                     */
/*                                                                         */
/*    NETIA (operator)  — sieć, technologia, umowa abonencka, baza         */
/*                        2,4 mln klientów, parametry usługi, serwis.      */
/*    PARTNER (my)      — doradztwo, kontakt, prowadzenie sprzedaży,       */
/*                        pomoc w formalnościach i reklamacji.             */
/*                                                                         */
/*  Do tej pory gwarancje szły w pierwszej osobie ("my monitorujemy",      */
/*  "oddzwaniamy w 3 minuty") tuż obok statystyk operatorskich, a stopka   */
/*  mówiła "autoryzowany partner". Klient nie wie, kto za co odpowiada,    */
/*  a to jest jednocześnie problem zaufania i ryzyko prawne: za własne     */
/*  materiały reklamowe odpowiada partner (art. 5 ustawy o przeciwdziałaniu*/
/*  nieuczciwym praktykom rynkowym).                                       */
/*                                                                         */
/*  Zasada redakcyjna: liczba operatorska ZAWSZE z nazwą operatora         */
/*  ("2,4 mln klientów Netii"), nigdy w pierwszej osobie ("nasze 2,4 mln", */
/*  "pyta nas 2,4 mln klientów"). Obietnice partnerskie zostają w pierwszej*/
/*  osobie, bo je realnie dowozimy.                                        */
/* ---------------------------------------------------------------------- */

export const ATTRIBUTION = {
  /** Krótka nota pod statystykami operatorskimi. */
  statsNote:
    "Dane dotyczą sieci Netia. Twoją ofertą, umową i kontaktem zajmuje się autoryzowany partner Netii.",
  /** Wersja jednozdaniowa do stopki sekcji i paneli kontaktowych. */
  advisorNote:
    "Jesteśmy autoryzowanym partnerem Netii. Usługę świadczy Netia S.A., my prowadzimy sprzedaż, doradztwo i obsługę Twojego zgłoszenia.",
} as const;

/* ---------------------------------------------------------------------- */
/*  ===== OCENA 4.8/5 — USUNIĘTA ZE STRONY =====                           */
/*                                                                         */
/*  Na stronie stało "4.8/5 od 2,4 mln klientów po zmianie dostawcy"       */
/*  oraz kafelek "4.8/5 / średnia ocena od realnych klientów".             */
/*  Ani jedno, ani drugie nie miało źródła: nie wiadomo było, na jakiej     */
/*  platformie te oceny są, ile ich jest i kogo dotyczą. Pierwsze zdanie    */
/*  dodatkowo sklejało dwie niepowiązane liczby i czytało się jako          */
/*  "2,4 mln osób wystawiło ocenę 4.8" — twierdzenie nie do obrony.        */
/*                                                                         */
/*  Ocena bez źródła to wciąż głos firmy o samej sobie, czyli dokładnie    */
/*  to, czego belief #5 z beliefes.docx zabrania: dowód musi być niesiony  */
/*  przez coś POZA firmą. Dlatego oba wystąpienia usunięte, a nie          */
/*  poprawione.                                                            */
/*                                                                         */
/*  JEŚLI kiedyś zbierzecie oceny (Google Business, Trustpilot, opinie     */
/*  na PanWybierak), wróćcie tu i dodajcie stałą z trzema polami:          */
/*  wartość + nazwa platformy + liczba opinii, najlepiej z linkiem.        */
/*  Bez wszystkich trzech nie publikujcie oceny na stronie.                */
/* ---------------------------------------------------------------------- */