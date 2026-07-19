"use client";

import {
  Tv,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  FileText,
  ImageIcon,
  RotateCcw,
  CloudUpload,
  Smartphone,
  Film,
  BookOpenText,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect, type ReactNode, type ElementType } from "react";
import {
  ADDONS,
  TIER_LABELS,
  TIER_CHANNEL_COUNTS,
  REGIONAL_TVP_CHANNELS_COUNT,
  channelsForTier,
  channelsForAddon,
  type Tier,
  type Channel,
} from "@/lib/channels";

/* ---------- design tokens ----------
   Same palette as the Internet help page so both read as one product. */
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
   Used for groups of cards/pills so they cascade in rather than
   popping together. */
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

/* ---------- copy that isn't in the data layer ----------
   Package/add-on numbers, logos, and tiers come straight from
   lib/channels.ts. Only the marketing blurbs live here, since that
   text doesn't belong in a data file. */
const TIER_DESCRIPTIONS: Record<Tier, string> = {
  xs: "Najmniejszy zestaw kanałów obejmujący kluczowe stacje ogólnotematyczne oraz komplet kanałów regionalnych TVP. Dobry wybór jako baza do dalszej rozbudowy pakietu.",
  s: "Podstawowy zestaw kanałów telewizyjnych obejmujący najpopularniejsze polskie stacje ogólnotematyczne, informacyjne i rozrywkowe. Doskonały wybór dla osób, które chcą mieć dostęp do sprawdzonych programów bez rozbudowanej oferty tematycznej.",
  m: "Rozszerzenie pakietu S o dodatkowe kanały tematyczne, takie jak filmy, sport, dokumenty i lifestyle. Zawiera wszystkie kanały z pakietu S plus znacznie więcej treści rozrywkowych i edukacyjnych. Idealny dla rodzin szukających większej różnorodności.",
  l: "Najpełniejszy pakiet telewizyjny Netii. Obejmuje wszystkie kanały z pakietów S i M, a dodatkowo zawiera szeroki wybór stacji premium, sportowych, filmowych i dla dzieci. Przeznaczony dla największych pasjonatów telewizji.",
};

const ADDON_DESCRIPTIONS: Record<string, string> = {
"canal-plus-prestige":
  "Najszerszy pakiet kanałów Canal+, obejmujący pełny zestaw stacji premium: filmowych, dokumentalnych, sportowych i tematycznych. Zawiera premiery, produkcje własne oraz transmisje sportowe o najwyższej randze.",

"canal-plus-select":
  "Podstawowa wersja pakietu Canal+, zapewniająca dostęp do kluczowych kanałów premium w jakości HD. Mniej rozbudowany niż Prestige, ale zawiera najważniejsze treści filmowe i serialowe marki Canal+.",

"cinemax-hd":
  "Dwa kanały przeznaczone dla widzów poszukujących ambitniejszego i mniej mainstreamowego kina. Oferują filmy z całego świata, produkcje niezależne, dramaty, thrillery oraz kino artystyczne.",

dzieci:
  "Zestaw bezpiecznych kanałów dziecięcych z bajkami, animacjami, programami edukacyjnymi i treściami familijnymi. Większość materiałów dostępna jest z polskim dubbingiem lub lektorem.",

dorosli:
  "Pakiet kanałów wyłącznie dla widzów pełnoletnich. Dostęp zabezpieczony kodem PIN, treści emitowane są w wyznaczonych godzinach i odseparowane od pozostałych kanałów.",

"eleven-sports":
  "Zestaw kanałów sportowych skupionych na europejskich ligach piłkarskich, motorsporcie i innych prestiżowych rozgrywkach. Oferuje transmisje na żywo, magazyny sportowe oraz analizy ekspertów.",

filmbox:
  "Grupa kanałów filmowych o szerokim przekroju gatunkowym: kino akcji, familijne, komedie, klasyki oraz kino niezależne. W pakiecie znajdują się również kanały tematyczne, takie jak Action czy Arthouse.",

hbo:
  "Pakiet obejmuje kanały HBO (HBO, HBO2 i HBO3) oraz dostęp do platformy Max. Oferuje premiery filmowe, seriale HBO Original oraz bogatą bibliotekę produkcji Warner Bros. Discovery.",

"polsat-sport-premium":
  "Pakiet dedykowany najważniejszym wydarzeniom sportowym, w tym europejskim rozgrywkom piłkarskim. Wybrane transmisje dostępne są również w jakości 4K, zgodnie z aktualną ramówką.",

ukraina:
  "Zestaw kanałów ukraińskich: informacyjnych, rozrywkowych, filmowych i muzycznych. Dedykowany osobom posługującym się językiem ukraińskim lub chcącym śledzić wydarzenia i kulturę regionu.",
};

/* ---------- small reusable pieces ---------- */

/* Pills can now optionally act as in-page anchor links. Passing a
   `targetId` makes the pill smooth-scroll to that section's id,
   offset for the sticky header height (see SCROLL_OFFSET below). */
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
    return <a href={href} className="no-underline">{content}</a>;
  }

  if (!targetId) return content;

  return <a href={`#${targetId}`} onClick={(e) => { e.preventDefault(); scrollToSection(targetId); }} className="no-underline">{content}</a>;
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

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <Reveal y={10}>
      <h3 className="text-[15px] font-bold tracking-tight mt-6 mb-3" style={{ color: c.text }}>
        {children}
      </h3>
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
        {/* FIX (a11y): Reveal renderuje się jako <li> zamiast owijać osobny <li> w <div>. */}
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

function BulletBox({ items }: { items: { icon: ReactNode; label: string; text: string }[] }) {
  return (
    <Reveal y={16}>
      <div className="rounded-xl px-5 py-2 my-4" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        {/* FIX (a11y): Reveal jako <li> zamiast owijania go w <div>. */}
        <ul>
          {items.map((item, i) => (
            <Reveal
              key={i}
              as="li"
              y={10}
              delay={i * 0.06}
              className="flex items-start gap-3 py-3 text-[14px]"
              style={{
                color: c.muted,
                borderBottom: i === items.length - 1 ? "none" : `1px solid ${c.border}`,
              }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: c.tealDim, color: c.teal }}
              >
                {item.icon}
              </span>
              <span>
                <span className="font-bold" style={{ color: c.text }}>
                  {item.label}
                </span>{" "}
                – {item.text}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function PlainList({ items }: { items: string[] }) {
  return (
    <Reveal y={16}>
      <div className="rounded-xl px-5 py-2 my-4" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        {/* FIX (a11y): Reveal jako <li> zamiast owijania go w <div>. */}
        <ul>
          {items.map((item, i) => (
            <Reveal
              key={i}
              as="li"
              y={8}
              delay={i * 0.05}
              className="flex items-start gap-2.5 py-2.5 text-[14px]"
              style={{ color: c.muted }}
            >
              <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
              {item}
            </Reveal>
          ))}
        </ul>
      </div>
    </Reveal>
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

/* Placeholder shown until real device photos are pasted into the
   `image` prop of each DecoderDetailCard. Renders in the same slots
   (header thumbnail + large expanded photo) as on the Internet page,
   so nothing shifts when the photo lands. */
function ImagePlaceholder({ alt, large = false }: { alt: string; large?: boolean }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="w-full h-full flex flex-col items-center justify-center gap-1.5"
      style={{ color: c.faint }}
    >
      <ImageIcon size={large ? 28 : 20} />
      {large && <span className="text-[11.5px] text-center px-3">Zdjęcie wkrótce</span>}
    </div>
  );
}

/* Full decoder card — photo (or placeholder), description, spec table
   and manual link. Collapsible so the page stays scannable, matching
   the accordion pattern on Netia's own Pomoc → Telewizja page. The
   outer card fades/rises in on scroll; the expanded inner content is
   an instant toggle (no re-animation), since it's user-triggered, not
   scroll-triggered. */
function DecoderDetailCard({
  eyebrow,
  name,
  subtitle,
  image,
  imageAlt,
  description,
  specs,
  manualLabel,
  isOpen,
  onToggle,
}: {
  eyebrow: string;
  name: string;
  subtitle: string;
  image?: string; // ścieżka / URL zdjęcia dekodera
  imageAlt: string;
  description: string[];
  specs: { label: string; value: string }[];
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
              style={{
                background: image ? "#ffffff" : c.cardAlt,
                border: `1px solid ${c.border}`,
              }}
            >
              {image ? (
                <img src={image} alt={imageAlt} className="w-full h-full object-contain p-1.5" />
              ) : (
                <ImagePlaceholder alt={imageAlt} />
              )}
            </div>
            <div>
              <div className="text-[12.5px] mb-1" style={{ color: c.faint }}>
                {eyebrow}
              </div>
              <div className="font-extrabold text-[16px]" style={{ color: c.text }}>
                {name}
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
                  style={{
                    background: image ? "#ffffff" : c.cardAlt,
                    border: `1px solid ${c.border}`,
                    minHeight: 160,
                  }}
                >
                  {image ? (
                    <img src={image} alt={imageAlt} className="w-full h-full object-contain p-3" />
                  ) : (
                    <ImagePlaceholder alt={imageAlt} large />
                  )}
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

/* ---------- channel chip (used inside expanded package cards) ---------- */

function ChannelChip({ channel }: { channel: Channel }) {
  const initials = channel.name.replace(/HD|4K/g, "").trim().slice(0, 2).toUpperCase();
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
      title={`${channel.number} — ${channel.name}`}
    >
      <div
        className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold"
        style={{ background: channel.logoUrl ? "#ffffff" : channel.color, color: channel.logoUrl ? undefined : "#fff" }}
      >
        {channel.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={channel.logoUrl} alt={channel.alt ?? channel.name} className="w-full h-full object-contain p-1" />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-mono" style={{ color: c.faint }}>
          {channel.number}
        </div>
        <div className="text-[12.5px] font-semibold truncate" style={{ color: c.text }}>
          {channel.name}
        </div>
      </div>
      {channel.only4k && (
        <span className="ml-auto text-[9.5px] font-bold px-1.5 py-0.5 rounded" style={{ background: c.tealDim, color: c.teal }}>
          4K
        </span>
      )}
    </div>
  );
}

/* ---------- collapsible package / add-on card ----------
   Accordion behaviour: this component no longer owns its own open/closed
   state. Instead it's fully controlled by the parent (`isOpen` + `onToggle`),
   so the page can guarantee only one package/add-on is expanded at a time.
   The expand/collapse itself animates via the CSS grid-template-rows
   0fr → 1fr trick, which is the only reliable way to transition to/from
   an "auto" height smoothly. */
function CollapsibleCard({
  id,
  name,
  count,
  description,
  channels,
  isOpen,
  onToggle,
  note,
}: {
  id?: string;
  name: string;
  count: number;
  description: string;
  channels: Channel[];
  isOpen: boolean;
  onToggle: () => void;
  note?: string;
}) {
  return (
    <Reveal y={18}>
      <div
        id={id}
        className="rounded-xl overflow-hidden mb-3"
        style={{
          background: c.card,
          border: `1px solid ${isOpen ? c.tealBorder : c.border}`,
          transition: "border-color .35s ease",
          scrollMarginTop: SCROLL_OFFSET,
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 cursor-pointer border-0 bg-transparent text-left"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-[15px]" style={{ color: c.text }}>
                {name}
              </span>
              <span
                className="text-[11.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: c.tealDim, color: c.teal, border: `1px solid ${c.tealBorder}` }}
              >
                {count} {count === 1 ? "kanał" : count < 5 ? "kanały" : "kanałów"}
              </span>
            </div>
            <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: c.muted }}>
              {description}
            </p>
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

        {/* grid-rows trick: animates smoothly between 0fr (collapsed,
            zero real height) and 1fr (collapsed to content's natural
            height), which lets us transition to "auto" height. */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows .38s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              className="px-5 pb-5"
              style={{
                borderTop: `1px solid ${c.border}`,
                opacity: isOpen ? 1 : 0,
                transition: `opacity ${isOpen ? ".3s ease .08s" : ".15s ease"}`,
              }}
            >
              {note && (
                <p className="text-[13.5px] italic mb-3 mt-4" style={{ color: c.faint }}>
                  {note}
                </p>
              )}
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ${note ? "" : "mt-4"} max-h-[420px] overflow-y-auto pr-1`}>
                {channels.map((ch) => (
                  <ChannelChip key={`${ch.number}-${ch.name}`} channel={ch} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- helpers: deep-linking do konkretnego pakietu/dodatku ----------
   Inne strony (np. OfferMaxSection) mogą linkować bezpośrednio do konkretnego
   pakietu/dodatku, np. href="/pomoc/telewizja#pakiet-addon-hbo". Format kotwicy
   to zawsze "pakiet-" + klucz z dwukropkiem zamienionym na myślnik
   ("tier:xs" -> "pakiet-tier-xs", "addon:hbo" -> "pakiet-addon-hbo"). */
function anchorIdForPackageKey(key: string): string {
  return `pakiet-${key.replace(":", "-")}`;
}

function packageKeyFromAnchorId(anchor: string): string | null {
  const prefiks = "pakiet-";
  if (!anchor.startsWith(prefiks)) return null;
  const reszta = anchor.slice(prefiks.length); // np. "addon-hbo" albo "tier-xs"
  const [rodzaj, ...idParts] = reszta.split("-");
  if (rodzaj !== "tier" && rodzaj !== "addon") return null;
  return `${rodzaj}:${idParts.join("-")}`;
}

/* ---------- page ---------- */

export default function NetiaTelewizjaPomocPage() {
  const tiers: Tier[] = ["xs", "s", "m", "l"];

  // Accordion state shared across BOTH the base tiers and the add-ons,
  // so opening any one package/add-on channel list closes whichever
  // other one was open — only one can be expanded at a time.
  const [openPackageKey, setOpenPackageKey] = useState<string | null>(null);

  const togglePackage = (key: string) => {
    setOpenPackageKey((current) => (current === key ? null : key));
  };

  // Same accordion pattern for the decoder cards — a separate state
  // since decoders and packages are unrelated sections of the page.
  const [openDecoderKey, setOpenDecoderKey] = useState<string | null>(null);

  const toggleDecoder = (key: string) => {
    setOpenDecoderKey((current) => (current === key ? null : key));
  };

  // Deep-linking: jeśli ktoś wchodzi na stronę z kotwicą wskazującą na
  // konkretny pakiet/dodatek (np. z OfferMaxSection -> #pakiet-addon-hbo),
  // automatycznie rozwiń tę pozycję i przewiń do niej po zamontowaniu strony.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const key = packageKeyFromAnchorId(hash);
    if (!key) return;

    setOpenPackageKey(key);
    // Poczekaj aż akordeon zdąży się wyrenderować, zanim przewiniemy do niego.
const DEEP_LINK_EXTRA_OFFSET = 50;

const id = requestAnimationFrame(() => {
  const el = document.getElementById(hash);
  if (el) {
    const top =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      SCROLL_OFFSET -
      DEEP_LINK_EXTRA_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
});
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pills = [
 <Pill key="faq" icon={<HelpCircle size={15} style={{ color: c.teal }} />} href="/pomoc/faq">
    Najczęstsze pytania
  </Pill>,
    <Pill key="iptv" targetId="iptv">
      IPTV
    </Pill>,
    <Pill key="dek" targetId="dekodery">
      Dekodery
    </Pill>,
    <Pill key="pak" targetId="pakiety">
      Pakiety
    </Pill>,
    <Pill key="fun" targetId="funkcje">
      Funkcje
    </Pill>,
    <Pill key="mr" targetId="multiroom">
      Multiroom
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
                <Tv size={22} />
              </div>
              <div>
                <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: c.text }}>
                  Telewizja
                </h1>
                <p className="text-[14px] mt-0.5" style={{ color: c.muted }}>
                  Informacje o technologii świadczonych usług, pakietach telewizyjnych oraz
                  urządzeniach.
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
              Telewizja Netii działa wyłącznie jako element zestawu z internetem stacjonarnym.
              Wynika to z technologii IPTV – cała transmisja kanałów odbywa się przez łącze
              internetowe, więc aktywna usługa internetu jest niezbędna.
            </span>
          </Paragraph>

          {/* FAQ — placeholder anchor target; podmień na docelową sekcję FAQ,
              jeśli powstanie osobny komponent z pytaniami i odpowiedziami. */}
          <div id="faq" style={{ scrollMarginTop: SCROLL_OFFSET }} />

          <div id="iptv" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Technologia IPTV – jak działa telewizja Netii</SectionHeading>
            <Paragraph>
              Telewizja IPTV polega na przesyłaniu programów w formie strumienia danych. Dekoder
              pobiera sygnał przez internet i wyświetla go na telewizorze. Dzięki temu można
              korzystać z:
            </Paragraph>
            <AdvantagesBox
              items={[
                "stabilnego obrazu niezależnego od warunków atmosferycznych",
                "jakości HD i 4K",
                "szybkiej reakcji na zmianę kanału",
                "funkcji, których nie oferuje tradycyjna telewizja kablowa (czas cofania, nagrywanie w chmurze, dostęp w aplikacji)",
              ]}
            />
            <Note>
              Wymagane jest jedynie stabilne łącze internetowe od Netii – technologia sama nie
              wymaga klasycznego sygnału antenowego.
            </Note>
          </div>

          <div id="dekodery" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Dekodery Netii</SectionHeading>
            <Paragraph>Netia oferuje trzy modele dekoderów IPTV:</Paragraph>
          </div>

          <DecoderDetailCard
            eyebrow="Dekoder NETIA SOUNDBOX 4K"
            name="NETIA SOUNDBOX 4K"
            subtitle="Dekoder Android TV 4K z wbudowanym soundbarem"
            image="/images/Dekoder_Soundbox4k_logo.webp"
            imageAlt="Dekoder Netia Soundbox 4K"
            description={[
              "Netia Soundbox 4K to zaawansowany dekoder IPTV łączący funkcje przystawki Smart TV, dekodera 4K oraz kompaktowego soundbara. Dzięki Android TV, obsłudze Google Play i systemowi audio strojonemu we współpracy z Bang & Olufsen urządzenie oferuje bogate możliwości rozrywki — od telewizji 4K, przez aplikacje VOD, po wysokiej jakości dźwięk przestrzenny z Dolby Atmos.",
              "Nowoczesne Wi-Fi 6 oraz pilot Bluetooth zapewniają szybkie i wygodne korzystanie, a solidna konstrukcja sprawia, że urządzenie idealnie komponuje się w każdym wnętrzu.",
            ]}
            specs={[
              { label: "Wideo", value: "4K Ultra HD, HDR, HDMI, CEC" },
              { label: "Audio", value: "Wbudowany głośnik (system Bang & Olufsen), Dolby Audio / Dolby Atmos" },
              { label: "Sieć", value: "Wi-Fi 6, Ethernet RJ-45, Bluetooth" },
              { label: "Porty", value: "1× HDMI, 1× RJ-45, 1× zasilanie DC" },
              { label: "Funkcje TV", value: "Telewizja w 4K, Programy do 7 dni wstecz, Nagrywanie, Netia GO, Wyszukiwarka, przewijanie, rekomendacje" },
              { label: "USB / Multimedia", value: "Obsługa multimediów przez aplikacje Android TV" },
              { label: "Wymiary", value: "165 × 165 × 65 mm" },
              { label: "Zasilanie", value: "Zasilacz 12 V DC" },
              { label: "Zawartość zestawu", value: "Dekoder Soundbox 4K, Pilot Bluetooth, Baterie, Kabel HDMI, Kabel Ethernet, Zasilacz" },
              { label: "System", value: "Android TV, Google Play, Chromecast built-in, Asystent Google" },
              { label: "Aplikacje", value: "Netia GO, YouTube, Disney+, Player, aplikacje z Google Play" },
            ]}
            manualLabel="Instrukcja użytkownika Netia dekodera Soundbox 4K"
            isOpen={openDecoderKey === "soundbox-4k"}
            onToggle={() => toggleDecoder("soundbox-4k")}
          />

          <DecoderDetailCard
            eyebrow="Dekoder NETIA EVOBOX 4K"
            name="NETIA EVOBOX 4K"
            subtitle="Kompaktowy dekoder IPTV Ultra HD / 4K"
            image="/images/DekoderEvo4K_logo.webp"
            imageAlt="Dekoder Netia EvoBox 4K"
            description={[
              "Netia EvoBox 4K to kompaktowy dekoder IPTV zapewniający obraz w jakości Ultra HD / 4K. Dzięki szybkiemu interfejsowi, pilotowi Bluetooth, obsłudze multimediów z USB/DLNA oraz dostępowi do aplikacji Netia GO i Disney+ urządzenie gwarantuje nowoczesne i wygodne korzystanie z telewizji.",
              "Niewielkie rozmiary, stabilne działanie i bardzo niski pobór energii sprawiają, że EvoBox 4K idealnie pasuje do każdego zestawu RTV. Do treści 4K rekomendowane jest łącze min. 25 Mb/s.",
            ]}
            specs={[
              { label: "Wideo", value: "HDMI (2160p/4K), HDCP 2.2, CEC" },
              { label: "Audio", value: "Dolby Digital, Dolby Digital Plus" },
              { label: "Sieć", value: "RJ-45 10/100, Wi-Fi 2,4 / 5 GHz (802.11ac, 2×2 MIMO), Bluetooth (pilot)" },
              { label: "Porty", value: "1× HDMI, 1× USB 2.0, 1× RJ-45, 1× DC 12 V" },
              { label: "Funkcje TV", value: "Nagrywanie, Time-shift, Netia GO, Multiroom" },
              { label: "USB / Multimedia", value: "USB 2.0 (typ A), DLNA / LAN. Formaty: Wideo (AVI, MKV, MP4, TS, M2TS), Audio (MP3), Zdjęcia (JPG, JPEG, PNG, GIF statyczny, BMP), Napisy (SRT UTF-8)" },
              { label: "Wymiary", value: "165 × 134,9 × 35,6 mm" },
              { label: "Zasilanie", value: "Zasilacz 12 V DC, Tryb czuwania < 0,5 W" },
              { label: "Zawartość zestawu", value: "Dekoder EvoBox 4K, Pilot Bluetooth + baterie, Kabel HDMI, Kabel Ethernet, Zasilacz, Instrukcja" },
              { label: "Aplikacje", value: "Netia GO, Disney+, Netflix (dostępność zależna od wersji oprogramowania)" },
              { label: "Masa", value: "ok. 230 g" },
            ]}
            manualLabel="Instrukcja użytkownika Netia dekodera EvoBox 4K"
            isOpen={openDecoderKey === "evobox-4k"}
            onToggle={() => toggleDecoder("evobox-4k")}
          />

          <DecoderDetailCard
            eyebrow="Dekoder NETIA EVOBOX HD"
            name="NETIA EVOBOX HD"
            subtitle="Lekki, ekonomiczny dekoder HD"
            image="/images/DekoderEvoHD_logo.webp"
            imageAlt="Dekoder Netia EvoBox HD"
            description={[
              "Netia EvoBox HD to lekki i ekonomiczny dekoder IPTV oferujący odbiór telewizji w jakości HD. Urządzenie zapewnia czytelne menu, szybkie działanie oraz obsługę multimediów z USB i DLNA — idealne rozwiązanie dla telewizorów Full HD i klasycznych zestawów RTV.",
            ]}
            specs={[
              { label: "Wideo", value: "HDMI (1080p, 1080i, 720p)" },
              { label: "Audio", value: "S/PDIF (optyczne), Dolby Digital, Dolby Digital Plus" },
              { label: "Sieć", value: "RJ-45 (Ethernet LAN), Wi-Fi 2,4 / 5 GHz (802.11 b/g/n/ac)" },
              { label: "Porty", value: "1× HDMI, 1× USB, 1× RJ-45, 1× S/PDIF, 1× zasilanie 12 V" },
              { label: "Funkcje TV", value: "Nagrywanie, Netia GO, Lista ulubionych, Wyszukiwanie treści, Tryby oszczędzania energii" },
              { label: "USB / Multimedia", value: "USB 2.0. Formaty: Wideo (AVI, MKV, MP4, TS, TP, TRP, M2TS), Audio (MP3, AC3), Zdjęcia (JPG, PNG, GIF statyczny, BMP), Napisy (SRT UTF-8)" },
              { label: "Wymiary", value: "122 × 115 × 28 mm" },
              { label: "Zasilanie", value: "Zasilacz 12 V DC" },
              { label: "Zawartość zestawu", value: "Dekoder EvoBox HD, Zasilacz, Pilot + baterie, Kabel HDMI, Kabel Ethernet, Instrukcja" },
              { label: "Masa", value: "ok. 0,23 kg (zestaw ok. 0,58 kg)" },
            ]}
            manualLabel="Instrukcja użytkownika Netia dekodera EvoBox HD"
            isOpen={openDecoderKey === "evobox-hd"}
            onToggle={() => toggleDecoder("evobox-hd")}
          />

          {/* PAKIETY TELEWIZYJNE — dane z lib/channels.ts */}
          <div id="pakiety" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Pakiety telewizyjne</SectionHeading>
            <Paragraph>
              Oferta telewizyjna składa się z zestawów tematycznych, różniących się liczbą i
              rodzajem kanałów.
            </Paragraph>

            <SubHeading>Pakiety podstawowe</SubHeading>
            {tiers.map((tier) => {
              const channels = channelsForTier(tier);
              const displayCount = TIER_CHANNEL_COUNTS[tier];
              const key = `tier:${tier}`;
              return (
                <CollapsibleCard
                  key={tier}
                  id={anchorIdForPackageKey(key)}
                  name={TIER_LABELS[tier]}
                  count={displayCount}
                  description={TIER_DESCRIPTIONS[tier]}
                  channels={channels}
                  isOpen={openPackageKey === key}
                  onToggle={() => togglePackage(key)}
                  note={
                    tier === "xs"
                      ? `Pakiet zawiera dodatkowo ${REGIONAL_TVP_CHANNELS_COUNT} kanałów regionalnych TVP, niewymienionych tu z osobna.`
                      : undefined
                  }
                />
              );
            })}

            <SubHeading>Pakiety dodatkowe</SubHeading>
            {ADDONS.map((addon) => {
              const channels = channelsForAddon(addon.key);
              const key = `addon:${addon.key}`;
              return (
                <CollapsibleCard
                  key={addon.key}
                  id={anchorIdForPackageKey(key)}
                  name={addon.label}
                  count={channels.length}
                  description={ADDON_DESCRIPTIONS[addon.key] ?? ""}
                  channels={channels}
                  isOpen={openPackageKey === key}
                  onToggle={() => togglePackage(key)}
                />
              );
            })}

            <Note>
              Większość kanałów nadawana jest w jakości HD, a wybrane materiały – w 4K (głównie
              sporty, kanały filmowe i wybrane programy dokumentalne).
            </Note>
          </div>

          {/* FUNKCJE */}
          <div id="funkcje" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Funkcje telewizji IPTV Netii</SectionHeading>
            <Paragraph>Telewizja Netii udostępnia szereg dodatkowych funkcji:</Paragraph>
            <BulletBox
              items={[
                { icon: <RotateCcw size={15} />, label: "Cofanie programów (Replay TV)", text: "powrót do programu nawet sprzed kilku dni" },
                { icon: <CloudUpload size={15} />, label: "Nagrywanie w chmurze", text: "przechowywanie bez lokalnego dysku" },
                { icon: <Smartphone size={15} />, label: "Netia GO", text: "oglądanie telewizji na telefonie, tablecie lub komputerze" },
                { icon: <Film size={15} />, label: "VOD", text: "wypożyczalnia filmów i seriali" },
                { icon: <BookOpenText size={15} />, label: "Przewodnik EPG", text: "czytelne informacje o programach" },
              ]}
            />
          </div>

          {/* MULTIROOM */}
          <div id="multiroom" style={{ scrollMarginTop: SCROLL_OFFSET }}>
            <SectionHeading>Multiroom w Netii – do 3 dodatkowych dekoderów</SectionHeading>
            <Paragraph>
              W Netii można rozszerzyć telewizję o maksymalnie 3 dodatkowe dekodery Multiroom,
              działające jako uzupełnienie głównego dekodera. Pozwalają one oglądać telewizję na
              kilku ekranach jednocześnie w ramach jednej usługi.
            </Paragraph>
            <Paragraph>Multiroom Netii występuje w dwóch wersjach:</Paragraph>

            <SubHeading>Multiroom HD (standardowy)</SubHeading>
            <PlainList
              items={[
                "Przeznaczony do telewizorów HD lub Full HD",
                "Działa z podstawowymi funkcjami IPTV",
                "Umożliwia oglądanie niezależnych kanałów w innych pokojach",
                "Zwykle wykorzystuje prostszy dekoder o podstawowej funkcjonalności",
              ]}
            />

            <SubHeading>Multiroom 4K</SubHeading>
            <PlainList
              items={[
                "Dostępny jako rozszerzenie do głównego dekodera 4K",
                "Obsługuje transmisję w Ultra HD",
                "Szybszy interfejs i wydajniejsze podzespoły",
                "Przystosowany do nowoczesnych telewizorów 4K",
              ]}
            />

            <SubHeading>Różnice (opis ogólny, zgodnie z realiami rynku IPTV)</SubHeading>
            <PlainList
              items={[
                "Multiroom 4K obsługuje kanały i materiały w wysokiej rozdzielczości",
                "Działa na nowszym sprzęcie, więc interfejs jest zauważalnie płynniejszy",
                "HD Multiroom sprawdzi się w pokojach z telewizorami starszego typu",
                "4K Multiroom wymaga wyższej przepustowości oraz nowszego modelu dekodera głównego",
              ]}
            />
            <Note>
              Jeśli urządzenia różnią się konstrukcyjnie – zwykle 4K to mocniejszy procesor,
              więcej pamięci, obsługa nowszych kodeków.
            </Note>

            <SubHeading>Jak działa Multiroom?</SubHeading>
            <Paragraph>Każdy dodatkowy dekoder:</Paragraph>
            <BulletBox
              items={[
                { icon: <MonitorSmartphone size={15} />, label: "Połączenie", text: "jest powiązany z główną usługą TV" },
                { icon: <Sparkles size={15} />, label: "Sieć", text: "działa w ramach jednej sieci internetowej dostarczanej przez Netię" },
                { icon: <Tv size={15} />, label: "Niezależność", text: "umożliwia oglądanie innych kanałów niż te wyświetlane na głównym dekoderze" },
              ]}
            />
            <Note>
              To wygodne rozwiązanie dla mieszkań, w których domownicy chcą oglądać różne treści
              w innych pomieszczeniach.
            </Note>
          </div>
        </div>
      </div>
    </div>
  );
}