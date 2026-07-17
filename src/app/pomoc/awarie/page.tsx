"use client";

import {
  AlertTriangle,
  HelpCircle,
  Phone,
  PhoneCall,
  Clock,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { type ReactNode, type MouseEvent, useState } from "react";

/* ---------- design tokens ----------
   Same palette as the Internet / Telewizja / Telefon help pages so
   all four read as one product. */
const c = {
  bg: "rgb(11, 42, 61)",
  bgDeep: "rgb(7, 28, 41)",
  card: "rgb(19, 55, 78)",
  cardAlt: "rgb(24, 66, 92)",
  border: "rgba(255,255,255,.12)",
  borderStrong: "rgba(255,255,255,.22)",
  teal: "#2dd9c4",
  tealDim: "rgba(45,217,196,.14)",
  tealBorder: "rgba(45,217,196,.3)",
  text: "#eef5f7",
  muted: "#a7b9c6",
  faint: "#8fa4b5",
  amber: "#f0b429",
};

/* Same ease-out-expo-ish curve used on the Internet and Usługi Mobilne
   help pages — kept as one constant so all "one product" pages move
   the same way instead of each reaching for framer-motion's generic
   "easeOut". */
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- motion presets ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

/* RevealGroup: wraps a block of children in the stagger variant so
   they cascade in on scroll, once, instead of appearing together. */
function RevealGroup({
  children,
  as = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: "div" | "ul" | "ol";
  className?: string;
  delay?: number;
}) {
  const MotionTag =
    as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <MotionTag
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* Single-item reveal for content that doesn't sit inside a
   RevealGroup (e.g. a standalone card lower on the page). */
function Reveal({
  children,
  variant = fadeUp,
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: typeof fadeUp | typeof fadeIn;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- small reusable pieces ---------- */

function Pill({
  icon,
  targetId,
  children,
}: {
  icon?: ReactNode;
  targetId?: string;
  children: ReactNode;
}) {
  const scrollToTarget = () => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.div
      variants={fadeIn}
      transition={{ duration: 0.4, ease: EASE }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={scrollToTarget}
      role={targetId ? "button" : undefined}
      tabIndex={targetId ? 0 : undefined}
      onKeyDown={(e) => {
        if (targetId && (e.key === "Enter" || e.key === " ")) scrollToTarget();
      }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold cursor-pointer transition-colors hover:border-white/25"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}`, color: c.text }}
    >
      {icon}
      {children}
    </motion.div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className="text-[22px] font-extrabold tracking-tight mt-14 mb-3"
      style={{ color: c.text }}
    >
      {children}
    </motion.h2>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <motion.p
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="text-[14.5px] leading-relaxed mb-3"
      style={{ color: c.muted }}
    >
      {children}
    </motion.p>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <motion.p
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
      className="flex items-center gap-2 text-[13px] mb-3"
      style={{ color: c.faint }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: c.teal, boxShadow: `0 0 0 3px ${c.tealDim}` }}
      />
      {children}
    </motion.p>
  );
}

/* ---------- copyable phone number ----------
   The number is the single most useful piece of data on this page —
   letting people grab it without a long-press-and-select on desktop
   is a real usability win, not decoration. */

function CopyableNumber({
  number,
  href,
  size = "text-[19px]",
}: {
  number: string;
  href: string;
  size?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — the tel: link below still works
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={href}
        className={`inline-flex items-center gap-2 font-mono font-extrabold tracking-tight no-underline hover:underline ${size}`}
        style={{ color: c.teal }}
      >
        <Phone size={16} />
        {number}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Numer skopiowany" : "Kopiuj numer"}
        className="flex items-center justify-center h-6 w-6 rounded-md transition-colors"
        style={{
          color: copied ? c.teal : c.faint,
          background: copied ? c.tealDim : "transparent",
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </span>
  );
}

/* ---------- alternating timeline ----------
   A centered vertical line with steps alternating left/right of it —
   odd steps (1, 3, 5) sit on the right, even steps (2, 4, 6) on the
   left, each with a dot centered on the line, a badge ("KROK 01")
   above the title, then a bold title and description. Built as a
   three-column grid (content / dot / content) per row so only one
   side is ever populated and the dot always lands dead-center. */

function TimelineList({ children }: { children: ReactNode }) {
  return (
    <RevealGroup as="ol" delay={0.05} className="relative my-6">
      <span
        className="absolute left-[5px] sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2"
        style={{ background: c.border }}
        aria-hidden="true"
      />
      {children}
    </RevealGroup>
  );
}

function TimelineStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  const isRight = number % 2 === 1; // 1, 3, 5 -> right · 2, 4, 6 -> left

  const content = (
    <div className={`min-w-0 ${isRight ? "sm:text-left" : "sm:text-right"}`}>
      <span
        className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wide mb-2"
        style={{ background: c.teal, color: c.bgDeep }}
      >
        KROK {String(number).padStart(2, "0")}
      </span>
      <div className="font-extrabold text-[16px] leading-snug mb-1.5" style={{ color: c.text }}>
        {title}
      </div>
      <p
        className={`text-[13.5px] leading-relaxed ${isRight ? "sm:ml-0" : "sm:ml-auto"} max-w-[42ch]`}
        style={{ color: c.muted }}
      >
        {children}
      </p>
    </div>
  );

  return (
    <motion.li
      variants={fadeUp}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr] gap-x-5 sm:gap-x-8 items-start pb-9 last:pb-0"
    >
      {/* left slot (desktop only) */}
      <div className="hidden sm:block">{!isRight && content}</div>

      {/* dot, centered on the line */}
      <span
        className="relative z-10 flex-shrink-0 mt-[6px] h-[11px] w-[11px] rounded-full"
        style={{ background: c.teal, boxShadow: `0 0 0 4px ${c.tealDim}` }}
        aria-hidden="true"
      />

      {/* right slot on desktop; on mobile everything collapses into this single column */}
      <div className="sm:hidden">{content}</div>
      <div className="hidden sm:block">{isRight && content}</div>
    </motion.li>
  );
}

/* ---------- quick-call button ---------- */

function CallButton({
  label,
  number,
  href,
  featured = false,
  bg,
}: {
  label: string;
  number: string;
  href: string;
  featured?: boolean;
  bg?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: EASE }}
      whileHover={{ y: -2 }}
      className="flex-1 min-w-[220px] rounded-xl px-5 py-4 flex items-center justify-between gap-3.5 transition-colors hover:border-white/25"
      style={{
        background: bg ?? (featured ? c.tealDim : c.cardAlt),
        border: `1px solid ${featured ? c.tealBorder : c.border}`,
      }}
    >
      <div className="flex items-center gap-3.5">
        <a
          href={href}
          aria-label={`${label}: zadzwoń pod ${number}`}
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{ color: c.teal }}
        >
          <PhoneCall size={20} />
        </a>
        <div>
          <div className="text-[12.5px] font-semibold" style={{ color: c.muted }}>
            {label}
          </div>
          <CopyableNumber number={number} href={href} size="text-[17px]" />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- hotline detail card ----------
   Two cards up top side by side, third one centered below on its own
   row so it reads as "the extra option" rather than competing for
   equal weight in a 3-column grid. */

function HotlineCard({
  title,
  number,
  href,
  hours,
  live = false,
  description,
  featured = false,
}: {
  title: string;
  number: string;
  href: string;
  hours: string;
  live?: boolean;
  description: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.55, ease: EASE }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: featured ? c.tealDim : c.card,
        border: `1px solid ${featured ? c.tealBorder : c.border}`,
      }}
    >
      <div className="font-extrabold text-[15px] mb-3" style={{ color: c.text }}>
        {title}
      </div>
      <div className="mb-3">
        <CopyableNumber number={number} href={href} />
      </div>
      <div className="flex items-center gap-2 text-[13px] mb-3" style={{ color: c.faint }}>
        {live ? (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: c.teal }} />
        ) : (
          <Clock size={14} style={{ flexShrink: 0 }} />
        )}
        {hours}
      </div>
      <p className="text-[13.5px] leading-relaxed" style={{ color: c.muted }}>
        {description}
      </p>
    </motion.div>
  );
}

/* ---------- reason to call row ---------- */

function ReasonRow({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.li
      variants={fadeUp}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex items-start gap-2.5 py-1.5 text-[14px]"
      style={{ color: c.muted }}
    >
      <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
      <span>
        <span className="font-bold" style={{ color: c.text }}>
          {title}
        </span>{" "}
        — {desc}
      </span>
    </motion.li>
  );
}

/* ---------- page ---------- */

export default function NetiaZglaszanieAwariiPomocPage() {
  return (
    <div
      style={{
        backgroundColor: c.bg,
        color: c.text,
        backgroundImage: `radial-gradient(${c.border} 1px, transparent 1px)`,
        backgroundSize: "26px 26px",
      }}
      className="font-sans leading-relaxed"
    >
      <div className="max-w-[820px] mx-auto px-6 py-10 pt-36">
        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-[22px] px-8 md:px-10 py-9"
          style={{
            background: `radial-gradient(120% 160% at 0% 0%, ${c.cardAlt} 0%, ${c.bg} 55%, ${c.bgDeep} 100%)`,
            border: `1px solid ${c.borderStrong}`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: c.tealDim, border: `1px solid ${c.tealBorder}`, color: c.teal }}
            >
              <AlertTriangle size={22} />
            </motion.div>
            <div>
              <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: c.text }}>
                Zgłaszanie Awarii
              </h1>
              <p className="text-[14px] mt-0.5" style={{ color: c.muted }}>
                Instrukcja postępowania i szybki kontakt z infolinią.
              </p>
            </div>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2.5"
          >
            <Pill icon={<HelpCircle size={15} style={{ color: c.teal }} />} targetId="steps">
              Kroki naprawcze
            </Pill>
            <Pill targetId="phones">Kontakt</Pill>
          </motion.div>
        </motion.div>

        {/* CONTENT */}
        <div className="mt-2">
          <div id="steps">
            <SectionHeading>Co zrobić w przypadku awarii</SectionHeading>
            <Paragraph>
              Zanim zgłosisz problem, przejdź poniższe kroki po kolei — często pozwalają szybko
              przywrócić połączenie i przyspieszają obsługę zgłoszenia, jeśli mimo wszystko okaże
              się konieczne.
            </Paragraph>

            <TimelineList>
              <TimelineStep number={1} title="Sprawdź urządzenie">
                Sprawdź, czy problem występuje tylko na jednym urządzeniu. Jeśli tak — spróbuj
                ponownie połączyć się z Wi-Fi lub przetestuj inne urządzenie.
              </TimelineStep>
              <TimelineStep number={2} title="Sprawdź kable i zasilanie">
                Upewnij się, że router (i ONT przy światłowodzie) są podłączone, a wszystkie
                wtyczki dobrze osadzone.
              </TimelineStep>
              <TimelineStep number={3} title="Zrestartuj sprzęt">
                Odłącz router (i ONT) na 30 sekund, włącz najpierw ONT, po 60 s włącz router
                i odczekaj 2–3 minuty.
              </TimelineStep>
              <TimelineStep number={4} title="Sprawdź diody">
                PON/DSL — stała zielona = sygnał OK, miganie/czerwona/brak = problem z linią.
                Internet/WAN — zielona ciągła = online.
              </TimelineStep>
              <TimelineStep number={5} title="Test połączenia przewodowego">
                Podłącz jedno urządzenie kablem LAN do routera. Jeśli też nie działa — to nie
                problem z Wi-Fi.
              </TimelineStep>
              <TimelineStep number={6} title="Zgłoś awarię">
                Jeśli Internet nadal nie działa — zgłoś awarię. Przygotuj numer klienta lub
                PESEL oraz adres instalacji.
              </TimelineStep>
            </TimelineList>

            <RevealGroup className="flex flex-col md:flex-row gap-3 my-4">
              <CallButton
                label="Infolinia 24/7"
                number="+48 793 800 300"
                href="tel:+48793800300"
                featured
              />
              <CallButton
                label="Telefon stacjonarny"
                number="+48 227 111 111"
                href="tel:+48227111111"
                bg="#1c394b"
              />
            </RevealGroup>
            <Note>Godziny pracy infolinii technicznej: całodobowo, 7 dni w tygodniu.</Note>
          </div>

          <div id="phones">
            <SectionHeading>Infolinia Netia — telefony, godziny i koszt połączeń</SectionHeading>
            <Paragraph>
              Netia udostępnia trzy główne numery — w zależności od tego, czy zgłaszasz awarię,
              chcesz zamówić usługę, czy szukasz wsparcia ogólnego. Wszystkie połączenia są
              bezpłatne z polskich sieci komórkowych i stacjonarnych.
            </Paragraph>

            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <HotlineCard
                title="Infolinia techniczna 24/7 (obsługa istniejących klientów, reklamacje)"
                number="+48 793 800 300"
                href="tel:+48793800300"
                hours="Czynna 24 godziny na dobę, 7 dni w tygodniu"
                live
                description="Główna infolinia techniczna Netii — zgłaszanie awarii Internetu, Telewizji i usług mobilnych. Konsultant sprawdzi status łącza po stronie sieci i nada numer zgłoszenia. Przygotuj numer umowy lub PESEL i adres montażu."
              />

              <HotlineCard
                title="Kontakt z przedstawicielem Netii (zamawianie nowych usług internetu i TV)"
                number="+48 883 334 124"
                href="tel:+48883334124"
                hours="Pn–Ndz: 8:00–21:00"
                description="Doradztwo handlowe — nowa umowa, zmiana pakietu, dopasowanie taryfy. Dostępne języki: polski, angielski, ukraiński. Skierowane do nowych i obecnych klientów Netii."
              />
            </RevealGroup>

            <Reveal delay={0.1} className="w-full mt-4">
              <HotlineCard
                title="Infolinia stacjonarna Netia (obsługa istniejących klientów, reklamacje)"
                number="+48 22 711 11 11"
                href="tel:+48227111111"
                hours="Czynna całodobowo"
                live
                description="Standardowy numer stacjonarny Netii — alternatywa dla infolinii komórkowej, przydatna gdy preferujesz dzwonienie z telefonu domowego lub gdy hotline 793 800 300 jest zajęty."
              />
            </Reveal>
          </div>

          <div id="kiedy-dzwonic">
            <SectionHeading>Kiedy zadzwonić na infolinię?</SectionHeading>
            <Paragraph>Najczęstsze powody, dla których klienci dzwonią na infolinię Netii:</Paragraph>
            <RevealGroup as="ul" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
              <ReasonRow
                title="Awaria Internetu lub Telewizji"
                desc="brak sygnału, miganie diody PON, błąd na dekoderze 4K."
              />
              <ReasonRow
                title="Sprawdzenie statusu zgłoszenia"
                desc="gdy złożyłeś zgłoszenie online i czekasz na potwierdzenie."
              />
              <ReasonRow
                title="Zmiana terminu wizyty technika"
                desc="przełożenie instalacji lub serwisu w ciągu 24h."
              />
              <ReasonRow
                title="Rozliczenia i faktury"
                desc="pytania o wysokość rachunku, zmianę formy płatności, brakujące dokumenty."
              />
              <ReasonRow
                title="Zmiana danych umowy"
                desc="adres korespondencyjny, dane do faktury, kontakt SMS."
              />
              <ReasonRow
                title="Wypowiedzenie umowy"
                desc="pod numerem 22 711 11 11 lub elektronicznie przez e-BOK Netia."
              />
            </RevealGroup>
          </div>

          <div id="koszt">
            <SectionHeading>Koszt połączenia z infolinią Netii</SectionHeading>
            <Reveal className="my-4">
              <div
                className="rounded-xl px-5 py-4 flex items-start gap-3.5"
                style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
              >
                <Wallet size={18} style={{ color: c.teal, flexShrink: 0, marginTop: 2 }} />
                <p className="text-[13.5px] leading-relaxed" style={{ color: c.muted }}>
                  Wszystkie numery infolinii Netii (793 800 300, 22 711 11 11, 883 334 124) są
                  bezpłatne z polskich sieci komórkowych i stacjonarnych — opłata zgodna z taryfą
                  Twojego operatora. Z zagranicy obowiązują standardowe stawki roamingowe.
                  Konsultanci nie pobierają dodatkowych opłat za rozmowę.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}