export interface City {
  /** Mianownik – forma podstawowa, np. "Warszawa" */
  name: string;
  /** Miejscownik – forma po "w/we", np. "Warszawie", używana w H1 i meta danych */
  locative: string;
  /** Slug do adresu URL, np. "warszawa", "zielona-gora" */
  slug: string;
  population: number;
}

export const CITIES: City[] = [
  { name: "Warszawa", locative: "Warszawie", slug: "warszawa", population: 1862402 },
  { name: "Kraków", locative: "Krakowie", slug: "krakow", population: 807644 },
  { name: "Wrocław", locative: "Wrocławiu", slug: "wroclaw", population: 675531 },
  { name: "Łódź", locative: "Łodzi", slug: "lodz", population: 648711 },
  { name: "Poznań", locative: "Poznaniu", slug: "poznan", population: 536818 },
  { name: "Gdańsk", locative: "Gdańsku", slug: "gdansk", population: 499039 },
  { name: "Szczecin", locative: "Szczecinie", slug: "szczecin", population: 398213 },
  { name: "Bydgoszcz", locative: "Bydgoszczy", slug: "bydgoszcz", population: 352008 },
  { name: "Lublin", locative: "Lublinie", slug: "lublin", population: 341245 },
  { name: "Katowice", locative: "Katowicach", slug: "katowice", population: 331098 },
  { name: "Białystok", locative: "Białymstoku", slug: "bialystok", population: 291352 },
  { name: "Częstochowa", locative: "Częstochowie", slug: "czestochowa", population: 271806 },
  { name: "Radom", locative: "Radomiu", slug: "radom", population: 235417 },
  { name: "Toruń", locative: "Toruniu", slug: "torun", population: 224439 },
  { name: "Kielce", locative: "Kielcach", slug: "kielce", population: 215662 },
  { name: "Rzeszów", locative: "Rzeszowie", slug: "rzeszow", population: 214527 },
  { name: "Gliwice", locative: "Gliwicach", slug: "gliwice", population: 192882 },
  { name: "Olsztyn", locative: "Olsztynie", slug: "olsztyn", population: 176257 },
  { name: "Zabrze", locative: "Zabrzu", slug: "zabrze", population: 169440 },
  { name: "Bytom", locative: "Bytomiu", slug: "bytom", population: 154636 },
  { name: "Zielona Góra", locative: "Zielonej Górze", slug: "zielona-gora", population: 140593 },
  { name: "Ruda Śląska", locative: "Rudzie Śląskiej", slug: "ruda-slaska", population: 135884 },
  { name: "Tychy", locative: "Tychach", slug: "tychy", population: 128991 },
  { name: "Dąbrowa Górnicza", locative: "Dąbrowie Górniczej", slug: "dabrowa-gornicza", population: 124663 },
  { name: "Elbląg", locative: "Elblągu", slug: "elblag", population: 118501 },
  { name: "Płock", locative: "Płocku", slug: "plock", population: 114093 },
  { name: "Opole", locative: "Opolu", slug: "opole", population: 107821 },
  { name: "Gdynia", locative: "Gdyni", slug: "gdynia", population: 106580 },
  { name: "Tarnów", locative: "Tarnowie", slug: "tarnow", population: 96233 },
  { name: "Wałbrzych", locative: "Wałbrzychu", slug: "walbrzych", population: 91044 },
];

/** Zwraca dane miasta na podstawie slugu z adresu URL, np. z /internet/[slug] */
export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}