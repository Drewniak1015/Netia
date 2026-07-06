"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  FileX,
  ShieldCheck,
  Clock,
  Wrench,
  Banknote,
  Router,
  Tag,
  Home,
  Tv,
  Database,
  Smartphone,
  Lock,
  Baby,
  Gauge,
  Package,
  FileCheck,
  Wallet,
  TrendingUp,
  FileText,
  XCircle,
  CreditCard,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

/* ---------- design tokens ----------
   This page mirrors the reference screenshot: a light page with a
   dark gradient hero card floating on top, then a white "toolbar"
   card holding search + category filters. */
const c = {
  pageBg: "#eef2f6",
  hero1: "#0b2536",
  hero2: "#1b2350",
  hero3: "#2a1f49",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f2436",
  muted: "#64748b",
  faint: "#94a3b8",
  accent: "#0f9488",
  accentDim: "rgba(15,148,136,.08)",
  accentBorder: "rgba(15,148,136,.28)",
};

/* ---------- data ----------
   Every question from all the drafts you pasted (TIER_1 / TIER_2 /
   TIER_3, both FAQ_ITEMS arrays, and the `faqs` array) — 35 items
   total, each tagged with a category so the pill filters work.
   Note: "Czy Bezpieczny Internet obejmuje kontrolę rodzicielską?"
   still carries the placeholder answer from your draft ("Uzupełnij
   odpowiedź przed publikacją") — it's included as requested, but
   swap in the real answer before this goes live.
   A couple of questions repeat across drafts with different answers
   (e.g. contract length appears three times) — kept as separate rows
   since each came with its own wording. */

type Category =
  | "Zamówienie i instalacja"
  | "Internet"
  | "Telewizja"
  | "Mobile"
  | "Umowy i rozliczenia"
  | "Pomoc techniczna"
  | "Inne usługi";

const CATEGORIES: Category[] = [
  "Zamówienie i instalacja",
  "Internet",
  "Telewizja",
  "Mobile",
  "Umowy i rozliczenia",
  "Pomoc techniczna",
  "Inne usługi",
];

interface FaqItem {
  icon: LucideIcon;
  q: string;
  a: string;
  category: Category;
}

const FAQ_ITEMS: FaqItem[] = [
  // — TIER_1 —
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7 pod numerem +48 793 800 300. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
    category: "Internet",
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy — termin ustalasz indywidualnie z technikiem. Sama instalacja w lokalu trwa około 1,5 godziny: technik podłącza światłowód, konfiguruje router i dekoder, sprawdza prędkość i pokazuje aplikację Netia GO. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
    category: "Zamówienie i instalacja",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł (łącznie 81 zł na pierwszej fakturze przy pakiecie Internet + TV). Router (Wi-Fi 6 lub Combo z ONT Wi-Fi 7), Dekoder 4K, aplikacja Netia GO i Giganagrywarka Basic są w cenie abonamentu — nie dopłacasz za sprzęt.",
    category: "Umowy i rozliczenia",
  },

  // — TIER_2 —
  {
    icon: Router,
    q: "Czy mogę używać własnego routera?",
    a: "Tak — musi być kompatybilny z technologią światłowodową. Jeśli wolisz, dostarczymy nowoczesny router (Wi-Fi 6 lub Combo Wi-Fi 7) w cenie abonamentu.",
    category: "Internet",
  },
  {
    icon: Wrench,
    q: "Co jeśli wystąpi awaria po instalacji?",
    a: "Wsparcie techniczne działa 24/7 — zgłoś awarię pod +48 793 800 300 lub przez formularz na /awaria. W razie potrzeby wysyłamy technika na miejsce.",
    category: "Pomoc techniczna",
  },
  {
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    a: "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + Telewizję S (umowa 24-miesięczna). Sam internet bez TV — najpopularniejszy wariant to 1000 Mb/s w promocji „6 miesięcy za 0 zł”, potem 65 zł/mies. Ostateczna cena zależy od technologii dostępnej pod Twoim adresem.",
    category: "Internet",
  },
  {
    icon: Home,
    q: "Czy Netia działa w blokach i domach jednorodzinnych?",
    a: "Tak — światłowód dostępny jest w obu typach budynków.",
    category: "Zamówienie i instalacja",
  },
  {
    icon: Clock,
    q: "Czy muszę być w domu podczas instalacji?",
    a: "Tak, potrzebujemy Twojej obecności na czas montażu — zwykle 30–90 minut. Termin ustalisz bezpośrednio z technikiem po kontakcie z nami.",
    category: "Zamówienie i instalacja",
  },
  {
    icon: Tv,
    q: "Czy mogę zamówić sam internet bez telewizji?",
    a: "Tak. Konfigurator na /oferta pozwala wybrać sam Internet w dowolnej prędkości. TV (pakiety S/M/L), kanały premium i Mobile 5G to opcjonalne dodatki — możesz je dołożyć teraz lub w trakcie umowy.",
    category: "Internet",
  },

  // — TIER_3 —
  {
    icon: Database,
    q: "Czy Netia ma limit danych?",
    a: "Nie — internet światłowodowy Netii jest nielimitowany.",
    category: "Internet",
  },
  {
    icon: Smartphone,
    q: "Czy mogę połączyć Internet z TV i usługami mobilnymi?",
    a: "Tak — w konfiguratorze dobierzesz Internet + TV + Mobile 5G (plany SUPER / VIP / GIGA, pierwsze 6 mies. za 0 zł) w jednej umowie i na jednej fakturze.",
    category: "Mobile",
  },
  {
    icon: Lock,
    q: "Co to jest Bezpieczny Internet Netii?",
    a: "To usługa chroniąca przed wirusami, phishingiem, złośliwym oprogramowaniem i wyciekiem danych.",
    category: "Inne usługi",
  },
  {
    icon: Baby,
    q: "Czy Bezpieczny Internet obejmuje kontrolę rodzicielską?",
    a: "Uzupełnij odpowiedź przed publikacją.",
    category: "Inne usługi",
  },

  // — FAQ_ITEMS (konfigurator ogólny) —
  {
    icon: Gauge,
    q: "Jakie prędkości Internetu są dostępne?",
    a: "Konfigurator obsługuje pięć prędkości stacjonarnych: 150 Mb/s, 300 Mb/s, 600 Mb/s, 1000 Mb/s i 2000 Mb/s. Najwyższa (2 Gb/s) dostępna jest w technologii PON. Faktyczna dostępność prędkości zależy od technologii pokrycia pod Twoim adresem.",
    category: "Internet",
  },
  {
    icon: Tv,
    q: "Czym różnią się pakiety telewizyjne S, M i L?",
    a: "Pakiet S „Coś na Start” to wybór podstawowy, M „Najpopularniejszy” zawiera szerszy zestaw kanałów (sport, filmy), L „Dla Wymagających” to najbogatszy pakiet z największą liczbą kanałów. Pełna lista kanałów jest dostępna na stronie „Lista Kanałów”.",
    category: "Telewizja",
  },
  {
    icon: Package,
    q: "Jakie dodatki mogę dodać do pakietu?",
    a: "Konfigurator obsługuje: Multiroom (standardowy i 4K), Giga Nagrywarka Maxi, Bezpieczny Internet, Stałe IP, kanały premium (HBO + MAX, Canal+ Select, Canal+ Prestige, Eleven Sports, Polsat Sport Premium, FilmBox, Cinemax, Dla Dorosłych, Dla Dzieci, Pakiet Ukraina) oraz streaming Disney+ i SkyShowtime.",
    category: "Inne usługi",
  },
  {
    icon: Smartphone,
    q: "Jak działają usługi mobilne 5G?",
    a: "Trzy plany 5G: SUPER (60 GB w PL + 8,5 GB roaming UE, 30 zł po 6 mies. 0 zł), VIP (100 GB + 11 GB, 40 zł), GIGA (200 GB + 15 GB, 60 zł). Wszystkie z nielimitowanymi połączeniami i SMS w kraju, umową na 24 miesiące i bez opłaty aktywacyjnej.",
    category: "Mobile",
  },
  {
    icon: FileCheck,
    q: "Czy mogę zmienić pakiet w trakcie umowy?",
    a: "Podwyższenie prędkości lub rozszerzenie pakietu TV (np. dodanie kanałów premium) jest możliwe w trakcie umowy bez jej wydłużania. Obniżenie pakietu może wiązać się z dodatkowymi warunkami — sprawdź to u konsultanta.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: Wallet,
    q: "Czy montaż jest płatny?",
    a: "Tak — w cenniku istnieje jednorazowa opłata aktywacyjna (osobne pozycje dla Internetu, Telewizji, Multiroom, usług mobilnych i HBO Max). Konfigurator pokazuje sumę aktywacji dla wybranych usług w sekcji „Opłata aktywacyjna (jednorazowa)”.",
    category: "Zamówienie i instalacja",
  },

  // — FAQ_ITEMS (promocja Max 1000 / Max 2000) —
  {
    icon: Package,
    q: "Co dokładnie dostaję w pakiecie Max 1000 i Max 2000?",
    a: "Max 1000: Internet do 1000 Mb/s + Telewizja L 4K z Dekoderem + Bezpieczny Internet Ultra (ochrona 5 urządzeń + CyberEkspert). Max 2000: to samo, ale z Internetem do 2000 Mb/s (technologia PON). W obu opcjonalnie SoundBox 4K za +30 zł/mies.",
    category: "Internet",
  },
  {
    icon: Wallet,
    q: "Ile naprawdę zapłacę przez pierwsze 12 miesięcy?",
    a: "Przez pierwsze 12 miesięcy abonament wynosi 0 zł. Płatne są jedynie opłaty aktywacyjne na pierwszej fakturze: 79 zł za Internet i 2 zł za Telewizję (łącznie 81 zł jednorazowo).",
    category: "Umowy i rozliczenia",
  },
  {
    icon: TrendingUp,
    q: "Ile kosztuje pakiet od 13. miesiąca?",
    a: "Max 1000 = 140 zł/mies., Max 2000 = 160 zł/mies. — te ceny obowiązują od 13. do 24. miesiąca. Po 24 miesiącach cena abonamentu rośnie o 10 zł zgodnie z regulaminem.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: FileCheck,
    q: "Czy muszę spełnić jakieś warunki, żeby cena pozostała na poziomie 140/160 zł?",
    a: "Tak — wymagana jest e-faktura (rabat 5 zł) i zgody marketingowe (rabat 5 zł). Jeśli zrezygnujesz z tych zgód lub e-faktury, cena wzrośnie o 10 zł.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: FileText,
    q: "Na jak długo jest umowa?",
    a: "Umowa zawierana jest na czas określony 24 pełnych okresów rozliczeniowych. Pierwsze 12 mies. abonamentu za 0 zł, kolejne 12 mies. według tabeli cen.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: Tv,
    q: "Czy mogę dokupić pakiety filmowe lub sportowe?",
    a: "Tak — dostępne dopłaty: HBO + HBO Max (+25 zł), Canal+ Prestige (+50 zł), Canal+ Select (+35 zł), Polsat Sport Premium (+20 zł), Eleven Sports (+10 zł), Polsat Sport Premium + Eleven Sports (+20 zł), FilmBox (+10 zł), Dla Dorosłych (+10 zł).",
    category: "Telewizja",
  },
  {
    icon: XCircle,
    q: "Czy w ofercie jest Disney+ lub SkyShowtime?",
    a: "Nie. W tej promocji nie ma usług streamingowych Disney+ i SkyShowtime. Dostępne są klasyczne pakiety telewizyjne i premium opisane wyżej.",
    category: "Telewizja",
  },
  {
    icon: Gauge,
    q: "W jakiej technologii dostępna jest prędkość 2 Gb/s?",
    a: "Maksymalna prędkość 2 Gb/s dostępna jest w technologii PON. W technologiach HFC lub ETTH maksymalna prędkość może być inna — sprawdź dostępność pod swoim adresem przed zamówieniem.",
    category: "Internet",
  },

  // — faqs (oferty specjalne) —
  {
    icon: Router,
    q: "Co dokładnie dostaję w wybranym pakiecie?",
    a: "Każdy pakiet zawiera internet światłowodowy Netii oparty o sieć Orange, telewizję z dekoderem oraz router w cenie abonamentu. Szczegółowa lista sprzętu i usług znajduje się przy każdej ofercie powyżej.",
    category: "Internet",
  },
  {
    icon: CreditCard,
    q: "Ile naprawdę zapłacę przez pierwsze miesiące?",
    a: "W pakietach oznaczonych jako „Abonament 6 miesięcy za 0 zł” przez pierwsze 6 miesięcy nie płacisz nic — opłata w wysokości podanej przy ofercie nalicza się od kolejnego okresu rozliczeniowego, zgodnie z regulaminem promocji.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: CalendarClock,
    q: "Na jak długo zawierana jest umowa?",
    a: "W zależności od wybranej oferty umowa obowiązuje przez 24 pełne okresy rozliczeniowe. Dokładny czas trwania i warunki znajdziesz w regulaminie danej promocji.",
    category: "Umowy i rozliczenia",
  },
  {
    icon: Gauge,
    q: "Czy prędkość internetu jest gwarantowana?",
    a: "Prędkości podane w ofertach to prędkości maksymalne dostępne w danej technologii i lokalizacji. Realna prędkość może zależeć od parametrów łącza dostępnych pod konkretnym adresem.",
    category: "Internet",
  },
  {
    icon: Tv,
    q: "Czy mogę dokupić dodatkowe pakiety telewizyjne?",
    a: "Tak, do każdej oferty możesz dokupić pakiety premium, takie jak kanały sportowe czy filmowe, a także dodatkowy dekoder do kolejnego telewizora.",
    category: "Telewizja",
  },
  {
    icon: ShieldCheck,
    q: "Jak szybko mogę zamówić wybraną ofertę?",
    a: "Wystarczy zadzwonić lub wysłać SMS z tego miejsca — nasz doradca oddzwoni w kilka minut i przeprowadzi Cię przez cały proces zamówienia.",
    category: "Zamówienie i instalacja",
  },
];

/* ---------- pieces ---------- */

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap border cursor-pointer transition-colors"
      style={
        active
          ? { background: c.accent, borderColor: c.accent, color: "#ffffff" }
          : { background: c.card, borderColor: c.border, color: c.text }
      }
    >
      {label}
      <span
        className="text-[11.5px] font-bold px-1.5 py-0.5 rounded-full"
        style={
          active
            ? { background: "rgba(255,255,255,.22)", color: "#ffffff" }
            : { background: c.accentDim, color: c.accent }
        }
      >
        {count}
      </span>
    </button>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors"
      style={{ background: c.card, border: `1px solid ${c.border}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer border-0 bg-transparent text-left"
      >
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: c.accentDim, color: c.accent }}
        >
          <Icon size={17} />
        </div>
        <div className="font-bold text-[14.5px] flex-1" style={{ color: c.text }}>
          {item.q}
        </div>
        <ChevronDown
          size={18}
          style={{
            color: c.faint,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s ease",
          }}
        />
      </button>
      {open && (
        <div
          className="px-5 pb-4 pl-[4.4rem] text-[14px] leading-relaxed"
          style={{ color: c.muted }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function FaqPage() {
  const [active, setActive] = useState<Category | "Wszystkie">("Wszystkie");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("Wszystkie", FAQ_ITEMS.length);
    for (const cat of CATEGORIES) {
      map.set(cat, FAQ_ITEMS.filter((i) => i.category === cat).length);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = active === "Wszystkie" || item.category === active;
      const matchesQuery =
        q.length === 0 || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [active, query]);

  return (
    <div style={{ background: c.pageBg, color: c.text }} className="font-sans min-h-screen">
      <div className="max-w-[860px] mx-auto px-5 py-8 pt-36">
        {/* HERO */}
        <div
          className="rounded-[26px] px-8 md:px-10 py-9"
          style={{
            background: `linear-gradient(120deg, ${c.hero1} 0%, ${c.hero2} 55%, ${c.hero3} 100%)`,
          }}
        >
          <h1 className="text-[30px] md:text-[36px] font-extrabold tracking-tight text-white">
            Najczęstsze pytania
          </h1>
          <p className="text-[14.5px] md:text-[15px] mt-2" style={{ color: "rgba(255,255,255,.72)" }}>
            Krótko i na temat: odpowiedzi techniczne i sprzedażowe.
          </p>
        </div>

        {/* TOOLBAR: search + category pills */}
        <div
          className="rounded-[22px] mt-[-14px] mx-2 px-5 md:px-7 pt-6 pb-5 relative"
          style={{ background: c.card, border: `1px solid ${c.border}` }}
        >
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ border: `1px solid ${c.border}` }}
          >
            <Search size={18} style={{ color: c.faint }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wyszukaj w FAQ i dokumentach..."
              className="w-full bg-transparent outline-none text-[14.5px]"
              style={{ color: c.text }}
            />
          </div>

          <div className="flex flex-wrap gap-2.5 mt-4">
            <CategoryPill
              label="Wszystkie"
              count={counts.get("Wszystkie") ?? 0}
              active={active === "Wszystkie"}
              onClick={() => setActive("Wszystkie")}
            />
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                count={counts.get(cat) ?? 0}
                active={active === cat}
                onClick={() => setActive(cat)}
              />
            ))}
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="flex flex-col gap-3 mt-6">
          {filtered.length === 0 ? (
            <div
              className="rounded-2xl px-6 py-10 text-center text-[14.5px]"
              style={{ background: c.card, border: `1px solid ${c.border}`, color: c.muted }}
            >
              Nie znaleziono pytań pasujących do wyszukiwania.
            </div>
          ) : (
            filtered.map((item, i) => <FaqRow key={i} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}