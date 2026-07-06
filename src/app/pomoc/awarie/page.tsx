"use client";

import {
  AlertTriangle,
  HelpCircle,
  Phone,
  PhoneCall,
  Clock,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { type ReactNode } from "react";

/* ---------- design tokens ----------
   Same palette as the Internet / Telewizja / Telefon help pages so
   all four read as one product. */
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

/* ---------- small reusable pieces ---------- */

function Pill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold cursor-pointer transition-colors hover:border-white/25"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}`, color: c.text }}
    >
      {icon}
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[22px] font-extrabold tracking-tight mt-12 mb-3" style={{ color: c.text }}>
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14.5px] leading-relaxed mb-3" style={{ color: c.muted }}>
      {children}
    </p>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13.5px] italic mb-3" style={{ color: c.faint }}>
      {children}
    </p>
  );
}

/* ---------- numbered repair step ---------- */

function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
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
  );
}

/* ---------- quick-call button ---------- */

function CallButton({
  label,
  number,
  href,
  featured = false,
}: {
  label: string;
  number: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      className="flex-1 min-w-[220px] rounded-xl px-5 py-4 flex items-center gap-3.5 no-underline transition-colors hover:border-white/25"
      style={{
        background: featured ? c.tealDim : c.cardAlt,
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
    </a>
  );
}

/* ---------- hotline detail card ---------- */

function HotlineCard({
  title,
  number,
  href,
  hours,
  description,
}: {
  title: string;
  number: string;
  href: string;
  hours: string;
  description: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 mb-4"
      style={{ background: c.card, border: `1px solid ${c.border}` }}
    >
      <div className="font-extrabold text-[15.5px] mb-3" style={{ color: c.text }}>
        {title}
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-2 text-[20px] font-extrabold mb-3 no-underline hover:underline"
        style={{ color: c.teal }}
      >
        <Phone size={17} />
        {number}
      </a>
      <div className="flex items-center gap-2 text-[13px] mb-3" style={{ color: c.faint }}>
        <Clock size={14} style={{ flexShrink: 0 }} />
        {hours}
      </div>
      <p className="text-[13.5px] leading-relaxed" style={{ color: c.muted }}>
        {description}
      </p>
    </div>
  );
}

/* ---------- reason to call row ---------- */

function ReasonRow({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5 text-[14px]" style={{ color: c.muted }}>
      <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
      <span>
        <span className="font-bold" style={{ color: c.text }}>
          {title}
        </span>{" "}
        — {desc}
      </span>
    </li>
  );
}

/* ---------- page ---------- */

export default function NetiaZglaszanieAwariiPomocPage() {
  return (
    <div style={{ backgroundColor: c.bg, color: c.text }} className="font-sans leading-relaxed">
      <div className="max-w-[820px] mx-auto px-6 py-10 pt-36">
        {/* HERO CARD */}
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
              <AlertTriangle size={22} />
            </div>
            <div>
              <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: c.text }}>
                Zgłaszanie Awarii
              </h1>
              <p className="text-[14px] mt-0.5" style={{ color: c.muted }}>
                Instrukcja postępowania i szybki kontakt z infolinią.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Pill icon={<HelpCircle size={15} style={{ color: c.teal }} />}>
              Kroki naprawcze
            </Pill>
            <Pill>Kontakt</Pill>
          </div>
        </div>

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
            <div
              className="rounded-xl px-5 py-2 my-4"
              style={{ background: c.card, border: `1px solid ${c.border}` }}
            >
              <Step number={1}>
                Sprawdź, czy problem występuje tylko na jednym urządzeniu. Jeśli tak — spróbuj
                ponownie połączyć się z Wi-Fi lub przetestuj inne urządzenie.
              </Step>
              <Step number={2}>
                Sprawdź zasilanie i kable: upewnij się, że router (i ONT przy światłowodzie) są
                podłączone, a wszystkie wtyczki dobrze osadzone.
              </Step>
              <Step number={3}>
                Zrestartuj sprzęt: odłącz router (i ONT) na 30 sekund, włącz najpierw ONT, po 60 s
                włącz router i odczekaj 2–3 minuty.
              </Step>
              <Step number={4}>
                Sprawdź diody: PON/DSL — stała zielona = sygnał OK, miganie/czerwona/brak = problem
                z linią. Internet/WAN — zielona ciągła = online.
              </Step>
              <Step number={5}>
                Przetestuj połączenie przewodowe: podłącz jedno urządzenie kablem LAN do routera.
                Jeśli też nie działa — to nie problem z Wi-Fi.
              </Step>
              <Step number={6}>
                Jeśli Internet nadal nie działa — zgłoś awarię. Przygotuj numer klienta lub PESEL
                oraz adres instalacji.
              </Step>
            </div>

            <div className="flex flex-col md:flex-row gap-3 my-4">
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
              />
            </div>
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

            <HotlineCard
              title="Infolinia stacjonarna Netia (Obsługa istniejących klientów, reklamacje)"
              number="+48 22 711 11 11"
              href="tel:+48227111111"
              hours="Czynna całodobowo"
              description="Standardowy numer stacjonarny Netii — alternatywa dla infolinii komórkowej, przydatna gdy preferujesz dzwonienie z telefonu domowego lub gdy hotline 793 800 300 jest zajęty."
            />
          </div>

          <div id="kiedy-dzwonic">
            <SectionHeading>Kiedy zadzwonić na infolinię?</SectionHeading>
            <Paragraph>Najczęstsze powody, dla których klienci dzwonią na infolinię Netii:</Paragraph>
            <ul className="mb-4">
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
            </ul>
          </div>

          <div id="koszt">
            <SectionHeading>Koszt połączenia z infolinią Netii</SectionHeading>
            <div
              className="rounded-xl px-5 py-4 my-4 flex items-start gap-3.5"
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
          </div>
        </div>
      </div>
    </div>
  );
}