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
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

// Tier 1 — najsilniejsze objection-killery, zawsze widoczne domyślnie
const TIER_1: FaqItem[] = [
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7 pod numerem +48 793 800 300. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
  },
  {
    icon: Undo2,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy — termin ustalasz indywidualnie z technikiem. Sama instalacja w lokalu trwa około 1,5 godziny: technik podłącza światłowód, konfiguruje router i dekoder, sprawdza prędkość i pokazuje aplikację Netia GO. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł (łącznie 81 zł na pierwszej fakturze przy pakiecie Internet + TV). Router (Wi-Fi 6 lub Combo z ONT Wi-Fi 7), Dekoder 4K, aplikacja Netia GO i Giganagrywarka Basic są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
];

// Tier 2 — wspierają decyzję, gaszą praktyczne wątpliwości (widoczne po rozwinięciu)
const TIER_2: FaqItem[] = [
  {
    icon: Gauge,
    q: "Mój obecny internet działa nie najgorzej — po co zmieniać?",
    a: "„Nie najgorzej” najczęściej znaczy: działa, dopóki nie sprawdzisz go wieczorem, gdy cała rodzina jest online. To właśnie wtedy większość dostawców nie gwarantuje niczego poza liczbą „do X Mb/s” na papierze. U nas prędkość jest monitorowana 24/7, a sprawdzenie, ile realnie zyskujesz pod swoim adresem, nic nie kosztuje i do niczego nie zobowiązuje.",
  },
  {
    icon: Home,
    q: "Mój problem z Wi-Fi to pewnie wina grubych ścian, nie dostawcy — czy zmiana coś da?",
    a: "Możliwe, że częściowo tak — dlatego technik podczas instalacji sprawdza pokrycie sygnałem w każdym pomieszczeniu i dobiera ustawienie routera (lub dodatkowy access point, jeśli trzeba) w cenie instalacji. Sama zmiana dostawcy nie naprawi grubych ścian, ale konfiguracja pod Twoje mieszkanie już tak.",
  },
  {
    icon: MonitorCheck,
    q: "Dekoder pewnie i tak będzie się zawieszał, niezależnie od dostawcy — mam to już za sobą.",
    a: "Zawieszanie się dekodera najczęściej wynika z niestabilnego łącza, nie tylko samego sprzętu — dlatego dajemy Dekoder 4K razem z monitorowanym połączeniem, nie osobno. Jeśli mimo to coś się zacina, serwisant jest u Ciebie w 24h, nie za tydzień.",
  },
  {
    icon: Cable,
    q: "Czy to na pewno prawdziwy światłowód, nie hybryda pod inną nazwą?",
    a: "Technologię dostępną pod Twoim adresem (FTTH, HFC czy inna) potwierdzamy jeszcze przed podpisaniem umowy, podczas sprawdzania dostępności — widzisz to czarno na białym, zanim się zdecydujesz, nie dowiadujesz się po fakcie.",
  },
  {
    icon: Percent,
    q: "Co jeśli zechcę zrezygnować już w trakcie trwania umowy, nie tylko w pierwszych 14 dniach?",
    a: "Po okresie 14 dni na odstąpienie obowiązują standardowe zasady wcześniejszego rozwiązania umowy zawartej na czas określony (opisane w regulaminie oferty) — to nie jest już rezygnacja bez podania przyczyny. Dlatego zachęcamy do wykorzystania pełnych 14 dni na sprawdzenie usługi u siebie, zanim zdecydujesz się na stałe.",
  },
  {
    icon: Router,
    q: "Czy mogę używać własnego routera?",
    a: "Tak — musi być kompatybilny z technologią światłowodową. Jeśli wolisz, dostarczymy nowoczesny router (Wi-Fi 6 lub Combo Wi-Fi 7) w cenie abonamentu.",
  },
  {
    icon: Wrench,
    q: "Co jeśli wystąpi awaria po instalacji?",
    a: "Wsparcie techniczne działa 24/7 — zgłoś awarię pod +48 793 800 300 lub przez formularz na /awaria. W razie potrzeby wysyłamy technika na miejsce.",
  },
  {
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    a: "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + Telewizję S (umowa 24-miesięczna). Sam internet bez TV — najpopularniejszy wariant to 1000 Mb/s w promocji „6 miesięcy za 0 zł„, potem 65 zł/mies. Ostateczna cena zależy od technologii dostępnej pod Twoim adresem.",
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
  {
    icon: Tv,
    q: "Czy mogę zamówić sam internet bez telewizji?",
    a: "Tak. Konfigurator na /oferta pozwala wybrać sam Internet w dowolnej prędkości. TV (pakiety S/M/L), kanały premium i Mobile 5G to opcjonalne dodatki — możesz je dołożyć teraz lub w trakcie umowy.",
  },
];

// Tier 3 — uzupełnienie, mała waga sprzedażowa (widoczne po rozwinięciu)
const TIER_3: FaqItem[] = [
  {
    icon: Lock,
    q: "Co to jest Bezpieczny Internet Netii?",
    a: "To usługa chroniąca przed wirusami, phishingiem, złośliwym oprogramowaniem i wyciekiem danych.",
  },
];

const EXTRA_ITEMS = [...TIER_2, ...TIER_3];

/* [KOPIA] Bez animacji wejścia i bez zamykającego CTA — sekcja kończy
   się na liście pytań i przycisku "Pokaż więcej". CTA do kontaktu
   zostaje tylko w dedykowanej sekcji ContactSection, żeby nie
   powielać tego samego wezwania do działania dwa razy pod rząd.

   [POPRAWKA] Dodano 5 pozycji do TIER_2, adresujących obiekcje z
   Offer_Brief, które wcześniej nie miały żadnej odpowiedzi w FAQ:
   "speed już wystarcza", ściany/Wi-Fi, dekoder, światłowód-vs-hybryda,
   i rezygnacja po okresie 14 dni (uczciwie, bez ukrywania że wtedy
   obowiązują standardowe zasady wypowiedzenia). */
function FaqCard({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] ${
        isOpen
          ? "bg-teal-400/10 border-teal-400/30 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]"
          : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
      }`}
    >
      <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
        <div
          className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 transition-colors duration-300 ${
            isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
          }`}
        >
          <Icon size={19} strokeWidth={2} />
        </div>

        <span
          className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug transition-colors duration-300 ${
            isOpen ? "text-white" : "text-white/80"
          }`}
        >
          {item.q}
        </span>

        <div
          className={`shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <Plus size={20} className="text-teal-400" />
        </div>
      </div>

      {/* Grid-rows trick zamiast animate height: "auto" */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[calc(2.5rem+1rem)] text-sm sm:text-[0.9375rem] leading-relaxed text-white/60"
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? [...TIER_1, ...EXTRA_ITEMS] : TIER_1;

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full py-16 px-6 font-sans overflow-hidden"
    >
      <div className="max-w-305 mx-auto">
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </div>

        <h2 className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3">
          Najczęstsze pytania
        </h2>
        <p className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65">
          Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 items-start">
          {visibleItems.map((item, i) => (
            <FaqCard
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Toggle — trzyma domyślną wysokość sekcji krótką, bez tracenia treści */}
        {!showAll && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                setOpenIndex(null);
              }}
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