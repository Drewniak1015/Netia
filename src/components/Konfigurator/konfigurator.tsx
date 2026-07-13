"use client";

import { Suspense, createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Check,
  Wifi,
  Tv,
  Smartphone,
  Gift,
  Flame,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Wspólny stan wybranej oferty (umowa / pakiet / TV / 5G / dodatki)      */
/*  Trzymany WYŁĄCZNIE w pamięci (bez localStorage/cookies/requestów) —   */
/*  dzięki temu <PodsumowanieFixed /> może być osadzony na innych         */
/*  stronach i widzieć ten sam, sesyjny wybór. Owiń tym providerem root   */
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
  dodatki: WybranaPozycja | null;
}

interface KonfiguratorContextValue extends KonfiguratorState {
  setUmowa: (umowa: UmowaType) => void;
  setPakiet: (pakiet: WybranaPozycja | null) => void;
  setTv: (tv: WybranaPozycja | null) => void;
  setUslugi5g: (uslugi5g: WybranaPozycja | null) => void;
  setDodatki: (dodatki: WybranaPozycja | null) => void;
  suma: number;
  maWybor: boolean;
}

const initialState: KonfiguratorState = {
  umowa: "24",
  pakiet: null,
  tv: null,
  uslugi5g: null,
  dodatki: null,
};

const KonfiguratorContext = createContext<KonfiguratorContextValue | undefined>(
  undefined
);

/** Owiń tym całą aplikację (np. w app/layout.tsx), żeby <PodsumowanieFixed />
 *  na innych stronach widział wybór zrobiony w konfiguratorze. */
export function KonfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KonfiguratorState>(initialState);

  const setUmowa = (umowa: UmowaType) =>
    // Zmiana umowy = reset wszystkich wyborów
    setState({ ...initialState, umowa });

  const setPakiet = (pakiet: WybranaPozycja | null) =>
    setState((prev) => ({ ...prev, pakiet }));
  const setTv = (tv: WybranaPozycja | null) =>
    setState((prev) => ({ ...prev, tv }));
  const setUslugi5g = (uslugi5g: WybranaPozycja | null) =>
    setState((prev) => ({ ...prev, uslugi5g }));
  const setDodatki = (dodatki: WybranaPozycja | null) =>
    setState((prev) => ({ ...prev, dodatki }));

  const suma =
    (state.pakiet?.cena ?? 0) +
    (state.tv?.cena ?? 0) +
    (state.uslugi5g?.cena ?? 0) +
    (state.dodatki?.cena ?? 0);

  const maWybor = state.pakiet !== null;

  const value = useMemo<KonfiguratorContextValue>(
    () => ({ ...state, setUmowa, setPakiet, setTv, setUslugi5g, setDodatki, suma, maWybor }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
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
/*  Dane pakietów internetowych — umowa 24 mies.                           */
/* ---------------------------------------------------------------------- */
interface Pakiet {
  id: string;
  nazwa: string;
  predkosc: string;
  upload: string;
  wyposazenie: string;
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
    cena: 55,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-300",
    nazwa: "Internet do 300Mb/s",
    predkosc: "300 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    cena: 55,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
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
    cena: 80,
    promoBadge: "Abonament 3 mies. 0 zł po rabatach",
  },
  {
    id: "24-2000",
    nazwa: "Internet do 2000Mb/s",
    predkosc: "2000 Mb/s",
    upload: "Upload do 1000 Mb/s",
    wyposazenie: "Router Combo z ONT WiFi 7",
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
    cena: 65,
  },
  {
    id: "bez-300",
    nazwa: "Internet do 300Mb/s",
    predkosc: "300 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    cena: 65,
  },
  {
    id: "bez-600",
    nazwa: "Internet do 600Mb/s",
    predkosc: "600 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi",
    cena: 75,
    wyrozniony: true,
  },
  {
    id: "bez-1000",
    nazwa: "Internet do 1000Mb/s",
    predkosc: "1000 Mb/s",
    upload: "Zgodnie z cennikiem",
    wyposazenie: "Router WiFi 6",
    cena: 90,
  },
];

/* ---------------------------------------------------------------------- */
/*  Dane dodatkowych sekcji ofert                                          */
/*  TODO: podmień na realne nazwy / opisy / ceny                          */
/* ---------------------------------------------------------------------- */
interface Oferta {
  id: string;
  nazwa: string;
  opis: string;
  cena: number;
}

const OFERTY_TV: Oferta[] = [
  {
    id: "tv-s",
    nazwa: "Pakiet S",
    opis: "Coś na Start",
    cena: 5,
  },
  {
    id: "tv-m",
    nazwa: "Pakiet M",
    opis: "Najpopularniejszy",
    cena: 15,
  },
  {
    id: "tv-l",
    nazwa: "Pakiet L",
    opis: "Dla Wymagających",
    cena: 45,
  },
];

const OFERTY_5G: Oferta[] = [
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

// TODO: nazwa tej sekcji nie została podana — zmień na docelową
const OFERTY_DODATKOWE: Oferta[] = [
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

// TODO: osobne oferty 5G / Dodatki dla wariantu bez zobowiązań (jeśli mają się różnić)
const PAKIETY_24_BEZ: Pakiet[] = [
  {
    id: "24-150",
    nazwa: "Internet 150",
    predkosc: "150 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    cena: 65,
  },
  {
    id: "24-300",
    nazwa: "Internet 300",
    predkosc: "300 Mb/s",
    upload: "Upload do 50 Mb/s",
    wyposazenie: "Router WiFi",
    cena: 65,
  },
  {
    id: "24-600",
    nazwa: "Internet 600",
    predkosc: "600 Mb/s",
    upload: "Upload do 100 Mb/s",
    wyposazenie: "Router WiFi",
    cena: 75,
  },
  {
    id: "24-1000",
    nazwa: "Internet 1000",
    predkosc: "1000 Mb/s",
    upload: "Upload do 300 Mb/s",
    wyposazenie: "Router WiFi 6",
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
function PrzelacznikUmowy({
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
}

/* ---------------------------------------------------------------------- */
/*  Kafelek pakietu internetowego                                          */
/* ---------------------------------------------------------------------- */
function KafelekPakietu({
  pakiet,
  umowa,
  wybrany,
  onWybierz,
  delay,
}: {
  pakiet: Pakiet;
  umowa: UmowaType;
  wybrany: boolean;
  onWybierz: () => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.button
      type="button"
      onClick={onWybierz}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`relative flex h-full flex-col rounded-2xl border p-6 text-left transition-colors ${
        wybrany
          ? "border-teal-300 bg-white/[0.04] shadow-[0_0_0_3px_rgba(45,212,191,0.15)]"
          : "border-white/10 bg-transparent hover:bg-white/[0.03]"
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

      {/* Chip sprzętu w cenie */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-white/70">
        {pakiet.wyposazenie}
      </div>

      {/* CTA */}
      <div
        className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
          wybrany
            ? "border border-teal-300 bg-teal-300/10 text-teal-200"
            : "border border-white/15 bg-transparent text-white/80"
        }`}
      >
        {wybrany && <Check size={16} />}
        {wybrany ? "Wybrane" : "Wybierz"}
      </div>
    </m.button>
  );
}

/* ---------------------------------------------------------------------- */
/*  Kafelek dodatkowej oferty (TV / 5G / dodatkowe)                        */
/* ---------------------------------------------------------------------- */
function KafelekOferty({
  oferta,
  wybrana,
  onWybierz,
  delay,
}: {
  oferta: Oferta;
  wybrana: boolean;
  onWybierz: () => void;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.button
      type="button"
      onClick={onWybierz}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={`flex h-full flex-col rounded-2xl border p-5 text-left transition-colors ${
        wybrana
          ? "border-teal-300 bg-white/[0.04]"
          : "border-white/10 bg-transparent hover:bg-white/[0.03]"
      }`}
    >
      <h3 className="text-lg font-extrabold text-white">{oferta.nazwa}</h3>
      <p className="mt-2 text-sm leading-snug text-white/65">{oferta.opis}</p>

      <div className="mt-4 flex items-end gap-1.5">
        <span className="text-2xl font-extrabold text-white">{oferta.cena} zł</span>
        <span className="mb-0.5 text-xs text-white/60">/mies.</span>
      </div>

      <div
        className={`mt-4 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
          wybrana
            ? "border border-teal-300 bg-teal-300/10 text-teal-200"
            : "border border-white/15 text-white/80"
        }`}
      >
        <span className="flex items-center gap-2">
          {wybrana && <Check size={14} />}
          {wybrana ? "Wybrano" : "Wybierz"}
        </span>
        <ChevronRight size={14} />
      </div>
    </m.button>
  );
}

/* ---------------------------------------------------------------------- */
/*  Sekcja z nagłówkiem i siatką ofert (jedna opcja na raz w rzędzie)      */
/* ---------------------------------------------------------------------- */
function SekcjaOfert({
  tytul,
  ikona,
  oferty,
  wybrana,
  onToggle,
}: {
  tytul: string;
  ikona: React.ReactNode;
  oferty: Oferta[];
  wybrana: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-12 lg:mt-16">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
        {ikona}
        {tytul}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
        {oferty.map((oferta, i) => (
          <KafelekOferty
            key={oferta.id}
            oferta={oferta}
            wybrana={wybrana === oferta.id}
            onWybierz={() => onToggle(oferta.id)}
            delay={0.08 * i}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Nota prawna — wyświetlana pod wszystkimi kafelkami                     */
/* ---------------------------------------------------------------------- */
function NotaPrawna() {
  return (
    <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-white/40 lg:mt-14">
      <p>
        Znak „+” przy cenie telewizji lub dodatków oznacza, że wskazana kwota
        zostanie doliczona do ceny wybranego Internetu. Łączna miesięczna
        opłata = cena Internetu + cena wybranej opcji (z VAT).
      </p>
      <p>
        Prezentowana oferta dotyczy mieszkań. W przypadku budynków
        jednorodzinnych obowiązuje inna oferta.
      </p>
      <p>
        Prezentowana oferta Netii S.A.: „Wybierz Internet bez zobowiązania
        (CU, PON, HFC, ETTH)” obowiązuje przy zawarciu Umowy na czas
        nieokreślony przy jednoczesnym korzystaniu z rabatów za e-fakturę
        (5 zł) i zgody marketingowe (5 zł). W przypadku rezygnacji lub
        niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł.
        Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w
        wysokości 79 zł za Internet i 2 zł za Telewizję. „Szybki Internet Max
        (300, 600, 1000)” stanowi wyłącznie nazwę marketingową. Usługa
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
    dodatki: wybranaDodatkiObj,
    setUmowa,
    setPakiet,
    setTv,
    setUslugi5g,
    setDodatki,
  } = useKonfigurator();

  // Czy animacja rozwinięcia sekcji ofert się zakończyła — dopóki trwa animacja
  // wysokości, overflow musi być "hidden", po jej zakończeniu przełączamy na
  // "visible", żeby hover (scale) na kafelkach nie był przycinany
  const [ofertyRozwiniete, setOfertyRozwiniete] = useState(false);

  // Pakiety i oferty zależne od wybranej umowy
  const pakiety = umowa === "24" ? PAKIETY_24 : PAKIETY_BEZ;
  const oferty5g = umowa === "24" ? OFERTY_5G : OFERTY_5G_BEZ;
  const ofertyDodatkowe = umowa === "24" ? OFERTY_DODATKOWE : OFERTY_DODATKOWE_BEZ;

  const togglePakiet = (pakiet: Pakiet) => {
    setPakiet(
      wybranyPakietObj?.id === pakiet.id
        ? null
        : { id: pakiet.id, nazwa: pakiet.nazwa, cena: pakiet.cena }
    );
  };

  const toggleOferta =
    (
      setter: (v: { id: string; nazwa: string; cena: number } | null) => void,
      aktualna: { id: string; nazwa: string; cena: number } | null
    ) =>
    (oferta: Oferta) => {
      setter(
        aktualna?.id === oferta.id
          ? null
          : { id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }
      );
    };

  const toggleTv = toggleOferta(setTv, wybranaTvObj);
  const toggle5g = toggleOferta(setUslugi5g, wybrana5gObj);
  const toggleDodatki = toggleOferta(setDodatki, wybranaDodatkiObj);

  // Zmiana umowy = pełny reset wszystkich zaznaczeń (obsłużone w kontekście)
  const zmienUmowe = (nowaUmowa: UmowaType) => {
    setUmowa(nowaUmowa);
  };

  useEffect(() => {
    if (paramUmowa === "bez" || paramUmowa === "24") {
      zmienUmowe(paramUmowa);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramUmowa]);

  // Gdy pakiet zostaje odznaczony (sekcja zaczyna się zwijać) — od razu
  // wracamy do overflow-hidden, żeby zawartość ładnie się schowała
  useEffect(() => {
    if (wybranyPakietObj === null) {
      setOfertyRozwiniete(false);
    }
  }, [wybranyPakietObj]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans py-16 sm:py-20 lg:py-24"
        id="konfigurator"
      >
        <div className="relative z-10 mx-auto max-w-320 px-5 sm:px-6 lg:px-8">
          {/* BANER — h1 + badge + grafika sygnału + przełącznik umowy */}
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

          {/* Nagłówek "Internet" nad siatką pakietów — spójny z sekcjami TV/5G/Dodatki */}
          <div className="mt-10 lg:mt-14">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
              <Wifi size={22} className="text-teal-300" />
              Internet
            </h2>

            {/* Siatka 3 pakietów internetowych — zależna od wybranej umowy */}
            <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
              {pakiety.map((pakiet, i) => (
                <KafelekPakietu
                  key={pakiet.id}
                  pakiet={pakiet}
                  umowa={umowa}
                  wybrany={wybranyPakietObj?.id === pakiet.id}
                  onWybierz={() => togglePakiet(pakiet)}
                  delay={0.1 * i}
                />
              ))}
            </div>
          </div>

          {/* Sekcje ofert — dopiero po wybraniu konkretnego pakietu internetowego */}
          <AnimatePresence>
            {wybranyPakietObj !== null && (
              <m.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onAnimationComplete={() => setOfertyRozwiniete(true)}
                className={ofertyRozwiniete ? "overflow-visible" : "overflow-hidden"}
              >
                {/* TV — tylko dla umowy 24 miesiące */}
                {umowa === "24" && (
                  <SekcjaOfert
                    tytul="Telewizja"
                    ikona={<Tv size={22} className="text-teal-300" />}
                    oferty={OFERTY_TV}
                    wybrana={wybranaTvObj?.id ?? null}
                    onToggle={(id) => {
                      const oferta = OFERTY_TV.find((o) => o.id === id);
                      if (oferta) toggleTv(oferta);
                    }}
                  />
                )}
                <SekcjaOfert
                  tytul="Usługi Mobilne 5G"
                  ikona={<Smartphone size={22} className="text-teal-300" />}
                  oferty={oferty5g}
                  wybrana={wybrana5gObj?.id ?? null}
                  onToggle={(id) => {
                    const oferta = oferty5g.find((o) => o.id === id);
                    if (oferta) toggle5g(oferta);
                  }}
                />
                <SekcjaOfert
                  tytul="Usługi Dodatkowe"
                  ikona={<Gift size={22} className="text-teal-300" />}
                  oferty={ofertyDodatkowe}
                  wybrana={wybranaDodatkiObj?.id ?? null}
                  onToggle={(id) => {
                    const oferta = ofertyDodatkowe.find((o) => o.id === id);
                    if (oferta) toggleDodatki(oferta);
                  }}
                />
              </m.div>
            )}
          </AnimatePresence>

          {/* CTA — spójne z Hero */}
          <m.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-14"
          >
            <m.a
              href="tel:+48883334124"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex w-full items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:w-auto sm:min-w-60"
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
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:w-auto sm:min-w-60"
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
          </m.div>

          {/* Nota prawna — pod wszystkimi kafelkami */}
          <NotaPrawna />
        </div>
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