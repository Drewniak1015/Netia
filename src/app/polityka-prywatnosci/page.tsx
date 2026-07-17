"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Polityka Prywatności — Netia S.A.
 *
 * Next.js (App Router) + Tailwind CSS. Zależy wyłącznie od Reacta —
 * kolory zdefiniowane inline jako klasy arbitralne Tailwind (bg-[#...]),
 * więc nie wymaga rozszerzania tailwind.config.
 *
 * WERSJA 3 — zmiany względem poprzednich:
 *  - Spis treści przeniesiony na samą górę strony (poziomy pasek chipów,
 *    zawijający się w wiersze), zamiast sticky sidebara w layoucie
 *    dwukolumnowym. Sticky + grid bywa źródłem bugów, jeśli strona
 *    nadrzędna ma swój overflow / transform / position na przodkach
 *    (sticky wtedy "nie łapie") albo gdy istnieje własny scroll-container.
 *  - Usunięty baner/nagłówek (tytuł, ikonka, gradient) — strona zaczyna się
 *    od razu od spisu treści.
 *  - Spis treści, treść i stopka mają teraz tę samą szerokość (max-w-3xl)
 *    i to samo poziome wyśrodkowanie — wszystko wyrównane w jednej,
 *    spójnej kolumnie.
 *  - Układ jest jednokolumnowy (prostszy, mniej zależny od zachowania
 *    rodzica).
 *  - Śledzenie aktywnej sekcji liczone na scrollu (bez IntersectionObserver
 *    i bez sticky pozycjonowania).
 *
 * WERSJA 4 — jedyna zmiana: subtelne kropkowane tło całej strony
 * (ten sam wzorzec co na 4 stronach Pomocy i na checkoucie konfiguratora:
 * radial-gradient rgba(255,255,255,.12) co 26px). Ta strona to spokojny,
 * jednokolumnowy tekst prawny bez siatek kart — dlatego dostaje jedną,
 * subtelną teksturę na całej stronie zamiast dekoracji pod poszczególnymi
 * sekcjami (ten drugi zabieg jest zarezerwowany dla siatek ofertowych).
 *
 * WAŻNE: `pt-40` na głównym wrapperze strony jest celowe — strona ma stały
 * (fixed) górny pasek nawigacji, który bez tego odstępu zachodziłby na
 * treść tej podstrony. Jeśli u Ciebie navbar ma inną wysokość, dopasuj tę
 * wartość (np. pt-32 / pt-48) zamiast usuwać.
 *
 * Użycie:
 *   app/polityka-prywatnosci/page.tsx
 *   -> import PolitykaPrywatnosci from "@/components/PolitykaPrywatnosci";
 *   -> export default function Page() { return <PolitykaPrywatnosci />; }
 */

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
            Administrator albo Netia
          </dt>
          <dd className="mt-1 text-[15px] text-white/65">
            Netia S.A., ul. Poleczki 13, 02-822 Warszawa.
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
              href="https://www.uslugi-netia.pl"
              className="text-teal-300 underline decoration-teal-300/30 underline-offset-2 hover:decoration-teal-300"
            >
              www.uslugi-netia.pl
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

        <h3 className="mt-6 mb-3 text-[15px] font-bold text-teal-300">
          Cele wykorzystania
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            <strong className="text-white">Cookie wymagane</strong>,
            niezbędne do korzystania z serwisu: pliki z danymi wprowadzanymi
            przez Użytkownika, uwierzytelniające pliki cookie, pliki służące
            do zapewnienia bezpieczeństwa oraz sesyjne pliki cookie
            odtwarzaczy multimedialnych.
          </li>
          <li>
            <strong className="text-white">Cookie funkcjonalne</strong>,
            ułatwiające korzystanie z serwisu: trwałe pliki służące
            personalizacji interfejsu oraz pliki monitorujące ruch na stronie
            (analityka danych).
          </li>
        </ul>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          Użytkownik może w każdej chwili zmienić ustawienia plików cookie
          poprzez zmianę ustawień prywatności w przeglądarce bądź aplikacji, z
          zastrzeżeniem że zmiana ta może spowodować brak dostępu do
          niektórych funkcji Serwisu.
        </p>

        <h3 className="mt-6 mb-3 text-[15px] font-bold text-teal-300">
          Narzędzia zewnętrznych dostawców
        </h3>
        <p className="mb-4 text-[15px] leading-relaxed text-white/65">
          W celach analitycznych i statystycznych Administrator korzysta z
          poniższych narzędzi, uruchamianych wyłącznie po wyrażeniu zgody
          Użytkownika na kategorię „Analityka” w panelu plików cookie:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            <strong className="text-white">
              Google Analytics 4 i Google Tag Manager
            </strong>{" "}
            (Google Ireland Limited) — pomiar ruchu w Serwisie, źródeł
            odwiedzin oraz zdarzeń konwersji. Dane są anonimizowane.
          </li>
          <li>
            <strong className="text-white">Microsoft Clarity</strong>{" "}
            (Microsoft Corporation) — analiza zachowania Użytkownika poprzez
            heatmapy oraz nagrania sesji; pola formularzy są automatycznie
            maskowane.
          </li>
          <li>
            <strong className="text-white">Bing Webmaster Tools</strong>{" "}
            (Microsoft Corporation) — monitorowanie indeksacji Serwisu. Nie
            wykorzystuje cookie po stronie Użytkownika.
          </li>
          <li>
            <strong className="text-white">Protokół IndexNow</strong> —
            powiadamianie wyszukiwarek o zmianach w treści Serwisu. Nie
            wykorzystuje cookie po stronie Użytkownika.
          </li>
          <li>
            <strong className="text-white">CookieYes</strong> (CookieYes
            Ltd.) — zarządzanie zgodami na pliki cookie, z wykorzystaniem
            pliku kategorii „Niezbędne”.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-white/65">
          Wycofanie zgody możliwe jest w dowolnym momencie poprzez ponowne
          otwarcie panelu zgód (link „Zmień ustawienia cookies” w stopce
          Serwisu) lub poprzez usunięcie plików cookie w ustawieniach
          przeglądarki.
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
            świadczeniem usług i prowadzeniem działalności gospodarczej
            (dowodowe, analityczne, statystyczne).
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
            wcześniej.
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
        kategoriom odbiorców: podmiotom świadczącym Administratorowi usługi
        niezbędne do realizacji celów przetwarzania, w tym dostawcom IT,
        podmiotom realizującym wsparcie techniczne, organizacyjne i doradcze,
        innym podwykonawcom w zakresie obsługi klienta, integratorom oraz
        podmiotom uprawnionym na podstawie przepisów prawa, a także spółkom z
        Grupy Polsat Plus.
      </p>
    ),
  },
  {
    id: "eog",
    number: "08",
    title: "Przekazywanie danych poza EOG",
    body: (
      <p className="text-[15px] leading-relaxed text-white/65">
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
          osobowych należy kierować:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
          <li>
            telefonicznie do Działu Obsługi Klienta: 801 802 803, 22 711 11
            11 lub z telefonu komórkowego 793 800 300;
          </li>
          <li>
            pisemnie na adres: Netia S.A. — Dział Obsługi Reklamacji, skr.
            pocztowa nr 597, 40-950 Katowice S105;
          </li>
          <li>
            elektronicznie, poprzez formularz na stronie Netia Online (dla
            klientów Netii);
          </li>
          <li>
            pisemnie lub ustnie do protokołu w Punkcie sprzedaży (obsługi).
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-white/65">
          Administrator wyznaczył inspektora ochrony danych, z którym można
          się skontaktować elektronicznie pod adresem{" "}
          <a
            href="mailto:iod@netia.pl"
            className="text-teal-300 underline decoration-teal-300/30 underline-offset-2 hover:decoration-teal-300"
          >
            iod@netia.pl
          </a>{" "}
          lub pisemnie na adres siedziby Administratora, z dopiskiem
          „Inspektor ochrony danych”.
        </p>
      </>
    ),
  },
  {
    id: "zmiany",
    number: "11",
    title: "Zmiany Polityki Prywatności",
    body: (
      <p className="text-[15px] leading-relaxed text-white/65">
        Polityka Prywatności jest na bieżąco weryfikowana i w razie potrzeby
        aktualizowana. Aktualna wersja Polityki Prywatności została przyjęta i
        obowiązuje od <strong className="text-white">05.02.2021 r.</strong>
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

// ---------------------------------------------------------------------------
// Komponent główny
// ---------------------------------------------------------------------------

const PolitykaPrywatnosci: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // Prostszy, mniej "kruchy" sposób ustalania aktywnej sekcji: patrzymy,
    // która sekcja jest najbliżej góry viewportu. Nie zależy od sticky
    // pozycjonowania ani od dokładnego rootMargin dopasowanego do
    // konkretnego layoutu strony.
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

      <header className=" px-6 pb-8 pt-10">
        <div className="mx-auto max-w-[45rem]">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Netia S.A. · Ochrona danych
          </p>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Polityka Prywatności
          </h1>
          <p className="max-w-[46ch] text-[15px] text-white/60">
            Zasady przetwarzania danych osobowych w serwisie
            www.uslugi-netia.pl. Obowiązuje od 05.02.2021 r.
          </p>
        </div>
      </header>

      {/* Spis treści — poziomy pasek chipów na samej górze, NAD treścią.
          max-w-3xl — ta sama szerokość co treść i stopka poniżej, dla
          spójnego, "równego" wyrównania w pionie. */}
      <nav
        aria-label="Spis treści"
        className="px-6 py-5"
      >
        <div className="mx-auto max-w-[45rem]">
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

      {/* Treść — jednokolumnowa, bez sticky/grid, ta sama szerokość co spis treści i stopka */}
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        <main className="min-w-0">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => {
                sectionRefs.current[s.id] = el;
              }}
              className={[
                "scroll-mt-32 py-9",
                i < SECTIONS.length - 1 ? "border-b border-white/10" : "",
              ].join(" ")}
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

      {/* Stopka — ta sama szerokość co reszta, dla spójnego wyrównania */}
      <footer className="mx-auto max-w-3xl border-t border-white/10 px-6 py-8 text-[13px] text-white/40">
        © {new Date().getFullYear()} Netia S.A., ul. Poleczki 13, 02-822
        Warszawa. Inspektor ochrony danych: iod@netia.pl.
      </footer>

      {/* Przycisk „do góry” */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Wróć do początku"
        className={[
          "fixed bottom-7 right-7 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 transition-all duration-200 hover:bg-teal-400",
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