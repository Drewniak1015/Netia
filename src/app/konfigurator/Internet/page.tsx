"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Check,
  Zap,
  Wifi,
  Gauge,
  Infinity as InfinityIcon,
  Sparkles,
  Flame,
  Lock,
  FileCheck,
  FileText,
  Truck,
  MapPin,
  Headset,
  RotateCcw,
  Info,
  ListChecks,
  ListOrdered,
  Smartphone,
  Users,
  ThumbsUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";

/**
 * OfferInternetTvSection
 * Sekcja "Internet + Telewizja XS": baner promo + siatka 2x2 kart.
 *
 * NOWOŚĆ: benefity kart (prędkość, router, Netia GO) są teraz klikalne —
 * otwierają ten sam modal "Szczegóły" co w OfferQuizSection (routery,
 * Netia GO, oraz nowe wpisy tłumaczące gwarancję prędkości per wariant).
 * Cechy bez `infoId` (np. "Telewizja XS w pakiecie") zostają zwykłym,
 * nieklikalnym tekstem.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PHONE_DISPLAY = "+48 883 334 124";
const PHONE_HREF = "tel:+48883334124";
const SMS_HREF = "sms:+48883334124?body=INTERNET";

/** Poprawna polska odmiana słowa "miesiąc" dla liczb używanych w promocjach. */
function polishMonthsWord(n: number): string {
  if (n === 1) return "miesiąc";
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 12 && lastTwo <= 14) return "miesięcy";
  if (lastDigit >= 2 && lastDigit <= 4) return "miesiące";
  return "miesięcy";
}

/** Klucz koloru akcentu przypisany do wariantu prędkości — odwzorowuje logikę
 * "prostota → moc": teal (start) → emerald (rodzina) → pink (moc) → amber (flagowiec). */
type AccentKey = "teal" | "emerald" | "pink" | "amber";

/** Literalne klasy Tailwind per akcent — celowo nie budowane dynamicznym
 * template stringiem, żeby JIT poprawnie je wykrył i nie wyciął przy buildzie. */
const ACCENT_STYLES: Record<
  AccentKey,
  {
    speedText: string;
    spineBar: string;
    checkBg: string;
    checkText: string;
    borderFeatured: string;
    glowFeatured: string;
    featuredBadge: string;
    promoPill: string;
  }
> = {
  teal: {
    speedText: "text-teal-400",
    spineBar: "bg-gradient-to-b from-teal-400 to-teal-600",
    checkBg: "bg-teal-400/10",
    checkText: "text-teal-400",
    borderFeatured: "border-2 border-teal-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(20,184,166,0.15),0_20px_45px_-20px_rgba(20,184,166,0.45)]",
    featuredBadge: "bg-gradient-to-r from-teal-500 to-teal-400 text-[#0B2A3D]",
    promoPill:
      "bg-gradient-to-r from-teal-500 to-teal-400 text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(20,184,166,0.7)]",
  },
  emerald: {
    speedText: "text-emerald-400",
    spineBar: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    checkBg: "bg-emerald-400/10",
    checkText: "text-emerald-400",
    borderFeatured: "border-2 border-emerald-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_20px_45px_-20px_rgba(52,211,153,0.45)]",
    featuredBadge: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#0B2A3D]",
    promoPill:
      "bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(52,211,153,0.7)]",
  },
  pink: {
    speedText: "text-pink-400",
    spineBar: "bg-gradient-to-b from-pink-400 to-fuchsia-600",
    checkBg: "bg-pink-400/10",
    checkText: "text-pink-400",
    borderFeatured: "border-2 border-pink-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(244,114,182,0.45)]",
    featuredBadge: "bg-gradient-to-r from-pink-500 to-fuchsia-400 text-white",
    promoPill:
      "bg-gradient-to-r from-pink-500 to-fuchsia-400 text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(244,114,182,0.7)]",
  },
  amber: {
    speedText: "text-amber-400",
    spineBar: "bg-gradient-to-b from-amber-300 to-amber-600",
    checkBg: "bg-amber-400/10",
    checkText: "text-amber-400",
    borderFeatured: "border-2 border-amber-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_20px_45px_-20px_rgba(251,191,36,0.45)]",
    featuredBadge: "bg-gradient-to-r from-amber-400 to-amber-300 text-[#0B2A3D]",
    promoPill:
      "bg-gradient-to-r from-amber-400 to-amber-300 text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(251,191,36,0.7)]",
  },
};

/* ======================================================================
   SYSTEM "SZCZEGÓŁY" (routery, Netia GO, prędkość) — 1:1 wzorzec z
   OfferQuizSection: cecha z `infoId` jest klikalna i otwiera modal.
   ====================================================================== */

interface OfferFeature {
  label: string;
  /** Jeśli obecne, cecha jest klikalna i otwiera popup ze szczegółami z INFO_ITEMS. */
  infoId?: string;
}

type SectionContent =
  | { type: "paragraphs"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "specTable"; items: { label: string; value: string }[] }
  | { type: "box"; text: string };

interface InfoSection {
  title: string;
  icon: LucideIcon;
  content: SectionContent;
}

interface InfoItem {
  id: string;
  model: string;
  podtytul?: string;
  zdjecie?: string;
  banner?: string;
  bannerAkcent?: "teal" | "lime";
  sections: InfoSection[];
  uwaga?: string;
  instrukcjaUrl?: string;
}

/** Generuje wpis "Szczegóły" dla danego wariantu prędkości — ten sam poziom
 * konkretu co przy routerach (gwarancja prawna + technologia), zamiast
 * marketingowego ogólnika w karcie. */
function createSpeedInfo(speedLabel: string, id: string): InfoItem {
  return {
    id,
    model: `Internet do ${speedLabel}`,
    podtytul: "Prędkość Internetu Światłowodowego Netia",
    sections: [
      {
        title: "Jak działa prędkość w umowie",
        icon: Gauge,
        content: {
          type: "paragraphs",
          items: [
            `Deklarowana prędkość do ${speedLabel} to prędkość maksymalna, osiągana w sieci światłowodowej PON przy sprzyjających warunkach technicznych połączenia.`,
            "Zgodnie z prawem gwarantujemy minimum 50% zadeklarowanej prędkości przez cały czas trwania umowy. Jeśli usługa nie spełnia tego warunku, zgłoś to wsparciu technicznemu dostępnemu 24/7.",
          ],
        },
      },
      {
        title: "Technologia",
        icon: Wifi,
        content: {
          type: "bullets",
          items: [
            "Światłowód PON — najniższe opóźnienia (1–5 ms)",
            "Stała prędkość o każdej porze dnia, niezależnie od obciążenia sieci",
            "Prędkości od 2 Gb/s dostępne w wybranej technologii (PON)",
          ],
        },
      },
    ],
  };
}

const INFO_ITEMS: Record<string, InfoItem> = {
  "predkosc-300": createSpeedInfo("300 Mb/s", "predkosc-300"),
  "predkosc-600": createSpeedInfo("600 Mb/s", "predkosc-600"),
  "predkosc-1000": createSpeedInfo("1000 Mb/s", "predkosc-1000"),
  "predkosc-2000": createSpeedInfo("2000 Mb/s", "predkosc-2000"),

  "router-wifi": {
    id: "router-wifi",
    model: "HUAWEI HG8245Q",
    podtytul:
      "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych",
    zdjecie: "/images/LowRouter.webp",
    sections: [
      {
        title: "Opis urządzenia",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Huawei HG8245Q to stabilny i sprawdzony terminal optyczny GPON stosowany w instalacjach światłowodowych Netii. Urządzenie łączy funkcję routera Wi-Fi, gigabitowego przełącznika, bramy VoIP i optycznego ONT w jednej obudowie.",
            "Zaprojektowany do pracy ciągłej, oferuje pewne połączenie internetowe, obsługę usług IPTV oraz telefonię VoIP. Dwupasmowe Wi-Fi 2.4 / 5 GHz zapewnia stabilne działanie sieci bezprzewodowej w mieszkaniu, a cztery porty LAN ułatwiają podłączanie telewizora, konsoli lub komputera po kablu.",
          ],
        },
      },
      {
        title: "Specyfikacja techniczna",
        icon: ListChecks,
        content: {
          type: "specTable",
          items: [
            { label: "Światłowód / PON", value: "GPON ITU-T G.984, port optyczny SC/APC" },
            { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL (VoIP), 1× USB, zasilanie DC" },
            { label: "Wi-Fi (2.4 / 5 GHz)", value: "802.11 b/g/n + 802.11 a/n/ac, WPA/WPA2, WPS" },
            { label: "Funkcje", value: "NAT / DHCP / firewall, QoS, IPTV / VLAN, VoIP" },
            { label: "Wymiary", value: "285 × 190 × 85 mm" },
            { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
          ],
        },
      },
      {
        title: "Prędkość Internetu Światłowodowego Netia",
        icon: Gauge,
        content: {
          type: "box",
          text: "Router Huawei HG8245Q jest instalowany przy prędkościach do 600 Mb/s, do 300 Mb/s, do 150 Mb/s.",
        },
      },
      {
        title: "Koszt routera zawarty w umowie",
        icon: Wallet,
        content: {
          type: "box",
          text: "Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów.",
        },
      },
    ],
    instrukcjaUrl: "/pdf/Instrukcja_Router_Huawei_HG8245Q.pdf",
  },

  "router-wifi6": {
    id: "router-wifi6",
    model: "HUAWEI HG8245X6-10",
    podtytul: "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 1 Gb/s",
    zdjecie: "/images/MidRouter.webp",
    sections: [
      {
        title: "Opis urządzenia",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Huawei HG8245X6-10 to nowoczesny terminal GPON wyposażony w technologię Wi-Fi 6. Zapewnia wyższą przepustowość, stabilność oraz lepszą obsługę wielu urządzeń równocześnie, co czyni go idealnym dla gospodarstw domowych z telewizorami 4K, konsolami, laptopami i systemami smart home.",
            "Router obsługuje szybkie połączenia bezprzewodowe, IPTV i VoIP, a cztery gigabitowe porty LAN umożliwiają podłączenie urządzeń wymagających maksymalnej stabilności. HG8245X6-10 pozwala w pełni wykorzystać możliwości światłowodu o prędkości do 1 Gb/s.",
          ],
        },
      },
      {
        title: "Specyfikacja techniczna",
        icon: ListChecks,
        content: {
          type: "specTable",
          items: [
            { label: "Światłowód / PON", value: "GPON, port SC/APC" },
            { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL, 1× USB, zasilanie DC" },
            { label: "Wi-Fi 6 (802.11ax)", value: "2.4 i 5 GHz, OFDMA, MU-MIMO, WPA2 / WPA3*" },
            { label: "Funkcje", value: "IPTV / VLAN, NAT / DHCP / firewall, QoS, WPS" },
            { label: "Wymiary", value: "235 × 150 × 33 mm" },
            { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
          ],
        },
      },
      {
        title: "Technologia Wi-Fi 6",
        icon: Wifi,
        content: {
          type: "bullets",
          items: [
            "wyższe prędkości i niższe opóźnienia",
            "streaming 4K/8K bez buforowania",
            "większa stabilność przy wielu urządzeniach",
            "lepszy zasięg i odporność na zakłócenia",
          ],
        },
      },
      {
        title: "Prędkość Internetu Światłowodowego Netia",
        icon: Gauge,
        content: {
          type: "box",
          text: "Router Huawei HG8245X6-10 jest instalowany przy prędkościach do 1 Gb/s.",
        },
      },
      {
        title: "Koszt routera zawarty w umowie",
        icon: Wallet,
        content: {
          type: "box",
          text: "Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów.",
        },
      },
    ],
    instrukcjaUrl: "/pdf/Instrukcja_Router_Huawei_HG8245X6_10.pdf",
  },

  "router-wifi7": {
    id: "router-wifi7",
    model: "HUAWEI HG8145B7N",
    podtytul: "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 2 Gb/s",
    zdjecie: "/images/TopRouter.webp",
    sections: [
      {
        title: "Opis urządzenia",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Huawei HG8145B7N to najbardziej zaawansowany router dostępny w Netii. Wyposażony w najnowszy standard Wi-Fi 7 oraz port LAN 2.5 Gb/s, pozwala wykorzystać pełny potencjał światłowodu o prędkości do 2 Gb/s.",
            "Urządzenie obsługuje najnowocześniejsze funkcje, takie jak Multi-Link Operation, kanały 320 MHz i modulację 4096-QAM, co gwarantuje szybkie, stabilne i odporne na zakłócenia połączenie. Router idealnie sprawdza się w środowiskach o dużym obciążeniu — streaming 8K, VR, gaming, praca w chmurze i profesjonalne zestawy multimedialne.",
          ],
        },
      },
      {
        title: "Specyfikacja techniczna",
        icon: ListChecks,
        content: {
          type: "specTable",
          items: [
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
          ],
        },
      },
      {
        title: "Technologia Wi-Fi 7",
        icon: Wifi,
        content: {
          type: "bullets",
          items: [
            "ultrawysokie prędkości",
            "najniższe opóźnienia",
            "praca na wielu pasmach jednocześnie (MLO)",
            "idealny do VR, 8K, gamingu i pracy profesjonalnej",
          ],
        },
      },
      {
        title: "Prędkość Internetu Światłowodowego Netia",
        icon: Gauge,
        content: {
          type: "box",
          text: "Router Huawei HG8145B7N jest instalowany przy prędkościach do 2 Gb/s.",
        },
      },
      {
        title: "Koszt routera zawarty w umowie",
        icon: Wallet,
        content: {
          type: "box",
          text: "Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów.",
        },
      },
    ],
    instrukcjaUrl: "/pdf/Instrukcja_Router_ONTCombo_HuaweiHG8145B7N-_2-5G_WiFi7.pdf",
  },

  "netia-go": {
    id: "netia-go",
    model: "Netia GO",
    podtytul: "Serwis TV online i VOD dla klientów telewizji Netii",
    banner: "Twoja telewizja online — w domu i w podróży",
    bannerAkcent: "lime",
    sections: [
      {
        title: "Opis usługi",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Netia GO to serwis TV online i VOD dla klientów telewizji Netii – oglądasz kanały na żywo i bibliotekę filmów/seriali na dekoderze, w przeglądarce oraz w aplikacjach mobilnych i Smart TV. Logujesz się danymi z Netia Online i startujesz od razu – w domu i w podróży.",
          ],
        },
      },
      {
        title: "Jak zacząć",
        icon: ListOrdered,
        content: {
          type: "steps",
          items: [
            "Wejdź na go.netia.pl lub zainstaluj aplikację (Google Play / App Store / Android TV / Apple TV / wybrane Samsung Smart TV od 2019 r.).",
            "Zaloguj się danymi do Netia Online i zacznij oglądać.",
          ],
        },
      },
      {
        title: "Urządzenia",
        icon: Smartphone,
        content: {
          type: "bullets",
          items: [
            "Dekoder Netia (EvoBox).",
            "Telefon i tablet (Android / iOS).",
            "Komputer (przeglądarka).",
            "Smart TV (Android TV, Apple TV, wybrane Samsung), wsparcie Chromecast i AirPlay.",
          ],
        },
      },
      {
        title: "Kluczowe funkcje",
        icon: Sparkles,
        content: {
          type: "bullets",
          items: [
            "Kanały TV online oraz biblioteka VOD (w tym treści Netia Premium).",
            "Kontynuacja oglądania na dowolnym urządzeniu, profile użytkowników i lista „Moje”.",
            "Rekomendacje treści oraz wybrane tytuły do oglądania offline (pobieranie w aplikacji mobilnej).",
          ],
        },
      },
      {
        title: "Limity i konta",
        icon: Users,
        content: {
          type: "bullets",
          items: [
            "Do 5 profili na koncie abonenckim.",
            "Jednoczesne oglądanie na maks. 3 urządzeniach (w zależności od oferty/treści).",
          ],
        },
      },
      {
        title: "Dostęp i płatności",
        icon: Wallet,
        content: {
          type: "bullets",
          items: [
            "Dostęp dla abonentów TV Netii w ramach posiadanej oferty (bez dodatkowych opłat za samą usługę Netia GO).",
            "Wybrane treści transakcyjne (TVOD) mogą być płatne jednorazowo.",
          ],
        },
      },
      {
        title: "Korzyści",
        icon: ThumbsUp,
        content: {
          type: "bullets",
          items: [
            "TV i VOD na wielu ekranach – zawsze pod ręką.",
            "Szybki start bez dodatkowej konfiguracji.",
            "Łatwe przerzucanie obrazu na duży ekran (Chromecast/AirPlay).",
            "Offline dla wybranych tytułów bez Internetu.",
          ],
        },
      },
    ],
  },
};

const BANNER_AKCENTY: Record<
  "teal" | "lime",
  { border: string; background: string; text: string; soft: string }
> = {
  teal: {
    border: "border-teal-300/25",
    background:
      "radial-gradient(130% 160% at 15% 0%, rgba(45,212,191,.45), transparent 60%), linear-gradient(135deg, #0f3550 0%, #0B2A3D 100%)",
    text: "text-teal-300",
    soft: "bg-teal-300/15",
  },
  lime: {
    border: "border-[#a3d146]/40",
    background: "linear-gradient(135deg, #8bc34a 0%, #5c9c2e 55%, #33540f 100%)",
    text: "text-[#c3e86b]",
    soft: "bg-[#a3d146]/15",
  },
};

/** Kolor podkreślenia klikalnej cechy: teal domyślnie, limonkowy dla Netia GO. */
function klasaCechy(infoId: string | undefined, aktywnyInfoId: string | null): string {
  const jestAktywna = !!infoId && infoId === aktywnyInfoId;

  if (jestAktywna) {
    const akcent = infoId ? INFO_ITEMS[infoId]?.bannerAkcent : undefined;
    if (akcent === "lime") return "text-[rgb(166,206,58)] decoration-[rgb(166,206,58)]";
    return "text-teal-300 decoration-teal-300";
  }

  return "hover:text-teal-300 hover:decoration-teal-300";
}

function IkonaProduktu({ zdjecie, model }: { zdjecie: string; model: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={zdjecie}
      alt={model}
      className="h-40 w-full rounded-xl border border-white/10 bg-white object-contain p-4 sm:h-48"
    />
  );
}

function TrescSekcji({
  content,
  akcent,
}: {
  content: SectionContent;
  akcent: { text: string; soft: string };
}) {
  switch (content.type) {
    case "paragraphs":
      return (
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
          {content.items.map((akapit, i) => (
            <p key={i}>{akapit}</p>
          ))}
        </div>
      );

    case "bullets":
      return (
        <ul className="mt-3 space-y-2">
          {content.items.map((cecha, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/75">
              <Check size={15} className={`mt-0.5 shrink-0 ${akcent.text}`} />
              {cecha}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mt-3 space-y-2.5">
          {content.items.map((krok, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/75">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${akcent.soft} ${akcent.text}`}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{krok}</span>
            </li>
          ))}
        </ol>
      );

    case "specTable":
      return (
        <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
          {content.items.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
            >
              <span className={`text-xs font-semibold ${akcent.text}`}>{spec.label}</span>
              <span className="text-sm text-white/75">{spec.value}</span>
            </div>
          ))}
        </div>
      );

    case "box":
      return (
        <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/75">{content.text}</p>
        </div>
      );

    default:
      return null;
  }
}

function InfoModal({ infoId, onClose }: { infoId: string | null; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const item = infoId ? INFO_ITEMS[infoId] : null;

  useEffect(() => {
    if (!item) return;
    const poprzednieOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = poprzednieOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <m.div
          key="info-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="info-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={item.model}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
            style={{ backgroundColor: "#0B2A3D" }}
          >
            {(() => {
              const akcent = BANNER_AKCENTY[item.bannerAkcent ?? "teal"];

              return (
                <>
                  <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
                    <div className={`flex items-center gap-2 ${akcent.text}`}>
                      <Info size={18} />
                      <span className="text-xs font-bold uppercase tracking-wide">Szczegóły</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                      {item.model}
                    </h3>
                    {item.podtytul && (
                      <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
                    {item.zdjecie && <IkonaProduktu zdjecie={item.zdjecie} model={item.model} />}

                    {item.banner && (
                      <div
                        className={`mb-6 overflow-hidden rounded-2xl border ${akcent.border} px-5 py-7 text-center sm:px-8 sm:py-9`}
                        style={{ background: akcent.background }}
                      >
                        <p className="text-xl font-extrabold leading-snug text-white sm:text-2xl">
                          {item.banner}
                        </p>
                      </div>
                    )}

                    {item.sections.map((section, i) => {
                      const Ikona = section.icon;

                      if (section.content.type === "box") {
                        return (
                          <div
                            key={section.title}
                            className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                              <Ikona size={14} className={akcent.text} />
                              {section.title}
                            </h4>
                            <p className="mt-1.5 text-sm text-white/75">{section.content.text}</p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={section.title}
                          className={
                            i === 0 && !item.zdjecie && !item.banner
                              ? "mt-0"
                              : "mt-6 border-t border-white/10 pt-6"
                          }
                        >
                          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                            <Ikona size={15} className={akcent.text} />
                            {section.title}
                          </h4>
                          <TrescSekcji content={section.content} akcent={akcent} />
                        </div>
                      );
                    })}

                    {item.uwaga && (
                      <p className="mt-6 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/40">
                        {item.uwaga}
                      </p>
                    )}

                    {item.instrukcjaUrl && (
                      <a
                        href={item.instrukcjaUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-300/20"
                      >
                        Instrukcja użytkownika {item.model}
                        <ChevronRight size={16} />
                      </a>
                    )}
                  </div>
                </>
              );
            })()}

            <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
                Zamknij
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ======================================================================
   PLANY — teraz z jawną listą `features` (zamiast pojedynczych pól
   routerBenefit/extraBenefit), żeby dało się mieszać cechy klikalne
   (router, Netia GO) ze zwykłym tekstem (Telewizja XS w pakiecie).
   ====================================================================== */

interface Plan {
  speed: string;
  price: string;
  tag: string;
  /** Liczba darmowych miesięcy promocji — jeśli brak, karta pokazuje zwykłą plakietkę `tag`. */
  promoMonths?: number;
  featured?: boolean;
  icon: LucideIcon;
  /** Klucz do INFO_ITEMS — klikalna prędkość otwiera modal z gwarancją i technologią. */
  speedInfoId: string;
  /** Cechy karty — te z `infoId` są klikalne. */
  features: OfferFeature[];
  /** Kolor akcentu karty (pasek, liczba, checklista) — różny dla każdej prędkości. */
  accent: AccentKey;
}

const plans: Plan[] = [
  {
    speed: "300 Mb/s",
    price: "30",
    tag: "Na start",
    icon: Wifi,
    speedInfoId: "predkosc-300",
    accent: "teal",
    features: [
      { label: "Internet do 300 Mb/s" },
      { label: "Router Wi-Fi w cenie", infoId: "router-wifi" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "600 Mb/s",
    price: "55",
    tag: "Wybór rodziny",
    promoMonths: 3,
    icon: Gauge,
    speedInfoId: "predkosc-600",
    accent: "emerald",
    features: [
      { label: "Internet do 600 Mb/s" },
      { label: "Router Wi-Fi w cenie", infoId: "router-wifi" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1000 Mb/s",
    price: "65",
    tag: "Moc dla wymagających",
    promoMonths: 3,
    icon: Zap,
    speedInfoId: "predkosc-1000",
    accent: "pink",
    features: [
      { label: "Internet do 1000 Mb/s" },
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "2000 Mb/s",
    price: "80",
    tag: "Najczęściej wybierany",
    promoMonths: 6,
    featured: true,
    icon: InfinityIcon,
    speedInfoId: "predkosc-2000",
    accent: "amber",
    features: [
      { label: "Internet do 2000 Mb/s" },
      { label: "Router Combo z ONT Wi-Fi 7 w cenie", infoId: "router-wifi7" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
];

interface PlanCardProps {
  plan: Plan;
  index: number;
  reduceMotion: boolean | null;
  onFeatureClick: (infoId: string) => void;
  aktywnyInfoId: string | null;
}

function PlanCard({ plan, index, reduceMotion, onFeatureClick, aktywnyInfoId }: PlanCardProps) {
  const accent = ACCENT_STYLES[plan.accent];

  return (
    <m.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={`relative flex flex-col rounded-2xl p-5 pt-5 pb-5 sm:p-7 sm:pt-7 sm:pb-6 bg-[#183648] ${
        plan.featured ? `${accent.borderFeatured} ${accent.glowFeatured}` : "border border-white/10"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-6 bottom-6 w-1 rounded-full ${accent.spineBar}`}
      />

      {plan.featured && (
        <m.span
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${accent.featuredBadge}`}
        >
          Najczęściej wybierany
        </m.span>
      )}

      <div className="mb-3.5 flex items-center justify-between gap-3">
        {/* Prędkość — zwykły tekst, nieklikalny (info o gwarancji jest dostępne przez benefit "Internet do X Mb/s" niżej) */}
        <span className={`text-3xl font-black tracking-tight sm:text-4xl ${accent.speedText}`}>
          {plan.speed}
        </span>
        {plan.promoMonths ? (
          <m.span
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-wide ${accent.promoPill}`}
          >
            <Zap size={13} fill="currentColor" />
            {plan.promoMonths} {polishMonthsWord(plan.promoMonths)} za 0 zł!
          </m.span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/55">
            {plan.tag}
          </span>
        )}
      </div>

      <div className="mb-5 flex items-baseline gap-1.5 border-b border-white/10 pb-5">
        <span className="text-[28px] font-black leading-none text-white">
          {plan.price} zł
        </span>
        <span className="text-[13px] text-white/55">/ mies.</span>
      </div>

      <ul className="mb-6 flex-1 list-none space-y-3 p-0">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5 text-sm leading-snug text-white">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${accent.checkBg} ${accent.checkText}`}
            >
              <Check size={14} strokeWidth={3} />
            </span>
            {f.infoId ? (
              <button
                type="button"
                onClick={() => onFeatureClick(f.infoId!)}
                className={`inline-flex cursor-pointer items-center gap-1 text-left underline decoration-dotted decoration-white/25 underline-offset-4 transition-colors ${klasaCechy(
                  f.infoId,
                  aktywnyInfoId
                )}`}
              >
                {f.label}
                <Info size={12} className="shrink-0 opacity-60" />
              </button>
            ) : (
              <span>{f.label}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <m.a
          href={PHONE_HREF}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex w-full sm:min-w-[140px] sm:w-auto flex-1 items-center justify-between gap-3 rounded-2xl border border-transparent bg-teal-500 px-4 py-3 text-white shadow-[0_8px_20px_-8px_rgba(20,184,166,0.6)]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Phone size={16} />
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold leading-tight">
                Zadzwoń
              </span>
              <span className="block text-xs font-normal text-white/85">
                {PHONE_DISPLAY}
              </span>
            </span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-white/70" />
        </m.a>
        <m.a
          href={SMS_HREF}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex w-full sm:min-w-[140px] sm:w-auto flex-1 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <MessageCircle size={16} />
            </span>
            <span className="text-sm font-bold">Wyślij SMS</span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-white/50" />
        </m.a>
      </div>
    </m.div>
  );
}

interface TrustItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/** Uniwersalny pasek zaufania — 3 gwarancje prawnie ugruntowane, wspólne dla
 * całej oferty (nie tylko tej sekcji), zgodnie z rekomendacją z badania:
 * konkretne, weryfikowalne fakty budują zaufanie mocniej niż obietnice. */
const trustItems: TrustItem[] = [
  {
    icon: Gauge,
    title: "Prędkość zgodna z umową",
    desc: "Minimum 50% deklarowanej prędkości, zgodnie z prawem.",
  },
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Odstąpienie od umowy bez podania przyczyny.",
  },
  {
    icon: Headset,
    title: "Wsparcie zawsze pod ręką",
    desc: "Infolinia i serwis techniczny gotowe pomóc.",
  },
];

/* ======================================================================
   SZCZEGÓŁY UMOWY (PRAWNE) — domyślnie zwinięte, rozwijane przyciskiem
   "Zobacz szczegóły oferty" (ta sama technika grid-template-rows co
   akordeon FAQ poniżej oraz w OfferMaxSection / PopularneOferty).
   ====================================================================== */

function LegalDisclosure({
  paragraphs,
  reduceMotion,
}: {
  paragraphs: string[];
  reduceMotion: boolean | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-6 max-w-4xl text-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mx-auto flex items-center gap-1.5 text-[12px] font-semibold text-white/40 underline decoration-dotted underline-offset-4 transition-colors hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
      >
        {open ? "Ukryj szczegóły oferty" : "Zobacz szczegóły umowy"}
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-4 text-left text-[11px] leading-relaxed text-white/35">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FaqItem {
  icon: LucideIcon;
  question: string;
  answer: string;
}

/** FAQ rozwiewające 6 najczęstszych obiekcji klientów przy wyborze internetu —
 * treść oparta wprost na sekcji "Obiekcje klientów" z badania rynku (długa
 * umowa, ukryte opłaty, realna prędkość, proces przejścia, zasięg, serwis). */
const faqItems: FaqItem[] = [
  {
    icon: FileCheck,
    question: "Czy muszę podpisywać kolejną długą umowę?",
    answer:
      "Umowa jest na czas określony 24 miesięcy, z warunkami jasnymi od pierwszego dnia — bez ukrytych zapisów w regulaminie.",
  },
  {
    icon: Lock,
    question: "Czy po jakimś czasie pojawią się ukryte opłaty?",
    answer:
      "Nie. Cenę obowiązującą po zakończeniu promocji znasz już w momencie podpisania umowy — żadnych niespodzianek na fakturze.",
  },
  {
    icon: Gauge,
    question: "Co jeśli internet będzie wolniejszy niż obiecane?",
    answer:
      "Prędkość jest zgodna z umową. Jeśli coś działa nie tak jak powinno, nasz serwis reaguje szybko — nie zostajesz z tym sam.",
  },
  {
    icon: Truck,
    question: "Czy przejście do Netii będzie skomplikowane?",
    answer:
      "Nie musisz martwić się formalnościami — pomagamy w całym procesie przeniesienia numeru i usług, krok po kroku.",
  },
  {
    icon: MapPin,
    question: "Czy w moim miejscu w ogóle jest zasięg?",
    answer:
      "Sprawdzimy dostępność usługi pod Twoim adresem jeszcze przed podpisaniem umowy — zero ryzyka z Twojej strony.",
  },
  {
    icon: Headset,
    question: "A jeśli coś się zepsuje — jak szybko dostanę pomoc?",
    answer:
      "Wsparcie techniczne działa 24/7, każdego dnia — również wieczorami i w weekendy.",
  },
];

export default function OfferInternetTvSection() {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="overflow-x-hidden bg-[#0B2A3D] font-sans text-white sm:pt-20 pt-16">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          {/* HERO PROMO BANNER — styl przeniesiony z Konfiguratora: wyśrodkowany,
              plakietka z ikonami Flame po obu stronach, dekoracyjne SVG w rogu */}
          <m.section
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto flex max-w-310 flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12 mt-16"
            style={{
              background:
                "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

            <svg
              className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="150" cy="55" r="5" fill="#2DD4BF" />
              <circle cx="150" cy="55" r="28" stroke="#2DD4BF" strokeOpacity="0.55" strokeWidth="2" />
              <circle cx="150" cy="55" r="52" stroke="#2DD4BF" strokeOpacity="0.32" strokeWidth="2" />
              <circle cx="150" cy="55" r="76" stroke="#99F6E4" strokeOpacity="0.18" strokeWidth="2" />
              <path
                d="M35 165 L85 118 L115 136 L165 78"
                stroke="#99F6E4"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 7"
              />
              <circle cx="35" cy="165" r="3.5" fill="#99F6E4" />
              <circle cx="85" cy="118" r="3.5" fill="#99F6E4" />
              <circle cx="115" cy="136" r="3.5" fill="#99F6E4" />
              <circle cx="165" cy="78" r="3.5" fill="#2DD4BF" />
            </svg>

            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
            >
              <Flame size={13} className="fill-current" />
              Internet + Telewizja XS
              <Flame size={13} className="fill-current" />
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Internet i telewizja{" "}
              <span className="block bg-gradient-to-r from-teal-400 via-teal-300 to-teal-500 bg-clip-text text-[clamp(30px,5vw,52px)] font-black text-transparent">
                w jednym pakiecie
              </span>
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative z-10 mt-1 flex max-w-xl items-center justify-center gap-2 text-sm text-white/65 sm:text-base"
            >
              <Sparkles size={15} className="text-white/50" />
              Telewizja XS w każdym pakiecie — do 6 miesięcy za 0 zł
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative z-10 mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row"
            >
              <m.a
                href={PHONE_HREF}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center justify-between gap-3 rounded-2xl bg-teal-500 px-5 py-3 text-white shadow-[0_8px_20px_-8px_rgba(20,184,166,0.6)] sm:w-64"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Phone size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">
                      Zadzwoń
                    </span>
                    <span className="block text-xs font-normal text-white/85">
                      {PHONE_DISPLAY}
                    </span>
                  </span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-white/70" />
              </m.a>
              <m.a
                href={SMS_HREF}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-white sm:w-64"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={16} />
                  </span>
                  <span className="text-sm font-bold">Wyślij SMS</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-white/50" />
              </m.a>
            </m.div>
          </m.section>

          {/* SECTION TITLE */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 mb-8 text-center sm:mt-16 sm:mb-10"
          >
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold text-white">
              Wybierz swój pakiet{" "}
              <span className="text-teal-400">Internet + TV</span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" />
          </m.div>

          {/* CARDS — full-bleed kropkowane tło pod siatką, jak w OfferMaxSection */}
          <div className="relative">
            <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <DottedBackground variant="dots" size={22} />
            </div>

            <div className="relative grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.speed}
                  plan={plan}
                  index={index}
                  reduceMotion={reduceMotion}
                  onFeatureClick={setAktywnyInfoId}
                  aktywnyInfoId={aktywnyInfoId}
                />
              ))}
            </div>
          </div>

          {/* PASEK ZAUFANIA — uniwersalny, prawnie ugruntowany, ten sam pod
              każdą sekcją ofertową na stronie */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-2.5 sm:grid-cols-3"
          >
            {trustItems.map((item) => {
              const TrustIcon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-2.5 rounded-xl px-3.5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70">
                    <TrustIcon size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/90">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </m.div>

          {/* SZCZEGÓŁY UMOWY — bezpośrednio pod paskiem zaufania, zwinięte
              domyślnie, rozwijane przyciskiem "Zobacz szczegóły umowy" */}
          <LegalDisclosure
            reduceMotion={reduceMotion}
            paragraphs={[
              "Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje inna oferta. Prezentowana oferta Netii S.A. dla wariantów prędkości: 300 Mb/s (30 zł/mies. z Telewizją XS), 600 Mb/s (55 zł/mies. z Telewizją XS oraz promocją „3 miesiące za 0 zł”), 1000 Mb/s (65 zł/mies. z Telewizją XS oraz promocją „3 miesiące za 0 zł”) oraz 2000 Mb/s (80 zł/mies. z Telewizją XS oraz promocją „6 miesięcy za 0 zł”) obowiązuje przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję. Po 24 miesiącach cena abonamentu wzrasta o 10 zł. Nazwy promocji oraz podane prędkości stanowią nazwy marketingowe. Usługa Internetowa oparta jest na parametrach jakości wynikających z maksymalnych parametrów technicznych danej technologii, w jakiej świadczona jest Usługa Internetowa lub wynikających z ofertowych ustawień technicznych łącza. Prędkość 2000 Mb/s (2 Gb/s) jest dostępna na wybranej technologii (PON). Parametry świadczenia Usługi Internetowej, w szczególności parametry prędkości oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest ograniczona terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.",
            ]}
          />

          {/* FAQ — 6 najczęstszych obiekcji klientów, rozwiane z wyprzedzeniem
              (treść oparta na badaniu głosu klienta: umowa, opłaty, prędkość,
              proces przejścia, zasięg, serwis) */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-14 flex justify-center sm:mt-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              FAQ
            </span>
          </m.div>

          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="mt-3 text-center"
          >
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Najczęstsze pytania
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/65 sm:text-base">
              Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś
              jeszcze niejasne? Doradca odpowie w 3 minuty przez telefon.
            </p>
          </m.div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {faqItems.map((item, i) => {
              const FaqIcon = item.icon;
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.question}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenFaq(isOpen ? null : i);
                    }
                  }}
                  className={`cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-200 ${
                    isOpen
                      ? "border-teal-400/30 bg-teal-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
                      }`}
                    >
                      <FaqIcon size={18} strokeWidth={2} />
                    </div>

                    <span
                      className={`flex-1 text-sm font-medium leading-snug transition-colors duration-300 sm:text-[15px] ${
                        isOpen ? "text-white" : "text-white/80"
                      }`}
                    >
                      {item.question}
                    </span>

                    <Plus
                      size={18}
                      className="shrink-0 text-teal-400 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    />
                  </div>

                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[calc(2.5rem+1rem)] text-[13px] leading-relaxed text-white/60 sm:px-6 sm:pb-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={() => setAktywnyInfoId(null)} />
    </LazyMotion>
  );
}