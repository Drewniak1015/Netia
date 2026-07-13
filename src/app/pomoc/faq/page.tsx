"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowRight,
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
   Układ „ciemny hero + jasna lista" — jak na inspiracji.
   Hero zostaje w palecie strony Pomocy (navy + teal),
   lista FAQ przechodzi na jasne karty dla lepszej czytelności. */
const c = {
  // hero (ciemna strefa)
  heroBg: "rgb(9, 33, 50)",
  heroDeep: "rgb(6, 24, 38)",
  heroInner: "rgb(17, 51, 74)",
  heroBorder: "rgba(255,255,255,.1)",
  heroText: "#eef5f7",
  heroMuted: "#a7b9c6",
  heroFaint: "#6f8798",

  // body (jasna strefa)
  pageBg: "#eef2f5",
  card: "#ffffff",
  cardBorder: "rgba(13, 45, 66, .08)",
  text: "#10344c", // pytania
  muted: "#54697a", // odpowiedzi
  faint: "#93a6b3", // chevrony nieaktywne

  // akcent
  accent: "#2dd9c4",
  accentDark: "#0fae9c", // teal na jasnym tle (kontrast)
  accentDim: "rgba(45,217,196,.14)",
  accentDimLight: "rgba(15,174,156,.1)",
  accentBorder: "rgba(45,217,196,.32)",
};

/* ---------- data ----------
   Wszystkie 35 pytań bez zmian.
   Uwaga: "Czy Bezpieczny Internet obejmuje kontrolę rodzicielską?"
   nadal ma placeholder — uzupełnij przed publikacją. */

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
  /** opcjonalny link „Dowiedz się więcej" pod odpowiedzią */
  more?: { label: string; href: string };
}

const FAQ_ITEMS: FaqItem[] = [
  // — TIER_1 —
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
    category: "Umowy i rozliczenia",
    more: { label: "Dowiedz się więcej", href: "/pomoc" },
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

/* ---------- animations (global keyframes) ---------- */

const ANIM_CSS = `
@keyframes faqFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes faqFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
@keyframes faqFloatAlt {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
.faq-fade-up  { animation: faqFadeUp .55s cubic-bezier(.22,.8,.32,1) both; }
.faq-float    { animation: faqFloat 5s ease-in-out infinite; }
.faq-float-alt{ animation: faqFloatAlt 4s ease-in-out .6s infinite; }

.faq-card { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.faq-card:hover { transform: translateY(-2px); }

.faq-pill { transition: filter .15s ease; }
.faq-pill:hover { filter: brightness(1.18); }

.faq-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .3s cubic-bezier(.22,.8,.32,1);
}
.faq-collapse.open { grid-template-rows: 1fr; }
.faq-collapse > div { overflow: hidden; min-height: 0; }
.faq-collapse .faq-answer { opacity: 0; transition: opacity .25s ease .05s; }
.faq-collapse.open .faq-answer { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .faq-fade-up, .faq-float, .faq-float-alt { animation: none; }
  .faq-card, .faq-pill, .faq-collapse, .faq-collapse .faq-answer { transition: none; }
  .faq-card:hover { transform: none; }
}
`;

/* ---------- illustration ----------
   Dymki „pytanie + Wi-Fi" — odchudzony SVG:
   bez filtrów feDropShadow (ciężkie w renderze),
   cień jako jedna elipsa, po jednym gradiencie na dymek,
   do tego delikatne pływanie (CSS, wyłączane przy reduced motion). */

function HeroBubbles() {
  return (
    <svg
      viewBox="0 0 300 240"
      className="w-[220px] md:w-[280px] h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fbTeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ee8d3" />
          <stop offset="100%" stopColor="#0e9d8e" />
        </linearGradient>
        <linearGradient id="fbNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d5a80" />
          <stop offset="100%" stopColor="#0c2c44" />
        </linearGradient>
      </defs>

      {/* cień pod całością — jedna elipsa zamiast filtrów */}
      <ellipse cx="165" cy="224" rx="105" ry="11" fill="#02121d" opacity=".35" />

      {/* dymek główny — znak zapytania */}
      <g className="faq-float">
        <path
          d="M138 18c-58 0-104 38-104 86 0 47 46 85 104 85 10 0 20-1 29-3l34 22-6-34c29-16 47-42 47-70 0-48-46-86-104-86z"
          fill="url(#fbTeal)"
        />
        {/* delikatny błysk — jedna półprzezroczysta ścieżka */}
        <path
          d="M70 62c18-25 46-38 74-38 20 0 38 6 53 16-38-13-85-4-112 27-8 9-13 19-16 30-2-12-1-24 1-35z"
          fill="rgba(255,255,255,.2)"
        />
        <text
          x="138"
          y="128"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="800"
          fontSize="96"
          fill="#ffffff"
        >
          ?
        </text>
      </g>

      {/* dymek drugi — Wi-Fi */}
      <g className="faq-float-alt">
        <path
          d="M228 78c-38 0-68 25-68 56 0 31 30 56 68 56 7 0 13-1 19-2l24 16-4-24c18-11 29-27 29-46 0-31-30-56-68-56z"
          fill="url(#fbNavy)"
        />
        <g stroke="#2dd9c4" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M198 130c17-15 43-15 60 0" />
          <path d="M208 143c11-10 29-10 40 0" />
        </g>
        <circle cx="228" cy="157" r="6" fill="#2dd9c4" />
      </g>
    </svg>
  );
}

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
      className="faq-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap border cursor-pointer"
      style={
        active
          ? { background: c.accent, borderColor: c.accent, color: "rgb(6, 26, 39)" }
          : {
              background: "rgba(255,255,255,.04)",
              borderColor: c.heroBorder,
              color: c.heroMuted,
            }
      }
    >
      {label}
      <span
        className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
        style={
          active
            ? { background: "rgba(6,26,39,.18)", color: "rgb(6, 26, 39)" }
            : { background: "rgba(255,255,255,.08)", color: c.heroFaint }
        }
      >
        {count}
      </span>
    </button>
  );
}

function FaqRow({
  item,
  defaultOpen = false,
  delay = 0,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
  delay?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = item.icon;

  return (
    <div
      className="faq-card faq-fade-up rounded-2xl overflow-hidden"
      style={{
        background: c.card,
        border: `1px solid ${open ? "rgba(15,174,156,.35)" : c.cardBorder}`,
        boxShadow: open
          ? "0 10px 30px rgba(13,45,66,.1)"
          : "0 2px 10px rgba(13,45,66,.05)",
        animationDelay: `${delay}ms`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer border-0 bg-transparent text-left"
      >
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{
            background: c.accentDimLight,
            border: "1px solid rgba(15,174,156,.2)",
            color: c.accentDark,
          }}
        >
          <Icon size={17} />
        </div>
        <div className="font-bold text-[14.5px] flex-1" style={{ color: c.text }}>
          {item.q}
        </div>
        <ChevronDown
          size={18}
          style={{
            color: open ? c.accentDark : c.faint,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .25s ease",
          }}
        />
      </button>

      {/* płynne rozwijanie: grid 0fr → 1fr */}
      <div className={`faq-collapse${open ? " open" : ""}`}>
        <div>
          <div className="faq-answer px-5 pb-5 pl-[4.4rem]">
            <p className="text-[14px] leading-relaxed" style={{ color: c.muted }}>
              {item.a}
            </p>
            {item.more && (
              <a
                href={item.more.href}
                className="inline-flex items-center gap-1.5 mt-3 text-[13.5px] font-bold no-underline"
                style={{ color: c.accentDark }}
              >
                {item.more.label}
                <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
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
    <div style={{ background: c.pageBg }} className="font-sans min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />

      {/* ===== HERO — ciemna strefa na pełną szerokość ===== */}
      <div
        style={{
          background: `radial-gradient(140% 180% at 85% -30%, ${c.heroInner} 0%, ${c.heroBg} 45%, ${c.heroDeep} 100%)`,
          borderBottom: `1px solid ${c.heroBorder}`,
        }}
      >
        <div className="max-w-[920px] mx-auto px-5 pt-32 pb-10 md:pb-12">
          <div className="flex items-center justify-between gap-8">
            {/* lewa kolumna: tytuł + search */}
            <div className="flex-1 max-w-[560px]">
              <h1
                className="faq-fade-up text-[28px] md:text-[34px] font-extrabold tracking-tight"
                style={{ color: c.heroText }}
              >
                Najczęstsze pytania
              </h1>
              <p
                className="faq-fade-up text-[14.5px] md:text-[15px] mt-2"
                style={{ color: c.heroMuted, animationDelay: "80ms" }}
              >
                Szybkie odpowiedzi na pytania o Internet, telewizję i usługi Netii.
              </p>

              {/* SEARCH */}
              <div
                className="faq-fade-up flex items-center gap-3 rounded-full px-5 py-3 mt-6 transition-colors focus-within:border-[rgba(45,217,196,.5)]"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${c.heroBorder}`,
                  animationDelay: "160ms",
                }}
              >
                <Search size={17} style={{ color: c.heroFaint, flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Wyszukaj wśród pytań..."
                  className="w-full bg-transparent outline-none text-[14.5px]"
                  style={{ color: c.heroText }}
                />
              </div>
            </div>

            {/* prawa kolumna: ilustracja */}
            <div
              className="faq-fade-up hidden md:block flex-shrink-0 -mb-6"
              style={{ animationDelay: "200ms" }}
            >
              <HeroBubbles />
            </div>
          </div>

          {/* CATEGORY PILLS */}
          <div
            className="faq-fade-up flex gap-2.5 mt-7 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible"
            style={{ scrollbarWidth: "none", animationDelay: "240ms" }}
          >
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
      </div>

      {/* ===== FAQ LIST — jasna strefa ===== */}
      <main className="max-w-310 mx-auto px-5 py-8 pb-16">
        <div className="max-w-[885px] mx-auto flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div
              className="faq-fade-up rounded-2xl px-6 py-10 text-center text-[14.5px]"
              style={{
                background: c.card,
                border: `1px solid ${c.cardBorder}`,
                color: c.muted,
              }}
            >
              Nie znaleziono pytań pasujących do wyszukiwania.
            </div>
          ) : (
            filtered.map((item, i) => (
              <FaqRow
                key={item.q + i}
                item={item}
                defaultOpen={i === 0 && active === "Wszystkie" && query.trim() === ""}
                delay={Math.min(i, 10) * 45}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}