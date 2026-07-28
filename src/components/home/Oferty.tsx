"use client";

import { memo, useEffect, useState, type ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  Check,
  MessageCircle,
  Phone,
  Wifi,
  Info,
  X,
  ChevronRight,
  FileText,
  ListChecks,
  Gauge,
  Wallet,
  ListOrdered,
  Smartphone,
  Sparkles,
  Users,
  CreditCard,
  ThumbsUp,
  Table2,
  Flame,
  Shield,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Popupy "Szczegóły" — routery, dekoder, Netia GO, Giganagrywarka       */
/*  Klikalna jest KAŻDA pozycja w liście cech karty ofertowej (Podstawa   */
/*  i MAX), która ma przypisany `infoId` wskazujący na wpis w INFO_ITEMS. */
/*  Bez zmian względem oryginału — ten sam system obsługuje teraz obie    */
/*  siatki kart.                                                          */
/* ---------------------------------------------------------------------- */
type SectionContent =
  | { type: "paragraphs"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "specTable"; items: { label: string; value: string }[] }
  | { type: "compareTable"; rows: { funkcja: string; basic: string; maxi: string }[] }
  | { type: "box"; text: string };

interface InfoSection {
  title: string;
  icon: typeof Info;
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
            { label: "Porty", value: "1× LAN 2.5 Gb/s, 3× LAN 1 Gb/s, 2× TEL, 1× USB, zasilanie DC" },
            { label: "Wi-Fi 7 (802.11be)", value: "2.4 / 5 / 6 GHz, 320 MHz kanały, 4096-QAM, MLO, MU-MIMO, OFDMA" },
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
            { label: "Sieć", value: "RJ-45 10/100, Wi-Fi 2,4 / 5 GHz (802.11ac, 2×2 MIMO), Bluetooth (pilot)" },
            { label: "Porty", value: "1× HDMI, 1× USB 2.0, 1× RJ-45, 1× DC 12 V" },
            { label: "Funkcje TV", value: "Nagrywanie, Time-shift, Netia GO, Multiroom" },
            {
              label: "USB",
              value:
                "USB 2.0 (typ A), DLNA / LAN. Obsługiwane formaty: Wideo (AVI, MKV, MP4, TS, M2TS), Audio (MP3), Zdjęcia (JPG, JPEG, PNG, GIF statyczny, BMP), Napisy (SRT UTF-8)",
            },
            { label: "Aplikacje", value: "Netia GO, Disney+, Netflix (dostępność zależna od wersji oprogramowania)" },
            { label: "Wymiary", value: "165 × 134,9 × 35,6 mm" },
            { label: "Masa", value: "ok. 230 g" },
            { label: "Zasilanie / pobór", value: "Zasilacz 12 V DC, Tryb czuwania < 0,5 W" },
            {
              label: "Zawartość zestawu",
              value: "Dekoder EvoBox 4K, Pilot Bluetooth + baterie, Kabel HDMI, Kabel Ethernet, Zasilacz, Instrukcja",
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
        icon: CreditCard,
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
    model: "Giganagrywarka",
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
            "Wybierz Giganagrywarka (Basic lub Maxi).",
            "Potwierdź aktywację.",
          ],
        },
      },
    ],
    uwaga: "Dostępność funkcji może zależeć od kanału i praw licencyjnych.",
  },
};

/* ---------------------------------------------------------------------- */
/*  Dane ofert — Podstawa i MAX.                                          */
/* ---------------------------------------------------------------------- */
type Feature = {
  label: string;
  /** Klucz w INFO_ITEMS — jeśli podany, pozycja jest klikalna i otwiera popup */
  infoId?: string;
};

type Offer = {
  speed: string;
  pkg: string;
  price: string;
  features: Feature[];
  featured?: boolean;
};

const offers: Offer[] = [
  {
    speed: "1000 Mb/s",
    pkg: "TV S",
    price: "70 zł",
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
    ],
  },
  {
    speed: "1000 Mb/s",
    pkg: "TV M",
    price: "80 zł",
    featured: true,
    features: [
      { label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "Gigangrywarka Basic", infoId: "giganagrywarka" },
    ],
  },
  {
    speed: "2000 Mb/s",
    pkg: "TV L",
    price: "125 zł",
    features: [
      { label: "Router Combo z ONT Wi-Fi 7", infoId: "router-wifi7" },
      { label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { label: "Netia GO w cenie", infoId: "netia-go" },
      { label: "Gigangrywarka Basic", infoId: "giganagrywarka" },
    ],
  },
];

type MaxOffer = {
  name: string;
  speed: string;
  price: string;
  monthsPill: string;
  featured?: boolean;
  features: Feature[];
};

const maxOffers: MaxOffer[] = [
  {
    name: "MAX 1000",
    speed: "1000 Mb/s",
    price: "140 zł/mies.",
    monthsPill: "Abonament 12 miesięcy za 0 zł po rabatach",
    features: [
      { label: "Telewizja L 4K z Dekoderem"},
      { label: "Bezpieczny Internet Ultra" },
    ],
  },
  {
    name: "MAX 2000",
    speed: "2000 Mb/s",
    price: "160 zł/mies.",
    monthsPill: "Abonament 12 miesięcy za 0 zł po rabatach",
    featured: true,
    features: [
      { label: "Telewizja L 4K z Dekoderem"},
      { label: "Bezpieczny Internet Ultra" },
    ],
  },
];

const PHONE = "+48 887 843 260";

/* [DODANO] Helper do odpalania zdarzenia Meta Pixel "Contact" — ten sam
   wzorzec co w Hero.tsx. content_name mówi z której konkretnie karty
   oferty przyszło kliknięcie (np. "oferta_podstawa_1000_tv_s"), co
   pozwala później zobaczyć w Meta, które oferty faktycznie generują
   telefony/SMS-y, a które tylko oglądanie. */
function trackContact(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Contact", { content_name: contentName });
  }
}

/* [DODANO] Buduje slug z prędkości + pakietu do użycia w content_name,
   np. "1000 Mb/s" + "TV S" -> "1000_tv_s". Tylko do własnego raportowania
   w Meta, nie widoczne dla użytkownika. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Custom cubic-bezier (easeOutExpo-ish) zamiast wbudowanego "easeOut" —
// wolniejszy, bardziej "ciężki" start i długie, miękkie wyhamowanie na
// końcu. To ta różnica, która sprawia, że ruch czuje się płynnie zamiast
// mechanicznie, nawet przy tym samym czasie trwania.
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SMOOTH_EASE } },
};

const headerGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SMOOTH_EASE } },
};

// Spring współdzielony przez hover kart i przyciski CTA — daje lekki,
// "żywy" odbicie zamiast płaskiego duration-based tweena.
const HOVER_SPRING = { type: "spring", stiffness: 350, damping: 22, mass: 0.6 } as const;
const TAP_SPRING = { type: "spring", stiffness: 500, damping: 25, mass: 0.5 } as const;

/* ---------------------------------------------------------------------- */
/*  Zdjęcie produktu na białym tle (routery) — pomijane, gdy brak `zdjecie` */
/* ---------------------------------------------------------------------- */
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
                    <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{item.model}</h3>
                    {item.podtytul && <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>}
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
                        className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-900/40 hover:border-teal-300/50"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-black/20 hover:text-white"
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

/* ---------------------------------------------------------------------- */
/*  PromoCena — wspólny blok ceny dla obu typów kart.                      */
/* ---------------------------------------------------------------------- */
function PromoCena({
  promoLabel,
  regularPrice,
  regularPriceNote,
  accent,
  leadWithZero,
}: {
  promoLabel: string;
  regularPrice: string;
  regularPriceNote: string;
  accent: "orange" | "pink";
  leadWithZero: boolean;
}) {
  const labelColor = accent === "pink" ? "text-pink-300" : "text-orange-300";

  if (leadWithZero) {
    return (
      <div className="mt-4 pb-4 border-b border-white/10">
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl font-black leading-none text-white">0 zł</span>
          <span className="text-base font-semibold text-white/35 line-through">{regularPrice}</span>
        </div>
        <p className={`mt-1.5 text-sm font-semibold ${labelColor}`}>{promoLabel}</p>
        <p className="mt-0.5 text-xs text-white/40">{regularPriceNote}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pb-4 border-b border-white/10">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black leading-none text-white">{regularPrice}</span>
        <span className="text-sm font-medium text-slate-400">/ mies.</span>
      </div>
      <p className={`mt-1.5 text-sm font-semibold ${labelColor}`}>{promoLabel}</p>
      <p className="mt-0.5 text-xs text-white/40">{regularPriceNote}</p>
    </div>
  );
}

function SzczegolyOferty({ children }: { children: ReactNode }) {
  const [otwarte, setOtwarte] = useState(false);

  return (
    <div className="mt-10 pt-6 border-t border-white/10 max-w-4xl mx-auto text-center">
      <button
        type="button"
        onClick={() => setOtwarte((o) => !o)}
        aria-expanded={otwarte}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition-colors hover:text-white/75"
      >
        {otwarte ? "Ukryj szczegóły oferty" : "Zobacz szczegóły oferty"}
        <ChevronRight
          size={13}
          className={`transition-transform duration-200 ${otwarte ? "rotate-90" : "rotate-0"}`}
        />
      </button>

      {otwarte && (
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{children}</p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Karta Podstawa.                                                        */
/* ---------------------------------------------------------------------- */
const OfferCard = memo(function OfferCard({
  offer,
  reduceMotion,
  onPokazInfo,
}: {
  offer: Offer;
  reduceMotion: boolean;
  onPokazInfo: (infoId: string) => void;
}) {
  // [DODANO] Treść SMS-a — konkretna oferta zamiast generycznego "INTERNET",
  // np. "Interesuje mnie oferta: Internet 1000 Mb/s + TV M. Oddzwońcie."
  const smsBody = encodeURIComponent(
    `Interesuje mnie oferta: Internet ${offer.speed} + ${offer.pkg}. Oddzwońcie do mnie.`
  );
  const contentName = `oferta_podstawa_${slugify(offer.speed)}_${slugify(offer.pkg)}`;

  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={HOVER_SPRING}
      className={`relative flex flex-col rounded-2xl border p-6 will-change-transform ${
        offer.featured
          ? "border-teal-400/50 bg-[#0f2436] shadow-[0_0_24px_-8px_rgba(45,212,191,0.25)]"
          : "border-white/10 bg-[#0d1f31] hover:border-white/20"
      }`}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a2b] text-center">
          Najczęściej wybierana
        </span>
      )}

      <p className="text-sm font-medium text-slate-300">Internet do</p>
      <p className="mt-1 text-2xl font-extrabold text-white leading-tight">
        {offer.speed} <span className="text-lg font-bold text-slate-300">+ {offer.pkg}</span>
      </p>

      <PromoCena
        promoLabel="Abonament 12 miesięcy za 0 zł po rabatach"
        regularPrice={offer.price}
        regularPriceNote={`Od 13. do 24. miesiąca: ${offer.price}/mies.`}
        accent="orange"
        leadWithZero={false}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
      <ul className="space-y-3">
        {offer.features.map((f) => (
          <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-200">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15">
              <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
            </span>
            {f.infoId ? (
              <button
                type="button"
                onClick={() => onPokazInfo(f.infoId!)}
                className="inline-flex items-center gap-1 cursor-pointer text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors hover:text-teal-300 hover:decoration-teal-300"
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
      </div>

      <m.a
        href={`tel:${PHONE.replace(/\s/g, "")}`}
        onClick={() => trackContact(`${contentName}_tel`)}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-600"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </m.a>

      <m.a
        href={`sms:${PHONE.replace(/\s/g, "")}?body=${smsBody}`}
        onClick={() => trackContact(`${contentName}_sms`)}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-black/20"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </m.a>
    </m.article>
  );
});

/* ---------------------------------------------------------------------- */
/*  Karta MAX.                                                            */
/* ---------------------------------------------------------------------- */
const MaxOfferCard = memo(function MaxOfferCard({
  offer,
  reduceMotion,
  onPokazInfo,
}: {
  offer: MaxOffer;
  reduceMotion: boolean;
  onPokazInfo: (infoId: string) => void;
}) {
  // [DODANO] Treść SMS-a z nazwą konkretnej oferty MAX (np. "MAX 2000")
  const smsBody = encodeURIComponent(
    `Interesuje mnie oferta: ${offer.name} (${offer.speed}). Oddzwońcie do mnie.`
  );
  const contentName = `oferta_max_${slugify(offer.name)}`;

  return (
    <m.article
      variants={cardVariants}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={HOVER_SPRING}
      className={`relative flex flex-col rounded-2xl p-6 bg-[#183648] ${
        offer.featured
          ? "border-2 border-pink-400/70 shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(236,72,153,0.45)]"
          : "border border-white/10"
      }`}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B2A3D] shadow-sm">
          Najczęściej wybierany
        </span>
      )}

      <span className="block text-2xl font-black tracking-tight text-pink-400 sm:text-3xl">
        {offer.name}
      </span>

      <PromoCena
        promoLabel={offer.monthsPill}
        regularPrice={offer.price}
        regularPriceNote={`Od 13. do 24. miesiąca: ${offer.price}`}
        accent="pink"
        leadWithZero={true}
      />

      <div className="mt-4 flex flex-1 flex-col justify-center">
      <ul className="space-y-3">
        <li className="flex items-center gap-2.5 text-sm text-white">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
            <Check size={12} strokeWidth={3} />
          </span>
          Internet do <b className="font-bold">{offer.speed}</b>
        </li>
        {offer.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5 text-sm text-white">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
              <Check size={12} strokeWidth={3} />
            </span>
            {f.infoId ? (
              <button
                type="button"
                onClick={() => onPokazInfo(f.infoId!)}
                className="inline-flex items-center gap-1 cursor-pointer text-left underline decoration-dotted decoration-pink-300/40 underline-offset-4 transition-colors hover:text-pink-300"
              >
                {f.label}
                <Info size={12} className="shrink-0 opacity-60" />
              </button>
            ) : f.label === "Bezpieczny Internet Ultra" ? (
              <span>
                {f.label}
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/55">
                  <Shield size={11} className="text-pink-300" />
                  Ochrona 5 urządzeń + CyberEkspert
                </span>
              </span>
            ) : (
              <span>{f.label}</span>
            )}
          </li>
        ))}
      </ul>
      </div>

      <m.a
        href={`tel:${PHONE.replace(/\s/g, "")}`}
        onClick={() => trackContact(`${contentName}_tel`)}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)]"
      >
        <Phone className="h-4 w-4" />
        ZADZWOŃ {PHONE}
      </m.a>

      <m.a
        href={`sms:${PHONE.replace(/\s/g, "")}?body=${smsBody}`}
        onClick={() => trackContact(`${contentName}_sms`)}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={TAP_SPRING}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-black/20"
      >
        <MessageCircle className="h-4 w-4" />
        WYŚLIJ SMS
      </m.a>
    </m.article>
  );
});

interface OfertyProps {
  cityLocative?: string;
  defaultOferta?: "podstawa" | "max";
}

export default function Oferty({ cityLocative, defaultOferta = "max" }: OfertyProps = {}) {
  const reduceMotion = useReducedMotion();
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [tryb, setTryb] = useState<"podstawa" | "max">(defaultOferta);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        className="relative w-full py-8 px-8 overflow-hidden"
        style={{ backgroundColor: "#0B2A3D" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
          }}
        />

        <div className="relative max-w-305 mx-auto">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headerGroupVariants}
            className="text-center mb-10"
          >
            <m.div
              variants={headerItemVariants}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70"
            >
              <Shield size={13} className="text-teal-300" />
              14 dni na rezygnację, zero pytań
            </m.div>
            <m.h2
              variants={headerItemVariants}
              className="text-4xl md:text-5xl font-extrabold text-white"
            >
              {cityLocative ? (
                <>
                  Internet w <span className="text-teal-400">{cityLocative}</span>, który nie
                  zawodzi. Dwa plany,<br /> jedna decyzja.
                </>
              ) : (
                <>
                  Dwa plany, jedna decyzja:{" "} <br />
                  <span className="text-teal-400">70 zł</span> albo{" "}
                  <span className="text-pink-400">0 zł</span>.
                </>
              )}
            </m.h2>
            <m.p variants={headerItemVariants} className="mt-3 text-slate-400 text-base">
              <span className="font-semibold text-white/80">Podstawa</span> — szybki, stabilny
              internet od 70 zł/mies.
              <br />
              <span className="font-semibold text-white/80">MAX</span> — internet + telewizja L
              4K + pełna ochrona. Abonament 12 miesięcy za 0 zł po rabatach.
            </m.p>

            <m.div
              variants={headerItemVariants}
              role="tablist"
              aria-label="Wybór trybu oferty"
              className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1"
            >
              <m.span
                aria-hidden="true"
                animate={{
                  x: tryb === "max" ? "calc(100% + 8px)" : 0,
                }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full ${
                  tryb === "max"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400"
                    : "bg-gradient-to-r from-teal-500 to-teal-400"
                }`}
              />
              <button
                type="button"
                role="tab"
                aria-selected={tryb === "podstawa"}
                onClick={() => setTryb("podstawa")}
                className={`relative z-10 flex-1 rounded-full px-6 py-2.5 text-center text-sm font-bold transition-colors ${
                  tryb === "podstawa" ? "text-[#0B2A3D]" : "text-white/70 hover:text-white"
                }`}
              >
                Podstawa
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tryb === "max"}
                onClick={() => setTryb("max")}
                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${
                  tryb === "max" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <Flame size={14} className={tryb === "max" ? "fill-current" : ""} />
                MAX
              </button>
            </m.div>

          </m.div>

          <AnimatePresence mode="wait">
            {tryb === "podstawa" ? (
              <m.div
                key="podstawa"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              >
                <m.div
                  initial="hidden"
                  animate="visible"
                  variants={gridVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
                >
                  {offers.map((offer) => (
                    <OfferCard
                      key={`${offer.speed}-${offer.pkg}`}
                      offer={offer}
                      reduceMotion={!!reduceMotion}
                      onPokazInfo={setAktywnyInfoId}
                    />
                  ))}
                </m.div>

                <SzczegolyOferty>
                  Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje inna oferta.
                  Prezentowana oferta Netii S.A.: „Wybierz szybszy Internet 12 mies. 1/2Gb/s (PON, HFC, ETTH)”
                  obowiązuje przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy
                  jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku
                  rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą
                  fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję.
                  Po 24 miesiącach cena abonamentu wzrasta o 10 zł. „Szybki Internet Max (1000, 2000)” stanowi
                  wyłącznie nazwę marketingową. Usługa Internetowa oparta jest na parametrach jakości wynikających
                  z maksymalnych parametrów technicznych danej technologii, w jakiej świadczona jest Usługa
                  Internetowa lub wynikających z ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest
                  dostępna na technologii PON. Parametry świadczenia Usługi Internetowej, w szczególności
                  parametry prędkości oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie
                  netia.pl. Oferta jest ograniczona terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH
                  Operatora.
                </SzczegolyOferty>
              </m.div>
            ) : (
              <m.div
                key="max"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              >
                <m.div
                  initial="hidden"
                  animate="visible"
                  variants={gridVariants}
                  className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 items-stretch"
                >
                  {maxOffers.map((offer) => (
                    <MaxOfferCard
                      key={offer.name}
                      offer={offer}
                      reduceMotion={!!reduceMotion}
                      onPokazInfo={setAktywnyInfoId}
                    />
                  ))}
                </m.div>


                <SzczegolyOferty>
                  Prezentowana oferta Netii S.A.: „Wybierz rabat 12 miesięcy” (PON, HFC, ETTH) obowiązuje przy
                  zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy jednoczesnym
                  korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku rezygnacji
                  lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą fakturą
                  zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję. Po 24
                  miesiącach cena abonamentu wzrasta o 10 zł. „Wybierz rabat 12 miesięcy” stanowi wyłącznie nazwę
                  marketingową. Usługa Internetowa oparta jest na parametrach jakości wynikających z maksymalnych
                  parametrów technicznych danej technologii, w jakiej świadczona jest Usługa Internetowa, lub
                  wynikających z ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest dostępna na
                  technologii PON. Parametry świadczenia Usługi Internetowej, w szczególności parametry prędkości
                  oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest
                  ograniczona terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.
                </SzczegolyOferty>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <InfoModal infoId={aktywnyInfoId} onClose={() => setAktywnyInfoId(null)} />
      </section>
    </LazyMotion>
  );
}