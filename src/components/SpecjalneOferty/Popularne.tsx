"use client";

import { useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  Check,
  Router,
  Tv,
  ShieldCheck,
  Gauge,
  CreditCard,
  CalendarClock,
  Users,
  Flame,
  Info,
  X,
  FileText,
  ListChecks,
  Wallet,
  ListOrdered,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Table2,
  Wifi,
} from "lucide-react";

/* Wspólny wariant fade-up — zgodnie z Hero.tsx */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------------------------------------------------------------- */
/*  Popupy "Szczegóły" — routery, dekoder, Netia GO, Giganagrywarka       */
/*  Klikalna jest KAŻDA pozycja w liście cech karty ofertowej, która ma   */
/*  przypisany `infoId` wskazujący na wpis w INFO_ITEMS poniżej.          */
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
  // TODO: jeśli plik leży w innym miejscu niż /public, popraw ścieżkę.
  zdjecie?: string;
  /** Duży, wyróżniony napis-baner — używany zwłaszcza tam, gdzie brak zdjęcia */
  banner?: string;
  /** Kolorystyka poświaty/ramki banera i akcentu ikon — domyślnie teal */
  bannerAkcent?: "red" | "lime";
  sections: InfoSection[];
  uwaga?: string;
  instrukcjaUrl?: string;
}

const INFO_ITEMS: Record<string, InfoItem> = {
  "router-wifi": {
    id: "router-wifi",
    model: "HUAWEI HG8245Q",
    podtytul: "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych",
    zdjecie: "/LowRouter.webp",
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
    instrukcjaUrl: "https://uslugi-netia.pl/docs/Instrukcja_Router_Huawei_HG8245Q.pdf",
  },

  "router-wifi6": {
    id: "router-wifi6",
    model: "HUAWEI HG8245X6-10",
    podtytul: "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 1 Gb/s",
    zdjecie: "/MidRouter.webp",
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
    instrukcjaUrl: "https://uslugi-netia.pl/docs/Instrukcja_Router_Huawei_HG8245X6_10.pdf",
  },

  "router-wifi7": {
    id: "router-wifi7",
    model: "HUAWEI HG8145B7N",
    podtytul: "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 2 Gb/s",
    zdjecie: "/TopRouter.webp",
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
    instrukcjaUrl:
      "https://uslugi-netia.pl/docs/Instrukcja_Router_ONTCombo_HuaweiHG8145B7N-_2-5G_WiFi7.pdf",
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
    instrukcjaUrl:
      "https://uslugi-netia.pl/docs/Instrukcja_uzytkownika_netia_dekodera_evobox_4K.pdf",
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
/*  Kolorystyka banera-hasła i ikon (Netia GO / Giganagrywarka) — starszy, */
/*  mocniejszy wariant gradientu (radialna poświata + ciemne tło).         */
/* ---------------------------------------------------------------------- */
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
  // "subrosa" — rgb(238,18,100)
  red: {
    border: "border-[rgb(238,18,100)]/40",
    background:
      "radial-gradient(130% 160% at 15% 0%, rgba(238,18,100,.55), transparent 60%), linear-gradient(135deg, #5c0a2e 0%, #1a0310 100%)",
    text: "text-[rgb(238,18,100)]",
    soft: "bg-[rgb(238,18,100)]/15",
  },
  // rgb(166,206,58)
  lime: {
    border: "border-[rgb(166,206,58)]/40",
    background:
      "radial-gradient(130% 160% at 15% 0%, rgba(166,206,58,.55), transparent 60%), linear-gradient(135deg, #3a4a15 0%, #12180a 100%)",
    text: "text-[rgb(166,206,58)]",
    soft: "bg-[rgb(166,206,58)]/15",
  },
};

/* ---------------------------------------------------------------------- */
/*  Kolor cechy na karcie ofertowej — adekwatny kolor pojawia się dopiero  */
/*  gdy powiązany popup jest aktualnie otwarty (kliknięcie), a nie na      */
/*  hover — hover zawsze zostaje zwykłym, domyślnym teal.                  */
/* ---------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------- */
/*  Zdjęcie produktu na białym tle (routery/dekoder) — pomijane, gdy brak  */
/*  `zdjecie`.                                                             */
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

/* ---------------------------------------------------------------------- */
/*  Renderer treści sekcji — jedna funkcja obsługująca wszystkie typy      */
/* ---------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------- */
/*  Modal — "Szczegóły" (router / dekoder / Netia GO / Giganagrywarka)     */
/*  Nagłówek zawsze na górze, środek jako jedyny scrollowalny fragment,    */
/*  przycisk zamknięcia zawsze na dole.                                    */
/* ---------------------------------------------------------------------- */
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
            {/* Nagłówek — zawsze widoczny, nazwa się nie chowa */}
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <Info size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Szczegóły</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{item.model}</h3>
              {item.podtytul && <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>}
            </div>

            {/* Środkowa część — jedyny scrollowalny fragment okna */}
            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              {item.zdjecie && <IkonaProduktu zdjecie={item.zdjecie} model={item.model} />}

              {(() => {
                const akcent = BANNER_AKCENTY[item.bannerAkcent ?? "teal"];

                return (
                  <>
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
                  </>
                );
              })()}

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

            {/* Stopka — zawsze na dole, jedyny przycisk zamknięcia */}
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

type Offer = {
  id: string;
  /* Nagłówek prędkości — dwupoziomowy, jak "Internet do" / "300 Mb/s + TV S" */
  eyebrow: string;
  speedBold: string;
  speedSuffix?: string;
  /* Blok promocji — etykieta / duży nagłówek / dopisek gwiazdką */
  promoEyebrow?: string;
  promoHeadline?: string;
  promoNote?: string;
  /* Fallback, gdy oferta nie ma trzyczęściowego bloku promo (np. "Najczęściej wybierany") */
  badgeLabel: string;
  features: { icon: React.ReactNode; label: string; infoId?: string }[];
  price: string;
  priceUnit: string;
  priceNote: string;
  highlighted?: boolean;
};

const offers: Offer[] = [
  {
    id: "net-300-tv-s",
    eyebrow: "Internet do",
    speedBold: "300 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "UMOWA",
    promoHeadline: "24 miesiące",
    promoNote: "*po rabatach",
    badgeLabel: "Umowa na 24 miesiące *po rabatach",
    features: [
      { icon: <Router size={14} />, label: "Router z Wi-Fi w cenie", infoId: "router-wifi" },
      { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "40",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-300-tv-s-4k",
    eyebrow: "Internet do",
    speedBold: "300 Mb/s",
    speedSuffix: "+ TV S 4K",
    promoEyebrow: "UMOWA",
    promoHeadline: "24 miesiące",
    promoNote: "*po rabatach",
    badgeLabel: "Umowa na 24 miesiące *po rabatach",
    features: [
      { icon: <Router size={14} />, label: "Router z Wi-Fi w cenie", infoId: "router-wifi" },
      { icon: <Tv size={14} />, label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "45",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-1000",
    eyebrow: "Internet do",
    speedBold: "1000 Mb/s",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: <Router size={14} />, label: "Router Combo z ONT Wi-Fi 6", infoId: "router-wifi6" },
    ],
    price: "65",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-1000-tv-s",
    eyebrow: "Internet do",
    speedBold: "1000 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: <Router size={14} />, label: "Router z Wi-Fi 6 w cenie", infoId: "router-wifi6" },
      { icon: <Tv size={14} />, label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "70",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-2000-tv-s",
    eyebrow: "Internet do",
    speedBold: "2000 Mb/s",
    speedSuffix: "+ TV S",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    highlighted: true,
    features: [
      { icon: <Router size={14} />, label: "Router Combo z ONT z Wi-Fi 7", infoId: "router-wifi7" },
      { icon: <Tv size={14} />, label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie", infoId: "netia-go" },
    ],
    price: "85",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
  {
    id: "net-2000-tv-l",
    eyebrow: "Internet do",
    speedBold: "2000 Mb/s",
    speedSuffix: "+ TV L",
    promoEyebrow: "ABONAMENT",
    promoHeadline: "6 miesięcy za 0 zł",
    promoNote: "*po rabatach",
    badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
    features: [
      { icon: <Router size={14} />, label: "Router Combo z ONT Wi-Fi 7", infoId: "router-wifi7" },
      { icon: <Tv size={14} />, label: "Dekoder 4K w cenie", infoId: "dekoder-evobox" },
      { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie", infoId: "netia-go" },
      { icon: <Gauge size={14} />, label: "Giganagrywarka Basic", infoId: "giganagrywarka" },
    ],
    price: "125",
    priceUnit: "zł z VAT",
    priceNote: "Przez 24 miesiące z rabatami",
  },
];

const faqs: { icon: React.ReactNode; q: string; a: string }[] = [
  {
    icon: <Router size={19} strokeWidth={2} />,
    q: "Co dokładnie dostaję w wybranym pakiecie?",
    a: "Każdy pakiet zawiera internet światłowodowy Netii oparty o sieć Orange, telewizję z dekoderem oraz router w cenie abonamentu. Szczegółowa lista sprzętu i usług znajduje się przy każdej ofercie powyżej.",
  },
  {
    icon: <CreditCard size={19} strokeWidth={2} />,
    q: "Ile naprawdę zapłacę przez pierwsze miesiące?",
    a: "W pakietach oznaczonych jako „Abonament 6 miesięcy za 0 zł” przez pierwsze 6 miesięcy nie płacisz nic — opłata w wysokości podanej przy ofercie nalicza się od kolejnego okresu rozliczeniowego, zgodnie z regulaminem promocji.",
  },
  {
    icon: <CalendarClock size={19} strokeWidth={2} />,
    q: "Na jak długo zawierana jest umowa?",
    a: "W zależności od wybranej oferty umowa obowiązuje przez 24 pełne okresy rozliczeniowe. Dokładny czas trwania i warunki znajdziesz w regulaminie danej promocji.",
  },
  {
    icon: <Gauge size={19} strokeWidth={2} />,
    q: "Czy prędkość internetu jest gwarantowana?",
    a: "Prędkości podane w ofertach to prędkości maksymalne dostępne w danej technologii i lokalizacji. Realna prędkość może zależeć od parametrów łącza dostępnych pod konkretnym adresem.",
  },
  {
    icon: <Tv size={19} strokeWidth={2} />,
    q: "Czy mogę dokupić dodatkowe pakiety telewizyjne?",
    a: "Tak, do każdej oferty możesz dokupić pakiety premium, takie jak kanały sportowe czy filmowe, a także dodatkowy dekoder do kolejnego telewizora.",
  },
  {
    icon: <ShieldCheck size={19} strokeWidth={2} />,
    q: "Jak szybko mogę zamówić wybraną ofertę?",
    a: "Wystarczy zadzwonić lub wysłać SMS z tego miejsca — nasz doradca oddzwoni w kilka minut i przeprowadzi Cię przez cały proces zamówienia.",
  },
];

export default function PopularneOferty() {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Który popup ze szczegółami pokazać (klucz z INFO_ITEMS, lub null = zamknięty)
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Pulsujący przycisk "Zadzwoń" w domykającym CTA — jak w NetiaFAQ.tsx */}
      <style>{`
        @keyframes popularne-oferty-faq-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.45); }
          50% { box-shadow: 0 0 0 8px rgba(45, 212, 191, 0); }
        }
        .popularne-oferty-faq-cta-pulse {
          animation: popularne-oferty-faq-pulse 2.4s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .popularne-oferty-faq-cta-pulse {
            animation: none;
          }
        }
      `}</style>

      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans py-20 sm:py-24 "
      >
        <div className="relative z-10 mx-auto max-w-320 px-5 sm:px-6 lg:px-8 pt-12">
          {/* BANER PROMO — h1 + badge + grafika sygnału + CTA */}
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto flex max-w-310 flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12"
            style={{
              background:
                "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

            {/* Grafika SVG — kwadraty, dekoracja po prawej stronie */}
            <svg
              className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Duży obrócony kwadrat — kontur */}
              <rect
                x="120"
                y="25"
                width="70"
                height="70"
                rx="10"
                stroke="#2DD4BF"
                strokeOpacity="0.5"
                strokeWidth="2"
                transform="rotate(15 155 60)"
              />
              {/* Mniejszy kwadrat — kontur */}
              <rect
                x="140"
                y="75"
                width="42"
                height="42"
                rx="8"
                stroke="#99F6E4"
                strokeOpacity="0.32"
                strokeWidth="2"
                transform="rotate(-10 161 96)"
              />
              {/* Wypełnione kwadraty w różnych rozmiarach */}
              <rect
                x="60"
                y="120"
                width="16"
                height="16"
                rx="3"
                fill="#2DD4BF"
                opacity="0.7"
                transform="rotate(20 68 128)"
              />
              <rect
                x="95"
                y="145"
                width="10"
                height="10"
                rx="2"
                fill="#99F6E4"
                opacity="0.55"
                transform="rotate(35 100 150)"
              />
              <rect
                x="30"
                y="70"
                width="9"
                height="9"
                rx="2"
                fill="#99F6E4"
                opacity="0.5"
                transform="rotate(-15 34 74)"
              />
              <rect
                x="165"
                y="150"
                width="7"
                height="7"
                rx="2"
                fill="#2DD4BF"
                opacity="0.55"
              />
            </svg>

            {/* Grafika SVG — gwiazdki i kółka, dekoracja po lewej stronie */}
            <svg
              className="pointer-events-none absolute -left-10 -bottom-10 hidden h-52 w-52 opacity-40 sm:block lg:h-64 lg:w-64"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Kółka o różnej wielkości, w stylu "orbit" */}
              <circle cx="40" cy="150" r="4" fill="#2DD4BF" />
              <circle
                cx="40"
                cy="150"
                r="22"
                stroke="#2DD4BF"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy="150"
                r="42"
                stroke="#99F6E4"
                strokeOpacity="0.28"
                strokeWidth="2"
              />

              <circle cx="120" cy="40" r="3" fill="#99F6E4" />
              <circle
                cx="120"
                cy="40"
                r="16"
                stroke="#99F6E4"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />

              {/* Gwiazdki (4-ramienne, "sparkle") w kilku miejscach */}
              <path
                d="M75 90 L79 100 L89 104 L79 108 L75 118 L71 108 L61 104 L71 100 Z"
                fill="#2DD4BF"
                opacity="0.7"
              />
              <path
                d="M150 120 L152.5 126 L158.5 128.5 L152.5 131 L150 137 L147.5 131 L141.5 128.5 L147.5 126 Z"
                fill="#99F6E4"
                opacity="0.6"
              />
              <path
                d="M25 55 L27 60 L32 62 L27 64 L25 69 L23 64 L18 62 L23 60 Z"
                fill="#99F6E4"
                opacity="0.5"
              />
              <path
                d="M105 165 L107 170 L112 172 L107 174 L105 179 L103 174 L98 172 L103 170 Z"
                fill="#2DD4BF"
                opacity="0.5"
              />

              {/* Drobne kropki dla wypełnienia */}
              <circle cx="60" cy="30" r="2.5" fill="#2DD4BF" opacity="0.6" />
              <circle cx="170" cy="70" r="2" fill="#99F6E4" opacity="0.5" />
              <circle cx="15" cy="110" r="2" fill="#2DD4BF" opacity="0.5" />
            </svg>

            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
            >
              <Flame size={13} className="fill-current" />
              Najpopularniejsze
              <Flame size={13} className="fill-current" />
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Najczęściej wybierane{" "}
              <span className="text-teal-300">pakiety</span>
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative z-10 mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-white/65 sm:text-base"
            >
              <Users size={15} className="text-teal-300" />
              Internet i telewizja w najkorzystniejszych cenach — sprawdzone
              przez ponad{" "}
              <span className="font-semibold text-white">2,4 mln klientów</span>{" "}
              w całej Polsce.
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative z-10 mt-4 flex flex-col gap-2.5 sm:flex-row"
            >
              <m.a
                href="tel:+48883334124"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white"
              >
                <Phone size={15} />
                ZADZWOŃ +48 883 334 124
              </m.a>
              <m.a
                href="sms:+48883334124?body=INTERNET"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
              >
                <MessageCircle size={15} />
                WYŚLIJ SMS
              </m.a>
            </m.div>
          </m.div>

          {/* Siatka ofert */}
          {/* Siatka ofert — items-stretch wyrównuje wysokość kart w każdym wierszu */}
<div className="mt-14 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {offers.map((offer, i) => (
    <m.div
      key={offer.id}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={`relative flex h-full flex-col rounded-2xl border p-6 ${
        offer.highlighted
          ? "border-amber-400/60 bg-white/5"
          : "border-white/10 bg-white/5"
      }`}
    >
                {offer.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B2A3D]">
                    Najczęściej wybierany
                  </span>
                )}

                {/* Nagłówek: mała etykieta + duża prędkość */}
                <p className="text-xs font-semibold text-white/50">
                  {offer.eyebrow}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold leading-snug text-white">
                  {offer.speedBold}
                  {offer.speedSuffix && (
                    <span className="ml-1.5 text-lg font-semibold text-white/85">
                      {offer.speedSuffix}
                    </span>
                  )}
                </h3>

                {/* Blok promocji: etykieta / duży nagłówek / dopisek — lub pigułka zastępcza */}
                {offer.promoHeadline ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                      {offer.promoEyebrow}
                    </p>
                    <p className="text-lg font-extrabold leading-tight text-orange-300">
                      {offer.promoHeadline}
                    </p>
                    {offer.promoNote && (
                      <p className="mt-0.5 text-[11px] text-white/40">
                        {offer.promoNote}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="mt-4 inline-flex w-fit items-center rounded-full bg-teal-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-300">
                    {offer.badgeLabel}
                  </span>
                )}

                <div className="mt-5 border-t border-white/10" />

                <ul className="mt-5 flex-1 space-y-2.5">
                  {offer.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-white/70 sm:text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                        <Check size={12} />
                      </span>
                      {f.infoId ? (
                        <button
                          type="button"
                          onClick={() => setAktywnyInfoId(f.infoId!)}
                          className={`inline-flex cursor-pointer items-center gap-1 text-left underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors ${klasaCechy(
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

                {/* Boks z ceną — wyśrodkowany, w ramce */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] py-4 text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl font-extrabold text-white">
                      {offer.price}
                    </span>
                    <span className="text-sm font-medium text-white/60">
                      {offer.priceUnit}
                    </span>
                  </div>
                  <span className="mt-1 block text-[11px] text-white/40">
                    {offer.priceNote}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-2.5 pt-6">
                  <m.a
                    href="tel:+48883334124"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <Phone size={14} /> ZADZWOŃ +48 883 334 124
                  </m.a>
                  <m.a
                    href="sms:+48883334124?body=INTERNET"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <MessageCircle size={14} /> WYŚLIJ SMS
                  </m.a>
                </div>
              </m.div>
            ))}
          </div>

          {/* Zapisek prawny / regulaminowy — pod ofertami */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mt-10 max-w-4xl space-y-3 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-white/40"
          >
            <p>
              Prezentowana oferta dotyczy mieszkań. W przypadku budynków
              jednorodzinnych obowiązuje inna oferta.
            </p>
            <p>
              Prezentowana oferta Netii S.A.: „Wybierz super cenę 300Mb/s
              (HFC, PON, ETTH)” obowiązuje przy zawarciu Umowy na czas
              określony 24 pełnych Okresów Rozliczeniowych przy jednoczesnym
              korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe
              (5 zł). W przypadku rezygnacji lub niespełnienia warunków
              przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą
              fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł
              za Internet i 2 zł za Telewizję. Po 24 miesiącach cena
              abonamentu wzrasta o 20 zł. „Szybki Internet Max 300” stanowi
              wyłącznie nazwę marketingową. Usługa Internetowa oparta jest na
              parametrach jakości wynikających z maksymalnych parametrów
              technicznych danej technologii, w jakiej świadczona jest Usługa
              Internetowa lub wynikających z ofertowych ustawień technicznych
              łącza. Parametry świadczenia Usługi Internetowej, w
              szczególności parametry prędkości oraz wpływu innych Usług na
              Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest
              ograniczona terytorialnie do zasięgu stacjonarnej sieci PON,
              HFC, ETTH Operatora.
            </p>
            <p>
              Prezentowana oferta Netii S.A.: „Wybierz szybszy Internet
              6mies. 1/2Gb/s (PON, HFC, ETTH)” obowiązuje przy zawarciu Umowy
              na czas określony 24 pełnych Okresów Rozliczeniowych przy
              jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody
              marketingowe (5 zł). W przypadku rezygnacji lub niespełnienia
              warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z
              pierwszą fakturą zostanie naliczona opłata aktywacyjna w
              wysokości 79 zł za Internet i 2 zł za Telewizję. Po 24
              miesiącach cena abonamentu wzrasta o 10 zł. „Szybki Internet
              Max (1000, 2000)” stanowi wyłącznie nazwę marketingową. Usługa
              Internetowa oparta jest na parametrach jakości wynikających z
              maksymalnych parametrów technicznych danej technologii, w
              jakiej świadczona jest Usługa Internetowa lub wynikających z
              ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest
              dostępna na technologii PON. Parametry świadczenia Usługi
              Internetowej, w szczególności parametry prędkości oraz wpływu
              innych Usług na Usługę Internetową, dostępne są na stronie
              netia.pl. Oferta jest ograniczona terytorialnie do zasięgu
              stacjonarnej sieci PON, HFC, ETTH Operatora.
            </p>
          </m.div>

          {/* FAQ — styl zunifikowany z NetiaFAQ.tsx: ikona per-pytanie w kolorowym
              boksie, "Plus" obracający się o 45° zamiast ChevronDown, oraz kolory
              otwartej karty (teal-400/10 bg, teal-400/30 border). */}
          <div className="mx-auto mt-16 max-w-310">
            <div className="text-center">
              <m.div
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  FAQ
                </span>
              </m.div>
              <m.h3
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="text-xl font-extrabold text-white sm:text-2xl"
              >
                Najczęstsze pytania
              </m.h3>
              <m.p
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="mx-auto mt-3 max-w-md text-sm text-white/60"
              >
                Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów.
                Coś jeszcze niejasne? Doradca odpowie w 3 minuty przez telefon.
              </m.p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 items-start">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <m.div
                    key={i}
                    initial={reduceMotion ? false : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenFaq(isOpen ? null : i);
                      }
                    }}
                    className={`cursor-pointer overflow-hidden self-start rounded-2xl border transition-colors duration-200 ${
                      isOpen
                        ? "border-teal-400/30 bg-teal-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          isOpen
                            ? "bg-teal-400/15 text-teal-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <span
                        className={`flex-1 text-base font-medium leading-snug transition-colors duration-300 sm:text-[1.0625rem] ${
                          isOpen ? "text-white" : "text-white/80"
                        }`}
                      >
                        {item.q}
                      </span>

                      <Plus
                        size={20}
                        className="shrink-0 text-teal-400 transition-transform duration-300"
                        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      />
                    </div>
                    <div
                      className="grid transition-all duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[calc(2.5rem+1rem)] text-sm leading-relaxed text-white/60 sm:px-6 sm:pb-6 sm:text-[0.9375rem]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* Dolne CTA */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-16 max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center sm:px-10 sm:py-10"
          >
            <h4 className="text-xl font-bold text-white sm:text-2xl">
              Wciąż masz pytania?
            </h4>
            <p className="mt-2 mb-6 text-sm text-white/65 sm:text-[0.9375rem]">
              Rozmowa zajmuje ~3 minuty, bez zobowiązań. Doradca odpowie od razu.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <m.a
                href="tel:+48883334124"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="popularne-oferty-faq-cta-pulse flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Phone size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">
                      ZADZWOŃ
                    </span>
                    <span className="block text-xs text-white/85">
                      +48 883 334 124
                    </span>
                  </span>
                </span>
                <ChevronRight size={18} className="text-white/70" />
              </m.a>

              <m.a
                href="sms:+48883334124?body=INTERNET"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={16} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold leading-tight">
                      WYŚLIJ SMS
                    </span>
                    <span className="block text-xs text-white/70">
                      Oddzwonimy w kilka minut
                    </span>
                  </span>
                </span>
                <ChevronRight size={18} className="text-white/50" />
              </m.a>
            </div>
          </m.div>
        </div>

        {/* Popup ze szczegółami — wspólny dla wszystkich klikalnych cech na kartach */}
        <InfoModal infoId={aktywnyInfoId} onClose={() => setAktywnyInfoId(null)} />
      </section>
    </LazyMotion>
  );
}