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
  Wallet,
  TrendingUp,
  FileCheck,
  CalendarClock,
  MapPin,
  type LucideIcon,
} from "lucide-react";

/**
 * ObjectionsFaqSection
 * Samodzielny komponent FAQ — ta sama anatomia co w referencyjnym FaqPage
 * (ciemne hero z wyszukiwarką i pigułkami kategorii + jasna lista rozwijanych
 * kart), ale treść jest tu dobrana pod konkretne obiekcje klientów przy
 * wyborze internetu/TV (umowa, cena, prędkość, instalacja) — nie ogólny
 * spis pytań, tylko odpowiedzi, które mają realnie usuwać wahanie przed
 * telefonem/SMS-em.
 *
 * Dane są wbudowane w plik (bez zewnętrznego ./faqPomocData), żeby
 * komponent dało się wstawić samodzielnie w dowolnym miejscu strony.
 */

/* ---------- design tokens ---------- */
const c = {
  heroBg: "rgb(9, 33, 50)",
  heroDeep: "rgb(6, 24, 38)",
  heroInner: "rgb(17, 51, 74)",
  heroBorder: "rgba(255,255,255,.1)",
  heroText: "#eef5f7",
  heroMuted: "#a7b9c6",
  heroFaint: "#6f8798",

  pageBg: "#eef2f5",
  card: "#ffffff",
  cardBorder: "rgba(13, 45, 66, .08)",
  text: "#10344c",
  muted: "#54697a",
  faint: "#93a6b3",

  accent: "#2dd9c4",
  accentDark: "#0fae9c",
  accentDim: "rgba(45,217,196,.14)",
  accentDimLight: "rgba(15,174,156,.1)",
  accentBorder: "rgba(45,217,196,.32)",
};

/* ---------- data — obiekcje pogrupowane tematycznie ---------- */

const CATEGORIES = ["Umowa", "Cena", "Prędkość i jakość", "Instalacja"] as const;
type Category = (typeof CATEGORIES)[number];

interface FaqItem {
  q: string;
  a: string;
  category: Category;
  icon: LucideIcon;
  more?: { href: string; label: string };
}

const FAQ_ITEMS: FaqItem[] = [
  // Umowa
  {
    category: "Umowa",
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    category: "Umowa",
    icon: CalendarClock,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
  {
    category: "Umowa",
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    category: "Umowa",
    icon: FileCheck,
    q: "Kto zajmuje się formalnościami przy przejściu, np. cesją numeru?",
    a: "My. Wypełniamy i pilnujemy dokumentów przeniesienia numeru oraz kontaktu ze starym operatorem, żebyś nie musiał tego robić sam. Cały proces koordynuje jeden doradca, z którym możesz się kontaktować na bieżąco.",
  },

  // Cena
  {
    category: "Cena",
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł. Router, dekoder 4K i aplikacja Netia GO są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
  {
    category: "Cena",
    icon: Wallet,
    q: "Czy po jakimś czasie pojawią się ukryte opłaty?",
    a: "Nie. Cenę obowiązującą po zakończeniu promocji znasz już w momencie podpisania umowy — żadnych niespodzianek na fakturze.",
  },
  {
    category: "Cena",
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    a: "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + Telewizję S (umowa 24-miesięczna). Ostateczna cena zależy od technologii dostępnej pod Twoim adresem.",
  },
  {
    category: "Cena",
    icon: TrendingUp,
    q: "Mam teraz promocję u obecnego dostawcy — czy zmiana się opłaca?",
    a: "Sprawdzimy Twoją obecną cenę telefonicznie i pokażemy realne porównanie — bez naciągania. W większości przypadków nasza oferta jest konkurencyjna już od pierwszego miesiąca, a stała cena obowiązuje przez całą umowę.",
  },

  // Prędkość i jakość
  {
    category: "Prędkość i jakość",
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
  },
  {
    category: "Prędkość i jakość",
    icon: Router,
    q: "Czy mogę używać własnego routera?",
    a: "Tak — musi być kompatybilny z technologią światłowodową. Jeśli wolisz, dostarczymy nowoczesny router w cenie abonamentu.",
  },
  {
    category: "Prędkość i jakość",
    icon: Wrench,
    q: "Co jeśli wystąpi awaria po instalacji?",
    a: "Wsparcie techniczne działa 24/7. W razie potrzeby wysyłamy technika na miejsce — nie zostajesz z problemem sam.",
  },

  // Instalacja
  {
    category: "Instalacja",
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy. Sama instalacja w lokalu trwa około 1,5 godziny. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
  },
  {
    category: "Instalacja",
    icon: Home,
    q: "Czy muszę być w domu podczas instalacji?",
    a: "Tak, potrzebujemy Twojej obecności na czas montażu — zwykle 30–90 minut. Termin ustalisz bezpośrednio z technikiem po kontakcie z nami.",
  },
  {
    category: "Instalacja",
    icon: MapPin,
    q: "Planuję się niedługo przeprowadzić — czy to ma sens?",
    a: "Tak — usługę przenosimy razem z Tobą na nowy adres bez dodatkowych kar. Jeśli światłowód nie dotrze jeszcze do nowej lokalizacji, doradca podpowie najlepsze rozwiązanie na czas przeprowadzki.",
  },
];

/* ---------- animations (global keyframes) ---------- */

const ANIM_CSS = `
@keyframes objFaqFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.obj-faq-fade-up { animation: objFaqFadeUp .55s cubic-bezier(.22,.8,.32,1) both; }

.obj-faq-card { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.obj-faq-card:hover { transform: translateY(-2px); }

.obj-faq-pill { transition: filter .15s ease; }
.obj-faq-pill:hover { filter: brightness(1.18); }

.obj-faq-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .3s cubic-bezier(.22,.8,.32,1);
}
.obj-faq-collapse.open { grid-template-rows: 1fr; }
.obj-faq-collapse > div { overflow: hidden; min-height: 0; }
.obj-faq-collapse .obj-faq-answer { opacity: 0; transition: opacity .25s ease .05s; }
.obj-faq-collapse.open .obj-faq-answer { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .obj-faq-fade-up { animation: none; }
  .obj-faq-card, .obj-faq-pill, .obj-faq-collapse, .obj-faq-collapse .obj-faq-answer { transition: none; }
  .obj-faq-card:hover { transform: none; }
}
`;

/* ---------- illustration (dymki pytanie + Wi-Fi) ---------- */

function HeroBubbles() {
  return (
    <svg
      viewBox="0 0 300 240"
      className="w-[220px] md:w-[280px] h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="objFbTeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ee8d3" />
          <stop offset="100%" stopColor="#0e9d8e" />
        </linearGradient>
        <linearGradient id="objFbNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d5a80" />
          <stop offset="100%" stopColor="#0c2c44" />
        </linearGradient>
      </defs>

      <ellipse cx="165" cy="224" rx="105" ry="11" fill="#02121d" opacity=".35" />

      <g>
        <path
          d="M138 18c-58 0-104 38-104 86 0 47 46 85 104 85 10 0 20-1 29-3l34 22-6-34c29-16 47-42 47-70 0-48-46-86-104-86z"
          fill="url(#objFbTeal)"
        />
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

      <g>
        <path
          d="M228 78c-38 0-68 25-68 56 0 31 30 56 68 56 7 0 13-1 19-2l24 16-4-24c18-11 29-27 29-46 0-31-30-56-68-56z"
          fill="url(#objFbNavy)"
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
      className="obj-faq-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap border cursor-pointer"
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

function FaqRow({ item, delay = 0 }: { item: FaqItem; delay?: number }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="obj-faq-card obj-faq-fade-up rounded-2xl overflow-hidden"
      style={{
        background: c.card,
        border: `1px solid ${open ? "rgba(15,174,156,.35)" : c.cardBorder}`,
        boxShadow: open ? "0 10px 30px rgba(13,45,66,.1)" : "0 2px 10px rgba(13,45,66,.05)",
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

      <div className={`obj-faq-collapse${open ? " open" : ""}`}>
        <div>
          <div className="obj-faq-answer px-5 pb-5 pl-[4.4rem]">
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

/* ---------- component ---------- */

export default function ObjectionsFaqSection() {
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
    <div style={{ background: c.pageBg }} className="font-sans">
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />

      {/* ===== HERO — ciemna strefa ===== */}
      <div
        style={{
          background: `radial-gradient(140% 180% at 85% -30%, ${c.heroInner} 0%, ${c.heroBg} 45%, ${c.heroDeep} 100%)`,
          borderBottom: `1px solid ${c.heroBorder}`,
        }}
      >
        <div className="max-w-[920px] mx-auto px-5 pt-14 pb-10 md:pt-16 md:pb-12">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 max-w-[560px]">
              <h2
                className="obj-faq-fade-up text-[28px] md:text-[34px] font-extrabold tracking-tight"
                style={{ color: c.heroText }}
              >
                Najczęstsze wątpliwości
              </h2>
              <p
                className="obj-faq-fade-up text-[14.5px] md:text-[15px] mt-2"
                style={{ color: c.heroMuted, animationDelay: "80ms" }}
              >
                Odpowiedzi na to, co najczęściej powstrzymuje przed zmianą dostawcy — umowa, cena,
                prędkość i instalacja.
              </p>

              <div
                className="obj-faq-fade-up flex items-center gap-3 rounded-full px-5 py-3 mt-6 transition-colors focus-within:border-[rgba(45,217,196,.5)]"
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

            <div
              className="obj-faq-fade-up hidden md:block flex-shrink-0 -mb-6"
              style={{ animationDelay: "200ms" }}
            >
              <HeroBubbles />
            </div>
          </div>

          <div
            className="obj-faq-fade-up flex gap-2.5 mt-7 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible"
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

      {/* ===== LISTA — jasna strefa ===== */}
      <div className="max-w-310 mx-auto px-5 py-8 pb-16">
        <div className="max-w-[885px] mx-auto flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div
              className="obj-faq-fade-up rounded-2xl px-6 py-10 text-center text-[14.5px]"
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
              <FaqRow key={item.q} item={item} delay={Math.min(i, 10) * 45} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}