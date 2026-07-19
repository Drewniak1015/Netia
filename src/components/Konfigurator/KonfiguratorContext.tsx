"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  UmowaType,
  WybranaPozycja,
  KonfiguratorState,
} from "./types";

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

export const DODATKI_WYMAGAJACE_TV = new Set([
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

  useEffect(() => {
    setState(wczytajZeSessionStorage());
    setWczytanoZStorage(true);
  }, []);

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
