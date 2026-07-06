"use client";

import {
  Tv,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useState, type ReactNode } from "react";

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

/* Full decoder card — description, spec table and manual link.
   Collapsible so the page stays scannable, matching the accordion
   pattern on Netia's own Pomoc → Telewizja page. */
function DecoderDetailCard({
  eyebrow,
  name,
  subtitle,
  description,
  specs,
  manualLabel,
}: {
  eyebrow: string;
  name: string;
  subtitle: string;
  description: string[];
  specs: { label: string; value: string }[];
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
          <div className="pt-5">
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
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function NetiaTelewizjaPomocPage() {
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
            <Pill icon={<HelpCircle size={15} style={{ color: c.teal }} />}>
              Najczęstsze pytania
            </Pill>
            <Pill>IPTV</Pill>
            <Pill>Dekodery</Pill>
            <Pill>Pakiety</Pill>
            <Pill>Funkcje</Pill>
            <Pill>Multiroom</Pill>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-2">
          <Paragraph>
            <span className="block mt-8">
              Telewizja Netii działa wyłącznie jako element zestawu z internetem stacjonarnym.
              Wynika to z technologii IPTV – cała transmisja kanałów odbywa się przez łącze
              internetowe, więc aktywna usługa internetu jest niezbędna.
            </span>
          </Paragraph>

          <div id="iptv">
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

          <div id="dekodery">
            <SectionHeading>Dekodery Netii</SectionHeading>
            <Paragraph>Netia oferuje trzy modele dekoderów IPTV:</Paragraph>
          </div>

          <DecoderDetailCard
            eyebrow="Dekoder NETIA SOUNDBOX 4K"
            name="NETIA SOUNDBOX 4K"
            subtitle="Dekoder Android TV 4K z wbudowanym soundbarem"
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
          />

          <DecoderDetailCard
            eyebrow="Dekoder NETIA EVOBOX 4K"
            name="NETIA EVOBOX 4K"
            subtitle="Kompaktowy dekoder IPTV Ultra HD / 4K"
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
          />

          <DecoderDetailCard
            eyebrow="Dekoder NETIA EVOBOX HD"
            name="NETIA EVOBOX HD"
            subtitle="Lekki, ekonomiczny dekoder HD"
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
          />
        </div>
      </div>
    </div>
  );
}