import { CITIES, City } from "./cities";

/**
 * Dobiera "pobliskie miasta" do sekcji linkowania wewnętrznego na dole strony.
 *
 * UWAGA: to NIE jest prawdziwa bliskość geograficzna — CITIES nie ma
 * współrzędnych. Na razie bierzemy inne największe miasta (po populacji),
 * pomijając bieżące. Jeśli kiedyś dojdą współrzędne / województwo do City,
 * podmień to na realne sąsiedztwo (np. najbliższe km lub to samo województwo).
 */
export function getNearbyCities(currentSlug: string, count = 6): City[] {
  return CITIES
    .filter((c) => c.slug !== currentSlug)
    .sort((a, b) => b.population - a.population)
    .slice(0, count);
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Generuje standardowy zestaw pytań FAQ dla strony miasta, podstawiając
 * odmienioną nazwę (miejscownik). Odpowiedzi są celowo ogólne/bezpieczne
 * (nie podają konkretnych cen na sztywno) — jeśli chcesz cen z description,
 * podmień treść odpowiedzi 1 i 5 na wyciąg z city.description.
 */
export function generateCityFaq(city: City): FaqItem[] {
  const w = city.locative; // np. "Kielcach"

  return [
    {
      question: `Ile kosztuje Internet Netia w ${w}?`,
      answer: `Ceny zależą od wybranej prędkości i tego, czy dodajesz telewizję. W ${w} pakiety zaczynają się od 40 zł/mies. za Internet z TV, a same łącza o wyższych prędkościach są dostępne w aktualnych promocjach — sprawdź szczegóły w konfiguratorze ofert.`,
    },
    {
      question: `Czy w ${w} jest dostępny światłowód Netia?`,
      answer: `Tak — sieć światłowodowa PON pokrywa większość popularnych dzielnic i osiedli w ${w}. Dokładną dostępność pod konkretnym adresem sprawdzisz w konfiguratorze ofert lub dzwoniąc pod +48 883 334 124.`,
    },
    {
      question: `Ile wynosi opłata aktywacyjna Netii w ${w}?`,
      answer: `Opłata aktywacyjna jest doliczana do pierwszej faktury i zależy od wybranego pakietu (Internet i/lub Telewizja). Aktualną wysokość zobaczysz przy konkretnej ofercie przed podpisaniem umowy.`,
    },
    {
      question: `Jak długo trwa instalacja Netii w ${w}?`,
      answer: `Montaż standardowo odbywa się w 1–3 dni robocze od złożenia zamówienia, w terminie dogodnym dla Ciebie.`,
    },
    {
      question: `Jakie prędkości światłowodu są dostępne w ${w}?`,
      answer: `W zależności od adresu dostępne są prędkości od 300 Mb/s do 2 Gb/s. Dokładną maksymalną prędkość pod Twoim adresem pokaże konfigurator ofert.`,
    },
    {
      question: `W których dzielnicach ${city.name} działa Netia?`,
      answer: `Netia obsługuje większość popularnych dzielnic i osiedli — pełną listę znajdziesz w sekcji „Dzielnice obsługiwane” niżej na tej stronie.`,
    },
    {
      question: `Na jaki okres można podpisać umowę Netii w ${w}?`,
      answer: `Do wyboru są umowy 24-, 12- lub 9-miesięczne — ta ostatnia sprawdza się przy wynajmie krótkoterminowym lub w cyklu akademickim.`,
    },
    {
      question: `Co zrobić w razie awarii Internetu Netia w ${w}?`,
      answer: `Zgłoś awarię przez formularz „Zgłoś Awarię” w serwisie lub zadzwoń pod +48 883 334 124 — konsultant pomoże zdalnie lub umówi wizytę technika.`,
    },
  ];
}
