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
import { useState, type ReactNode } from "react";

/* ---------- design tokens ----------
   bg matches the earlier request: rgb(11, 42, 61).
   Everything else (card / cardAlt / borders) is a tint or line of
   that same navy so the page reads as one material. */
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
    <div id={id}>
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
   own Pomoc → Internet page. */
function DeviceDetailCard({
  eyebrow,
  name,
  tier,
  subtitle,
  image,
  description,
  specs,
  techTitle,
  techPoints,
  speedNote,
  costNote,
  manualLabel,
}: {
  eyebrow: string;
  name: string;
  tier: string;
  subtitle: string;
  image: string;
  description: string[];
  specs: { label: string; value: string }[];
  techTitle: string;
  techPoints: string[];
  speedNote: string;
  costNote: string;
  manualLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4 text-left"
      style={{ background: c.card, border: `1px solid ${c.border}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 cursor-pointer border-0 bg-transparent text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ background: "#ffffff", border: `1px solid ${c.border}` }}
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <div>
            <div className="text-[12.5px] mb-1" style={{ color: c.faint }}>
              {eyebrow}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-extrabold text-[16px]" style={{ color: c.text }}>
                {name}
              </div>
              <span
                className="text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ color: c.teal, background: c.tealDim, border: `1px solid ${c.tealBorder}` }}
              >
                {tier}
              </span>
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
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s ease",
          }}
        />
      </button>

      {open && (
        <div className="px-6 pb-6" style={{ borderTop: `1px solid ${c.border}` }}>
          <div className="pt-5 flex flex-col sm:flex-row gap-5">
            <div
              className="w-full sm:w-[180px] flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "#ffffff", border: `1px solid ${c.border}`, minHeight: 160 }}
            >
              <img
                src={image}
                alt={name}
                className="w-full h-full object-contain p-3"
              />
            </div>
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-2 text-[11.5px] tracking-wide uppercase font-bold px-3 py-1 rounded-full mb-3"
                style={{ color: c.teal, background: c.tealDim, border: `1px solid ${c.tealBorder}` }}
              >
                Opis urządzenia
              </div>
              {description.map((p, i) => (
                <Paragraph key={i}>{p}</Paragraph>
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
            <ul>
              {techPoints.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 py-1 text-[14px]"
                  style={{ color: c.muted }}
                >
                  <CheckCircle2 size={15} style={{ color: c.teal, flexShrink: 0, marginTop: 3 }} />
                  {t}
                </li>
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
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function NetiaInternetPomocPage() {
  return (
    <div style={{ backgroundColor: c.bg, color: c.text }} className="font-sans leading-relaxed">
      <div className="max-w-[820px] mx-auto px-6 py-10 pt-36">
        {/* HERO CARD */}
        <div
          className="rounded-[22px] px-8 md:px-10 py-9"
          style={{
            background: `radial-gradient(120%% 160%% at 0%% 0%%, ${c.cardAlt} 0%%, ${c.bg} 55%%, ${c.bgDeep} 100%%)`,
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
            <Pill icon={<HelpCircle size={15} style={{ color: c.teal }} />}>
              Najczęstsze pytania
            </Pill>
            <Pill>PON</Pill>
            <Pill>ETTH</Pill>
            <Pill>HFC</Pill>
            <Pill>Urządzenia</Pill>
          </div>
        </div>

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

          <div id="urzadzenia">
            <SectionHeading>Urządzenia używane w Netii</SectionHeading>
            <Paragraph>
              Netia udostępnia abonentom sprzęt dostosowany do technologii, w jakiej działa
              usługa:
            </Paragraph>
          </div>

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych"
            name="HUAWEI HG8245Q"
            tier="lowrouter"
            subtitle="Router ONT Combo z Wi-Fi 5"
            image="data:image/webp;base64,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"
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
          />

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 1 Gb/s"
            name="HUAWEI HG8245X6-10"
            tier="midrouter"
            subtitle="Router z Wi-Fi 6"
            image="data:image/webp;base64,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"
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
          />

          <DeviceDetailCard
            eyebrow="Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 2 Gb/s"
            name="HUAWEI HG8145B7N"
            tier="toprouter"
            subtitle="Router z Wi-Fi 7 i portem 2.5G LAN"
            image="data:image/webp;base64,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"
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