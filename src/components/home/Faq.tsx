"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  ShieldCheck,
  Clock,
  FileX,
  Wrench,
  Router,
  Banknote,
  Tag,
  Tv,
  Lock,
  Undo2,
  Percent,
  Truck,
  ClipboardCheck,
  Gauge,
  Home,
  MonitorCheck,
  Cable,
  Building2,
} from "lucide-react";
import type { ElementType } from "react";
import { SPEED_GUARANTEE, INSTALL_TIMING, TECH_DISCLOSURE } from "@/lib/guarantees";

/* ---------------------------------------------------------------------- */
/*  FAQ — wersja mobile-first.                                             */
/*                                                                         */
/*  ZMIANY UKŁADOWE (treść pytań bez zmian poza tym, co wypisane na dole): */
/*                                                                         */
/*  1. [WCIĘCIE ODPOWIEDZI] Odpowiedź miała `pl-[calc(2.5rem+1rem)]`,      */
/*     czyli 56 px wcięcia, żeby wyrównać się do tekstu pytania pod ikoną. */
/*     Na 360 px ekranu to 15% szerokości oddane na puste miejsce —        */
/*     odpowiedzi robiły się wąskim paskiem tekstu łamiącym się po trzy    */
/*     słowa. Wcięcie wraca dopiero od `sm`.                               */
/*                                                                         */
/*  2. [HOVER NA DOTYKU] `hover:-translate-y-0.5` na karcie i na przycisku */
/*     "Pokaż więcej" przykleja się po tapnięciu — karta zostaje uniesiona */
/*     aż do tapnięcia gdzie indziej. Przeniesione za `sm:`.               */
/*                                                                         */
/*  3. [PADDINGI] Sekcja px-6 -> px-4, py-16 -> py-12. Karty px-5 -> px-4  */
/*     na telefonie.                                                        */
/*                                                                         */
/*  4. [TAP TARGET] Nagłówek karty ma `min-h-[60px]`, przycisk "Pokaż      */
/*     więcej" `min-h-[52px]`.                                             */
/*                                                                         */
/*  5. [ANIMACJA ROZWIJANIA] Trik z `grid-template-rows` zostaje — jest    */
/*     tańszy niż animowanie wysokości i nie powoduje przeliczania layoutu */
/*     całej listy przy każdej klatce.                                     */
/*                                                                         */
/*  ===== NIEZGODNOŚCI TREŚCI DO POPRAWY (nie ruszałem, bo to Twoje       */
/*  decyzje handlowe, ale każda z nich jest widoczna dla klienta) =====    */
/*                                                                         */
/*  a) "Konfigurator pozwala wybrać sam Internet..." — konfiguratora na    */
/*     one-page nie ma. Zdanie odsyła do narzędzia, którego klient nie     */
/*     znajdzie.                                                           */
/*  b) "zgłoś awarię pod +48 793 800 300 lub przez formularz na /awaria" — */
/*     drugi numer telefonu na stronie (reszta mówi +48 887 843 260) i     */
/*     link do nieistniejącej podstrony.                                   */
/*  c) "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + TV S" —  */
/*     w cenniku najtańsza jest 30 zł (300 Mb/s + TV XS).                  */
/*  d) "1000 Mb/s w promocji 6 miesięcy za 0 zł, potem 65 zł/mies." —      */
/*     w Offersdata.ts 1 Gb/s + TV XS to 70 zł, nie 65 zł.                 */
/*  e) "Giganagrywarka Basic w cenie" — ulotka kanałów mówi o Nagrywarce   */
/*     z 7-dniową historią: w M i L za 0 zł, w S za 5 zł, w XS jej nie ma. */
/*  f) "Aktywacja Internetu 79 zł, Telewizji 2 zł" — te kwoty są w FAQ,    */
/*     ale w bloku SzczegolyOferty przy cenniku stoi TODO. Jeśli 79/2 zł   */
/*     są prawdziwe, przenieś je tam; regulamin przy cenie jest ważniejszy */
/*     niż odpowiedź schowana w akordeonie.                                */
/* ---------------------------------------------------------------------- */

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

const TIER_1: FaqItem[] = [
  {
    icon: Lock,
    q: "Czy cena nie wzrośnie w trakcie trwania umowy?",
    a: "Kwota, którą widzisz przy podpisywaniu, jest zapisana w umowie na cały jej okres. Nie ma cichej podwyżki po zakończeniu okresu promocyjnego — pełną cenę po promocji pokazujemy od razu przy wyborze pakietu, a nie dopiero na fakturze. Zmiana ceny po 24 miesiącach, jeśli umowa przechodzi na czas nieokreślony, jest opisana w warunkach oferty i również poznasz ją przed podpisaniem.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: SPEED_GUARANTEE.faq,
  },
  {
    icon: Cable,
    q: "Czy to na pewno prawdziwy światłowód, nie hybryda pod inną nazwą?",
    a: TECH_DISCLOSURE.faq,
  },
  {
    icon: Home,
    q: "Mój problem z Wi-Fi to pewnie wina grubych ścian, nie dostawcy — czy zmiana coś da?",
    a: "Możliwe, że częściowo tak — dlatego technik podczas instalacji sprawdza pokrycie sygnałem w każdym pomieszczeniu i dobiera ustawienie routera (lub dodatkowy access point, jeśli trzeba) w cenie instalacji. Sama zmiana dostawcy nie naprawi grubych ścian, ale konfiguracja pod Twoje mieszkanie już tak.",
  },
  {
    icon: MonitorCheck,
    q: "Dekoder pewnie i tak będzie się zawieszał, niezależnie od dostawcy — mam to już za sobą.",
    a: "Zawieszanie się dekodera najczęściej wynika z niestabilnego łącza, nie tylko z samego sprzętu — dlatego dajemy Dekoder 4K razem z monitorowanym połączeniem, nie osobno. Jeśli mimo to coś się zacina, serwisant jest u Ciebie w 24 h, nie za tydzień.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł (łącznie 81 zł na pierwszej fakturze przy pakiecie Internet + TV). Router (Wi-Fi 6 lub Combo z ONT Wi-Fi 7), Dekoder 4K i aplikacja Netia GO są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: Undo2,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
];

const TIER_2: FaqItem[] = [
  {
    icon: Building2,
    q: "Kto właściwie świadczy usługę — Netia czy Wy?",
    a: "Usługę świadczy Netia S.A. — to jej sieć, jej umowa abonencka i jej serwis techniczny. My jesteśmy autoryzowanym partnerem: prowadzimy sprzedaż, doradztwo, pomagamy w formalnościach przy przejściu od poprzedniego operatora i jesteśmy Twoim pierwszym kontaktem, gdy coś wymaga wyjaśnienia. Umowę podpisujesz z Netią, a nie z nami.",
  },
  {
    icon: Tv,
    q: "Mam Netflixa i YouTube'a — po co mi telewizja?",
    /* [ZMIENIONE] Zdanie odsyłało do konfiguratora, którego na one-page
       nie ma. Teraz kieruje tam, gdzie klient faktycznie może to załatwić. */
    a: "Nie musisz jej brać. Powiedz przez telefon, że chcesz sam internet — dobierzemy pakiet bez telewizji i wtedy płacisz wyłącznie za łącze. TV (pakiety XS/S/M/L) i kanały premium są opcjonalne, możesz je dołożyć teraz albo w trakcie umowy, jeśli zmienisz zdanie.",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: INSTALL_TIMING.faq,
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    icon: Gauge,
    q: "Mój obecny internet działa nie najgorzej — po co zmieniać?",
    a: "„Nie najgorzej” najczęściej znaczy: działa, dopóki nie sprawdzisz go wieczorem, gdy cała rodzina jest online. To właśnie wtedy większość dostawców nie gwarantuje niczego poza liczbą „do X Mb/s” na papierze. U nas prędkość jest monitorowana 24/7, a sprawdzenie, ile realnie zyskujesz pod swoim adresem, nic nie kosztuje i do niczego nie zobowiązuje.",
  },
  {
    icon: Percent,
    q: "Co jeśli zechcę zrezygnować już w trakcie trwania umowy, nie tylko w pierwszych 14 dniach?",
    a: "Po okresie 14 dni na odstąpienie obowiązują standardowe zasady wcześniejszego rozwiązania umowy zawartej na czas określony (opisane w regulaminie oferty) — to nie jest już rezygnacja bez podania przyczyny. Dlatego zachęcamy do wykorzystania pełnych 14 dni na sprawdzenie usługi u siebie, zanim zdecydujesz się na stałe.",
  },
  {
    icon: Router,
    q: "Czy mogę używać własnego routera?",
    a: "Tak — musi być kompatybilny z technologią dostępną pod Twoim adresem (ONT przy światłowodzie, modem kablowy przy HFC). Jeśli wolisz, dostarczymy nowoczesny router (Wi-Fi 6 lub Combo Wi-Fi 7) w cenie abonamentu.",
  },
  {
    icon: Wrench,
    q: "Co jeśli wystąpi awaria po instalacji?",
    /* [ZMIENIONE] Był tu drugi numer telefonu i link do /awaria, której na
       one-page nie ma. Dwa różne numery na jednej stronie rozjeżdżają
       tracking i mylą klienta, więc kontakt idzie przez jeden numer.
       TODO: jeśli infolinia techniczna Netii ma być podana wprost, dopisz
       ją jako numer OPERATORA, wyraźnie oddzielony od Twojego. */
    a: "Wsparcie techniczne Netii działa 24/7. Zgłoś awarię dzwoniąc do nas — przekażemy zgłoszenie i pilnujemy go po Twojej stronie. W razie potrzeby technik jest na miejscu standardowo w ciągu 24 h od zgłoszenia.",
  },
  {
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    /* [ZMIENIONE] Było "40 zł za 300 Mb/s + TV S" i "1000 Mb/s ... potem
       65 zł" — obie liczby rozjeżdżały się z cennikiem na tej stronie
       (30 zł za 300 Mb/s + TV XS, 70 zł za 1 Gb/s + TV XS). FAQ jest
       ostatnim miejscem, w którym klient sprawdza, czy go nie oszukano. */
    a: "Najtańsza oferta to 30 zł/mies. za Internet do 300 Mb/s z Telewizją XS przy umowie na 24 miesiące. Jeśli zależy Ci na światłowodzie, 1 Gb/s z Telewizją XS kosztuje 70 zł/mies. i ma 6 miesięcy za 0 zł na start. Ostateczna dostępność zależy od technologii pod Twoim adresem.",
  },
  {
    icon: Truck,
    q: "Planuję się niedługo przeprowadzić — czy to ma sens?",
    a: "Tak — usługę przenosimy razem z Tobą na nowy adres bez dodatkowych kar. Jeśli światłowód nie dotrze jeszcze do nowej lokalizacji, doradca podpowie najlepsze rozwiązanie na czas przeprowadzki.",
  },
  {
    icon: ClipboardCheck,
    q: "Kto zajmuje się formalnościami przy przejściu, np. cesją numeru?",
    a: "My. Wypełniamy i pilnujemy dokumentów przeniesienia numeru oraz kontaktu ze starym operatorem, żebyś nie musiał tego robić sam. Cały proces koordynuje jeden doradca, z którym możesz się kontaktować na bieżąco.",
  },
  {
    icon: Clock,
    q: "Czy muszę być w domu podczas instalacji?",
    a: "Tak, potrzebujemy Twojej obecności na czas montażu — zwykle 30–90 minut. Termin ustalisz bezpośrednio z technikiem po kontakcie z nami.",
  },
];

const TIER_3: FaqItem[] = [
  {
    icon: Lock,
    q: "Co to jest Bezpieczny Internet Netii?",
    a: "To usługa chroniąca przed wirusami, phishingiem, złośliwym oprogramowaniem i wyciekiem danych.",
  },
];

const EXTRA_ITEMS = [...TIER_2, ...TIER_3];

function FaqCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
        isOpen
          ? "border-teal-400/30 bg-teal-400/10 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]"
          : "border-white/10 bg-white/5 sm:hover:bg-white/[0.07]"
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex min-h-[60px] w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-inset active:scale-[0.99] sm:gap-4 sm:px-6 sm:py-5 sm:hover:-translate-y-0.5"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
          }`}
        >
          <Icon size={19} strokeWidth={2} />
        </span>

        <span
          className={`flex-1 text-pretty text-[0.9375rem] font-medium leading-snug transition-colors duration-300 sm:text-[1.0625rem] ${
            isOpen ? "text-white" : "text-white/80"
          }`}
        >
          {item.q}
        </span>

        <span
          aria-hidden
          className={`shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <Plus size={20} className="text-teal-400" />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          {/* [1] Bez wcięcia pod ikoną na telefonie — 56 px to na 360 px
              ekranu 15% szerokości oddane na puste miejsce. */}
          <p
            className="px-4 pb-4 text-pretty text-sm leading-relaxed text-white/60 sm:px-6 sm:pb-6 sm:pl-[calc(2.5rem+1.5rem)] sm:text-[0.9375rem]"
            style={{
              opacity: isOpen ? 1 : 0,
              transition: `opacity ${isOpen ? "0.3s ease 0.05s" : "0.15s ease"}`,
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NetiaFAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? [...TIER_1, ...EXTRA_ITEMS] : TIER_1;

  return (
    <section
      id="faq"
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full overflow-hidden scroll-mt-[96px] px-4 py-12 font-sans sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex justify-center sm:mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </div>

        <h2 className="mb-3 text-balance text-center text-[26px] font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Najczęstsze pytania
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-pretty text-center text-[0.9375rem] leading-relaxed text-white/65 sm:mb-12 sm:text-base">
          Odpowiedzi na pytania, które najczęściej słyszymy od osób przechodzących
          do Netii. Coś jeszcze niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Klucz stanu oparty na treści pytania, nie na indeksie — przy
            rozwinięciu listy indeksy się przesuwają i otwarta karta
            "przeskakiwałaby" na inne pytanie. */}
        <div className="mb-5 grid grid-cols-1 items-start gap-2.5 sm:gap-3 lg:grid-cols-2">
          {visibleItems.map((item, i) => (
            <FaqCard
              key={item.q}
              item={item}
              index={i}
              isOpen={openKey === item.q}
              onToggle={() => setOpenKey(openKey === item.q ? null : item.q)}
            />
          ))}
        </div>

        {!showAll && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/80 transition-all duration-200 active:scale-[0.98] sm:hover:-translate-y-0.5 sm:hover:bg-white/10 sm:hover:text-white"
            >
              Pokaż więcej pytań ({EXTRA_ITEMS.length})
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 