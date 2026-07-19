"use client";

import {
  Wifi,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Gauge,
  Wallet,
  FileText,
} from "lucide-react";
import { useState, useRef, useEffect, type ReactNode, type ElementType } from "react";

/* ---------- design tokens ----------
   bg matches the earlier request: rgb(11, 42, 61).
   Everything else (card / cardAlt / borders) is a tint or line of
   that same navy so the page reads as one material. Same palette as
   the TV help page so both read as one product. */
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
};

/* ---------- scroll-reveal system ----------
   IntersectionObserver-based, NOT on-load. Each <Reveal> only animates
   the first time it crosses into the viewport while scrolling, then
   stops observing. Respects prefers-reduced-motion. */

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useRevealOnScroll(threshold = 0.12) {
  // FIX (a11y): typ zawężony do HTMLElement (nie tylko HTMLDivElement),
  // bo Reveal może się teraz renderować jako <li> zamiast <div>.
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

type RevealProps = {
  children: ReactNode;
  /** stagger, in seconds */
  delay?: number;
  /** subtle vertical rise on entry (px) */
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * FIX (a11y — "Elementy list (<li>) nie znajdują się wewnątrz [...]"):
   * Reveal domyślnie renderuje <div>. Gdy owija element listy, musi
   * renderować się jako <li> SAM W SOBIE (zamiast owijać <li> divem),
   * inaczej <li> przestaje być bezpośrednim dzieckiem <ul>/<ol> i
   * czytniki ekranu nie rozpoznają struktury listy. Animacja (opacity/
   * transform) jest identyczna niezależnie od tagu.
   */
  as?: "div" | "li";
};

function Reveal({ children, delay = 0, y = 18, className, style, as = "div" }: RevealProps) {
  const { ref, visible } = useRevealOnScroll();
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

/* Wraps a list of children, giving each a small incremental stagger.
   Used for groups of pills so they cascade in rather than popping
   together. */
function RevealGroup({
  children,
  step = 0.06,
  y = 14,
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

/* Pills can act as in-page anchor links. Passing a `targetId` makes
   the pill smooth-scroll to that section's id, offset for the sticky
   header height (see SCROLL_OFFSET below). */
const SCROLL_OFFSET = 140; // px – tweak if the fixed header height changes

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

function Pill({
  icon,
  children,
  targetId,
  href,
}: {
  icon?: ReactNode;
  children: ReactNode;
  targetId?: string;
  href?: string;
}) {
  const content = (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold cursor-pointer transition-colors hover:border-white/25"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}`, color: c.text }}
    >
      {icon}
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="no-underline">
        {content}
      </a>
    );
  }

  if (!targetId) return content;

  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(targetId);
      }}
      className="no-underline"
    >
      {content}
    </a>
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
          FIX (a11y): Reveal renderuje się teraz JAKO <li> (as="li"),
          zamiast owijać osobny <li> w <div>. <li> zostaje bezpośrednim
          dzieckiem <ul>, tak jak wymaga tego poprawna struktura listy.
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

function TechSection({
  id,
  name,
  desc,
  advantages,
  note,
}: {
  id: string;
  name: string;
  desc: string;
  advantages: string[];
  note: string;
}) {
  return (
    <div id={id} style={{ scrollMarginTop: SCROLL_OFFSET }}>
      <SectionHeading>{name}</SectionHeading>
      <Paragraph>{desc}</Paragraph>
      <AdvantagesBox items={advantages} />
      <Note>{note}</Note>
    </div>
  );
}

function SpecRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-start gap-1 md:gap-6 py-3 text-[13.5px]"
      style={{ borderBottom: last ? "none" : `1px solid ${c.border}` }}
    >
      <div className="font-bold md:w-[190px] flex-shrink-0" style={{ color: c.text }}>
        {label}
      </div>
      <div style={{ color: c.muted }}>{value}</div>
    </div>
  );
}

/* Full device card — photo, description, spec table, Wi-Fi tech bullets,
   supported speeds, cost line and manual link. Collapsible so the
   page stays scannable, matching the accordion pattern on Netia's
   own Pomoc → Internet page.

   Controlled (isOpen/onToggle) rather than owning its own state, so
   the parent page can guarantee only one router card is expanded at
   a time — opening one closes whichever other one was open. The
   expand/collapse itself animates via the CSS grid-template-rows
   0fr → 1fr trick, the only reliable way to transition to/from an
   "auto" height smoothly. */
function DeviceDetailCard({
  eyebrow,
  name,
  subtitle,
  image,
  description,
  specs,
  techTitle,
  techPoints,
  speedNote,
  costNote,
  manualLabel,
  isOpen,
  onToggle,
}: {
  eyebrow: string;
  name: string;
  subtitle: string;
  image: string;
  description: string[];
  specs: { label: string; value: string }[];
  techTitle: string;
  techPoints: string[];
  speedNote: string;
  costNote: string;
  manualLabel: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Reveal y={22}>
      <div
        className="rounded-2xl overflow-hidden mb-4 text-left"
        style={{
          background: c.card,
          border: `1px solid ${isOpen ? c.tealBorder : c.border}`,
          transition: "border-color .35s ease",
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 cursor-pointer border-0 bg-transparent text-left"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: "#ffffff", border: `1px solid ${c.border}` }}
            >
              <img src={image} alt={name} className="w-full h-full object-contain p-1.5" />
            </div>
            <div>
              <div className="text-[12.5px] mb-1" style={{ color: c.faint }}>
                {eyebrow}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-extrabold text-[16px]" style={{ color: c.text }}>
                  {name}
                </div>
              </div>
              <div className="text-[13px] mt-0.5" style={{ color: c.muted }}>
                {subtitle}
              </div>
            </div>
          </div>
          <ChevronDown
            size={20}
            style={{
              color: c.teal,
              flexShrink: 0,
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .35s cubic-bezier(.16,1,.3,1)",
            }}
          />
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
              className="px-6 pb-6"
              style={{
                borderTop: `1px solid ${c.border}`,
                opacity: isOpen ? 1 : 0,
                transition: `opacity ${isOpen ? ".35s ease .1s" : ".15s ease"}`,
              }}
            >
              <div className="pt-5 flex flex-col sm:flex-row gap-5">
                <div
                  className="w-full sm:w-[180px] flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{ background: "#ffffff", border: `1px solid ${c.border}`, minHeight: 160 }}
                >
                  <img src={image} alt={name} className="w-full h-full object-contain p-3" />
                </div>
                <div className="flex-1">
                  <div
                    className="inline-flex items-center gap-2 text-[11.5px] tracking-wide uppercase font-bold px-3 py-1 rounded-full mb-3"
                    style={{ color: c.teal, background: c.tealDim, border: `1px solid ${c.tealBorder}` }}
                  >
                    Opis urządzenia
                  </div>
                  {description.map((p, i) => (
                    <p key={i} className="text-[14.5px] leading-relaxed mb-3" style={{ color: c.muted }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div
                  className="inline-flex items-center gap-2 text-[11.5px] tracking-wide uppercase font-bold px-3 py-1 rounded-full mb-3"
                  style={{ color: c.teal, background: c.tealDim, border: `1px solid ${c.tealBorder}` }}
                >
                  Specyfikacja techniczna
                </div>
                <div
                  className="rounded-xl px-5"
                  style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
                >
                  {specs.map((s, i) => (
                    <SpecRow key={i} label={s.label} value={s.value} last={i === specs.length - 1} />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="font-bold text-[14px] mb-2" style={{ color: c.text }}>
                  {techTitle}
                </div>
                {/* FIX (a11y): jak w AdvantagesBox — Reveal jako <li> zamiast owijania go w <div>. */}
                <ul>
                  {techPoints.map((t, i) => (
                    <Reveal
                      key={i}
                      as="li"
                      className="flex items-start gap-2.5 py-1 text-[14px]"
                      style={{ color: c.muted }}
                    >
                      <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
                      {t}
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div
                className="mt-5 rounded-xl px-5 py-4 flex flex-col gap-3"
                style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
              >
                <div className="flex items-start gap-3">
                  <Gauge size={17} style={{ color: c.teal, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-bold text-[13.5px]" style={{ color: c.text }}>
                      Prędkość Internetu Światłowodowego Netia
                    </div>
                    <div className="text-[13.5px]" style={{ color: c.muted }}>
                      {speedNote}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wallet size={17} style={{ color: c.teal, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-bold text-[13.5px]" style={{ color: c.text }}>
                      Koszt routera zawarty w umowie
                    </div>
                    <div className="text-[13.5px]" style={{ color: c.muted }}>
                      {costNote}
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-[13.5px] font-semibold mt-4 no-underline hover:underline"
                style={{ color: c.teal }}
              >
                <FileText size={15} />
                {manualLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- page ---------- */

export default function NetiaInternetPomocPage() {
  // Accordion state shared across the three router cards, so opening
  // one automatically closes whichever other one was open — only one
  // can be expanded at a time.
  const [openDeviceKey, setOpenDeviceKey] = useState<string | null>(null);

  const toggleDevice = (key: string) => {
    setOpenDeviceKey((current) => (current === key ? null : key));
  };

  const pills = [
    <Pill key="faq" icon={<HelpCircle size={15} style={{ color: c.teal }} />} href="/pomoc/faq">
      Najczęstsze pytania
    </Pill>,
    <Pill key="pon" targetId="pon">
      PON
    </Pill>,
    <Pill key="etth" targetId="etth">
      ETTH
    </Pill>,
    <Pill key="hfc" targetId="hfc">
      HFC
    </Pill>,
    <Pill key="urz" targetId="urzadzenia">
      Urządzenia
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
                <Wifi size={22} />
              </div>
              <div>
                <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: c.text }}>
                  Internet
                </h1>
                <p className="text-[14px] mt-0.5" style={{ color: c.muted }}>
                  Informacje o technologiach w jakich świadczona jest usługa Internetu
                  światłowodowego Netia.
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
              Internet stacjonarny Netii opiera się głównie na nowoczesnych technologiach
              światłowodowych oraz sieciach hybrydowych. Najczęściej spotykane w zabudowie
              mieszkaniowej są trzy rozwiązania: PON, ETTH oraz HFC. Każde z nich działa w inny
              sposób, ale wszystkie mają wspólny cel — zapewnić stabilny i szybki dostęp do
              internetu dla użytkowników indywidualnych.
            </span>
          </Paragraph>

          <TechSection
            id="pon"
            name="PON – światłowód doprowadzony bezpośrednio do mieszkania"
            desc="Technologia PON (Passive Optical Network) to najnowszy i najbardziej efektywny sposób dostarczania internetu. Światłowód biegnie od centrali aż do lokalu abonenta, bez elementów aktywnych po drodze."
            advantages={[
              "bardzo wysokie prędkości (nawet do 2 Gb/s)",
              "stabilne łącze niezależne od odległości od nadajnika",
              "niskie opóźnienia — istotne przy grach, wideokonferencjach i streamingu",
            ]}
            note="To rozwiązanie typowe dla nowoczesnych osiedli oraz budynków, w których sieć została zmodernizowana."
          />

          <TechSection
            id="etth"
            name="ETTH – światłowód w budynku, Ethernet w lokalu"
            desc="W ETTH światłowód kończy się w piwnicy lub szachcie technicznym, a od tego punktu do mieszkań biegnie okablowanie Ethernet."
            advantages={[
              "bardzo wysokie prędkości",
              "przewidywalna stabilność",
              "niewielka wrażliwość na zakłócenia",
            ]}
            note="To często stosowany kompromis w starszych budynkach, gdzie trudno poprowadzić światłowód aż do lokalu."
          />

          <TechSection
            id="hfc"
            name="HFC – hybryda światłowodu i kabla koncentrycznego"
            desc="Technologia HFC (Hybrid Fiber Coax) łączy światłowód do budynku z koncentrykiem do mieszkania. Jest to typowa infrastruktura dawnych sieci telewizji kablowej."
            advantages={[
              "duża realna przepustowość",
              "odporność na warunki zewnętrzne",
              "możliwość jednoczesnego przesyłu internetu i sygnału telewizyjnego",
            ]}
            note="Jest to stabilne rozwiązanie w miejscach, gdzie modernizacja do pełnego światłowodu jest niemożliwa lub wymagałaby dużej ingerencji w budynek."
          />

          <div id="urzadzenia" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Urządzenia używane w Netii</SectionHeading>
            <Paragraph>
              Netia udostępnia abonentom sprzęt dostosowany do technologii, w jakiej działa
              usługa:
            </Paragraph>
          </div>

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych"
            name="HUAWEI HG8245Q"
            subtitle="Router ONT Combo z Wi-Fi 5"
            image="/images/LowRouter.webp"
            description={[
              "Huawei HG8245Q to stabilny i sprawdzony terminal optyczny GPON stosowany w instalacjach światłowodowych Netii. Urządzenie łączy funkcję routera Wi-Fi, gigabitowego przełącznika, bramy VoIP i optycznego ONT w jednej obudowie.",
              "Zaprojektowany do pracy ciągłej, oferuje pewne połączenie internetowe, obsługę usług IPTV oraz telefonię VoIP. Dwupasmowe Wi-Fi 2.4 / 5 GHz zapewnia stabilne działanie sieci bezprzewodowej w mieszkaniu, a cztery porty LAN ułatwiają podłączanie telewizora, konsoli lub komputera po kablu.",
              "Model ten świetnie sprawdza się w typowych domowych zastosowaniach, gdzie priorytetem jest pewność działania i stabilność.",
            ]}
            specs={[
              { label: "Światłowód / PON", value: "GPON ITU-T G.984, port optyczny SC/APC" },
              { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL (VoIP), 1× USB, zasilanie DC" },
              { label: "Wi-Fi (2.4 / 5 GHz)", value: "802.11 b/g/n + 802.11 a/n/ac, WPA/WPA2, WPS" },
              { label: "Funkcje", value: "NAT / DHCP / firewall, QoS, IPTV / VLAN, VoIP" },
              { label: "Wymiary", value: "285 × 190 × 85 mm" },
              { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
            ]}
            techTitle="Technologia Wi-Fi 5"
            techPoints={[
              "stabilne działanie 2.4 i 5 GHz",
              "mniejsze zakłócenia niż w starszych standardach",
              "pełna kompatybilność ze wszystkimi urządzeniami domowymi",
            ]}
            speedNote="Router Huawei HG8245Q jest instalowany przy prędkościach do 600 Mb/s, do 300 Mb/s, do 150 Mb/s."
            costNote="Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów."
            manualLabel="Instrukcja użytkownika Huawei HG8245Q"
            isOpen={openDeviceKey === "hg8245q"}
            onToggle={() => toggleDevice("hg8245q")}
          />

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 1 Gb/s"
            name="HUAWEI HG8245X6-10"
            subtitle="Router z Wi-Fi 6"
            image="/images/MidRouter.webp"
            description={[
              "Huawei HG8245X6-10 to nowoczesny terminal GPON wyposażony w technologię Wi-Fi 6. Zapewnia wyższą przepustowość, stabilność oraz lepszą obsługę wielu urządzeń równocześnie, co czyni go idealnym dla gospodarstw domowych z telewizorami 4K, konsolami, laptopami i systemami smart home.",
              "Router obsługuje szybkie połączenia bezprzewodowe, IPTV i VoIP, a cztery gigabitowe porty LAN umożliwiają podłączenie urządzeń wymagających maksymalnej stabilności. HG8245X6-10 pozwala w pełni wykorzystać możliwości światłowodu o prędkości do 1 Gb/s.",
            ]}
            specs={[
              { label: "Światłowód / PON", value: "GPON, port SC/APC" },
              { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL, 1× USB, zasilanie DC" },
              { label: "Wi-Fi 6 (802.11ax)", value: "2.4 i 5 GHz, OFDMA, MU-MIMO, WPA2 / WPA3*" },
              { label: "Funkcje", value: "IPTV / VLAN, NAT / DHCP / firewall, QoS, WPS" },
              { label: "Wymiary", value: "235 × 150 × 33 mm" },
              { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
            ]}
            techTitle="Technologia Wi-Fi 6"
            techPoints={[
              "wyższe prędkości i niższe opóźnienia",
              "streaming 4K/8K bez buforowania",
              "większa stabilność przy wielu urządzeniach",
              "lepszy zasięg i odporność na zakłócenia",
            ]}
            speedNote="Router Huawei HG8245X6-10 jest instalowany przy prędkościach do 1 Gb/s."
            costNote="Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów."
            manualLabel="Instrukcja użytkownika Huawei HG8245X6-10"
            isOpen={openDeviceKey === "hg8245x6"}
            onToggle={() => toggleDevice("hg8245x6")}
          />

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 2 Gb/s"
            name="HUAWEI HG8145B7N"
            subtitle="Router z Wi-Fi 7 i portem 2.5G LAN"
            image="/images/TopRouter.webp"
            description={[
              "Huawei HG8145B7N to najbardziej zaawansowany router dostępny w Netii. Wyposażony w najnowszy standard Wi-Fi 7 oraz port LAN 2.5 Gb/s, pozwala wykorzystać pełny potencjał światłowodu o prędkości do 2 Gb/s.",
              "Urządzenie obsługuje najnowocześniejsze funkcje, takie jak Multi-Link Operation, kanały 320 MHz i modulację 4096-QAM, co gwarantuje szybkie, stabilne i odporne na zakłócenia połączenie. Router idealnie sprawdza się w środowiskach o dużym obciążeniu — streaming 8K, VR, gaming, praca w chmurze i profesjonalne zestawy multimedialne.",
            ]}
            specs={[
              { label: "Światłowód / PON", value: "GPON / XG-PON, port SC/APC" },
              {
                label: "Porty",
                value: "1× LAN 2.5 Gb/s, 3× LAN 1 Gb/s, 2× TEL, 1× USB, zasilanie DC",
              },
              {
                label: "Wi-Fi 7 (802.11be)",
                value: "2.4 / 5 / 6 GHz, 320 MHz kanały, 4096-QAM, MLO, MU-MIMO, OFDMA",
              },
              { label: "Funkcje", value: "VoIP, IPTV, NAT / DHCP / firewall, QoS" },
              { label: "Wymiary", value: "250 × 160 × 40 mm" },
              { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
            ]}
            techTitle="Technologia Wi-Fi 7"
            techPoints={[
              "ultrawysokie prędkości",
              "najniższe opóźnienia",
              "praca na wielu pasmach jednocześnie (MLO)",
              "idealny do VR, 8K, gamingu i pracy profesjonalnej",
            ]}
            speedNote="Router Huawei HG8145B7N jest instalowany przy prędkościach do 2 Gb/s."
            costNote="Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów."
            manualLabel="Instrukcja użytkownika Huawei HG8145B7N"
            isOpen={openDeviceKey === "hg8145b7n"}
            onToggle={() => toggleDevice("hg8145b7n")}
          />

          <Note>
            Abonent nie musi kupować routera — sprzęt jest dzierżawiony i wymieniany przez Netię
            w razie awarii.
          </Note>
        </div>
      </div>
    </div>
  );
}