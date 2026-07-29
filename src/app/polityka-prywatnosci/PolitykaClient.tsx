"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Polityka Prywatności — Netia S.A.
 *
 * Next.js (App Router) + Tailwind CSS. Zależy wyłącznie od Reacta —
 * kolory zdefiniowane inline jako klasy arbitralne Tailwind (bg-[#...]),
 * więc nie wymaga rozszerzania tailwind.config.
 *
 * WERSJA 7 — uproszczono opis narzędzi do faktycznie wykorzystywanego
 * zestawu: WYŁĄCZNIE Meta Pixel oraz Meta Conversions API (server-side).
 * Usunięto wzmianki o narzędziach, z których serwis nie korzysta
 * (Google Analytics 4 / Google Tag Manager, Microsoft Clarity, Bing
 * Webmaster Tools, IndexNow, CookieYes) — wymienianie w polityce
 * narzędzi, których faktycznie się nie używa, jest samo w sobie
 * niezgodne z zasadą rzetelności/przejrzystości (art. 5 ust. 1 lit. a
 * RODO), niezależnie od tego czy dane narzędzie wygląda "bezpieczniej".
 *
 * Zmiany oznaczone komentarzem [ZMIANA V7]:
 *  - Sekcja 03: kategorie cookies uproszczone do dwóch (wymagane,
 *    marketingowe); usunięta sekcja "Narzędzia zewnętrznych dostawców";
 *    sekcja "Narzędzia marketingowe" rozszerzona o Meta Conversions API
 *    (server-side) obok Meta Pixel (client-side).
 *  - Sekcja 04: doprecyzowano podstawę prawną marketingu (Pixel + CAPI).
 *  - Sekcja 05: okres przechowywania odniesiony do Pixel + CAPI.
 *  - Sekcja 11: log zmian zaktualizowany.
 *
 * UWAGA PRAWNA: to wersja robocza — przed wdrożeniem na produkcję
 * zalecana jest weryfikacja przez prawnika lub dział compliance (Claude
 * nie jest prawnikiem). Sam dokument nie wystarczy: Meta Pixel i
 * Conversions API muszą być technicznie zablokowane/nieaktywne do
 * czasu, aż Użytkownik zaakceptuje kategorię "Marketing" w bannerze
 * cookies (patrz TODO w sekcji 03) — w przypadku Conversions API
 * dotyczy to również wysyłki danych po stronie serwera, nie tylko
 * pliku cookie w przeglądarce.
 *
 * WAŻNE: `pt-26` na głównym wrapperze strony jest celowe — strona ma stały
 * (fixed) górny pasek nawigacji, który bez tego odstępu zachodziłby na
 * treść tej podstrony. Jeśli u Ciebie navbar ma inną wysokość, dopasuj tę
 * wartość zamiast usuwać.
 *
 * Użycie:
 *   app/polityka-prywatnosci/page.tsx
 *   -> import PolitykaPrywatnosci from "@/components/PolitykaPrywatnosci";
 *   -> export default function Page() { return <PolitykaPrywatnosci />; }
 */

// ---------------------------------------------------------------------------
// Design tokens — te same co na stronach Pomoc, dla spójności palety
// ---------------------------------------------------------------------------

const c = {
  card: "rgb(19, 55, 78)",
  cardAlt: "rgb(24, 66, 92)",
  border: "rgba(255,255,255,.08)",
  borderStrong: "rgba(255,255,255,.16)",
  tealDim: "rgba(45,217,196,.14)",
  tealBorder: "rgba(45,217,196,.3)",
};

// ---------------------------------------------------------------------------
// Dane treści
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  number: string;
  title: string;
  body: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "definicje",
    number: "01",
    title: "Definicje",
    body: (
      <dl className="space-y-3">
        <div>
          <dt className="font-semibold text-[15px] text-white">
            Administrator
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Jarosław Sitek, Autoryzowany Partner Netia S.A. (przedstawiciel
            handlowy), ul. Targowa 38/38, 90-043 Łódź.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">
            Dane osobowe
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Wszystkie informacje o osobie fizycznej zidentyfikowanej lub
            możliwej do zidentyfikowania poprzez jeden bądź kilka szczególnych
            czynników określających fizyczną, fizjologiczną, genetyczną,
            psychiczną, ekonomiczną, kulturową lub społeczną tożsamość — w
            tym, jeśli pozwalają na identyfikację Użytkownika, IP urządzenia,
            dane o lokalizacji, identyfikator internetowy oraz informacje
            gromadzone za pośrednictwem plików cookie i innych podobnych
            technologii.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">
            Polityka Prywatności
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Niniejsza Polityka Prywatności.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">RODO</dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z
            dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
            związku z przetwarzaniem danych osobowych i w sprawie swobodnego
            przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne
            rozporządzenie o ochronie danych).
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">Serwis</dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Serwis internetowy prowadzony przez Administratora bądź podmiot
            działający w jego imieniu (Autoryzowany Partner) pod adresem{" "}
            <a
              href="https://www.swiatlowod-netia-oferta.pl"
              className="text-teal-300 underline decoration-teal-300/30 underline-offset-2 hover:decoration-teal-300"
            >
              www.swiatlowod-netia-oferta.pl
            </a>
            .
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">
            Użytkownik
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Każda osoba fizyczna odwiedzająca Serwis lub korzystająca z jednej
            albo kilku usług czy funkcjonalności Serwisu.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[15px] text-white">
            Partner reklamowy
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Meta Platforms Ireland Limited (Facebook, Instagram) — jedyny
            podmiot, któremu Administrator powierza przetwarzanie danych w
            celach marketingowych za pośrednictwem narzędzi Meta Pixel oraz
            Meta Conversions API.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: "przetwarzanie",
    number: "02",
    title: "Przetwarzanie danych w związku z korzystaniem z Serwisu",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Polityka Prywatności opisuje zasady wykorzystania plików cookie lub
          innych podobnych technologii oraz zasady przetwarzania danych
          osobowych gromadzonych podczas korzystania z Serwisu przez
          Użytkownika.
        </p>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          W związku z korzystaniem przez Użytkownika z Serwisu, Administrator
          zbiera jego dane w zakresie niezbędnym do świadczenia poszczególnych
          oferowanych usług, a także informacje o aktywności Użytkownika w
          Serwisie, w tym IP urządzenia, dane o lokalizacji, identyfikator
          internetowy oraz informacje gromadzone za pośrednictwem plików
          cookie oraz innych podobnych technologii. Pliki cookie oraz podobne
          technologie nie służą identyfikacji Użytkownika i na ich podstawie
          nie jest ustalana tożsamość Użytkownika. W połączeniu z innymi
          unikatowymi identyfikatorami mogą jednak stanowić dane osobowe.
        </p>
        <p className="text-[15px] leading-relaxed text-white/65">
          Korzystanie z Serwisu jest możliwe bez konieczności zakładania
          konta przez Użytkownika. W takim przypadku korzystanie z Serwisu
          nie wymaga podania danych osobowych w formularzu rejestracyjnym.
          Przetwarzane dane obejmują informacje o korzystaniu z Serwisu.
        </p>
      </>
    ),
  },
  {
    id: "cookie",
    number: "03",
    title: "Pliki cookie oraz podobne technologie",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          W związku z korzystaniem z Serwisu wykorzystywane są pliki cookie
          lub podobne technologie w celu zapewnienia Użytkownikowi dostępu do
          Serwisu i usprawniania jego działania.
        </p>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Pliki cookie to małe pliki tekstowe zapisywane w telekomunikacyjnym
          urządzeniu końcowym Użytkownika (komputer, telefon, tablet itp.), w
          czasie korzystania z Serwisu. Podobne do cookie technologie to m.in.
          local storage, session storage oraz service workers.
        </p>

        <h3 className="mt-6 mb-3 text-[15px] font-bold text-teal-300">
          Czas życia plików cookie
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            <strong className="text-white">Sesyjne</strong> —
            przechowywane w urządzeniu Użytkownika do czasu zakończenia
            sesji.
          </li>
          <li>
            <strong className="text-white">Stałe</strong> — przechowywane
            do czasu ich usunięcia przez Użytkownika albo do czasu
            wygaśnięcia pliku cookie określonego w jego specyfikacji.
          </li>
        </ul>

        {/* [ZMIANA V7] — kategorie uproszczone do dwóch: wymagane i marketingowe */}
        <h3 className="mt-6 mb-3 text-[15px] font-bold text-teal-300">
          Cele wykorzystania
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            <strong className="text-white">Cookie wymagane</strong>,
            niezbędne do korzystania z serwisu: pliki z danymi wprowadzanymi
            przez Użytkownika, uwierzytelniające pliki cookie, pliki
            służące do zapewnienia bezpieczeństwa Serwisu, a także plik
            cookie zapamiętujący dokonany przez Użytkownika wybór w
            zakresie zgody na cookies (nazwa: „netia_cookie_consent”),
            dzięki któremu baner zgody nie pojawia się przy każdej wizycie.
          </li>
          <li>
            <strong className="text-white">Cookie marketingowe</strong>,
            wykorzystywane wyłącznie za pośrednictwem narzędzi Meta (Meta
            Pixel oraz Meta Conversions API) do wyświetlania
            spersonalizowanych reklam oraz pomiaru ich skuteczności — patrz
            „Narzędzia marketingowe” poniżej. Instalowane i uruchamiane
            wyłącznie po wyrażeniu zgody.
          </li>
        </ul>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Użytkownik może w każdej chwili zmienić ustawienia plików cookie
          poprzez zmianę ustawień prywatności w przeglądarce bądź aplikacji, z
          zastrzeżeniem że zmiana ta może spowodować brak dostępu do
          niektórych funkcji Serwisu.
        </p>

        {/* [ZMIANA V7] — jedyna sekcja narzędzi zewnętrznych: tylko Meta */}
        <h3 className="mt-6 mb-3 text-[15px] font-bold text-teal-300">
          Narzędzia marketingowe
        </h3>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Administrator nie korzysta z żadnych narzędzi analitycznych ani
          statystycznych podmiotów trzecich innych niż wskazane poniżej.
          Poniższe narzędzia są uruchamiane wyłącznie po wyrażeniu zgody
          Użytkownika na kategorię{" "}
          <strong className="text-white">„Marketing”</strong> w panelu
          zarządzania zgodami na pliki cookie:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            <strong className="text-white">Meta Pixel</strong> (Meta
            Platforms Ireland Limited) — fragment kodu instalowany po
            stronie przeglądarki Użytkownika, wykorzystywany do pomiaru
            skuteczności kampanii reklamowych prowadzonych na Facebooku i
            Instagramie, tworzenia grup odbiorców podobnych (lookalike) oraz
            remarketingu, tj. wyświetlania Użytkownikowi reklam dopasowanych
            do jego wcześniejszej aktywności w Serwisie. Dane przekazywane w
            ramach tego narzędzia mogą obejmować identyfikatory urządzenia,
            adres IP oraz informacje o odwiedzonych podstronach i działaniach
            podjętych w Serwisie (np. wypełnienie formularza kontaktowego).
          </li>
          <li>
            <strong className="text-white">Meta Conversions API</strong>{" "}
            (Meta Platforms Ireland Limited) — uzupełniające narzędzie
            działające po stronie serwera Administratora, przesyłające do
            Meta te same lub zbliżone zdarzenia co Meta Pixel (np. wysłanie
            formularza), niezależnie od ustawień blokowania cookies lub
            skryptów w przeglądarce Użytkownika. W ramach tego mechanizmu
            mogą być przekazywane zahaszowane (nieodwracalnie zaszyfrowane)
            dane kontaktowe Użytkownika, takie jak adres e-mail lub numer
            telefonu, o ile zostały podane w Serwisie, w celu dopasowania
            zdarzenia do konta reklamowego bez ujawniania Meta danych w
            postaci jawnej.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-white/65">
          Cookie i mechanizmy marketingowe opisane powyżej są uruchamiane
          wyłącznie po uzyskaniu zgody Użytkownika. Wycofanie zgody możliwe
          jest w dowolnym momencie poprzez ponowne otwarcie panelu zgód
          (link „Zmień ustawienia cookies” w stopce Serwisu) lub poprzez
          usunięcie plików cookie w ustawieniach przeglądarki, co nie
          wpływa na zgodność z prawem przetwarzania dokonanego przed
          wycofaniem zgody. Wycofanie zgody nie wpływa na zdarzenia
          przesłane do Meta Conversions API przed jej wycofaniem.
        </p>
      </>
    ),
  },
  {
    id: "cele",
    number: "04",
    title: "Cele oraz podstawy prawne przetwarzania danych",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Administrator przetwarza dane osobowe Użytkowników w celu:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            zapewnienia dostępu do serwisu — art. 6 ust. 1 lit. b RODO;
          </li>
          <li>
            wykonywania obowiązków wynikających z przepisów prawa — art. 6
            ust. 1 lit. c RODO;
          </li>
          <li>
            realizacji prawnie uzasadnionych interesów Administratora lub
            strony trzeciej — art. 6 ust. 1 lit. f RODO, w tym: wykrywanie i
            eliminowanie nadużyć oraz cele wewnętrzne związane ze
            świadczeniem usług i prowadzeniem działalności gospodarczej.
          </li>
          {/* [ZMIANA V7] */}
          <li>
            prowadzenia działań marketingowych, w tym wyświetlania
            spersonalizowanych reklam oraz mierzenia ich skuteczności za
            pośrednictwem Meta Pixel i Meta Conversions API na Facebooku i
            Instagramie — art. 6 ust. 1 lit. a RODO, tj. na podstawie
            dobrowolnej zgody Użytkownika wyrażonej poprzez baner cookies.
            Zgoda może zostać wycofana w każdym czasie, co pozostaje bez
            wpływu na zgodność z prawem przetwarzania dokonanego przed jej
            wycofaniem.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "okres",
    number: "05",
    title: "Okres przetwarzania danych osobowych",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Dane osobowe będą przetwarzane przez okres:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            przewidziany dla realizacji obowiązków wynikających z przepisów
            prawa dotyczących obronności, bezpieczeństwa państwa oraz
            bezpieczeństwa i porządku publicznego, a także z przepisów
            podatkowych i rachunkowych;
          </li>
          <li>
            przez okres przedawnienia roszczeń oraz do zakończenia
            postępowań cywilnych, egzekucyjnych, administracyjnych i karnych
            wymagających przetwarzania danych, a w przypadku zgody — do
            czasu realizacji jej celu lub odwołania, w zależności co nastąpi
            wcześniej;
          </li>
          {/* [ZMIANA V7] */}
          <li>
            w przypadku danych przetwarzanych na podstawie zgody na cookie
            marketingowe (Meta Pixel oraz Meta Conversions API) — przez
            okres wskazany w bieżącej dokumentacji Meta dla poszczególnych
            plików cookie i zdarzeń (standardowo do 90 dni w przypadku
            plików cookie _fbp/_fbc) lub do czasu wycofania zgody przez
            Użytkownika, w zależności co nastąpi wcześniej;
          </li>
          <li>
            plik cookie „netia_cookie_consent”, zapamiętujący dokonany
            przez Użytkownika wybór w zakresie zgody na cookies, jest
            przechowywany przez 180 dni (6 miesięcy), po czym Użytkownik
            zostanie poproszony o ponowne podjęcie decyzji.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-white/65">
          Użytkownik może samodzielnie usunąć pliki cookie ze swojego
          urządzenia, czyszcząc pamięć podręczną i pliki cookie w ustawieniach
          przeglądarki. Ustawienia mogą się różnić w zależności od
          przeglądarki i jej wersji. Usunięcie plików cookie skutkuje
          usunięciem ustawień Serwisu.
        </p>
      </>
    ),
  },
  {
    id: "uprawnienia",
    number: "06",
    title: "Uprawnienia użytkownika",
    body: (
      <p className="text-[15px] leading-relaxed text-white/65">
        Użytkownik może złożyć skargę dotyczącą przetwarzania danych
        osobowych do organu nadzorczego zajmującego się ochroną danych
        osobowych. W Rzeczpospolitej Polskiej organem nadzorczym jest Prezes
        Urzędu Ochrony Danych Osobowych.
      </p>
    ),
  },
  {
    id: "odbiorcy",
    number: "07",
    title: "Odbiorcy danych",
    body: (
      <p className="text-[15px] leading-relaxed text-white/65">
        Dane osobowe Użytkowników mogą być przekazywane następującym
        kategoriom odbiorców: Netia S.A. z siedzibą w Warszawie — w zakresie
        niezbędnym do realizacji zamówień na usługi Netii składanych za
        pośrednictwem Serwisu, podmiotom świadczącym Administratorowi usługi
        niezbędne do realizacji celów przetwarzania (np. hosting Serwisu),
        podmiotom uprawnionym na podstawie przepisów prawa, a także —
        wyłącznie w zakresie danych przetwarzanych za pośrednictwem Meta
        Pixel i Meta Conversions API — Meta Platforms Ireland Limited, 4
        Grand Canal Square, Grand Canal Harbour, Dublin 2, Irlandia
        (Facebook, Instagram).
      </p>
    ),
  },
  {
    id: "eog",
    number: "08",
    title: "Przekazywanie danych poza EOG",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Dane osobowe Użytkownika mogą być przekazywane do państw lub
          organizacji międzynarodowych poza Europejski Obszar Gospodarczy, gdy
          zostały one uznane przez Komisję Europejską za zapewniające adekwatny
          stopień ochrony danych, lub pod warunkiem zastosowania odpowiednich
          zabezpieczeń — wiążących reguł korporacyjnych, standardowych klauzul
          ochrony danych przyjętych przez Komisję Europejską bądź Prezesa
          Urzędu Ochrony Danych Osobowych, lub innych klauzul umownych przez
          niego dopuszczonych. Kopie zabezpieczeń można uzyskać na wniosek
          złożony w sposób wskazany w punkcie 10.
        </p>
        <p className="text-[15px] leading-relaxed text-white/65">
          W związku z korzystaniem z narzędzi Meta Pixel oraz Meta
          Conversions API dane Użytkowników mogą być przekazywane do Meta
          Platforms, Inc. z siedzibą w USA. Meta Platforms, Inc. stosuje
          odpowiednie zabezpieczenia prawne przewidziane dla przekazywania
          danych poza EOG, w tym może korzystać z mechanizmu certyfikacji w
          ramach programu EU-U.S. Data Privacy Framework (o ile obowiązuje w
          danym okresie) lub standardowych klauzul umownych zatwierdzonych
          przez Komisję Europejską. Aktualne informacje na temat stosowanych
          zabezpieczeń dostępne są w polityce prywatności Meta Platforms.
        </p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo",
    number: "09",
    title: "Bezpieczeństwo danych osobowych",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
        <li>
          Administrator na bieżąco prowadzi analizę ryzyka, by zapewnić, że
          dostęp do danych mają jedynie osoby upoważnione, w zakresie
          niezbędnym do wykonywanych przez nie zadań. Operacje na danych
          osobowych są rejestrowane i dokonywane jedynie przez uprawnionych
          pracowników i współpracowników.
        </li>
        <li>
          Administrator wymaga od podwykonawców i innych podmiotów
          współpracujących gwarancji stosowania odpowiednich środków
          bezpieczeństwa w każdym przypadku przetwarzania danych na jego
          zlecenie.
        </li>
        <li>
          W Serwisie wdrożone zostały rozwiązania zapewniające wysoki poziom
          ochrony danych osobowych Użytkownika.
        </li>
      </ul>
    ),
  },
  {
    id: "kontakt",
    number: "10",
    title: "Dane kontaktowe",
    body: (
      <>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Żądania, oświadczenia i wszelką korespondencję dotyczącą danych
          osobowych należy kierować bezpośrednio do Administratora:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            elektronicznie, na adres e-mail:{" "}
            <a
              href="mailto:jaroslaw.sitek@przedstawiciel.netia.pl"
              className="text-teal-300 underline decoration-teal-300/30 underline-offset-2 hover:decoration-teal-300"
            >
              jaroslaw.sitek@przedstawiciel.netia.pl
            </a>
            ;
          </li>
          <li>
            pisemnie na adres: Jarosław Sitek, ul. Targowa 38/38, 90-043
            Łódź.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-white/65">
          Sprawy dotyczące bezpośrednio usług telekomunikacyjnych Netii
          (np. reklamacje na usługę, a nie na przetwarzanie danych) można
          zgłaszać także za pośrednictwem Działu Obsługi Klienta Netii: 801
          802 803, 22 711 11 11 (lub 793 800 300 z telefonu komórkowego).
        </p>
      </>
    ),
  },
  {
    id: "zmiany",
    number: "11",
    title: "Zmiany Polityki Prywatności",
    body: (
      // [ZMIANA V7]
      <p className="text-[15px] leading-relaxed text-white/65">
        Polityka Prywatności jest na bieżąco weryfikowana i w razie potrzeby
        aktualizowana. Niniejsza wersja obowiązuje od{" "}
        <strong className="text-white">29.07.2026 r.</strong> i uwzględnia
        m.in. wskazanie Jarosława Sitka jako Administratora danych oraz
        ograniczenie zakresu wykorzystywanych narzędzi marketingowych do
        Meta Pixel i Meta Conversions API.
      </p>
    ),
  },
];

// ---------------------------------------------------------------------------
// Ikony (inline SVG — zero zależności)
// ---------------------------------------------------------------------------

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 19V5M12 5l-6 6M12 5l6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M19 12H5M5 12l6 6M5 12l6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Komponent główny
// ---------------------------------------------------------------------------

const PolitykaPrywatnosci: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          current = s.id;
        }
      }
      setActiveId(current);
      setShowTop(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);
  const progress = ((activeIndex + 1) / SECTIONS.length) * 100;

  return (
    <div
      className="min-h-screen pt-26 font-sans text-white"
      style={{
        backgroundColor: "#0B2A3D",
        backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    >
      {/* Pasek postępu */}
      <div
        className="fixed left-0 top-0 z-40 h-[3px] bg-teal-400 transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />

      <div className="mx-auto max-w-[45rem] px-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium text-white/50 no-underline transition-colors hover:text-white/80"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Wróć do strony głównej
        </a>

        <div
          className="mt-5 rounded-[22px] px-6 py-8 sm:px-8 sm:py-9"
          style={{
            background: `radial-gradient(120% 160% at 0% 0%, ${c.cardAlt} 0%, #0B2A3D 55%, #071c29 100%)`,
            border: `1px solid ${c.borderStrong}`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: c.tealDim, border: `1px solid ${c.tealBorder}` }}
            >
              <ShieldIcon className="h-[22px] w-[22px] text-teal-300" />
            </div>
            <div>
              <p className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Autoryzowany Partner Netia · Ochrona danych
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Polityka Prywatności
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-[50ch] text-[14.5px] leading-relaxed text-white/60">
            Zasady przetwarzania danych osobowych w serwisie
            www.swiatlowod-netia-oferta.pl. Obowiązuje od 29.07.2026 r.
          </p>
        </div>

        <nav aria-label="Spis treści" className="mt-5">
          <div
            className="rounded-2xl px-5 py-5 sm:px-6"
            style={{ background: c.card, border: `1px solid ${c.border}` }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
              Spis treści
            </p>
            <ul className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={[
                      "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                      activeId === s.id
                        ? "border-teal-400/50 bg-teal-400/15 font-semibold text-teal-200"
                        : "border-white/10 bg-transparent text-white/60 hover:border-white/25 hover:text-white/85",
                    ].join(" ")}
                  >
                    <span className="tabular-nums text-teal-300/80">
                      {s.number}
                    </span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <main className="flex min-w-0 flex-col gap-4">
          {SECTIONS.map((s) => (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => {
                sectionRefs.current[s.id] = el;
              }}
              className="scroll-mt-32 rounded-2xl px-5 py-6 sm:px-7 sm:py-7"
              style={{ background: c.card, border: `1px solid ${c.border}` }}
            >
              <div className="mb-4 flex items-baseline gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-[15px] font-bold text-teal-300">
                  {s.number}
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  {s.title}
                </h2>
              </div>
              {s.body}
            </section>
          ))}
        </main>
      </div>

      <footer className="mx-auto max-w-3xl border-t border-white/10 px-6 py-8 text-[13px] text-white/40">
        © {new Date().getFullYear()} Jarosław Sitek, ul. Targowa 38/38,
        90-043 Łódź. Kontakt w sprawach danych osobowych:
        jaroslaw.sitek@przedstawiciel.netia.pl.
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Wróć do początku"
        className={[
          "fixed bottom-7 right-7 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-500/30 transition-all duration-200 hover:bg-teal-500",
          showTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        ].join(" ")}
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PolitykaPrywatnosci;