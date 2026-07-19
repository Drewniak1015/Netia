"use client";

import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  memo,
  type ReactNode,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
// TODO: popraw ścieżkę importu, jeśli lib/channels.ts leży gdzie indziej niż @/lib/channels
import {
  channelsForTier,
  TIER_LABELS,
  TIER_CHANNEL_COUNTS,
  channelsForAddon,
  ADDONS,
  channelId,
  type Tier,
  type Channel,
} from "@/lib/channels";
import {
  ChevronRight,
  Check,
  Wifi,
  Tv,
  Smartphone,
  Gift,
  Flame,
  Sparkles,
  Info,
  X,
  FileText,
  ListChecks,
  Gauge,
  Wallet,
  LayoutGrid,
} from "lucide-react";
import type { Oferta5G } from "@/components/Konfigurator/Oferta5G";
import DottedBackground from "@/components/ui/DottedBackground";

/* ---------------------------------------------------------------------- */
/*  FIX (TBT): PodsumowanieFixed i Uslugi5GModal nie są potrzebne do        */
/*  pierwszego renderu (jeden to widget stopki, drugi to zawartość modala  */
/*  otwieranego dopiero po kliknięciu) — ładujemy je leniwie, żeby nie      */
/*  wchodziły w koszt Script Evaluation na starcie strony.                 */
/* ---------------------------------------------------------------------- */
const PodsumowanieFixed = dynamic(
  () => import("@/components/Konfigurator/konfiguratorFixed"),
  { ssr: false }
);
const Uslugi5GModal = dynamic(
  () => import("@/components/Konfigurator/Oferta5G"),
  { ssr: false }
);

/* ---------------------------------------------------------------------- */
/*  Wspólny stan wybranej oferty (umowa / pakiet / TV / 5G / dodatki)      */
/*  Trzymany w pamięci + sessionStorage — przetrwa nawigację i F5,         */
/*  znika po zamknięciu karty/przeglądarki. Owiń tym providerem root      */
/*  layout aplikacji (patrz komentarz przy `KonfiguratorProvider` niżej). */
/* ---------------------------------------------------------------------- */
export type UmowaType = "24" | "bez";

export interface WybranaPozycja {
  id: string;
  nazwa: string;
  cena: number;
}

interface KonfiguratorState {
  umowa: UmowaType;
  pakiet: WybranaPozycja | null;
  tv: WybranaPozycja | null;
  uslugi5g: WybranaPozycja | null;
  dodatki: WybranaPozycja[];
}

interface KonfiguratorContextValue extends KonfiguratorState {
  setUmowa: (umowa: UmowaType) => void;
  setPakiet: (pakiet: WybranaPozycja | null) => void;
  setTv: (tv: WybranaPozycja | null) => void;
  setUslugi5g: (uslugi5g: WybranaPozycja | null) => void;
  toggleDodatek: (dodatek: WybranaPozycja) => void;
  suma: number;
  maWybor: boolean;
}
const initialState: KonfiguratorState = {
  umowa: "24",
  pakiet: null,
  tv: null,
  uslugi5g: null,
  dodatki: [],
};
const DODATKI_WYMAGAJACE_TV = new Set([
  "hbo",
  "canal-plus-select",
  "canal-plus-prestige",
  "eleven-sports",
  "filmbox",
  "cinemax",
  "polsat-sport-premium",
  "dorosli",
  "ukraina",
  "dzieci",
]);
const KonfiguratorContext = createContext<KonfiguratorContextValue | undefined>(
  undefined
);
const STORAGE_KEY = "netia-konfigurator-stan";

// FIX: było window.localStorage — niezgodne z nazwą funkcji i komentarzem
// ("znika po zamknięciu karty"). localStorage przetrwałby zamknięcie
// przeglądarki na zawsze, co nie było zamierzone. Realny sessionStorage.
function wczytajZeSessionStorage(): KonfiguratorState {
  if (typeof window === "undefined") return initialState;
  try {
    const surowy = window.sessionStorage.getItem(STORAGE_KEY);
    if (!surowy) return initialState;
    const sparsowany = JSON.parse(surowy);
    return {
      umowa: sparsowany?.umowa === "bez" ? "bez" : "24",
      pakiet: sparsowany?.pakiet ?? null,
      tv: sparsowany?.tv ?? null,
      uslugi5g: sparsowany?.uslugi5g ?? null,
      dodatki: Array.isArray(sparsowany?.dodatki) ? sparsowany.dodatki : [],
    };
  } catch {
    return initialState;
  }
}

function zapiszDoSessionStorage(state: KonfiguratorState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage może być niedostępny (np. tryb prywatny) — po prostu nie zapisujemy
  }
}

/** Owiń tym całą aplikację (np. w app/layout.tsx), żeby <PodsumowanieFixed />
 *  na innych stronach widział wybór zrobiony w konfiguratorze. Stan jest też
 *  zapisywany w sessionStorage — przetrwa odświeżenie strony (F5) i nawigację
 *  (nawet pełny reload przez zwykły <a>), a znika dopiero po zamknięciu karty. */
export function KonfiguratorProvider({ children }: { children: ReactNode }) {
  // Zaczynamy od initialState (identyczne na serwerze i kliencie, żeby uniknąć
  // hydration mismatch) — prawdziwy zapisany stan wczytujemy w useEffect,
  // czyli już po stronie klienta.
  const [state, setState] = useState<KonfiguratorState>(initialState);
  const [wczytanoZStorage, setWczytanoZStorage] = useState(false);

  // Wczytanie zapisanego stanu przy montowaniu (tylko raz, po stronie klienta)
  useEffect(() => {
    setState(wczytajZeSessionStorage());
    setWczytanoZStorage(true);
  }, []);

  // Zapis do sessionStorage przy każdej zmianie stanu — pomijamy pierwszy
  // render, żeby nie nadpisać zapisanego stanu pustym `initialState` zanim
  // zdążymy go wczytać
  useEffect(() => {
    if (!wczytanoZStorage) return;
    zapiszDoSessionStorage(state);
  }, [state, wczytanoZStorage]);

  // FIX (TBT): setterów nie tworzymy na nowo przy każdym renderze providera —
  // useCallback z pustymi zależnościami (korzystamy z funkcyjnych aktualizacji
  // setState, więc nie ma tu ryzyka "stale closure").
  const setUmowa = useCallback(
    (umowa: UmowaType) => setState({ ...initialState, umowa }),
    []
  );

  const setPakiet = useCallback(
    (pakiet: WybranaPozycja | null) => setState((prev) => ({ ...prev, pakiet })),
    []
  );

  const setTv = useCallback((tv: WybranaPozycja | null) => {
    setState((prev) => ({
      ...prev,
      tv,
      // Odznaczenie TV kasuje też wszystkie wybrane dodatki zależne od TV
      // (Canal+, HBO, Eleven Sports itd.) — bez pakietu TV nie mają sensu.
      dodatki:
        tv === null
          ? prev.dodatki.filter((d) => !DODATKI_WYMAGAJACE_TV.has(d.id))
          : prev.dodatki,
    }));
  }, []);

  const setUslugi5g = useCallback(
    (uslugi5g: WybranaPozycja | null) => setState((prev) => ({ ...prev, uslugi5g })),
    []
  );

  const toggleDodatek = useCallback((dodatek: WybranaPozycja) => {
    setState((prev) => {
      const juzWybrany = prev.dodatki.some((d) => d.id === dodatek.id);
      return {
        ...prev,
        dodatki: juzWybrany
          ? prev.dodatki.filter((d) => d.id !== dodatek.id)
          : [...prev.dodatki, dodatek],
      };
    });
  }, []);

  const suma =
    (state.pakiet?.cena ?? 0) +
    (state.tv?.cena ?? 0) +
    (state.uslugi5g?.cena ?? 0) +
    state.dodatki.reduce((suma, d) => suma + d.cena, 0);

  const maWybor = state.pakiet !== null;

  const value = useMemo<KonfiguratorContextValue>(
    () => ({ ...state, setUmowa, setPakiet, setTv, setUslugi5g, toggleDodatek, suma, maWybor }),
    [state, setUmowa, setPakiet, setTv, setUslugi5g, toggleDodatek, suma, maWybor]
  );

  return (
    <KonfiguratorContext.Provider value={value}>
      {children}
    </KonfiguratorContext.Provider>
  );
}

export function useKonfigurator() {
  const ctx = useContext(KonfiguratorContext);
  if (!ctx) {
    throw new Error(
      "useKonfigurator musi być używany wewnątrz <KonfiguratorProvider>."
    );
  }
  return ctx;
}
/* ---------------------------------------------------------------------- */
/*  Dane routerów — wyświetlane w oknie "Szczegóły dołączonego routera"    */
/*  Na razie WSZYSTKIE pakiety wskazują na klucz "domyslny" (ten sam       */
/*  Huawei HG8245Q wszędzie). Dodano też 2 gotowe szablony ("szablon-1",  */
/*  "szablon-2") — podmień w nich dane i przypisz inny routerId do        */
/*  wybranych pakietów w PAKIETY_24 / PAKIETY_BEZ, gdy będziesz mieć      */
/*  informacje o innych routerach (np. do 1000/2000 Mb/s).                */
/* ---------------------------------------------------------------------- */
interface RouterSpec {
  label: string;
  value: string;
}

interface RouterInfo {
  id: string;
  model: string;
  podtytul: string;
  // TODO: podmień na realną ścieżkę do zdjęcia routera (np. "/routery/hg8245q.png"),
  // gdy zdjęcie będzie dostępne. Dopóki `zdjecie` jest puste, w oknie pokazuje się
  // ikona zastępcza (patrz komponent <IkonaRoutera />).
  zdjecie?: string;
  opis: string[];
  specyfikacja: RouterSpec[];
  wifi5Cechy: string[];
  predkosci: string;
  kosztInfo: string;
  instrukcjaUrl: string;
}

const HUAWEI_HG8245Q: RouterInfo = {
  id: "domyslny",
  model: "HUAWEI HG8245Q",
  podtytul:
    "Router instalowany do Internetu Światłowodowego Netii przy prędkościach do 600 Mb/s i niższych",
  // TODO: jeśli plik leży w innym miejscu niż /public, popraw ścieżkę.
  zdjecie: "/images/LowRouter.webp",
  opis: [
    "Huawei HG8245Q to stabilny i sprawdzony terminal optyczny GPON stosowany w instalacjach światłowodowych Netii. Urządzenie łączy funkcję routera Wi-Fi, gigabitowego przełącznika, bramy VoIP i optycznego ONT w jednej obudowie.",
    "Zaprojektowany do pracy ciągłej, oferuje pewne połączenie internetowe, obsługę usług IPTV oraz telefonię VoIP. Dwupasmowe Wi-Fi 2.4 / 5 GHz zapewnia stabilne działanie sieci bezprzewodowej w mieszkaniu, a cztery porty LAN ułatwiają podłączanie telewizora, konsoli lub komputera po kablu.",
    "Model ten świetnie sprawdza się w typowych domowych zastosowaniach, gdzie priorytetem jest pewność działania i stabilność.",
  ],
  specyfikacja: [
    { label: "Światłowód / PON", value: "GPON ITU-T G.984, port optyczny SC/APC" },
    { label: "Porty", value: "4× LAN 1 Gb/s, 2× TEL (VoIP), 1× USB, zasilanie DC" },
    { label: "Wi-Fi (2.4 / 5 GHz)", value: "802.11 b/g/n + 802.11 a/n/ac, WPA/WPA2, WPS" },
    { label: "Funkcje", value: "NAT / DHCP / firewall, QoS, IPTV / VLAN, VoIP" },
    { label: "Wymiary", value: "285 × 190 × 85 mm" },
    { label: "Zawartość zestawu", value: "Router, zasilacz, kabel Ethernet, instrukcja" },
  ],
  wifi5Cechy: [
    "stabilne działanie 2.4 i 5 GHz",
    "mniejsze zakłócenia niż w starszych standardach",
    "pełna kompatybilność ze wszystkimi urządzeniami domowymi",
  ],
  predkosci:
    "Router Huawei HG8245Q jest instalowany przy prędkościach do 600 Mb/s, do 300 Mb/s, do 150 Mb/s.",
  kosztInfo:
    "Dostarczany i instalowany przez technika w dniu instalacji usługi Internetu bez dodatkowych kosztów.",
  instrukcjaUrl:
    "/pdf/Instrukcja_Router_Huawei_HG8245Q.pdf",
};

const ROUTERY: Record<string, RouterInfo> = {
  domyslny: HUAWEI_HG8245Q,
  // TODO (szablon do podmiany): router dla pakietów do 1000 Mb/s (WiFi 6).
  // Zdjęcie już podpięte (MidRouter.webp) — reszta danych (model, opis,
  // specyfikacja) to na razie kopia HG8245Q, podmień na docelowy tekst.
  "szablon-1": { ...HUAWEI_HG8245Q, id: "szablon-1", zdjecie: "/images/MidRouter.webp" },
  // TODO (szablon do podmiany): router dla pakietów do 2000 Mb/s (WiFi 7 / ONT combo).
  // Zdjęcie już podpięte (TopRouter.webp) — reszta danych to na razie kopia HG8245Q.
  "szablon-2": { ...HUAWEI_HG8245Q, id: "szablon-2", zdjecie: "/images/TopRouter.webp" },
};

/* ---------------------------------------------------------------------- */
/*  Drugi, elastyczny system popupów "Szczegóły" — na razie tylko dekoder  */
/*  Netia EvoBox 4K (ta sama treść co w Oferty.tsx / PopularneOferty.tsx). */
/*  Router ma osobny, prostszy system wyżej (RouterInfo / ROUTERY).        */
/* ---------------------------------------------------------------------- */
type SectionContent =
  | { type: "paragraphs"; items: string[] }
  | { type: "specTable"; items: { label: string; value: string }[] };

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
  sections: InfoSection[];
  instrukcjaUrl?: string;
}

const INFO_ITEMS: Record<string, InfoItem> = {
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
};

function TrescSekcjiInfo({ content }: { content: SectionContent }) {
  if (content.type === "paragraphs") {
    return (
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
        {content.items.map((akapit, i) => (
          <p key={i}>{akapit}</p>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
      {content.items.map((spec) => (
        <div
          key={spec.label}
          className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
        >
          <span className="text-xs font-semibold text-teal-300">{spec.label}</span>
          <span className="text-sm text-white/75">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Modal — "Szczegóły" (na razie tylko dekoder), ten sam układ co         */
/*  <RouterModal>: nagłówek zawsze na górze, środek jako jedyny            */
/*  scrollowalny fragment, przycisk zamknięcia zawsze na dole.             */
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
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <Info size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Szczegóły</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{item.model}</h3>
              {item.podtytul && <p className="mt-1 text-sm text-white/60">{item.podtytul}</p>}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              {item.zdjecie && <IkonaRoutera zdjecie={item.zdjecie} model={item.model} />}

              {item.sections.map((section, i) => {
                const Ikona = section.icon;
                return (
                  <div
                    key={section.title}
                    className={i === 0 && !item.zdjecie ? "mt-0" : "mt-6 border-t border-white/10 pt-6"}
                  >
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                      <Ikona size={15} className="text-teal-300" />
                      {section.title}
                    </h4>
                    <TrescSekcjiInfo content={section.content} />
                  </div>
                );
              })}

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

            <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
/*  Modal — "Lista kanałów" dla danego pakietu TV (fetch z lib/channels)   */
/*  Ten sam układ: nagłówek na górze, scroll w środku, Zamknij na dole.    */
/* ---------------------------------------------------------------------- */
const KafelekKanalu = memo(function KafelekKanalu({ channel }: { channel: Channel }) {
  const inicjaly = channel.name.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
      {channel.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={channel.logoUrl}
          alt={channel.name}
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: "1 / 1" }}
          className="h-8 w-8 shrink-0 rounded-md bg-white object-contain p-0.5"
        />
      ) : (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
          style={{ backgroundColor: channel.color }}
        >
          {inicjaly}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white/90">
          {channel.name}
          {channel.guaranteed && <span className="ml-1 text-teal-300">*</span>}
        </p>
        <p className="text-[11px] text-white/40">
          nr {channel.number}
          {channel.only4k && " · 4K"}
        </p>
      </div>
    </div>
  );
});

function AddonKanalyModal({
  addonKey,
  onClose,
}: {
  addonKey: string | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const kanaly = useMemo(() => (addonKey ? channelsForAddon(addonKey) : []), [addonKey]);
  const etykieta = ADDONS.find((a) => a.key === addonKey)?.label ?? "";

  useEffect(() => {
    if (!addonKey) return;
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
  }, [addonKey]);

  return (
    <AnimatePresence>
      {addonKey && (
        <m.div
          key="addon-kanaly-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="addon-kanaly-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={etykieta}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
            style={{ backgroundColor: "#0B2A3D" }}
          >
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <LayoutGrid size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Lista kanałów</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{etykieta}</h3>
              <p className="mt-1 text-sm text-white/60">{kanaly.length} kanałów w cenie dodatku</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {kanaly.map((channel) => (
                  <KafelekKanalu key={channelId(channel)} channel={channel} />
                ))}
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-white/40">
                * kanał gwarantowany — zawsze dostępny w ramach dodatku. Lista kanałów
                może ulec zmianie zgodnie z aktualną ofertą Netii.
              </p>
            </div>

            <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
function KanalyModal({ tier, onClose }: { tier: Tier | null; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const kanaly = useMemo(() => (tier ? channelsForTier(tier) : []), [tier]);

  useEffect(() => {
    if (!tier) return;
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
  }, [tier]);

  return (
    <AnimatePresence>
      {tier && (
        <m.div
          key="kanaly-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="kanaly-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={TIER_LABELS[tier]}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
            style={{ backgroundColor: "#0B2A3D" }}
          >
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <LayoutGrid size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Lista kanałów</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {TIER_LABELS[tier]}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {TIER_CHANNEL_COUNTS[tier]} kanałów w cenie pakietu
                {tier === "xs" && " (+ 16 kanałów regionalnych TVP)"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {kanaly.map((channel) => (
                  <KafelekKanalu key={channelId(channel)} channel={channel} />
                ))}
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-white/40">
                * kanał gwarantowany — zawsze dostępny w ramach pakietu. Lista kanałów
                może ulec zmianie zgodnie z aktualną ofertą Netii.
              </p>
            </div>

            <div className="shrink-0 border-t border-white/10 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
/*  Dane pakietów internetowych — umowa 24 mies.                           */
/* ---------------------------------------------------------------------- */
interface Pakiet {
  id: string;
  nazwa: string;
  predkosc: string;
  upload: string;
  wyposazenie: string;
  routerId: string;
  cena: number;
  promoBadge?: string;
  wyrozniony?: boolean;
}

const PAKIETY_24: Pakiet[] = [
  {
    id: "24-150",
    nazwa: "Internet do 150Mb/s",
    predkosc: "150 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 55,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-300",
    nazwa: "Internet do 300Mb/s",
    predkosc: "300 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 55,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
    wyrozniony: true,
  },
  {
    id: "24-1000",
    nazwa: "Internet do 1000Mb/s",
    predkosc: "1000 Mb/s",
    upload: "Upload do 300 Mb/s",
    wyposazenie: "Router WiFi 6",
    routerId: "szablon-1",
    cena: 80,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-2000",
    nazwa: "Internet do 2000Mb/s",
    predkosc: "2000 Mb/s",
    upload: "Upload do 1000 Mb/s",
    wyposazenie: "Router Combo z ONT WiFi 7",
    routerId: "szablon-2",
    cena: 100,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
];

/* ---------------------------------------------------------------------- */
/*  Dane pakietów internetowych — bez zobowiązań                          */
/*  TODO: podmień na realne nazwy / opisy / ceny dla oferty bez umowy     */
/* ---------------------------------------------------------------------- */
const PAKIETY_BEZ: Pakiet[] = [
  {
    id: "bez-150",
    nazwa: "Internet do 150Mb/s",
    predkosc: "150 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "bez-300",
    nazwa: "Internet do 300Mb/s",
    predkosc: "300 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "bez-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 75,
    wyrozniony: true,
  },
  {
    id: "bez-1000",
    nazwa: "Internet do 1000Mb/s",
    predkosc: "1000 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi 6",
    routerId: "szablon-1",
    cena: 90,
  },
];

/* ---------------------------------------------------------------------- */
/*  Dane dodatkowych sekcji ofert                                          */
/*  TODO: podmień na realne nazwy / opisy / ceny                          */
/* ---------------------------------------------------------------------- */
export interface Oferta {
  id: string;
  nazwa: string;
  opis: string;
  cena: number;
}

/** Pakiet TV — jak Oferta, ale z dodatkową liczbą kanałów (chip na karcie) */
interface OfertaTV extends Oferta {
  /** Który tier z lib/channels.ts odpowiada temu pakietowi (do listy kanałów) */
  tier: Tier;
}

const OFERTY_TV: OfertaTV[] = [
  {
    id: "tv-s",
    nazwa: "Pakiet S",
    opis: "Coś na Start",
    cena: 5,
    tier: "s",
  },
  {
    id: "tv-m",
    nazwa: "Pakiet M",
    opis: "Najpopularniejszy",
    cena: 15,
    tier: "m",
  },
  {
    id: "tv-l",
    nazwa: "Pakiet L",
    opis: "Dla Wymagających",
    cena: 45,
    tier: "l",
  },
];

const OFERTY_5G: Oferta5G[] = [
  {
    id: "5g-super",
    nazwa: "SUPER (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 60 GB internetu mobilnego w Polsce.",
    cena: 30,
    gradient: "from-teal-500 to-teal-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "60 GB Internetu mobilnego w Polsce",
      "8,5 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 30 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
  {
    id: "5g-vip",
    nazwa: "VIP (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 100 GB internetu mobilnego w Polsce.",
    cena: 40,
    gradient: "from-pink-500 to-purple-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "100 GB Internetu mobilnego w Polsce",
      "11 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 40 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
  {
    id: "5g-giga",
    nazwa: "GIGA (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 200 GB internetu mobilnego w Polsce.",
    cena: 60,
    gradient: "from-lime-500 to-green-800",
    szczegoly: [
      "Nielimitowane połączenia, SMS-y i MMS-y w kraju",
      "200 GB Internetu mobilnego w Polsce",
      "15 GB Internetu Mobilnego w roamingu EU",
      "6 mc za 0 zł, potem 60 zł",
      "Umowa na 24 miesiące",
      "Aktywacja: 0 zł",
    ],
  },
];

// TODO: nazwa tej sekcji nie została podana — zmień na docelową
interface OfertaDodatek extends Oferta {
  /** Klucz z lib/channels.ts (pole ADDONS[].key) — jeśli podany, kafelek
   *  pokaże dodatkowy przycisk "Zobacz kanały" otwierający listę kanałów. */
  addonKey?: string;
}

const OFERTY_DODATKOWE: OfertaDodatek[] = [
  { id: "multiroom", nazwa: "Multiroom", opis: "Oglądaj telewizję na dodatkowym telewizorze w innym pokoju.", cena: 10 },
  { id: "multiroom-4k", nazwa: "Multiroom 4K", opis: "Dodatkowy dekoder 4K w innym pomieszczeniu.", cena: 15 },
  { id: "giga-nagrywarka-maxi", nazwa: "Giga Nagrywarka Maxi", opis: "Więcej miejsca na nagrania programów w chmurze.", cena: 15 },
  { id: "bezpieczny-internet", nazwa: "Bezpieczny Internet", opis: "Ochrona urządzeń i bezpieczeństwo podczas korzystania z internetu.", cena: 10 },
  { id: "stale-ip", nazwa: "Stałe IP", opis: "Publiczny, niezmienny adres IP do zdalnego dostępu i serwerów.", cena: 10 },
  { id: "hbo", nazwa: "HBO + MAX", opis: "Kanały HBO oraz dostęp do platformy streamingowej Max.", cena: 25, addonKey: "hbo" },
  { id: "canal-plus-select", nazwa: "CANAL+ Select", opis: "Pakiet kanałów sportowych i filmowych Canal+ Select.", cena: 35, addonKey: "canal-plus-select" },
  { id: "canal-plus-prestige", nazwa: "CANAL+ Prestige", opis: "Najszerszy pakiet Canal+ — sport, filmy, seriale i dokumenty.", cena: 50, addonKey: "canal-plus-prestige" },
  { id: "eleven-sports", nazwa: "Eleven Sports", opis: "Kanały sportowe Eleven Sports, w tym transmisje w 4K.", cena: 10, addonKey: "eleven-sports" },
  { id: "filmbox", nazwa: "FilmBox", opis: "Pakiet kanałów filmowych FilmBox+.", cena: 10, addonKey: "filmbox" },
  { id: "cinemax", nazwa: "Cinemax", opis: "Kanały filmowe Cinemax HD i Cinemax 2 HD.", cena: 10, addonKey: "cinemax-hd" },
  { id: "polsat-sport-premium", nazwa: "Polsat Sport Premium", opis: "Pakiet kanałów sportowych Polsat Sport Premium.", cena: 20, addonKey: "polsat-sport-premium" },
  { id: "dorosli", nazwa: "Dla Dorosłych", opis: "Pakiet kanałów dla dorosłych, chroniony kodem PIN.", cena: 10, addonKey: "dorosli" },
  { id: "ukraina", nazwa: "Pakiet Ukraina", opis: "Kanały informacyjne, rozrywkowe i sportowe w języku ukraińskim.", cena: 10, addonKey: "ukraina" },
  { id: "dzieci", nazwa: "Dla Dzieci", opis: "Bajki, programy edukacyjne i kanały dla najmłodszych.", cena: 10, addonKey: "dzieci" },
];

// TODO: osobne oferty 5G / Dodatki dla wariantu bez zobowiązań (jeśli mają się różnić)
const PAKIETY_24_BEZ: Pakiet[] = [
  {
    id: "24-150",
    nazwa: "Internet 150",
    predkosc: "150 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "24-300",
    nazwa: "Internet 300",
    predkosc: "300 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 65,
  },
  {
    id: "24-600",
    nazwa: "Internet 600",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
    routerId: "domyslny",
    cena: 75,
  },
  {
    id: "24-1000",
    nazwa: "Internet 1000",
    predkosc: "1000 Mb/s",
    upload: "Upload do 300 Mb/s",
    wyposazenie: "Router WiFi 6",
    routerId: "domyslny",
    cena: 90,
  },
];

const OFERTY_5G_BEZ: Oferta[] = [
  {
    id: "5g-super",
    nazwa: "SUPER (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 60 GB internetu mobilnego w Polsce.",
    cena: 30,
  },
  {
    id: "5g-vip",
    nazwa: "VIP (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 100 GB internetu mobilnego w Polsce.",
    cena: 40,
  },
  {
    id: "5g-giga",
    nazwa: "GIGA (5G)",
    opis: "Nielimitowane połączenia, SMS-y i MMS-y. 200 GB internetu mobilnego w Polsce.",
    cena: 60,
  },
];

const OFERTY_DODATKOWE_BEZ: Oferta[] = [
  {
    id: "bezpieczny-internet",
    nazwa: "Bezpieczny Internet",
    opis: "Ochrona urządzeń i bezpieczeństwo podczas korzystania z internetu.",
    cena: 10,
  },
  {
    id: "stale-ip",
    nazwa: "Stałe IP",
    opis: "Publiczny, niezmienny adres IP do zdalnego dostępu i serwerów.",
    cena: 10,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------------------------------------------------------------- */
/*  Przełącznik długości umowy                                             */
/* ---------------------------------------------------------------------- */
const PrzelacznikUmowy = memo(function PrzelacznikUmowy({
  umowa,
  setUmowa,
}: {
  umowa: UmowaType;
  setUmowa: (u: UmowaType) => void;
}) {
  const opcje: { id: UmowaType; label: string }[] = [
    { id: "24", label: "24 miesiące" },
    { id: "bez", label: "Bez zobowiązań" },
  ];

  return (
    <div className="inline-flex gap-2 rounded-full border border-white/10 bg-white/5 p-1.5">
      {opcje.map((opcja) => {
        const aktywna = umowa === opcja.id;
        return (
          <button
            key={opcja.id}
            type="button"
            onClick={() => setUmowa(opcja.id)}
            aria-pressed={aktywna}
            className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:text-base"
          >
            {aktywna && (
              <m.span
                layoutId="umowa-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
              />
            )}
            <span
              className={`relative ${
                aktywna ? "text-white" : "text-white/60 hover:text-white/80"
              }`}
            >
              {opcja.label}
            </span>
          </button>
        );
      })}
    </div>
  );
});

/* ---------------------------------------------------------------------- */
/*  Kafelek pakietu internetowego                                          */
/*  FIX (TBT): owinięty w React.memo — w siatce 5 kart re-render jednej    */
/*  karty (np. po jej wybraniu) nie odświeża już pozostałych 4.            */
/* ---------------------------------------------------------------------- */
const KafelekPakietu = memo(function KafelekPakietu({
  pakiet,
  umowa,
  wybrany,
  onWybierz,
  onPokazRouter,
  delay,
}: {
  pakiet: Pakiet;
  umowa: UmowaType;
  wybrany: boolean;
  onWybierz: () => void;
  onPokazRouter: (routerId: string) => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-pressed={wybrany}
      onClick={onWybierz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onWybierz();
        }
      }}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`relative flex h-full flex-col rounded-2xl border p-6 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
        wybrany
          ? "border-teal-300 bg-[#183648] shadow-[0_0_0_3px_rgba(45,212,191,0.15)]"
          : "border-white/10 bg-[#183648]"
      }`}
    >
      {pakiet.wyrozniony && (
        <span className="absolute -top-3 left-6 rounded-full bg-teal-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Najczęściej wybierany
        </span>
      )}

      {/* Nagłówek: prędkość jako duży tytuł + upload jako podpis */}
      <div className="flex items-center gap-2 text-white/50">
        <Wifi size={15} className="text-teal-300" />
        <span className="text-xs">{pakiet.upload}</span>
      </div>
      <h4 className="mt-1.5 text-xl font-extrabold leading-snug text-white">
        Internet do <span className="text-teal-300">{pakiet.predkosc}</span>
      </h4>

      {/* Pigułka promocji */}
      {pakiet.promoBadge && (
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold text-orange-300">
          <Gift size={12} />
          {pakiet.promoBadge}
        </span>
      )}

      {/* Cena */}
      <div className="mt-5 flex items-end gap-1.5">
        <span className="text-3xl font-extrabold text-white">{pakiet.cena} zł</span>
        <span className="mb-1 text-sm text-white/60">z VAT</span>
      </div>
      <span className="mt-0.5 text-xs text-white/45">
        {umowa === "24" ? "Przez 24 mies. z rabatami" : "bez zobowiązań, w każdej chwili możesz zrezygnować"}
      </span>

      {/* Chip sprzętu w cenie — klikalny, otwiera okno ze szczegółami routera */}
      <m.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPokazRouter(pakiet.routerId);
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <Info size={14} className="shrink-0 text-white/50" />
        <span>{pakiet.wyposazenie}</span>
        <span className="text-[11px] font-normal text-white/40">(pokaż router)</span>
      </m.button>

      {/* CTA — zostaje też osobno klikalny, ale karta jako całość już wybiera ofertę */}
      <m.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onWybierz();
        }}
        aria-pressed={wybrany}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
          wybrany
            ? "border-2 border-teal-400 bg-teal-400 text-[#0B2A3D] hover:bg-teal-300"
            : "border-2 border-teal-300/50 bg-teal-300/5 text-teal-200 hover:border-teal-300 hover:bg-teal-300/15"
        }`}
      >
        {wybrany && <Check size={16} />}
        {wybrany ? "Wybrane" : "Wybierz"}
      </m.button>
    </m.div>
  );
});

/* ---------------------------------------------------------------------- */
/*  Kafelek dodatkowej oferty (TV / 5G / dodatkowe)                        */
/* ---------------------------------------------------------------------- */
const KafelekOferty = memo(function KafelekOferty({
  oferta,
  wybrana,
  onWybierz,
  onPokazSzczegoly,
  onPokazKanaly,
  gradient,
  delay,
}: {
  oferta: Oferta;
  wybrana: boolean;
  onWybierz: () => void;
  onPokazSzczegoly?: () => void;
  onPokazKanaly?: () => void;
  gradient?: string;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-pressed={wybrana}
      onClick={onWybierz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onWybierz();
        }
      }}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`flex h-full flex-col rounded-2xl border p-5 text-left transition-colors ${
        wybrana
          ? "border-teal-300 bg-[#183648]"
          : "border-white/10 bg-[#183648]"
      }`}
    >
      <div className="flex flex-1 flex-col text-left">
        <h3 className="text-lg font-extrabold text-white">{oferta.nazwa}</h3>
        <p className="mt-2 text-sm leading-snug text-white/65">{oferta.opis}</p>
        <div className="mt-4 flex items-end gap-1.5">
          <span className="text-2xl font-extrabold text-white">{oferta.cena} zł</span>
          <span className="mb-0.5 text-xs text-white/60">/mies.</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onPokazSzczegoly && (
          <m.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPokazSzczegoly();
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className={`flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${
              gradient ?? "from-teal-600 to-teal-800"
            } px-3 py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90`}
          >
            <Info size={13} />
            Szczegóły
          </m.button>
        )}

        {onPokazKanaly && (
          <m.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPokazKanaly();
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            <LayoutGrid size={13} />
            Zobacz kanały
          </m.button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWybierz();
          }}
          className={`flex flex-1 basis-1/2 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
            wybrana
              ? "border border-teal-400 bg-teal-400 text-[#0B2A3D]"
              : "border border-teal-300/50 bg-teal-300/5 text-teal-200"
          }`}
        >
          {wybrana && <Check size={14} />}
          {wybrana ? "Wybrano" : "Wybierz"}
        </button>
      </div>
    </m.div>
  );
});

/* ---------------------------------------------------------------------- */
/*  Kafelek pakietu TV — badge w rogu, pigułka "Abonament...", chipy       */
/*  (Dekoder 4K / liczba kanałów) i gradientowy przycisk Wybierz.          */
/*  Layout wzorowany na referencyjnym screenie strony telewizji.          */
/* ---------------------------------------------------------------------- */
const KafelekTV = memo(function KafelekTV({
  oferta,
  wybrana,
  onWybierz,
  onPokazDekoder,
  onPokazKanaly,
  delay,
}: {
  oferta: OfertaTV;
  wybrana: boolean;
  onWybierz: () => void;
  onPokazDekoder: () => void;
  onPokazKanaly: (tier: Tier) => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-pressed={wybrana}
      onClick={onWybierz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onWybierz();
        }
      }}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`flex h-full flex-col rounded-2xl border p-5 text-left transition-colors ${
        wybrana
          ? "border-teal-300 bg-[#183648]"
          : "border-white/10 bg-[#183648]"
      }`}
    >
      {/* Nagłówek: nazwa pakietu + badge (np. "Najpopularniejszy") */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-extrabold text-white">{oferta.nazwa}</h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-400/40 bg-purple-400/10 px-2.5 py-1 text-[11px] font-semibold text-purple-200">
          <Sparkles size={11} />
          {oferta.opis}
        </span>
      </div>

      {/* Pigułka abonamentu */}
      <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-semibold text-lime-300">
        <Flame size={12} />
        Abonament 3 mies. 0 zł po rabatach
      </span>

      {/* Cena — dopłata do internetu, stąd prefiks "+" */}
      <div className="mt-4 flex items-end gap-1">
        <span className="text-2xl font-extrabold text-white">+ {oferta.cena}</span>
        <span className="mb-0.5 text-sm font-semibold text-white/70">zł</span>
        <span className="mb-0.5 text-xs text-white/50">z VAT</span>
      </div>

      {/* Chipy — klikalne: Dekoder 4K otwiera szczegóły dekodera,
          liczba kanałów otwiera pełną listę kanałów danego pakietu */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPokazDekoder();
          }}
          className="flex cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white/70 transition-colors hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
        >
          Dekoder 4K
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPokazKanaly(oferta.tier);
          }}
          className="flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          {TIER_CHANNEL_COUNTS[oferta.tier]} kanałów
        </button>
      </div>

      {/* CTA — gradient blue → teal, jak na referencyjnym screenie */}
      <div
        className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
          wybrana
            ? "border border-teal-400 bg-teal-400 text-[#0B2A3D]"
            : "border border-teal-300/50 bg-teal-300/5 text-teal-200"
        }`}
      >
        {wybrana && <Check size={16} />}
        {wybrana ? "Wybrano" : "Wybierz"}
      </div>
    </m.div>
  );
});

/* ---------------------------------------------------------------------- */
/*  Ikona zastępcza dla zdjęcia routera (dopóki brak realnego zdjęcia)     */
/* ---------------------------------------------------------------------- */
const IkonaRoutera = memo(function IkonaRoutera({
  zdjecie,
  model,
}: {
  zdjecie?: string;
  model: string;
}) {
  if (zdjecie) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={zdjecie}
        alt={model}
        width={400}
        height={192}
        loading="lazy"
        decoding="async"
        className="h-40 w-full rounded-xl border border-white/10 bg-white object-contain p-4 sm:h-48"
      />
    );
  }
  return (
    <div className="flex h-40 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-48">
      <Wifi size={48} className="text-teal-300/50" />
    </div>
  );
});

/* ---------------------------------------------------------------------- */
/*  Modal — "Szczegóły dołączonego routera"                                */
/* ---------------------------------------------------------------------- */
function RouterModal({
  routerId,
  onClose,
}: {
  routerId: string | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const router = routerId ? ROUTERY[routerId] : null;

  useEffect(() => {
    if (!router) return;
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
  }, [router]);

  return (
    <AnimatePresence>
      {router && (
        <m.div
          key="router-modal-overlay"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <m.div
            key="router-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={router.model}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 text-left sm:max-h-[88vh]"
            style={{ backgroundColor: "#0B2A3D" }}
          >
            {/* Nagłówek — zawsze widoczny, nazwa routera się nie chowa */}
            <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-2 text-teal-300">
                <Wifi size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Szczegóły dołączonego routera
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {router.model}
              </h3>
              <p className="mt-1 text-sm text-white/60">{router.podtytul}</p>
            </div>

            {/* Środkowa część — jedyny scrollowalny fragment okna */}
            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <IkonaRoutera zdjecie={router.zdjecie} model={router.model} />

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <FileText size={15} className="text-teal-300" />
                  Opis urządzenia
                </h4>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/75">
                  {router.opis.map((akapit, i) => (
                    <p key={i}>{akapit}</p>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <ListChecks size={15} className="text-teal-300" />
                  Specyfikacja techniczna
                </h4>
                <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                  {router.specyfikacja.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-1 gap-1 bg-white/[0.02] px-4 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
                    >
                      <span className="text-xs font-semibold text-teal-300">
                        {spec.label}
                      </span>
                      <span className="text-sm text-white/75">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <Wifi size={15} className="text-teal-300" />
                  Technologia Wi-Fi 5
                </h4>
                <ul className="mt-3 space-y-2">
                  {router.wifi5Cechy.map((cecha, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-teal-300" />
                      {cecha}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <Gauge size={14} className="text-teal-300" />
                  Prędkość Internetu Światłowodowego Netia
                </h4>
                <p className="mt-1.5 text-sm text-white/75">{router.predkosci}</p>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <Wallet size={14} className="text-teal-300" />
                  Koszt routera zawarty w umowie
                </h4>
                <p className="mt-1.5 text-sm text-white/75">{router.kosztInfo}</p>
              </div>

              <a
                href={router.instrukcjaUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-300/20"
              >
                Instrukcja użytkownika {router.model}
                <ChevronRight size={16} />
              </a>
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

/* ---------------------------------------------------------------------- */
/*  Nota prawna — wyświetlana pod wszystkimi kafelkami                     */
/* ---------------------------------------------------------------------- */
function NotaPrawna() {
  return (
    <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-white/40 lg:mt-14">
      <p>
        Znak „+" przy cenie telewizji lub dodatków oznacza, że wskazana kwota
        zostanie doliczona do ceny wybranego Internetu. Łączna miesięczna
        opłata = cena Internetu + cena wybranej opcji (z VAT).
      </p>
      <p>
        Prezentowana oferta dotyczy mieszkań. W przypadku budynków
        jednorodzinnych obowiązuje inna oferta.
      </p>
      <p>
        Prezentowana oferta Netii S.A.: „Wybierz Internet bez zobowiązania
        (CU, PON, HFC, ETTH)" obowiązuje przy zawarciu Umowy na czas
        nieokreślony przy jednoczesnym korzystaniu z rabatów za e-fakturę
        (5 zł) i zgody marketingowe (5 zł). W przypadku rezygnacji lub
        niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł.
        Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w
        wysokości 79 zł za Internet i 2 zł za Telewizję. „Szybki Internet Max
        (300, 600, 1000)" stanowi wyłącznie nazwę marketingową. Usługa
        Internetowa oparta jest na parametrach jakości wynikających z
        maksymalnych parametrów technicznych danej technologii, w jakiej
        świadczona jest Usługa Internetowa, lub wynikających z ofertowych
        ustawień technicznych łącza. Parametry świadczenia Usługi
        Internetowej, w szczególności parametry prędkości oraz wpływu innych
        Usług na Usługę Internetową, dostępne są na stronie netia.pl.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Główny komponent (czyta ?umowa=24 lub ?umowa=bez z URL)                */
/* ---------------------------------------------------------------------- */
function KonfiguratorZawartosc() {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const paramUmowa = searchParams.get("umowa");

  // Wybory (umowa + pakiet + oferty) żyją teraz we wspólnym kontekście, a nie
  // w lokalnym useState — dzięki temu widget PodsumowanieFixed (osadzony np.
  // na innych stronach) widzi tę samą, wyłącznie sesyjną (nigdzie niezapisywaną) daną.
  const {
    umowa,
    pakiet: wybranyPakietObj,
    tv: wybranaTvObj,
    uslugi5g: wybrana5gObj,
    dodatki: wybraneDodatki,
    setUmowa,
    setPakiet,
    setTv,
    setUslugi5g,
    toggleDodatek,
  } = useKonfigurator();

  // Który router pokazać w oknie modalnym (id z ROUTERY, lub null = zamknięte)
  const [aktywnyRouterId, setAktywnyRouterId] = useState<string | null>(null);

  // Który wpis z INFO_ITEMS pokazać w popupie (na razie tylko dekoder)
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);

  // Dla którego tieru (s/m/l) pokazać pełną listę kanałów, lub null = zamknięte
  const [aktywnyKanalyTier, setAktywnyKanalyTier] = useState<Tier | null>(null);

  const [aktywnaOferta5G, setAktywnaOferta5G] = useState<Oferta5G | null>(null);
  const [aktywnyDodatekAddon, setAktywnyDodatekAddon] = useState<string | null>(null);

  // Pakiety i oferty zależne od wybranej umowy
  const pakiety = umowa === "24" ? PAKIETY_24 : PAKIETY_BEZ;
  const oferty5g = umowa === "24" ? OFERTY_5G : OFERTY_5G_BEZ;
  const ofertyDodatkowe = umowa === "24" ? OFERTY_DODATKOWE : OFERTY_DODATKOWE_BEZ;

  // FIX (TBT): lista dodatków zależnych od TV filtrowana raz na zmianę
  // zależności, a nie tworzona od nowa w JSX przy każdym renderze.
  const widoczneDodatki = useMemo(
    () =>
      (ofertyDodatkowe as OfertaDodatek[]).filter(
        (oferta) => !oferta.addonKey || wybranaTvObj !== null
      ),
    [ofertyDodatkowe, wybranaTvObj]
  );

  const togglePakiet = useCallback(
    (pakiet: Pakiet) => {
      setPakiet(
        wybranyPakietObj?.id === pakiet.id
          ? null
          : { id: pakiet.id, nazwa: pakiet.nazwa, cena: pakiet.cena }
      );
    },
    [setPakiet, wybranyPakietObj]
  );

  const toggleTv = useCallback(
    (oferta: Oferta) => {
      setTv(
        wybranaTvObj?.id === oferta.id
          ? null
          : { id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }
      );
    },
    [setTv, wybranaTvObj]
  );

  const toggle5g = useCallback(
    (oferta: Oferta) => {
      setUslugi5g(
        wybrana5gObj?.id === oferta.id
          ? null
          : { id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }
      );
    },
    [setUslugi5g, wybrana5gObj]
  );

  const toggleDodatekHandler = useCallback(
    (oferta: OfertaDodatek) =>
      toggleDodatek({ id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }),
    [toggleDodatek]
  );

  // Zmiana umowy = pełny reset wszystkich zaznaczeń (obsłużone w kontekście)
  const zmienUmowe = useCallback(
    (nowaUmowa: UmowaType) => {
      setUmowa(nowaUmowa);
    },
    [setUmowa]
  );

  // Czy już zdążyliśmy choć raz zareagować na parametr z URL w tej sesji
  // komponentu — zapobiega to resetowi przy zwykłym ponownym wejściu na
  // stronę / przeklikaniu się nawigacją, gdy paramUmowa się nie zmienił
  // względem tego, co user miał wcześniej ustawione (i co jest już wczytane
  // z sessionStorage do kontekstu).
  const poprzedniParamUmowa = useRef<string | null>(null);
  const pierwszyRender = useRef(true);

  useEffect(() => {
    if (paramUmowa !== "bez" && paramUmowa !== "24") {
      pierwszyRender.current = false;
      return;
    }

    // Pierwszy render tego komponentu: jeśli parametr z URL zgadza się
    // z już zapisaną (wczytaną z sessionStorage) umową — NIC nie rób, cały
    // istniejący wybór (pakiet/tv/5g/dodatki) zostaje nietknięty.
    if (pierwszyRender.current) {
      pierwszyRender.current = false;
      poprzedniParamUmowa.current = paramUmowa;
      if (paramUmowa !== umowa) {
        zmienUmowe(paramUmowa);
      }
      return;
    }

    // Kolejne zmiany parametru w trakcie życia komponentu (np. user kliknął
    // link ze zmienionym ?umowa=...) — reaguj tylko na faktyczną ZMIANĘ
    // parametru, nie na samą jego obecność.
    if (paramUmowa !== poprzedniParamUmowa.current) {
      poprzedniParamUmowa.current = paramUmowa;
      if (paramUmowa !== umowa) {
        zmienUmowe(paramUmowa);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramUmowa]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans py-16 sm:py-20 lg:py-24"
        id="konfigurator"
      >
        <div className="relative z-10 mx-auto max-w-320 px-5 sm:px-6 lg:px-8 pt-4 sm:pt-0">
          {/* BANER — h1 + badge + grafika sygnału + przełącznik umowy.
              Bez kropek: ma własną dekorację SVG (koncentryczne kręgi +
              ścieżka sygnału światłowodowego). */}
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto flex max-w-310 flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12 mt-12"
            style={{
              background:
                "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

            {/* Grafika SVG — sygnał routera + ścieżka światłowodowa, motyw sieci */}
            <svg
              className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="150" cy="55" r="5" fill="#2DD4BF" />
              <circle
                cx="150"
                cy="55"
                r="28"
                stroke="#2DD4BF"
                strokeOpacity="0.55"
                strokeWidth="2"
              />
              <circle
                cx="150"
                cy="55"
                r="52"
                stroke="#2DD4BF"
                strokeOpacity="0.32"
                strokeWidth="2"
              />
              <circle
                cx="150"
                cy="55"
                r="76"
                stroke="#99F6E4"
                strokeOpacity="0.18"
                strokeWidth="2"
              />
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
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
            >
              <Flame size={13} className="fill-current" />
              Skonfiguruj pakiet
              <Flame size={13} className="fill-current" />
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Wybierz długość umowy{" "}
              <span className="text-teal-300">i pakiet dla siebie</span>
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative z-10 mt-1 max-w-xl text-sm text-white/65 sm:text-base"
            >
              {umowa === "24"
                ? "Pakiety internetowe z telewizją i usługami dodatkowymi."
                : "Elastyczna oferta bez zobowiązań: internet, usługi mobilne i dodatki."}
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative z-10 mt-5"
            >
              <PrzelacznikUmowy umowa={umowa} setUmowa={zmienUmowe} />
            </m.div>
          </m.div>

          {/* Cały blok wyboru oferty (Internet + TV + 5G + Dodatkowe) dzieli JEDNĄ
              ciągłą strefę kratki w tle, zamiast osobnego prostokąta pod każdą
              siatką — inaczej nagłówki i odstępy między sekcjami wypadały poza
              teksturą i tworzyły widoczne, twarde przerwy między "łatkami". */}
          <div className="relative mt-10 lg:mt-14">
            <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <DottedBackground variant="dots" size={22} />
            </div>

            <div className="relative">
              {/* Nagłówek "Internet" nad siatką pakietów — spójny z sekcjami TV/5G/Dodatki */}
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                <Wifi size={22} className="text-teal-300" />
                Internet
              </h2>

              {/* Siatka 5 pakietów internetowych */}
              <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                {pakiety.map((pakiet, i) => (
                  <KafelekPakietu
                    key={pakiet.id}
                    pakiet={pakiet}
                    umowa={umowa}
                    wybrany={wybranyPakietObj?.id === pakiet.id}
                    onWybierz={() => togglePakiet(pakiet)}
                    onPokazRouter={setAktywnyRouterId}
                    delay={0.1 * i}
                  />
                ))}
              </div>

              {/* Sekcje ofert — dopiero po wybraniu konkretnego pakietu internetowego.
                  FIX (CLS/TBT): poprzednio animowaliśmy `height: "auto"` co zmuszało
                  przeglądarkę do przeliczania layoutu na każdej klatce animacji
                  (koszt Style & Layout + TBT). Teraz blok jest po prostu
                  montowany/odmontowywany (Framer Motion animuje tylko opacity/y,
                  czyli własności kompozytowane przez GPU — bez reflow w locie).
                  Wynikowe przesunięcie layoutu pod spodem następuje w jednej
                  klatce, w reakcji na kliknięcie usera — Web Vitals wyłącza takie
                  shifty z liczonego CLS (input-driven layout shift). */}
              <AnimatePresence initial={false}>
                {wybranyPakietObj !== null && (
                  <m.div
                    key="sekcje-ofert"
                    initial={reduceMotion ? false : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* TV — tylko dla umowy 24 miesiące */}
                    {umowa === "24" && (
                      <div className="mt-12 lg:mt-16">
                        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                          <Tv size={22} className="text-teal-300" />
                          Telewizja
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                          {OFERTY_TV.map((oferta, i) => (
                            <KafelekTV
                              key={oferta.id}
                              oferta={oferta}
                              wybrana={wybranaTvObj?.id === oferta.id}
                              onWybierz={() => toggleTv(oferta)}
                              onPokazDekoder={() => setAktywnyInfoId("dekoder-evobox")}
                              onPokazKanaly={setAktywnyKanalyTier}
                              delay={0.08 * i}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-12 lg:mt-16">
                      <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                        <Smartphone size={22} className="text-teal-300" />
                        Usługi Mobilne 5G
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                        {oferty5g.map((oferta, i) => (
                          <KafelekOferty
                            key={oferta.id}
                            oferta={oferta}
                            wybrana={wybrana5gObj?.id === oferta.id}
                            onWybierz={() => toggle5g(oferta)}
                            onPokazSzczegoly={
                              "gradient" in oferta ? () => setAktywnaOferta5G(oferta as Oferta5G) : undefined
                            }
                            gradient={"gradient" in oferta ? (oferta as Oferta5G).gradient : undefined}
                            delay={0.08 * i}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-12 lg:mt-16">
                      <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                        <Gift size={22} className="text-teal-300" />
                        Usługi Dodatkowe
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                        {widoczneDodatki.map((oferta, i) => (
                          <KafelekOferty
                            key={oferta.id}
                            oferta={oferta}
                            wybrana={wybraneDodatki.some((d) => d.id === oferta.id)}
                            onWybierz={() => toggleDodatekHandler(oferta)}
                            onPokazKanaly={
                              oferta.addonKey ? () => setAktywnyDodatekAddon(oferta.addonKey!) : undefined
                            }
                            delay={0.08 * i}
                          />
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <PodsumowanieFixed />

          {/* Nota prawna — pod wszystkimi kafelkami */}
          <NotaPrawna />
        </div>

        {/* Okno modalne ze szczegółami routera — wspólne dla wszystkich kafelków */}
        <RouterModal
          routerId={aktywnyRouterId}
          onClose={() => setAktywnyRouterId(null)}
        />
        <InfoModal
          infoId={aktywnyInfoId}
          onClose={() => setAktywnyInfoId(null)}
        />
        <KanalyModal
          tier={aktywnyKanalyTier}
          onClose={() => setAktywnyKanalyTier(null)}
        />
        <Uslugi5GModal
          oferta={aktywnaOferta5G}
          onClose={() => setAktywnaOferta5G(null)}
        />
        <AddonKanalyModal
          addonKey={aktywnyDodatekAddon}
          onClose={() => setAktywnyDodatekAddon(null)}
        />
      </section>
    </LazyMotion>
  );
}

/* useSearchParams wymaga granicy Suspense w Next.js App Router */
export default function Konfigurator() {
  return (
    <Suspense fallback={null}>
      <KonfiguratorZawartosc />
    </Suspense>
  );
}