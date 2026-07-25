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
     text: "Płaciłem coraz więcej za coraz gorszy internet — i nikt mi nie powiedział, dlaczego. Przez trzy lata cena rosła co pół roku, aż w końcu dostałem SMS o kolejnej podwyżce — i to był ten moment. Zadzwoniłem do Netii, umowa gotowa w kilka dni, żadnych ukrytych kosztów. Dziś wiem dokładnie, ile zapłacę — nie tylko teraz, ale za pół roku i za rok.",
  },
{
  initials: "KD",
  name: "Kamila D.",
  age: 33,
  city: "Gdańsk",
  date: "maj 2026",
  text: "Pracuję zdalnie i mam spotkania online codziennie o 9 rano — nie mogę sobie pozwolić, żeby internet 'akurat teraz' odmówił posłuszeństwa. Zgłosiłam awarię w niedzielę wieczorem, spodziewając się czekać do poniedziałku. Serwis oddzwonił w kilkanaście minut i internet działał, zanim poszłam spać.",
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