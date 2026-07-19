"use client";

import {
  Smartphone,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Layers,
  Globe,
  Wifi,
  Phone,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/* ---------- design tokens ----------
   Same palette as the Internet / Telewizja help pages so all three
   read as one product. */
const c = {
  bg: "rgb(11, 42, 61)",
  bgDeep: "rgb(7, 28, 41)",
  card: "rgb(19, 55, 78)",
  cardAlt: "rgb(24, 66, 92)",
  border: "rgba(255,255,255,.08)",
  borderStrong: "rgba(255,255,255,.16)",
  teal: "#2dd9c4",
  tealDim: "rgba(45,217,196,.14)",
  tealBorder: "rgba(45,217,196,.3)",
  text: "#eef5f7",
  muted: "#a7b9c6",
  faint: "#71879a",
  pink: "#ff5fa8",
  purple: "#8b6bff",
  amber: "#ffb84d",
  lime: "#a4e94a",
};

const EASE = [0.16, 1, 0.3, 1] as const; // shared ease-out-expo-ish curve, same as Internet page

/* ---------- scroll helpers ---------- */

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* Reveal: fades + slides content up into view once, on scroll.
   Kept subtle and consistent so it reads as one motion language
   across the page rather than scattered effects.

   FIX (a11y — "Elementy list (<li>) nie znajdują się wewnątrz [...]"):
   dodany prop `as` ("div" | "li") i `style`. Kiedy Reveal owija element
   listy, musi renderować się JAKO <li> (motion.li), nie owijać osobny
   <li> w <motion.div> — inaczej <li> przestaje być bezpośrednim
   dzieckiem <ul>/<ol> i czytniki ekranu nie rozpoznają struktury listy.
   Animacja jest identyczna niezależnie od tagu. */
function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "li";
}) {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

/* Wraps a list of children, giving each a small incremental stagger —
   used for the hero pills and the advantage-list bullets so they
   cascade in rather than popping together all at once. */
function RevealGroup({
  children,
  step = 0.06,
  y = 12,
}: {
  children: ReactNode[];
  step?: number;
  y?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step} y={y}>
          {child}
        </Reveal>
      ))}
    </>
  );
}

/* ---------- small reusable pieces ---------- */

function Pill({
  icon,
  children,
  onClick,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold cursor-pointer transition-colors hover:border-white/25"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}`, color: c.text }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <Reveal y={14}>
      <h2 className="text-[22px] font-extrabold tracking-tight mt-12 mb-3" style={{ color: c.text }}>
        {children}
      </h2>
    </Reveal>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <Reveal y={10}>
      <p className="text-[14.5px] leading-relaxed mb-3" style={{ color: c.muted }}>
        {children}
      </p>
    </Reveal>
  );
}

function AdvantagesBox({ items }: { items: string[] }) {
  return (
    <Reveal y={16}>
      <div
        className="rounded-xl px-5 py-4 my-4"
        style={{ background: c.card, border: `1px solid ${c.border}` }}
      >
        <div className="text-[13px] font-bold mb-2" style={{ color: c.text }}>
          Zalety:
        </div>
        {/*
          FIX (a11y): każdy Reveal renderuje się teraz JAKO <li>
          (as="li") zamiast owijać osobny <li> w <motion.div> przez
          RevealGroup. <li> zostaje bezpośrednim dzieckiem <ul>.
        */}
        <ul>
          {items.map((a, i) => (
            <Reveal
              key={i}
              as="li"
              y={8}
              delay={i * 0.05}
              className="flex items-start gap-2.5 py-1 text-[14px]"
              style={{ color: c.muted }}
            >
              <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
              {a}
            </Reveal>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <Reveal y={8}>
      <p className="text-[13.5px] italic mb-3" style={{ color: c.faint }}>
        {children}
      </p>
    </Reveal>
  );
}

/* ---------- plan card (now an accordion, like the router cards on the
   Internet help page) ----------
   Collapsed, it's a compact price/name summary. Expanded, it reveals
   the full data/roaming/voice breakdown and description. Controlled
   from the parent so only one plan can be open at a time — opening
   one closes whichever other one was open, exactly like the router
   cards. The open/close itself animates via the CSS grid-template-rows
   0fr -> 1fr trick, the only reliable way to transition to/from an
   "auto" height smoothly. */
function PlanCard({
  name,
  price,
  promoNote,
  dataPoland,
  dataRoaming,
  description,
  accent,
  featured = false,
  isOpen,
  onToggle,
}: {
  name: string;
  price: string;
  promoNote: string;
  dataPoland: string;
  dataRoaming: string;
  description: string;
  accent: string;
  featured?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const rows: { icon: typeof Globe; label: string; value?: string }[] = [
    { icon: Globe, label: "Internet w Polsce", value: dataPoland },
    { icon: Wifi, label: "Internet w roamingu UE", value: dataRoaming },
    { icon: Phone, label: "Nielimitowane połączenia, SMS-y i MMS-y" },
  ];

  return (
    <Reveal y={22}>
      <div
        className="rounded-2xl overflow-hidden flex-1 min-w-[220px]"
        style={{
          background: c.card,
          border: `1px solid ${isOpen ? c.tealBorder : c.border}`,
          boxShadow: featured ? `0 12px 32px ${accent}26` : "none",
          transition: "border-color .35s ease",
        }}
      >
        {/* header — always visible, doubles as the toggle button */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full text-left border-0 cursor-pointer px-6 py-5"
          style={{
            background: `linear-gradient(120deg, ${accent} 0%, ${c.bgDeep} 165%)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {featured && (
                <div
                  className="inline-block text-[10.5px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2"
                  style={{ color: c.bgDeep, background: "rgba(255,255,255,.85)" }}
                >
                  Najczęściej wybierany
                </div>
              )}
              <div className="font-extrabold text-[17px]" style={{ color: "#fff" }}>
                {name}
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-[26px] font-extrabold" style={{ color: "#fff" }}>
                  {price}
                </span>
              </div>
              <div className="text-[12.5px] mt-0.5" style={{ color: "rgba(255,255,255,.75)" }}>
                {promoNote}
              </div>
            </div>
            <ChevronDown
              size={20}
              style={{
                color: "#fff",
                flexShrink: 0,
                marginTop: 2,
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .35s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </div>
        </button>

        {/* grid-rows trick: animates smoothly between 0fr (collapsed)
            and 1fr (natural content height), avoiding an instant
            show/hide while still supporting "auto" height content. */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows .4s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              className="px-6 pb-6 pt-5"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: `opacity ${isOpen ? ".35s ease .1s" : ".15s ease"}`,
              }}
            >
              <div className="flex flex-col gap-3 mb-4">
                {rows.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-[14px]"
                    style={{ color: c.text }}
                  >
                    <r.icon size={16} style={{ color: accent, flexShrink: 0 }} />
                    {r.value ? <span className="font-bold">{r.value}</span> : null}
                    <span style={{ color: c.muted }}>{r.label}</span>
                  </div>
                ))}
              </div>

              <div className="h-px mb-4" style={{ background: c.border }} />

              <p className="text-[13px] leading-relaxed" style={{ color: c.muted }}>
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- numbered step ---------- */

function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <Reveal y={10} delay={number * 0.05}>
      <div className="flex items-start gap-3.5 py-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[13px]"
          style={{ background: c.tealDim, border: `1px solid ${c.tealBorder}`, color: c.teal }}
        >
          {number}
        </div>
        <div className="text-[14px] pt-0.5" style={{ color: c.muted }}>
          {children}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- comparison table ---------- */

function ComparisonTable() {
  const rows: { label: string; values: [string, string, string] }[] = [
    { label: "Internet w Polsce", values: ["60 GB", "100 GB", "200 GB"] },
    { label: "Internet w roamingu UE", values: ["8.5 GB", "11 GB", "15 GB"] },
    { label: "Cena po promocji", values: ["30 zł/mc", "40 zł/mc", "60 zł/mc"] },
    { label: "Rozmowy i SMS/MMS", values: ["Nielimitowane", "Nielimitowane", "Nielimitowane"] },
  ];

  return (
    <Reveal y={16}>
      <div
        className="rounded-xl overflow-hidden my-4"
        style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
      >
        <div
          className="grid grid-cols-4 text-[13px] font-bold px-5 py-3"
          style={{ borderBottom: `1px solid ${c.border}`, color: c.text }}
        >
          <div>Cecha</div>
          <div className="text-center px-2" style={{ color: c.teal, borderLeft: `1px solid ${c.border}` }}>
            SUPER 5G
          </div>
          <div className="text-center px-2" style={{ color: c.pink, borderLeft: `1px solid ${c.border}` }}>
            VIP 5G
          </div>
          <div className="text-center px-2" style={{ color: c.lime, borderLeft: `1px solid ${c.border}` }}>
            GIGA 5G
          </div>
        </div>
        {rows.map((r, i) => (
          <Reveal key={i} y={10} delay={i * 0.06}>
            <div
              className="grid grid-cols-4 text-[13.5px] px-5 py-3"
              style={{
                borderBottom: i === rows.length - 1 ? "none" : `1px solid ${c.border}`,
                color: c.muted,
              }}
            >
              <div className="font-semibold" style={{ color: c.text }}>
                {r.label}
              </div>
              {r.values.map((v, j) => (
                <div key={j} className="text-center px-2" style={{ borderLeft: `1px solid ${c.border}` }}>
                  {v}
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}

/* ---------- page ---------- */

export default function NetiaUslugiMobilnePomocPage() {
  // Accordion state shared across the three plan cards, so opening
  // one automatically closes whichever other one was open — only one
  // can be expanded at a time. Mirrors the router-card behavior on
  // the Internet help page.
  const [openPlanKey, setOpenPlanKey] = useState<string | null>(null);

  const togglePlan = (key: string) => {
    setOpenPlanKey((current) => (current === key ? null : key));
  };

  const pills = [
    <Pill
      key="faq"
      icon={<HelpCircle size={15} style={{ color: c.teal }} />}
      onClick={() => (window.location.href = "/pomoc/faq")}
    >
      Najczęstsze pytania
    </Pill>,
    <Pill key="5g" onClick={() => scrollToId("5g")}>
      5G
    </Pill>,
    <Pill key="plany" onClick={() => scrollToId("plany")}>
      Plany
    </Pill>,
    <Pill key="funkcje" onClick={() => scrollToId("funkcje")}>
      Funkcje
    </Pill>,
    <Pill key="promocje" onClick={() => scrollToId("promocje")}>
      Promocje
    </Pill>,
  ];

  return (
    <div
      style={{
        backgroundColor: c.bg,
        color: c.text,
        backgroundImage: `radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)`,
        backgroundSize: "26px 26px",
      }}
      className="font-sans leading-relaxed"
    >
      <div className="max-w-[820px] mx-auto px-6 py-10 pt-36">
        {/* HERO CARD — reveals as a whole, pills cascade in slightly after */}
        <Reveal y={24}>
          <div
            className="rounded-[22px] px-8 md:px-10 py-9"
            style={{
              background: `radial-gradient(120% 160% at 0% 0%, ${c.cardAlt} 0%, ${c.bg} 55%, ${c.bgDeep} 100%)`,
              border: `1px solid ${c.borderStrong}`,
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: c.tealDim, border: `1px solid ${c.tealBorder}`, color: c.teal }}
              >
                <Smartphone size={22} />
              </div>
              <div>
                <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: c.text }}>
                  Usługi Mobilne
                </h1>
                <p className="text-[14px] mt-0.5" style={{ color: c.muted }}>
                  Pomoc z telefonem i usługami mobilnymi.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <RevealGroup step={0.05} y={8}>
                {pills}
              </RevealGroup>
            </div>
          </div>
        </Reveal>

        {/* CONTENT */}
        <div className="mt-2">
          <Paragraph>
            <span className="block mt-8">
              Netia Mobile 5G to usługa telefonii komórkowej działająca na bazie sieci operatora
              Plus. Dzięki temu klienci Netii mają dostęp do jednej z najnowocześniejszych sieci
              mobilnych w Polsce, obejmującej technologię 5G bez dodatkowych opłat.
            </span>
          </Paragraph>

          <div id="5g" className="scroll-mt-[140px]">
            <SectionHeading>Sieć 5G – szybkość i zasięg</SectionHeading>
            <Paragraph>
              Usługi mobilne Netii działają na infrastrukturze sieci Plus, która jest pierwszą w
              Polsce siecią 5G budowaną w paśmie 2600 TDD. Zapewnia to realnie najwyższą
              przepustowość – nawet do 600 Mb/s w warunkach optymalnych.
            </Paragraph>
            <AdvantagesBox
              items={[
                "zasięg 5G obejmuje ponad 20 mln mieszkańców Polski",
                "prędkości transmisji danych do 1 Gb/s w sieci mobilnej",
                "stabilne połączenie nawet w zatłoczonych miejscach",
                "5G dostępne bez dodatkowych opłat we wszystkich planach",
              ]}
            />
          </div>

          <div id="plany" className="scroll-mt-[140px]">
            <SectionHeading>Dostępne plany taryfowe</SectionHeading>
            <Paragraph>
              Netia oferuje trzy plany mobilne 5G, każdy z nielimitowanymi rozmowami, SMS-ami i
              MMS-ami w kraju. Rozwiń plan, aby zobaczyć pełne zestawienie:
            </Paragraph>

            <div className="flex flex-col gap-4 my-4">
              <PlanCard
                name="SUPER 5G"
                price="30 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="60 GB"
                dataRoaming="8.5 GB"
                accent={c.teal}
                description="Plan podstawowy z 60 GB transferu danych w Polsce i 8,5 GB w roamingu UE. Idealny dla osób, które korzystają z telefonu głównie do komunikacji i podstawowego przeglądania internetu."
                isOpen={openPlanKey === "super"}
                onToggle={() => togglePlan("super")}
              />
              <PlanCard
                name="VIP 5G"
                price="40 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="100 GB"
                dataRoaming="11 GB"
                accent={c.pink}
                description="Rozszerzony plan z 100 GB transferu danych w Polsce i 11 GB w roamingu UE. Polecany użytkownikom aktywnie korzystającym z multimediów, streamingu i mediów społecznościowych."
                featured
                isOpen={openPlanKey === "vip"}
                onToggle={() => togglePlan("vip")}
              />
              <PlanCard
                name="GIGA 5G"
                price="60 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="200 GB"
                dataRoaming="15 GB"
                accent={c.lime}
                description="Największy pakiet z 200 GB transferu danych w Polsce i 15 GB w roamingu UE. Stworzony dla najbardziej wymagających użytkowników – idealny jako mobilne centrum rozrywki."
                isOpen={openPlanKey === "giga"}
                onToggle={() => togglePlan("giga")}
              />
            </div>

            <Note>
              Wszystkie plany zawierają 6 miesięcy za 0 zł z rabatami, aktywację za 0 zł oraz
              umowę na 24 miesiące.
            </Note>
          </div>

          <div id="funkcje" className="scroll-mt-[140px]">
            <SectionHeading>Co zawiera każdy plan?</SectionHeading>
            <Paragraph>Niezależnie od wybranego planu, każdy abonent otrzymuje:</Paragraph>
            <AdvantagesBox
              items={[
                "nielimitowane rozmowy na numery komórkowe i stacjonarne w Polsce",
                "nielimitowane wiadomości SMS i MMS w kraju",
                "dostęp do sieci 5G bez dodatkowych opłat",
                "Wi-Fi Calling – dzwonienie przez sieć Wi-Fi w miejscach ze słabym zasięgiem",
                "VoLTE – połączenia głosowe najwyższej jakości przez sieć LTE",
                "roaming w UE zgodnie z regulacjami europejskimi",
              ]}
            />
          </div>

          <div id="promocje" className="scroll-mt-[140px]">
            <SectionHeading>Promocje i rabaty</SectionHeading>
            <Paragraph>Netia oferuje atrakcyjne promocje dla nowych klientów:</Paragraph>
            <AdvantagesBox
              items={[
                "6 miesięcy za 0 zł – po spełnieniu warunków promocji",
                "rabat za e-fakturę – 5 zł miesięcznie",
                "rabat za zgody marketingowe – 5 zł miesięcznie",
                "dodatkowy rabat przy łączeniu usług mobilnych ze światłowodem i telewizją",
                "możliwość zakupu telefonu na raty 0%",
              ]}
            />
            <Note>Szczegółowe warunki promocji dostępne są w regulaminie oferty.</Note>
          </div>

          <div id="przeniesienie-numeru" className="scroll-mt-[140px]">
            <SectionHeading>Przeniesienie numeru do Netii</SectionHeading>
            <Paragraph>Możesz łatwo przenieść swój obecny numer telefonu do Netii:</Paragraph>
            <Reveal y={16}>
              <div
                className="rounded-xl px-5 py-2 my-4"
                style={{ background: c.card, border: `1px solid ${c.border}` }}
              >
                <Step number={1}>Złóż zamówienie na usługę mobilną Netia.</Step>
                <Step number={2}>Podaj swój obecny numer telefonu i dane operatora.</Step>
                <Step number={3}>Netia zajmie się formalnościami przeniesienia.</Step>
                <Step number={4}>Otrzymasz nową kartę SIM i zachowasz dotychczasowy numer.</Step>
              </div>
            </Reveal>
            <Note>Proces przeniesienia numeru trwa zazwyczaj do kilku dni roboczych.</Note>
          </div>

          <div id="pakiety-laczone" className="scroll-mt-[140px]">
            <SectionHeading>Pakiety łączone – oszczędzaj więcej</SectionHeading>
            <Paragraph>
              Połączenie usług mobilnych z internetem światłowodowym i telewizją daje dodatkowe
              korzyści:
            </Paragraph>
            <AdvantagesBox
              items={[
                "niższa łączna cena abonamentu",
                "jedna faktura za wszystkie usługi",
                "bezpłatny dostęp do Disney+ przez cały okres zobowiązania (przy wybranych pakietach)",
                "możliwość rozłożenia opłaty aktywacyjnej na raty",
              ]}
            />
            <Reveal y={16}>
              <motion.a
                href="/konfigurator"
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group rounded-xl px-6 py-5 my-4 flex items-center justify-between gap-4 cursor-pointer no-underline"
                style={{
                  background: `linear-gradient(120deg, ${c.teal} 0%, #22b8a5 100%)`,
                  boxShadow: "0 8px 24px rgba(45,217,196,.25)",
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(7,28,41,.16)" }}
                  >
                    <Layers size={20} style={{ color: "white"}} />
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold" style={{ color: "white" }}>
                      Sprawdź konfigurator oferty
                    </div>
                    <div className="text-[12.5px] font-medium" style={{ color: "white" }}>
                      Dobierz usługi do swoich potrzeb
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  style={{ color: "white", flexShrink: 0 }}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </motion.a>
            </Reveal>
          </div>

          <div id="porownanie" className="scroll-mt-[140px]">
            <SectionHeading>Porównanie planów</SectionHeading>
            <Paragraph>Porównanie planów taryfowych SUPER, VIP i GIGA:</Paragraph>
            <ComparisonTable />
          </div>
        </div>
      </div>
    </div>
  );
}