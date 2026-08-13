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
/*  ===== PRZEBUDOWA FAQ =====                                             */
/*                                                                         */
/*  PROBLEM: trzy najsilniejsze blokery z researchu (grube ściany / Wi-Fi,  */
/*  zawieszający się dekoder, "czy to na pewno światłowód") BYŁY już        */
/*  w tym pliku — ale w TIER_2, czyli za przyciskiem "Pokaż więcej pytań".  */
/*  Domyślnie widoczne było za to sześć pytań organizacyjnych (długość      */
/*  umowy, czas instalacji, koszt aktywacji). Odwiedzający, który nie       */
/*  kliknie "pokaż więcej", a to większość, nie zobaczy odpowiedzi na       */
/*  dokładnie te obiekcje, które powstrzymują go przed zakupem.            */
/*                                                                         */
/*  ZMIANA: TIER_1 przebudowany na osiem pytań uszeregowanych według siły   */
/*  obiekcji z researchu, nie według kolejności procesu zakupowego.        */
/*  Pytania organizacyjne zeszły do TIER_2 — one interesują dopiero po      */
/*  podjęciu decyzji, więc kliknięcie "pokaż więcej" nie jest dla nich      */
/*  barierą.                                                                */
/*                                                                         */
/*  DWA NOWE PYTANIA (nie było ich w żadnym tierze):                        */
/*   1. "Czy cena nie wzrośnie w trakcie trwania umowy?" — Promo-Cliff to   */
/*      centralny mechanizm całej oferty i był omówiony wszędzie na         */
/*      stronie POZA FAQ, czyli tam, gdzie zagląda najbardziej sceptyczny   */
/*      czytelnik.                                                          */
/*   2. "Kto właściwie świadczy usługę — Netia czy Wy?" — pytanie, które    */
/*      klient i tak sobie zada, widząc "autoryzowany partner" w stopce     */
/*      obok gwarancji pisanych w pierwszej osobie. Lepiej odpowiedzieć     */
/*      pierwszym niż zostawić to jako niedopowiedzenie.                    */
/*                                                                          */
/*  DOSTĘPNOŚĆ: karta była <div role="button"> z ręczną obsługą Enter/Spacji*/
/*  i bez powiązania z panelem treści. Teraz to <button> z aria-controls    */
/*  i aria-labelledby — klawiatura, czytniki ekranu i focus działają bez    */
/*  dodatkowego kodu.                                                      */
/*                                                                          */
/*  ===== DO SPRAWDZENIA POZA TYM PLIKIEM =====                            */
/*  W app/page.tsx `faqSchema` budowany jest z FAQ_ITEMS (homeFaqData),     */
/*  a ten komponent renderuje własne, zahardkodowane TIER_1/2/3. To dwa     */
/*  różne źródła danych: dane strukturalne dla Google mogą nie odpowiadać   */
/*  temu, co jest na stronie. Docelowo jedno źródło — albo przenieś te      */
/*  tablice do homeFaqData, albo buduj schemę z tego pliku.                */
/* ---------------------------------------------------------------------- */

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

// TIER 1 — osiem najsilniejszych objection-killerów, zawsze widoczne.
// Kolejność wg siły obiekcji z researchu, nie wg procesu zakupowego.
const TIER_1: FaqItem[] = [
  {
    icon: Lock,
    q: "Czy cena nie wzrośnie w trakcie trwania umowy?",
    // [NOWE] Promo-Cliff jest centralnym mechanizmem oferty, a w FAQ go
    // brakowało. To pierwsze pytanie, bo research wskazuje podwyżkę po
    // promocji jako najsilniejszy wyzwalacz zmiany operatora.
    //
    // TODO PRZED PUBLIKACJĄ: zweryfikuj to zdanie ze Szczegółowymi
    // Warunkami Promocji. Jeśli regulamin dopuszcza jakąkolwiek zmianę
    // opłat w trakcie umowy (np. ustawowa waloryzacja), napisz to wprost —
    // przyznanie się do wyjątku jest bezpieczniejsze niż obietnica
    // bez pokrycia, a cała ta strona stoi na uczciwości wobec fine printu.
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
    // [PRZENIESIONE Z TIER_2] Lęk przed "kupieniem kota w worku" jest
    // w researchu jednym z najczęściej powtarzanych, a odpowiedź była
    // schowana za przyciskiem "pokaż więcej".
    a: TECH_DISCLOSURE.faq,
  },
  {
    icon: Home,
    q: "Mój problem z Wi-Fi to pewnie wina grubych ścian, nie dostawcy — czy zmiana coś da?",
    // [PRZENIESIONE Z TIER_2] Martwe strefy Wi-Fi to jedna z dwóch
    // najczęstszych skarg w cytatach z forów.
    a: "Możliwe, że częściowo tak — dlatego technik podczas instalacji sprawdza pokrycie sygnałem w każdym pomieszczeniu i dobiera ustawienie routera (lub dodatkowy access point, jeśli trzeba) w cenie instalacji. Sama zmiana dostawcy nie naprawi grubych ścian, ale konfiguracja pod Twoje mieszkanie już tak.",
  },
  {
    icon: MonitorCheck,
    q: "Dekoder pewnie i tak będzie się zawieszał, niezależnie od dostawcy — mam to już za sobą.",
    // [PRZENIESIONE Z TIER_2] Druga z dwóch najczęstszych skarg z forów.
    a: "Zawieszanie się dekodera najczęściej wynika z niestabilnego łącza, nie tylko z samego sprzętu — dlatego dajemy Dekoder 4K razem z monitorowanym połączeniem, nie osobno. Jeśli mimo to coś się zacina, serwisant jest u Ciebie w 24 h, nie za tydzień.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł (łącznie 81 zł na pierwszej fakturze przy pakiecie Internet + TV). Router (Wi-Fi 6 lub Combo z ONT Wi-Fi 7), Dekoder 4K, aplikacja Netia GO i Giganagrywarka Basic są w cenie abonamentu — nie dopłacasz za sprzęt.",
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

// TIER 2 — pytania organizacyjne i uzupełniające. Interesują dopiero po
// podjęciu decyzji, więc kliknięcie "pokaż więcej" nie jest dla nich barierą.
const TIER_2: FaqItem[] = [
  {
    icon: Building2,
    q: "Kto właściwie świadczy usługę — Netia czy Wy?",
    // [NOWE] Klient i tak zada sobie to pytanie, widząc "autoryzowany
    // partner" w stopce obok gwarancji pisanych w pierwszej osobie.
    // Lepiej odpowiedzieć pierwszym niż zostawić niedopowiedzenie.
    a: "Usługę świadczy Netia S.A. — to jej sieć, jej umowa abonencka i jej serwis techniczny. My jesteśmy autoryzowanym partnerem: prowadzimy sprzedaż, doradztwo, pomagamy w formalnościach przy przejściu od poprzedniego operatora i jesteśmy Twoim pierwszym kontaktem, gdy coś wymaga wyjaśnienia. Umowę podpisujesz z Netią, a nie z nami.",
  },
  {
    icon: Tv,
    q: "Mam Netflixa i YouTube'a — po co mi telewizja?",
    // Podniesione z końca listy: research wskazuje to jako obiekcję nr 1.
    a: "Nie musisz jej brać. Konfigurator pozwala wybrać sam Internet w dowolnej prędkości i wtedy płacisz wyłącznie za łącze. TV (pakiety S/M/L), kanały premium i Mobile 5G to opcjonalne dodatki — możesz je dołożyć teraz albo w trakcie umowy, jeśli zmienisz zdanie.",
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
    a: "Wsparcie techniczne działa 24/7 — zgłoś awarię pod +48 793 800 300 lub przez formularz na /awaria. W razie potrzeby wysyłamy technika na miejsce, standardowo w ciągu 24 h od zgłoszenia.",
  },
  {
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    a: "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + Telewizję S (umowa 24-miesięczna). Sam internet bez TV — najpopularniejszy wariant to 1000 Mb/s w promocji „6 miesięcy za 0 zł”, potem 65 zł/mies. Ostateczna cena zależy od technologii dostępnej pod Twoim adresem.",
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

// TIER 3 — uzupełnienie, mała waga sprzedażowa.
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
      className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
        isOpen
          ? "border-teal-400/30 bg-teal-400/10 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]"
          : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
      }`}
    >
      {/* [DOSTĘPNOŚĆ] Prawdziwy <button> zamiast <div role="button">.
          Obsługa klawiatury, focus i czytniki ekranu działają natywnie,
          bez ręcznego onKeyDown. aria-controls wiąże przycisk z panelem. */}
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-inset active:scale-[0.99] sm:px-6 sm:py-5"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
          }`}
        >
          <Icon size={19} strokeWidth={2} />
        </span>

        <span
          className={`flex-1 text-base font-medium leading-snug transition-colors duration-300 sm:text-[1.0625rem] ${
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

      {/* Grid-rows trick zamiast animate height: "auto" */}
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
          <p
            className="px-5 pb-5 pl-[calc(2.5rem+1rem)] text-sm leading-relaxed text-white/60 sm:px-6 sm:pb-6 sm:text-[0.9375rem]"
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
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full overflow-hidden px-6 py-16 font-sans"
    >
      <div className="mx-auto max-w-305">
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </div>

        <h2 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Najczęstsze pytania
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-sm text-white/65 sm:text-base">
          Odpowiedzi na pytania, które najczęściej słyszymy od osób przechodzących
          do Netii. Coś jeszcze niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile.
            [POPRAWKA] Klucz stanu oparty na treści pytania, nie na indeksie.
            Przy rozwinięciu listy indeksy się przesuwały, więc otwarta
            karta "przeskakiwała" na inne pytanie. */}
        <div className="mb-6 grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
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
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-[0.98]"
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