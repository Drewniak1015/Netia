// awarie-schema-data.ts
//
// Dane dla AwarieSchema.tsx. Treść zsynchronizowana ręcznie z tym, co
// widać w NetiaZglaszanieAwariiPomocPage.tsx (kroki TimelineStep i numery
// HotlineCard/CallButton) — jeśli zmienisz tekst kroków lub numery w
// komponencie, zaktualizuj też tutaj, żeby schema nie rozjechała się
// z widoczną treścią strony (niezgodność tekst/schema to częsty powód
// odrzucenia rich results przez Google).

export interface HowToStep {
  name: string;
  text: string;
}

export const AWARIE_STEPS: HowToStep[] = [
  {
    name: "Sprawdź urządzenie",
    text: "Sprawdź, czy problem występuje tylko na jednym urządzeniu. Jeśli tak — spróbuj ponownie połączyć się z Wi-Fi lub przetestuj inne urządzenie.",
  },
  {
    name: "Sprawdź kable i zasilanie",
    text: "Upewnij się, że router (i ONT przy światłowodzie) są podłączone, a wszystkie wtyczki dobrze osadzone.",
  },
  {
    name: "Zrestartuj sprzęt",
    text: "Odłącz router (i ONT) na 30 sekund, włącz najpierw ONT, po 60 s włącz router i odczekaj 2–3 minuty.",
  },
  {
    name: "Sprawdź diody",
    text: "PON/DSL — stała zielona = sygnał OK, miganie/czerwona/brak = problem z linią. Internet/WAN — zielona ciągła = online.",
  },
  {
    name: "Test połączenia przewodowego",
    text: "Podłącz jedno urządzenie kablem LAN do routera. Jeśli też nie działa — to nie problem z Wi-Fi.",
  },
  {
    name: "Zgłoś awarię",
    text: "Jeśli Internet nadal nie działa — zgłoś awarię. Przygotuj numer klienta lub PESEL oraz adres instalacji.",
  },
];

export interface HotlineContact {
  contactType: string;
  telephone: string;
  areaServed: string;
  availableLanguage: string[];
  hoursAvailable?: string;
}

export const AWARIE_CONTACTS: HotlineContact[] = [
  {
    contactType: "technical support",
    telephone: "+48-793-800-300",
    areaServed: "PL",
    availableLanguage: ["Polish"],
    hoursAvailable: "Mo-Su 00:00-24:00",
  },
  {
    contactType: "sales",
    telephone: "+48-883-334-124",
    areaServed: "PL",
    availableLanguage: ["Polish", "English", "Ukrainian"],
    hoursAvailable: "Mo-Su 08:00-21:00",
  },
  {
    contactType: "customer service",
    telephone: "+48-22-711-11-11",
    areaServed: "PL",
    availableLanguage: ["Polish"],
    hoursAvailable: "Mo-Su 00:00-24:00",
  },
];