export type Review = {
  initials: string;
  name: string;
  age: number;
  city: string;
  date: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    initials: "TW",
    name: "Tomasz W.",
    age: 47,
    city: "Poznań",
    date: "czerwiec 2026",
    text: "Dostałem SMS o kolejnej podwyżce od dotychczasowego operatora i tyle mi wystarczyło. U Netii cena w umowie to cena, którą płacę — bez niespodzianek co pół roku.",
  },
  {
    initials: "KD",
    name: "Kamila D.",
    age: 33,
    city: "Gdańsk",
    date: "maj 2026",
    text: "Pracuję zdalnie i prowadzę spotkania online codziennie — nie mogę sobie pozwolić na to, żeby internet 'akurat teraz' odmówił posłuszeństwa. Od kiedy mam Netię, po prostu o tym nie myślę.",
  },
  {
    initials: "RJ",
    name: "Rafał J.",
    age: 41,
    city: "Łódź",
    date: "kwiecień 2026",
    text: "U poprzedniego operatora awaria potrafiła trwać kilka dni, a infolinia odsyłała mnie z kwitkiem. Przy Netii jeszcze nie miałem sytuacji, żebym został bez pomocy dłużej niż kilka godzin.",
  },
];