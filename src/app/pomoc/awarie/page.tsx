"use client";

import {
  AlertTriangle,
  HelpCircle,
  Phone,
  PhoneCall,
  Clock,
  Wallet,
  CheckCircle2,
  Smartphone,
  Cable,
  RotateCw,
  Radio,
  Cable as WanIcon,
  Wifi,
} from "lucide-react";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

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
   they cascade in on scroll, once, instead of appearing together.
   Collapses the repeated
     variants={stagger} initial="hidden" whileInView="show"
     viewport={{ once: true, margin: "-60px" }}
   boilerplate that was previously copy-pasted at every call site into
   one place — same visual result, easier to retune later. Children
   should use the fadeUp/fadeIn variants (or their own) with no
   explicit initial/animate so they inherit state from this wrapper. */
function RevealGroup({
  children,
  as = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: "div" | "ul";
  className?: string;
  delay?: number;
}) {
  const MotionTag = as === "ul" ? motion.ul : motion.div;
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
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      className="text-[22px] font-extrabold tracking-tight mt-12 mb-3"
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
      className="text-[13.5px] italic mb-3"
      style={{ color: c.faint }}
    >
      {children}
    </motion.p>
  );
}

/* ---------- numbered repair step ----------
   Icon + number live together as one badge (icon on top, index as a
   small caption below it) so each step reads as a single unit instead
   of two separate marks fighting for attention. */

function Step({
  number,
  icon,
  title,
  children,
}: {
  number: number;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: EASE }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 h-full flex flex-col"
      style={{ background: "#0d1f31", border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-[14px]"
          style={{ background: c.tealDim, border: `1px solid ${c.tealBorder}`, color: c.teal }}
        >
          {number}
        </div>
        <div className="font-bold text-[14.5px] leading-tight" style={{ color: c.text }}>
          {title}
        </div>
      </div>
      <p className="text-[13.5px] leading-relaxed" style={{ color: c.muted }}>
        {children}
      </p>
    </motion.div>
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
    <motion.a
      href={href}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: EASE }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 min-w-[220px] rounded-xl px-5 py-4 flex items-center gap-3.5 no-underline transition-colors hover:border-white/25"
      style={{
        background: bg ?? (featured ? c.tealDim : c.cardAlt),
        border: `1px solid ${featured ? c.tealBorder : c.border}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: featured ? c.teal : c.card, color: featured ? c.bgDeep : c.teal }}
      >
        <PhoneCall size={17} />
      </div>
      <div>
        <div className="text-[12.5px] font-semibold" style={{ color: c.muted }}>
          {label}
        </div>
        <div className="text-[18px] font-extrabold" style={{ color: c.text }}>
          {number}
        </div>
      </div>
    </motion.a>
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
  description,
  featured = false,
}: {
  title: string;
  number: string;
  href: string;
  hours: string;
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
      <a
        href={href}
        className="inline-flex items-center gap-2 text-[19px] font-extrabold mb-3 no-underline hover:underline"
        style={{ color: c.teal }}
      >
        <Phone size={16} />
        {number}
      </a>
      <div className="flex items-center gap-2 text-[13px] mb-3" style={{ color: c.faint }}>
        <Clock size={14} style={{ flexShrink: 0 }} />
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
    <div style={{ backgroundColor: c.bg, color: c.text }} className="font-sans leading-relaxed">
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
          <Paragraph>
            <span className="block mt-8">
              Instrukcja postępowania przy awarii usług oraz numery kontaktowe.
            </span>
          </Paragraph>

          <div id="steps">
            <SectionHeading>Co zrobić w przypadku awarii</SectionHeading>
            <Paragraph>
              Zanim zgłosisz problem, wykonaj poniższe kroki — często pozwalają szybko przywrócić
              połączenie i przyspieszają obsługę zgłoszenia:
            </Paragraph>

            {/* Framed card wrapping the whole repair-steps block, so it
                reads as one distinct unit on the page. */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="rounded-2xl px-5 py-3 my-4"
              style={{ background: c.card, border: `1px solid ${c.border}` }}
            >
<RevealGroup delay={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
  <Step number={1} icon={<Smartphone size={16} />} title="Sprawdź urządzenie">
    Sprawdź, czy problem występuje tylko na jednym urządzeniu. Jeśli tak — spróbuj
    ponownie połączyć się z Wi-Fi lub przetestuj inne urządzenie.
  </Step>
  <Step number={2} icon={<Cable size={16} />} title="Sprawdź kable i zasilanie">
    Upewnij się, że router (i ONT przy światłowodzie) są podłączone, a wszystkie
    wtyczki dobrze osadzone.
  </Step>
  <Step number={3} icon={<RotateCw size={16} />} title="Zrestartuj sprzęt">
    Odłącz router (i ONT) na 30 sekund, włącz najpierw ONT, po 60 s włącz router
    i odczekaj 2–3 minuty.
  </Step>
  <Step number={4} icon={<Radio size={16} />} title="Sprawdź diody">
    PON/DSL — stała zielona = sygnał OK, miganie/czerwona/brak = problem z linią.
    Internet/WAN — zielona ciągła = online.
  </Step>
  <Step number={5} icon={<WanIcon size={16} />} title="Test połączenia przewodowego">
    Podłącz jedno urządzenie kablem LAN do routera. Jeśli też nie działa — to nie
    problem z Wi-Fi.
  </Step>
  <Step number={6} icon={<Wifi size={16} />} title="Zgłoś awarię">
    Jeśli Internet nadal nie działa — zgłoś awarię. Przygotuj numer klienta lub
    PESEL oraz adres instalacji.
  </Step>
</RevealGroup>
            </motion.div>

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
            <Note>Godziny Pracy Infolinii Technicznej: Całodobowo, 7 Dni w Tygodniu.</Note>
          </div>

          <div id="phones">
            <SectionHeading>Infolinia Netia — telefony, godziny i koszt połączeń</SectionHeading>
            <Paragraph>
              Pod jakim numerem działa infolinia Netii? Netia udostępnia trzy główne numery — w
              zależności od tego, czy zgłaszasz awarię, chcesz zamówić usługę, czy szukasz wsparcia
              ogólnego. Wszystkie połączenia są bezpłatne z polskich sieci komórkowych i
              stacjonarnych.
            </Paragraph>

            {/* Top row: 2 cards side by side */}
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <HotlineCard
                title="Infolinia techniczna 24/7 (Obsługa istniejących klientów, reklamacje)"
                number="+48 793 800 300"
                href="tel:+48793800300"
                hours="Czynna 24 godziny na dobę, 7 dni w tygodniu"
                description="Główna infolinia techniczna Netii — zgłaszanie awarii Internetu, Telewizji i usług mobilnych. Konsultant sprawdzi status łącza po stronie sieci i nada numer zgłoszenia. Przygotuj numer umowy lub PESEL i adres montażu."
              />

              <HotlineCard
                title="Kontakt z Przedstawicielem Netii (Zamawianie nowych usług internetu i TV)"
                number="+48 883 334 124"
                href="tel:+48883334124"
                hours="Pn–Ndz: 8:00–21:00"
                description="Doradztwo handlowe — nowa umowa, zmiana pakietu, dopasowanie taryfy. Dostępne języki: polski, angielski, ukraiński. Skierowane do nowych i obecnych klientów Netii."
              />
            </RevealGroup>

            {/* Bottom row: 1 card, centered, narrower so it reads as secondary */}
            <Reveal delay={0.1} className="w-full mt-4">
              <HotlineCard
                title="Infolinia stacjonarna Netia (Obsługa istniejących klientów, reklamacje)"
                number="+48 22 711 11 11"
                href="tel:+48227111111"
                hours="Czynna całodobowo"
                description="Standardowy numer stacjonarny Netii — alternatywa dla infolinii komórkowej, przydatna gdy preferujesz dzwonienie z telefonu domowego lub gdy hotline 793 800 300 jest zajęty."
              />
            </Reveal>
          </div>

          <div id="kiedy-dzwonic">
            <SectionHeading>Kiedy zadzwonić na infolinię?</SectionHeading>
            <Paragraph>Najczęstsze powody, dla których klienci dzwonią na infolinię Netii:</Paragraph>
            <RevealGroup as="ul" className="mb-4">
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