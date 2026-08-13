/* ---------------------------------------------------------------------- */
/*  homeReviewsData.ts                                                     */
/*                                                                         */
/*  UWAGA — POPRZEDNIA ZAWARTOŚĆ TEGO PLIKU ZOSTAŁA USUNIĘTA.              */
/*  Znajdowały się tu trzy opinie, które nie pochodziły od realnych         */
/*  klientów. Publikowanie zmyślonych opinii konsumenckich jest praktyką    */
/*  nieuczciwą w każdych okolicznościach. Niezależnie od przepisów: strona, */
/*  której teza brzmi "inni obiecują, my mówimy prawdę", nie może stać na   */
/*  wymyślonych cytatach — jeden zdemaskowany przewraca wszystkie pozostałe */
/*  argumenty.                                                             */
/*                                                                         */
/*  ===== JAK UZUPEŁNIĆ =====                                              */
/*                                                                         */
/*  1. Zadzwoń do klientów, których faktycznie obsłużyłeś. Zapytaj, co się  */
/*     zmieniło po przejściu i czy zgadzają się na publikację.             */
/*  2. Spisz to, co powiedzieli. Nie wygładzaj — konkret ("dzieciaki        */
/*     przestały krzyczeć, że im się tnie") działa lepiej niż ogólnik       */
/*     ("polecam, wszystko super").                                        */
/*  3. Wypełnij wpis poniżej. `text` to jedyne pole, które musi być         */
/*     dosłownym cytatem.                                                  */
/*  4. Zapisz gdzieś zgodę (mail, SMS, nagranie) — przy opiniach            */
/*     konsumenckich trzeba umieć wykazać, że pochodzą od osób, które       */
/*     faktycznie skorzystały z usługi.                                    */
/*                                                                         */
/*  ===== ZABEZPIECZENIE =====                                             */
/*                                                                         */
/*  Wpisy z `text` równym PLACEHOLDER_TEXT NIE renderują się na stronie.    */
/*  Jeśli wszystkie są niewypełnione, sekcja opinii w ogóle się nie         */
/*  pokazuje, a jej miejsce zajmuje oś czasu procesu serwisowego.          */
/*  Nie usuwaj tego mechanizmu i nie podmieniaj PLACEHOLDER_TEXT na pusty   */
/*  string, żeby "odblokować" wyświetlanie.                                */
/*                                                                         */
/*  ===== ZDJĘCIA =====                                                    */
/*                                                                         */
/*  Świadomie BEZ zdjęć. Kółko z inicjałami czyta się jak zwykła            */
/*  anonimizacja, której czytelnik się spodziewa. Zdjęcie ze stocka czyta   */
/*  się jak coś dobranego, żeby wyglądało wiarygodniej, a wyszukiwarka      */
/*  obrazem demaskuje je w kilka sekund — w sekcji, której jedynym          */
/*  zadaniem jest budowanie zaufania, brak elementu jest bezpieczniejszy    */
/*  niż element podejrzany.                                                */
/*                                                                         */
/*  WYJĄTEK: jeśli klient zgodzi się na PRAWDZIWE zdjęcie i pełne imię,     */
/*  taka jedna opinia jest warta więcej niż trzy anonimowe. Warto pytać.    */
/* ---------------------------------------------------------------------- */

export const PLACEHOLDER_TEXT = "UZUPEŁNIJ PRAWDZIWĄ OPINIĄ PRZED PUBLIKACJĄ";

export type Review = {
  /** Inicjały do awatara, np. "TW". Generowane automatycznie, jeśli puste. */
  initials?: string;
  /** Podpis pod opinią. Rekomendowane: inicjały z kropkami, np. "Tomasz W.". */
  name: string;
  /** Miasto. Pomaga w wiarygodności, jest neutralne dla prywatności. */
  city: string;
  /** Miesiąc i rok, np. "czerwiec 2026". Nie podawaj dziennej daty. */
  date: string;
  /** DOSŁOWNY cytat klienta. Nie parafrazuj, nie wygładzaj. */
  text: string;
  /** Pakiet, np. "Internet 600 Mb/s". Opcjonalne. */
  pakiet?: string;
  /**
   * Konkretna liczba z obsługi tego klienta, np. "Zgłoszenie 20:14 → naprawa 20:47".
   * Wpisuj TYLKO jeśli masz to w systemie. Zmyślony timestamp jest gorszy
   * niż jego brak, bo wygląda na dowód.
   */
  stat?: string;
};

export const REVIEWS: Review[] = [
  {
    name: "",
    city: "",
    date: "",
    text: PLACEHOLDER_TEXT,
  },
  {
    name: "",
    city: "",
    date: "",
    text: PLACEHOLDER_TEXT,
  },
  {
    name: "",
    city: "",
    date: "",
    text: PLACEHOLDER_TEXT,
  },
];

/** Opinie gotowe do publikacji — tylko wypełnione wpisy. */
export const PUBLISHABLE_REVIEWS = REVIEWS.filter(
  (r) => r.text.trim() !== "" && r.text !== PLACEHOLDER_TEXT && r.name.trim() !== ""
);

/** Inicjały z imienia i nazwiska, gdy pole `initials` nie zostało podane. */
export function getInitials(review: Review): string {
  if (review.initials) return review.initials.toUpperCase();
  return review.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .replace(/[^A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]/gi, "")
    .slice(0, 2)
    .toUpperCase();
}