"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Crown,
  FileText,
  FileX,
  Film,
  Flame,
  Gamepad2,
  Gauge,
  Globe,
  Headset,
  Info,
  ListChecks,
  ListOrdered,
  MessageCircle,
  Phone,
  Plus,
  Rocket,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Table2,
  ThumbsUp,
  Tv,
  Undo2,
  Users,
  Wallet,
  Wifi,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ======================================================================
   STAŁE — numer kontaktowy i wspólne stałe animacji, zgodnie z resztą
   serwisu (te same wartości co w OfferQuizSection / Oferty / PlanCard).
   ====================================================================== */

const PHONE_DISPLAY = "+48 883 334 124";
const PHONE_HREF = "tel:+48883334124";
const SMS_HREF = "sms:+48883334124?body=OFERTA";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// easeOutExpo-podobny cubic-bezier — ten sam "ciężki start, miękkie
// wyhamowanie", którego używamy wszędzie zamiast wbudowanego "easeOut".
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

// Sprężyny współdzielone przez hover kart i przyciski CTA w całym serwisie.
const HOVER_SPRING = { type: "spring", stiffness: 350, damping: 22, mass: 0.6 } as const;
const TAP_SPRING = { type: "spring", stiffness: 500, damping: 25, mass: 0.5 } as const;

/* ======================================================================
   TYPY
   ====================================================================== */

// Sekcje teraz odpowiadają progom prędkości internetu (rosnąco), a nie
// segmentom klienckim jak wcześniej (popularne/premium/biznes).
type SectionKey = "internet300" | "internet600" | "internet1000" | "internet2000";
type AccentKey = "teal" | "emerald" | "pink" | "amber";
type Stage = "start" | "q1" | "q2" | "success";

type TvSize = "XS" | "S" | "M" | "L";

interface OfferFeature {
  label: string;
  infoId?: string; // klucz do INFO_ITEMS — jeśli obecny, cecha jest klikalna i otwiera popup ze szczegółami
}

interface OfferCardData {
  name: string;
  price: string;
  pricePrefix?: string;
  priceNote: string;
  features: OfferFeature[];
  badge?: string;
  tvSize: TvSize; // rozmiar pakietu TV — używane do dopasowania konkretnej karty w kwizie
  promoMonths: number; // 0 = brak promocji; wyświetlane jako osobna, wyróżniona plakietka, nie jako pozycja na liście cech
}

interface OfferSectionData {
  key: SectionKey;
  title: string;
  icon: LucideIcon;
  accent: AccentKey;
  offers: OfferCardData[];
}

interface QuizOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

/* ======================================================================
   PALETA AKCENTÓW — literalne klasy Tailwind per akcent (celowo nie
   budowane dynamicznym template stringiem, żeby JIT poprawnie je
   wykrył i nie wyciął przy buildzie).
   ====================================================================== */

const ACCENT_STYLES: Record<
  AccentKey,
  {
    spineBar: string;
    checkBg: string;
    checkText: string;
    iconText: string;
    borderFeatured: string;
    glowFeatured: string;
    featuredBadge: string;
    labelText: string;
  }
> = {
  teal: {
    spineBar: "bg-gradient-to-b from-teal-400 to-teal-600",
    checkBg: "bg-teal-400/10",
    checkText: "text-teal-400",
    iconText: "text-teal-300",
    borderFeatured: "border-2 border-teal-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(20,184,166,0.15),0_20px_45px_-20px_rgba(20,184,166,0.45)]",
    featuredBadge: "bg-teal-400 text-black",
    labelText: "text-teal-300",
  },
  emerald: {
    spineBar: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    checkBg: "bg-emerald-400/10",
    checkText: "text-emerald-400",
    iconText: "text-emerald-300",
    borderFeatured: "border-2 border-emerald-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_20px_45px_-20px_rgba(52,211,153,0.45)]",
    featuredBadge: "bg-emerald-400 text-black",
    labelText: "text-emerald-300",
  },
  amber: {
    spineBar: "bg-gradient-to-b from-amber-300 to-amber-600",
    checkBg: "bg-amber-400/10",
    checkText: "text-amber-400",
    iconText: "text-amber-300",
    borderFeatured: "border-2 border-amber-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_20px_45px_-20px_rgba(251,191,36,0.45)]",
    featuredBadge: "bg-amber-400 text-black",
    labelText: "text-amber-300",
  },
  pink: {
    spineBar: "bg-gradient-to-b from-pink-400 to-pink-600",
    checkBg: "bg-pink-400/10",
    checkText: "text-pink-400",
    iconText: "text-pink-300",
    borderFeatured: "border-2 border-pink-400/70",
    glowFeatured:
      "shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(244,114,182,0.45)]",
    featuredBadge: "bg-pink-400 text-black",
    labelText: "text-pink-300",
  },
};

/* ======================================================================
   DANE — pytania kwizu (PLACEHOLDERY — do podmiany), treść ofert,
   pasek zaufania
   ====================================================================== */

// Pytanie 1 — sposób korzystania z internetu -> rekomendowana prędkość.
// Tiery rosną logicznie: pojedyncza osoba/lekkie użycie -> streaming ->
// praca i granie równolegle -> duże gospodarstwo domowe z wieloma urządzeniami.
const Q1_OPTIONS: QuizOption[] = [
  {
    label: "Przeglądanie stron",
    value: "web_only",
    icon: Globe,
  },
  {
    label: "Filmy i seriale",
    value: "movies_series",
    icon: Tv,
  },
  {
    label: "Praca i granie",
    value: "work_gaming",
    icon: Gamepad2,
  },
  {
    label: "Bardzo dużo osób i urządzeń",
    value: "everything_max",
    icon: Rocket,
  },
];

// Pytanie 2 — liczba kanałów TV -> rekomendowany rozmiar pakietu (M lub L).
// Nazwy tierów są teraz samodzielnie opisowe (bez sublabeli) — każda mówi
// wprost, co w niej jest, zamiast ogólnikowego "trochę więcej".
const Q2_OPTIONS: QuizOption[] = [
  {
    label: "Podstawowe kanały",
    value: "basic",
    icon: Tv,
  },
  {
    label: "Kanały filmowe i rozrywkowe",
    value: "movies_extra",
    icon: Film,
  },
  {
    label: "Sport, filmy i bajki dla dzieci",
    value: "lots_channels",
    icon: Sparkles,
  },
  {
    label: "Pełny wybór kanałów",
    value: "all_channels",
    icon: Crown,
  },
];

// Mapowania odpowiedzi na prędkość internetu i rozmiar pakietu TV — używane
// razem przez decideSection() do wskazania konkretnej, dopasowanej oferty.
const SPEED_MAP: Record<string, SectionKey> = {
  web_only: "internet600",
  movies_series: "internet600",
  work_gaming: "internet1000",
  everything_max: "internet2000",
};

const TV_SIZE_MAP: Record<string, TvSize> = {
  basic: "M",
  movies_extra: "M",
  lots_channels: "L",
  all_channels: "L",
};

// Cechy współdzielone przez wiele ofert — infoId wskazuje na wpis w
// INFO_ITEMS i sprawia, że cecha jest klikalna (otwiera popup ze szczegółami).
// Brak infoId (np. podstawowy dekoder bez 4K) = zwykły, nieklikalny tekst.
const FEATURE_ROUTER_BASIC: OfferFeature = { label: "Router Wi-Fi w cenie", infoId: "router-wifi" };
const FEATURE_ROUTER_WIFI6: OfferFeature = { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" };
const FEATURE_ROUTER_WIFI7: OfferFeature = {
  label: "Router Combo z ONT i Wi-Fi 7 w cenie",
  infoId: "router-wifi7",
};
const FEATURE_DEKODER_4K: OfferFeature = { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" };
const FEATURE_DEKODER_BASIC: OfferFeature = { label: "Dekoder w cenie" };
const FEATURE_NETIA_GO: OfferFeature = { label: "Netia GO w cenie", infoId: "netia-go" };
const FEATURE_GIGANAGRYWARKA: OfferFeature = {
  label: "GigaNagrywarka Maxi w cenie",
  infoId: "giganagrywarka",
};

/* ======================================================================
   POPUP "SZCZEGÓŁY" — routery, dekoder, Netia GO, GigaNagrywarka.
   Klikalna jest każda cecha karty ofertowej, która ma przypisany `infoId`
   wskazujący na wpis w INFO_ITEMS poniżej. Wzorzec 1:1 z PopularneOferty.
   ====================================================================== */

type SectionContent =
  | { type: "paragraphs"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "specTable"; items: { label: string; value: string }[] }
  | { type: "compareTable"; rows: { funkcja: string; basic: string; maxi: string }[] }
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
  bannerAkcent?: "red" | "lime";
  sections: InfoSection[];
  uwaga?: string;
  instrukcjaUrl?: string;
}

const INFO_ITEMS: Record<string, InfoItem> = {
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

  "dekoder-evobox": {
    id: "dekoder-evobox",
    model: "Netia EvoBox 4K",
    podtytul: "Kompaktowy dekoder IPTV w jakości Ultra HD / 4K",
    zdjecie: "/images/DekoderEvo4K_logo.webp",
    sections: [
      {
        title: "Opis urządzenia",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Netia EvoBox 4K to kompaktowy dekoder IPTV zapewniający obraz w jakości Ultra HD / 4K. Dzięki szybkiemu interfejsowi, pilotowi Bluetooth, obsłudze multimediów z USB/DLNA oraz dostępowi do aplikacji Netia GO i Disney+ urządzenie gwarantuje nowoczesne i wygodne korzystanie z telewizji.",
            "Niewielkie rozmiary, stabilne działanie i bardzo niski pobór energii sprawiają, że EvoBox 4K idealnie pasuje do każdego zestawu RTV. Do treści 4K rekomendowane jest łącze min. 25 Mb/s.",
          ],
        },
      },
      {
        title: "Specyfikacja techniczna",
        icon: ListChecks,
        content: {
          type: "specTable",
          items: [
            { label: "Wideo", value: "HDMI (2160p/4K), HDCP 2.2, CEC" },
            { label: "Audio", value: "Dolby Digital, Dolby Digital Plus" },
            {
              label: "Sieć",
              value: "RJ-45 10/100, Wi-Fi 2,4 / 5 GHz (802.11ac, 2×2 MIMO), Bluetooth (pilot)",
            },
            { label: "Porty", value: "1× HDMI, 1× USB 2.0, 1× RJ-45, 1× DC 12 V" },
            { label: "Funkcje TV", value: "Nagrywanie, Time-shift, Netia GO, Multiroom" },
            {
              label: "USB",
              value:
                "USB 2.0 (typ A), DLNA / LAN. Obsługiwane formaty: Wideo (AVI, MKV, MP4, TS, M2TS), Audio (MP3), Zdjęcia (JPG, JPEG, PNG, GIF statyczny, BMP), Napisy (SRT UTF-8)",
            },
            {
              label: "Aplikacje",
              value: "Netia GO, Disney+, Netflix (dostępność zależna od wersji oprogramowania)",
            },
            { label: "Wymiary", value: "165 × 134,9 × 35,6 mm" },
            { label: "Masa", value: "ok. 230 g" },
            { label: "Zasilanie / pobór", value: "Zasilacz 12 V DC, Tryb czuwania < 0,5 W" },
            {
              label: "Zawartość zestawu",
              value:
                "Dekoder EvoBox 4K, Pilot Bluetooth + baterie, Kabel HDMI, Kabel Ethernet, Zasilacz, Instrukcja",
            },
          ],
        },
      },
    ],
    instrukcjaUrl: "/pdf/Instrukcja_uzytkownika_netia_dekodera_evobox_4K.pdf",
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

  giganagrywarka: {
    id: "giganagrywarka",
    model: "GigaNagrywarka",
    podtytul: "Nagrywanie programów w chmurze — wersje Basic i Maxi",
    banner: "Do 1500 godzin nagrań w chmurze, przez 120 dni",
    bannerAkcent: "red",
    sections: [
      {
        title: "Opis usługi",
        icon: FileText,
        content: {
          type: "paragraphs",
          items: [
            "Nagrywaj programy w chmurze, przewijaj do 2 godzin wstecz i oglądaj wybrane audycje nawet do 7 dni po emisji. W wersji Maxi przechowasz do 1500 godzin przez 120 dni.",
          ],
        },
      },
      {
        title: "Porównanie wersji Basic / Maxi",
        icon: Table2,
        content: {
          type: "compareTable",
          rows: [
            { funkcja: "Ilość godzin do nagrania", basic: "100 godzin", maxi: "1500 godzin" },
            { funkcja: "Czas przechowywania", basic: "30 dni", maxi: "120 dni" },
            {
              funkcja: "Time Shift (przewijanie do tyłu)",
              basic: "Przewijanie do 2 godzin wstecz",
              maxi: "Przewijanie do 2 godzin wstecz",
            },
            {
              funkcja: "Catch-up (oglądanie po emisji)",
              basic: "Do 7 dni wstecz (na wybranych kanałach)",
              maxi: "Do 7 dni wstecz (na wybranych kanałach)",
            },
            {
              funkcja: "Równoległe nagrywanie",
              basic: "Nagrywaj wiele programów jednocześnie",
              maxi: "Nagrywaj wiele programów jednocześnie",
            },
            {
              funkcja: "Nagrywanie przy wyłączonym dekoderze",
              basic: "Działa także przy wyłączonym dekoderze",
              maxi: "Działa także przy wyłączonym dekoderze",
            },
          ],
        },
      },
      {
        title: "Najważniejsze funkcje",
        icon: Sparkles,
        content: {
          type: "bullets",
          items: [
            "Oglądanie wybranych programów do 7 dni po emisji",
            "Przewijanie programów do 2 godzin wstecz",
            "Równoległe nagrywanie wielu kanałów",
            "Do 1500 godzin nagrań (Maxi) przez 120 dni",
            "Zaplanowane nagrania działają bez zasilania dekodera",
          ],
        },
      },
      {
        title: "Jak włączyć",
        icon: ListOrdered,
        content: {
          type: "steps",
          items: [
            "Wejdź do menu dekodera Netia TV.",
            "Otwórz sekcję Usługi dodatkowe.",
            "Wybierz GigaNagrywarka (Basic lub Maxi).",
            "Potwierdź aktywację.",
          ],
        },
      },
    ],
    uwaga: "Dostępność funkcji może zależeć od kanału i praw licencyjnych.",
  },
};

const BANNER_AKCENTY: Record<
  "teal" | "red" | "lime",
  { border: string; background: string; text: string; soft: string }
> = {
  teal: {
    border: "border-teal-300/25",
    background:
      "radial-gradient(130% 160% at 15% 0%, rgba(45,212,191,.45), transparent 60%), linear-gradient(135deg, #0f3550 0%, #0B2A3D 100%)",
    text: "text-teal-300",
    soft: "bg-teal-300/15",
  },
  red: {
    border: "border-[#e0399e]/40",
    background: "linear-gradient(135deg, #d6409f 0%, #8a2570 55%, #4a1240 100%)",
    text: "text-[#f472b6]",
    soft: "bg-[#e0399e]/15",
  },
  lime: {
    border: "border-[#a3d146]/40",
    background: "linear-gradient(135deg, #8bc34a 0%, #5c9c2e 55%, #33540f 100%)",
    text: "text-[#c3e86b]",
    soft: "bg-[#a3d146]/15",
  },
};

function klasaCechy(infoId: string | undefined, aktywnyInfoId: string | null): string {
  const jestAktywna = !!infoId && infoId === aktywnyInfoId;

  if (jestAktywna) {
    const akcent = INFO_ITEMS[infoId!]?.bannerAkcent;
    if (akcent === "lime") return "text-[rgb(166,206,58)] decoration-[rgb(166,206,58)]";
    if (akcent === "red") return "text-[rgb(238,18,100)] decoration-[rgb(238,18,100)]";
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

    case "compareTable":
      return (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                <th className="px-4 py-2.5 font-semibold">Funkcja</th>
                <th className={`px-4 py-2.5 font-semibold ${akcent.text}`}>Basic</th>
                <th className={`px-4 py-2.5 font-semibold ${akcent.text}`}>Maxi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {content.rows.map((row) => (
                <tr key={row.funkcja} className="align-top">
                  <td className="px-4 py-3 text-white/75">{row.funkcja}</td>
                  <td className="px-4 py-3 text-white/75">{row.basic}</td>
                  <td className="px-4 py-3 text-white/75">{row.maxi}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

const OFFER_SECTIONS: OfferSectionData[] = [
  {
    key: "internet300",
    title: "Internet 300 Mb/s + TV",
    icon: Star,
    accent: "teal",
    offers: [
      {
        name: "Internet 300 Mb/s + TV S",
        price: "40",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 0,
      },
      {
        name: "Internet 300 Mb/s + TV M",
        price: "55",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 0,
      },
    ],
  },
  {
    key: "internet600",
    title: "Internet 600 Mb/s + TV",
    icon: Wifi,
    accent: "emerald",
    offers: [
      {
        name: "Internet 600 Mb/s + TV XS",
        price: "55",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_BASIC, FEATURE_NETIA_GO],
        tvSize: "XS",
        promoMonths: 0,
      },
      {
        name: "Internet 600 Mb/s + TV M",
        price: "70",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 3,
      },
      {
        name: "Internet 600 Mb/s + TV L",
        price: "100",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_BASIC, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 3,
      },
    ],
  },
  {
    key: "internet1000",
    title: "Internet 1 Gb/s + TV",
    icon: Crown,
    accent: "pink",
    offers: [
      {
        name: "Internet 1 Gb/s + TV S",
        price: "70",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 3,
      },
      {
        name: "Internet 1 Gb/s + TV M",
        price: "80",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 6,
      },
      {
        name: "Internet 1 Gb/s + TV L",
        price: "110",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI6, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 6,
      },
    ],
  },
  {
    key: "internet2000",
    title: "Internet 2 Gb/s + TV",
    icon: Rocket,
    accent: "amber",
    offers: [
      {
        name: "Internet 2 Gb/s + TV S",
        price: "85",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        tvSize: "S",
        promoMonths: 3,
      },
      {
        name: "Internet 2 Gb/s + TV M",
        price: "95",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO],
        badge: "Najczęściej wybierana",
        tvSize: "M",
        promoMonths: 6,
      },
      {
        name: "Internet 2 Gb/s + TV L",
        price: "125",
        priceNote: "zł/mies.",
        features: [FEATURE_ROUTER_WIFI7, FEATURE_DEKODER_4K, FEATURE_NETIA_GO, FEATURE_GIGANAGRYWARKA],
        tvSize: "L",
        promoMonths: 6,
      },
    ],
  },
];

const LOADING_MESSAGES = [
  "Analizujemy Twoje odpowiedzi",
  "Dopasowujemy najlepszą ofertę",
  "Gotowe!",
];

interface TrustItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const TRUST_ITEMS: TrustItem[] = [
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
   LOGIKA DOPASOWANIA — odpowiedzi -> konkretna oferta
   Q1 wskazuje prędkość (sekcję), Q2 wskazuje rozmiar pakietu TV (M/L)
   wewnątrz tej sekcji. Zwracamy obie informacje: klucz sekcji do otwarcia
   w akordeonie oraz nazwę oferty do podświetlenia jako "Dla Ciebie".
   ====================================================================== */

interface QuizRecommendation {
  section: SectionKey;
  offerName: string | null;
}

function decideSection(q1: string, q2: string): QuizRecommendation {
  const section = SPEED_MAP[q1] ?? "internet600";
  const tvSize = TV_SIZE_MAP[q2] ?? "M";
  const sectionData = OFFER_SECTIONS.find((s) => s.key === section);
  const matchedOffer = sectionData?.offers.find((o) => o.tvSize === tvSize);
  return { section, offerName: matchedOffer?.name ?? null };
}

/* ======================================================================
   WSPÓLNY CTA — Zadzwoń / SMS, dokładnie w konwencji reszty serwisu
   ====================================================================== */

function CtaButtons({ reduceMotion, smsBody }: { reduceMotion: boolean | null; smsBody?: string }) {
  const smsHref = smsBody ? `sms:+48883334124?body=${smsBody}` : SMS_HREF;
  return (
    <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <m.a
        href={PHONE_HREF}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={TAP_SPRING}
        className="inline-flex w-full flex-1 items-center justify-between gap-3 rounded-2xl border border-transparent bg-teal-500 px-4 py-3 text-white shadow-[0_8px_20px_-8px_rgba(20,184,166,0.6)] sm:w-auto sm:min-w-[140px]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Phone size={16} />
          </span>
          <span className="text-left">
            <span className="block text-sm font-bold leading-tight">Zadzwoń</span>
            <span className="block text-xs font-normal text-white/85">{PHONE_DISPLAY}</span>
          </span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-white/70" />
      </m.a>
      <m.a
        href={smsHref}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={TAP_SPRING}
        className="inline-flex w-full flex-1 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white sm:w-auto sm:min-w-[140px]"
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
  );
}

/* ======================================================================
   BANER PROMO + KWIZ — wszystko w jednym kontenerze: nagłówek "Dwa
   pytania i gotowe", a bezpośrednio pod nim aktualny krok kwizu
   (start -> pytanie 1/2 -> pytanie 2/2 -> sukces), bez oddzielnej
   karty poniżej.

   MOBILE: sekcja jest teraz zauważalnie niższa na telefonach — mniejsze
   paddingi, mniejszy nagłówek (clamp startuje niżej), a siatka odpowiedzi
   w kwizie jest zawsze 2 kolumny (układ 2x2 dla 4 opcji zamiast jednej
   kolumny na mobile).
   ====================================================================== */

function PromoBanner({ onComplete }: { onComplete: (rec: QuizRecommendation) => void }) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("q1");
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (stage !== "success" || !q1 || !q2) return;
    setLoadingStep(0);
    const t1 = window.setTimeout(() => setLoadingStep(1), 500);
    const t2 = window.setTimeout(() => setLoadingStep(2), 1000);
    const t3 = window.setTimeout(() => onComplete(decideSection(q1, q2)), 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function pickQ1(value: string) {
    setQ1(value);
    window.setTimeout(() => setStage("q2"), 280);
  }

  function pickQ2(value: string) {
    setQ2(value);
    window.setTimeout(() => setStage("success"), 280);
  }

  const progress = stage === "q1" ? 1 : stage === "q2" || stage === "success" ? 2 : 0;

  return (
    <m.section
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: SMOOTH_EASE }}
      className="relative mx-auto mt-8 flex max-w-[1240px] flex-col items-center gap-2.5 overflow-hidden rounded-[20px] border border-white/[0.08] px-4 py-6 text-center sm:mt-16 sm:gap-3 sm:px-6 sm:py-12"
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
        Dobór oferty
        <Flame size={13} className="fill-current" />
      </m.span>

      <m.h1
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 m-0 text-[clamp(22px,6vw,44px)] font-extrabold text-white"
      >
        Dwa pytania{" "}
        <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-teal-500 bg-clip-text font-black text-transparent">
          i gotowe
        </span>
      </m.h1>

      {/* Pasek postępu — pojawia się dopiero, gdy kwiz jest w toku */}
      {progress > 0 && (
        <div className="relative z-10 mt-1 w-full max-w-sm sm:mt-2">
          <div className="mb-1.5 flex justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-white/40 sm:mb-2">
            <span>Pytanie {progress} z 2</span>
            <span>{Math.round((progress / 2) * 100)}%</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2].map((seg) => (
              <div key={seg} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <m.div
                  className="h-full rounded-full bg-teal-400"
                  initial={false}
                  animate={{ width: progress >= seg ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Krok kwizu — bezpośrednio pod nagłówkiem, bez oddzielnego kontenera */}
      <div className="relative z-10 mt-2 w-full max-w-xl text-left sm:mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "q1" && (
            <QuestionStage
              key="q1"
              title="Jak korzystacie z internetu?"
              subtitle="Wybierz opis, który najlepiej pasuje do Waszego domu."
              options={Q1_OPTIONS}
              selected={q1}
              onSelect={pickQ1}
              reduceMotion={!!reduceMotion}
            />
          )}

          {stage === "q2" && (
            <QuestionStage
              key="q2"
              title="Ile kanałów chcecie mieć?"
              subtitle="To pomoże dobrać odpowiedni pakiet TV."
              options={Q2_OPTIONS}
              selected={q2}
              onSelect={pickQ2}
              onBack={() => setStage("q1")}
              reduceMotion={!!reduceMotion}
            />
          )}

          {stage === "success" && (
            <m.div
              key="success"
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: SMOOTH_EASE }}
              className="flex flex-col items-center gap-3 py-4 text-center sm:gap-4 sm:py-6"
            >
              <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                <m.div
                  className="absolute inset-0 rounded-full border-2 border-teal-400/20 border-t-teal-400"
                  animate={loadingStep < 2 ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    loadingStep < 2
                      ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                      : { duration: 0 }
                  }
                />
                <m.div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400 sm:h-8 sm:w-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: loadingStep >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "backOut" }}
                >
                  <Check size={16} strokeWidth={3} className="text-[#0f3550]" />
                </m.div>
              </div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Przygotowujemy rekomendację…
              </h2>
              <p className="text-xs text-white/50 sm:text-sm">
                {LOADING_MESSAGES[loadingStep] ?? LOADING_MESSAGES[0]}
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.section>
  );
}

function QuestionStage({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  onBack,
  reduceMotion,
}: {
  title: string;
  subtitle: string;
  options: QuizOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  onBack?: () => void;
  reduceMotion: boolean;
}): ReactNode {
  return (
    <m.div
      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: SMOOTH_EASE }}
      className="flex flex-col gap-3 sm:gap-5"
    >
      <div className="text-center">
        <h2 className="text-base font-bold text-white sm:text-xl">{title}</h2>
        <p className="mt-1 text-xs text-white/50 sm:text-sm">{subtitle}</p>
      </div>

      {/* Zawsze 2 kolumny — na telefonach daje to układ 2x2 dla 4 opcji
          zamiast jednej długiej kolumny (główna oszczędność wysokości). */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex flex-col gap-2 rounded-xl border px-3 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400 sm:px-4 sm:py-3.5 ${
                isSelected
                  ? "border-teal-400/70 bg-teal-400/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-teal-400/40 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={16} className={isSelected ? "text-teal-300" : "text-white/40"} />
                {isSelected ? (
                  <CheckCircle2 size={14} className="text-teal-400" />
                ) : (
                  <Circle size={14} strokeWidth={2} className="text-white/20" />
                )}
              </div>
              <span className="text-[12.5px] font-semibold leading-snug text-white sm:text-sm">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-white/50 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
        >
          <ArrowLeft size={14} />
          Wstecz
        </button>
      )}
    </m.div>
  );
}

/* ======================================================================
   KARTA OFERTY — anatomia 1:1 z PlanCard/OfferCard reszty serwisu:
   spine bar po lewej, plakietka "Najczęściej wybierana" nad kartą,
   cena z podkreśleniem, checklista cech, para CTA Zadzwoń / SMS.

   FIX (wyrównanie wysokości kart w wierszu): grid domyślnie rozciąga
   (align-items: stretch) BEZPOŚREDNI element grida do wysokości wiersza
   — ale bez jawnego "h-full" na tym elemencie i na jego dziecku ta
   wysokość nie "spływa" w dół, więc każda karta i tak przyjmowała tylko
   wysokość własnej treści (różna liczba cech / obecność badge'a =
   różne wysokości w tym samym rzędzie). Dodanie h-full tutaj + na
   wrapperze w OfferAccordionSections zamyka ten łańcuch: grid → wrapper
   → karta, więc wszystkie trzy karty w wierszu są odtąd zawsze tej
   samej wysokości, a `flex-1` na liście cech (już wcześniej w kodzie)
   konsekwentnie doksuwa przyciski CTA do wspólnej, dolnej krawędzi.
   ====================================================================== */

function OfferCard({
  offer,
  accent,
  index,
  reduceMotion,
  isRecommended,
  hasRecommendation,
  onFeatureClick,
  aktywnyInfoId,
}: {
  offer: OfferCardData;
  accent: AccentKey;
  index: number;
  reduceMotion: boolean | null;
  isRecommended?: boolean;
  hasRecommendation?: boolean;
  onFeatureClick: (infoId: string) => void;
  aktywnyInfoId: string | null;
}) {
  const styles = ACCENT_STYLES[accent];

  return (
    <m.div
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: SMOOTH_EASE, delay: index * 0.06 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={`relative flex h-full flex-col rounded-2xl bg-[#183648] p-5 pt-6 sm:p-6 ${
        isRecommended
          ? styles.borderFeatured
          : !hasRecommendation && offer.badge
            ? `${styles.borderFeatured} ${styles.glowFeatured}`
            : "border border-white/10"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-6 bottom-6 w-1 rounded-full ${styles.spineBar}`}
      />

      {isRecommended && (
        <span
          className={`absolute -top-3 right-4 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${styles.featuredBadge}`}
        >
          <Sparkles size={11} />
          Dla Ciebie
        </span>
      )}

      {!hasRecommendation && offer.badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${styles.featuredBadge}`}
        >
          {offer.badge}
        </span>
      )}

      <span className="text-[15px] font-bold text-white">{offer.name}</span>

      <div className="mb-4 mt-2 flex items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-baseline gap-1.5">
          {offer.pricePrefix && (
            <span className="text-xs font-medium text-white/40">{offer.pricePrefix}</span>
          )}
          <span className="text-3xl font-black leading-none text-white">{offer.price}</span>
          <span className="text-sm font-semibold text-white/55">{offer.priceNote}</span>
        </div>
        {offer.promoMonths > 0 && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-wide ${styles.featuredBadge}`}
          >
            <Zap size={10} className="fill-current" />
            {offer.promoMonths} {offer.promoMonths === 3 ? "miesiące" : "miesięcy"} za 0 zł!
          </span>
        )}
      </div>

      <ul className="mb-5 flex-1 space-y-2.5">
        {offer.features.map((f) => (
          <li
            key={f.label}
            className="flex items-start gap-2.5 text-sm leading-snug text-white/85"
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${styles.checkBg} ${styles.checkText}`}
            >
              <Check size={13} strokeWidth={3} />
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

      <CtaButtons reduceMotion={reduceMotion} smsBody={offer.name.replace(/\s+/g, "")} />
    </m.div>
  );
}

/* ======================================================================
   AKORDEON Z SEKCJAMI OFERT — otwieranie/zamykanie przez grid-template-rows,
   dokładnie ta sama technika co w akordeonach FAQ reszty serwisu.
   ====================================================================== */

function OfferAccordionSections({
  recommendedKey,
  recommendedOfferName,
  reduceMotion,
  onFeatureClick,
  aktywnyInfoId,
}: {
  recommendedKey: SectionKey | null;
  recommendedOfferName: string | null;
  reduceMotion: boolean | null;
  onFeatureClick: (infoId: string) => void;
  aktywnyInfoId: string | null;
}) {
  const [openKey, setOpenKey] = useState<SectionKey | null>("internet600");
  const sectionRefs = useRef<Partial<Record<SectionKey, HTMLDivElement | null>>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!recommendedKey) return;
    setOpenKey(recommendedKey);

    const t1 = window.setTimeout(() => {
      // Na telefonie skacz od razu do konkretnej, rekomendowanej karty
      // ("Dla Ciebie"), a nie tylko do nagłówka całej sekcji — na wąskim
      // ekranie karty są jedna pod drugą, więc sam nagłówek sekcji nie
      // pokazuje jeszcze wybranej oferty.
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const target =
        (isMobile && recommendedOfferName && cardRefs.current[recommendedOfferName]) ||
        sectionRefs.current[recommendedKey];

      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);

    return () => window.clearTimeout(t1);
  }, [recommendedKey, recommendedOfferName]);

  return (
    <div className="flex flex-col gap-3.5">
      {OFFER_SECTIONS.map((section) => {
        const isOpen = openKey === section.key;
        const isRecommended = recommendedKey === section.key;
        const styles = ACCENT_STYLES[section.accent];
        const Icon = section.icon;

        return (
          <div
            key={section.key}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[section.key] = el;
            }}
            className={`scroll-mt-[110px] overflow-hidden rounded-2xl border transition-colors duration-300 ${
              isRecommended
                ? "border-teal-400/40 bg-[#0f3550]/85"
                : "border-white/10 bg-[#0f3550]/60"
            }`}
          >
            {isRecommended && (
              <div className="px-6 pt-5">
                <m.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-3.5 py-1.5 text-xs font-bold text-teal-300"
                >
                  <Sparkles size={12} />
                  Polecamy na podstawie Twoich odpowiedzi
                </m.span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : section.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
            >
              <span className="flex items-center gap-2.5">
                <Icon size={18} className={isRecommended ? styles.iconText : "text-white/50"} />
                <span className="text-base font-bold text-white sm:text-lg">
                  {section.title}
                </span>
                <span className="text-xs font-medium text-white/35">
                  {section.offers.length} propozycje
                </span>
              </span>
              <ChevronDown
                size={18}
                className="shrink-0 text-white/50 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 items-stretch gap-3.5 px-6 pb-9 pt-6 sm:grid-cols-3">
                  {section.offers.map((offer, i) => (
                    <div
                      key={offer.name}
                      ref={(el: HTMLDivElement | null) => {
                        cardRefs.current[offer.name] = el;
                      }}
                      className="h-full scroll-mt-[110px]"
                    >
                      <OfferCard
                        offer={offer}
                        accent={section.accent}
                        index={i}
                        reduceMotion={reduceMotion}
                        isRecommended={offer.name === recommendedOfferName}
                        hasRecommendation={isRecommended && !!recommendedOfferName}
                        onFeatureClick={onFeatureClick}
                        aktywnyInfoId={aktywnyInfoId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ======================================================================
   PASEK ZAUFANIA — uniwersalny, ten sam wzorzec co pod każdą sekcją
   ofertową w serwisie (Gauge / RotateCcw / Headset).
   ====================================================================== */

function TrustBar({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <m.div
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: SMOOTH_EASE }}
      className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-2.5 sm:grid-cols-3"
    >
      {TRUST_ITEMS.map((item) => {
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
  );
}

/* ======================================================================
   FAQ — 6 odbić najważniejszych obiekcji, dokładnie w formacie NetiaFAQ
   (dwie kolumny, akordeon framer-motion, zamykające CTA Zadzwoń/SMS).
   Bez tierów i "pokaż więcej" — tu ma być tylko 6 najsilniejszych pytań.
   ====================================================================== */

interface QuizFaqItem {
  icon: LucideIcon;
  q: string;
  a: string;
}

const QUIZ_FAQ_ITEMS: QuizFaqItem[] = [
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
  },
  {
    icon: Undo2,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy — termin ustalasz indywidualnie z technikiem. Sama instalacja w lokalu trwa około 1,5 godziny. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł. Router, Dekoder 4K i aplikacja Netia GO są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
];

function QuizFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full py-16 px-6 font-sans overflow-hidden"
    >
      <div className="max-w-305 mx-auto">
        {/* Eyebrow */}
        <m.div
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </m.div>

        <m.h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          Najczęstsze pytania
        </m.h2>
        <m.p
          className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
        >
          Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </m.p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14 items-start">
          {QUIZ_FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const Icon = item.icon;
            return (
              <m.div
                key={item.q}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (i % 2) * 0.1,
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? "bg-teal-400/10 border-teal-400/30"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
                style={{
                  boxShadow: isOpen ? "0 8px 20px -8px rgba(0,0,0,0.35)" : "none",
                }}
              >
                <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
                  <m.div
                    animate={isOpen ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={
                      isOpen
                        ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.45 }
                    }
                    className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 transition-colors duration-300 ${
                      isOpen ? "bg-teal-400/15 text-teal-300" : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </m.div>

                  <span
                    className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug transition-colors duration-300 ${
                      isOpen ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.q}
                  </span>

                  <m.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                  >
                    <Plus size={20} className="text-teal-400" />
                  </m.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <m.p
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[calc(2.5rem+1rem)] text-sm sm:text-[0.9375rem] leading-relaxed text-white/60"
                      >
                        {item.a}
                      </m.p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
        </div>

        {/* Closing CTA — call or SMS only, styled like Hero buttons */}
        <m.div
          className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">Wciąż masz pytania?</h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            Rozmowa zajmuje ~3 minuty, bez zobowiązań. Doradca odpowie od razu.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <m.a
              href={PHONE_HREF}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(45, 212, 191, 0.45)",
                  "0 0 0 8px rgba(45, 212, 191, 0)",
                  "0 0 0 0 rgba(45, 212, 191, 0.45)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                  <span className="block text-xs text-white/85">{PHONE_DISPLAY}</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/70" />
            </m.a>

            <m.a
              href={SMS_HREF}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">WYŚLIJ SMS</span>
                  <span className="block text-xs text-white/70">Oddzwonimy w 3 minuty</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/50" />
            </m.a>
          </div>
        </m.div>
      </div>
    </section>
  );
}

/* ======================================================================
   EKSPORT GŁÓWNY — baner (z kwizem w środku) + akordeon + pasek zaufania.
   ====================================================================== */

export default function OfferQuizSection() {
  const reduceMotion = useReducedMotion();
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="overflow-x-hidden bg-[#0B2A3D] font-sans text-white">
        <div className="mx-auto max-w-[1140px] px-4 pt-24 sm:pt-6 sm:px-6 sm:pt-20">
          <PromoBanner onComplete={setRecommendation} />
        </div>

        <div className="mx-auto max-w-[1140px] px-4 py-10 pb-6 sm:px-6">
          <OfferAccordionSections
            recommendedKey={recommendation?.section ?? null}
            recommendedOfferName={recommendation?.offerName ?? null}
            reduceMotion={!!reduceMotion}
            onFeatureClick={setAktywnyInfoId}
            aktywnyInfoId={aktywnyInfoId}
          />
        </div>

        <div className="mx-auto max-w-[1140px] px-4 pb-16 sm:px-6">
          <TrustBar reduceMotion={!!reduceMotion} />
        </div>

        <QuizFaqSection />
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={() => setAktywnyInfoId(null)} />
    </LazyMotion>
  );
}