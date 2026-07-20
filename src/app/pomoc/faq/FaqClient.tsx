"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowRight,  
  Wifi,
  Antenna,
  MonitorPlay,
  Layers,
  Users,
  MapPin,
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
import { CATEGORIES, FAQ_ITEMS, type Category, type FaqItem } from "./faqPomocData";
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








/* ---------- animations (global keyframes) ---------- */

const ANIM_CSS = `
@keyframes faqFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}


.faq-fade-up  { animation: faqFadeUp .55s cubic-bezier(.22,.8,.32,1) both; }


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
.faq-fade-up { animation: none; }
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

      <g >
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
      <g>
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
  const [open, setOpen] = useState(false);
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