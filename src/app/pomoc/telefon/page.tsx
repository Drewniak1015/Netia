"use client";

import {
  Smartphone,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Zap,
  Percent,
  ArrowRightLeft,
  Layers,
} from "lucide-react";
import { useState, type ReactNode } from "react";

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

function AdvantagesBox({ items }: { items: string[] }) {
  return (
    <div
      className="rounded-xl px-5 py-4 my-4"
      style={{ background: c.card, border: `1px solid ${c.border}` }}
    >
      <div className="text-[13px] font-bold mb-2" style={{ color: c.text }}>
        Zalety:
      </div>
      <ul>
        {items.map((a, i) => (
          <li key={i} className="flex items-start gap-2.5 py-1 text-[14px]" style={{ color: c.muted }}>
            <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13.5px] italic mb-3" style={{ color: c.faint }}>
      {children}
    </p>
  );
}

/* ---------- plan card ---------- */

function PlanCard({
  name,
  price,
  promoNote,
  dataPoland,
  dataRoaming,
  description,
  featured = false,
}: {
  name: string;
  price: string;
  promoNote: string;
  dataPoland: string;
  dataRoaming: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 flex-1 min-w-[220px]"
      style={{
        background: featured ? c.tealDim : c.card,
        border: `1px solid ${featured ? c.tealBorder : c.border}`,
      }}
    >
      {featured && (
        <div
          className="inline-block text-[10.5px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
          style={{ color: c.bgDeep, background: c.teal }}
        >
          Najczęściej wybierany
        </div>
      )}
      <div className="font-extrabold text-[18px]" style={{ color: c.text }}>
        {name}
      </div>
      <div className="flex items-baseline gap-1.5 mt-2 mb-1">
        <span className="text-[26px] font-extrabold" style={{ color: c.teal }}>
          {price}
        </span>
      </div>
      <div className="text-[12.5px] mb-4" style={{ color: c.faint }}>
        {promoNote}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2.5 text-[14px]" style={{ color: c.text }}>
          <Zap size={15} style={{ color: c.teal, flexShrink: 0 }} />
          <span className="font-bold">{dataPoland}</span>
          <span style={{ color: c.muted }}>internet w Polsce</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px]" style={{ color: c.text }}>
          <ArrowRightLeft size={15} style={{ color: c.teal, flexShrink: 0 }} />
          <span className="font-bold">{dataRoaming}</span>
          <span style={{ color: c.muted }}>w roamingu UE</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px]" style={{ color: c.text }}>
          <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0 }} />
          <span style={{ color: c.muted }}>Nielimitowane połączenia, SMS-y i MMS-y</span>
        </div>
      </div>

      <p className="text-[13px] leading-relaxed" style={{ color: c.muted }}>
        {description}
      </p>
    </div>
  );
}

/* ---------- numbered step ---------- */

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

/* ---------- comparison table ---------- */

function ComparisonTable() {
  const rows: { label: string; values: [string, string, string] }[] = [
    { label: "Internet w Polsce", values: ["60 GB", "100 GB", "200 GB"] },
    { label: "Internet w roamingu UE", values: ["8.5 GB", "11 GB", "15 GB"] },
    { label: "Cena po promocji", values: ["30 zł/mc", "40 zł/mc", "60 zł/mc"] },
    { label: "Rozmowy i SMS/MMS", values: ["Nielimitowane", "Nielimitowane", "Nielimitowane"] },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden my-4"
      style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
    >
      <div
        className="grid grid-cols-4 text-[13px] font-bold px-5 py-3"
        style={{ borderBottom: `1px solid ${c.border}`, color: c.text }}
      >
        <div>Cecha</div>
        <div className="text-center">SUPER 5G</div>
        <div className="text-center">VIP 5G</div>
        <div className="text-center">GIGA 5G</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
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
            <div key={j} className="text-center">
              {v}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */

export default function NetiaUslugiMobilnePomocPage() {
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
            <Pill icon={<HelpCircle size={15} style={{ color: c.teal }} />}>
              Najczęstsze pytania
            </Pill>
            <Pill>5G</Pill>
            <Pill>Plany</Pill>
            <Pill>Funkcje</Pill>
            <Pill>Promocje</Pill>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-2">
          <Paragraph>
            <span className="block mt-8">
              Netia Mobile 5G to usługa telefonii komórkowej działająca na bazie sieci operatora
              Plus. Dzięki temu klienci Netii mają dostęp do jednej z najnowocześniejszych sieci
              mobilnych w Polsce, obejmującej technologię 5G bez dodatkowych opłat.
            </span>
          </Paragraph>

          <div id="5g">
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

          <div id="plany">
            <SectionHeading>Dostępne plany taryfowe</SectionHeading>
            <Paragraph>
              Netia oferuje trzy plany mobilne 5G, każdy z nielimitowanymi rozmowami, SMS-ami i
              MMS-ami w kraju:
            </Paragraph>

            <div className="flex flex-col md:flex-row gap-4 my-4">
              <PlanCard
                name="SUPER 5G"
                price="30 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="60 GB"
                dataRoaming="8.5 GB"
                description="Plan podstawowy z 60 GB transferu danych w Polsce i 8,5 GB w roamingu UE. Idealny dla osób, które korzystają z telefonu głównie do komunikacji i podstawowego przeglądania internetu."
              />
              <PlanCard
                name="VIP 5G"
                price="40 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="100 GB"
                dataRoaming="11 GB"
                description="Rozszerzony plan z 100 GB transferu danych w Polsce i 11 GB w roamingu UE. Polecany użytkownikom aktywnie korzystającym z multimediów, streamingu i mediów społecznościowych."
                featured
              />
              <PlanCard
                name="GIGA 5G"
                price="60 zł/mc"
                promoNote="6 mc. 0 zł po rabatach"
                dataPoland="200 GB"
                dataRoaming="15 GB"
                description="Największy pakiet z 200 GB transferu danych w Polsce i 15 GB w roamingu UE. Stworzony dla najbardziej wymagających użytkowników – idealny jako mobilne centrum rozrywki."
              />
            </div>

            <Note>
              Wszystkie plany zawierają 6 miesięcy za 0 zł z rabatami, aktywację za 0 zł oraz
              umowę na 24 miesiące.
            </Note>
          </div>

          <div id="funkcje">
            <SectionHeading>Co zawiera każdy plan?</SectionHeading>
            <Paragraph>
              Niezależnie od wybranego planu, każdy abonent otrzymuje:
            </Paragraph>
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

          <div id="promocje">
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

          <div id="przeniesienie-numeru">
            <SectionHeading>Przeniesienie numeru do Netii</SectionHeading>
            <Paragraph>Możesz łatwo przenieść swój obecny numer telefonu do Netii:</Paragraph>
            <div
              className="rounded-xl px-5 py-2 my-4"
              style={{ background: c.card, border: `1px solid ${c.border}` }}
            >
              <Step number={1}>Złóż zamówienie na usługę mobilną Netia.</Step>
              <Step number={2}>Podaj swój obecny numer telefonu i dane operatora.</Step>
              <Step number={3}>Netia zajmie się formalnościami przeniesienia.</Step>
              <Step number={4}>Otrzymasz nową kartę SIM i zachowasz dotychczasowy numer.</Step>
            </div>
            <Note>Proces przeniesienia numeru trwa zazwyczaj do kilku dni roboczych.</Note>
          </div>

          <div id="pakiety-laczone">
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
            <div
              className="rounded-xl px-5 py-4 my-4 flex items-center gap-3.5"
              style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
            >
              <Layers size={18} style={{ color: c.teal, flexShrink: 0 }} />
              <div className="text-[13.5px]" style={{ color: c.muted }}>
                Sprawdź konfigurator oferty i dobierz usługi do swoich potrzeb.
              </div>
            </div>
          </div>

          <div id="porownanie">
            <SectionHeading>Porównanie planów</SectionHeading>
            <Paragraph>Porównanie planów taryfowych SUPER, VIP i GIGA:</Paragraph>
            <ComparisonTable />
          </div>
        </div>
      </div>
    </div>
  );
}