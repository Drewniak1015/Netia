// components/Kanaly/Wyszukiwarka.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Search, X, FileDown } from "lucide-react";
import {
  CHANNELS,
  ADDONS,
  TIER_ORDER,
  TIER_LABELS,
  channelsForAddon,
  channelId,
  type Tier,
  type Channel,
} from "@/lib/channels";
import DottedBackground from "@/components/ui/DottedBackground";

type Props = {
  tier: Tier;
  onTierChange: (tier: Tier) => void;
};

const SELECTABLE_TIERS: Tier[] = ["s", "m", "l"];

// FIX (TBT/Style & Layout): przy pełnej liście (np. ~200 kanałów w
// pakiecie S) montowanie WSZYSTKICH kafelków naraz przy pierwszym
// renderze to spory koszt głównego wątku (każdy kafelek to osobny
// komponent React z własnym stanem, event handlerem, obrazkiem).
// Renderujemy tylko pierwsze BATCH_SIZE wyników, resztę doładowujemy
// na żądanie przyciskiem "Pokaż więcej" — klasyczny, prosty i pewny
// sposób na cięcie initial render cost bez wchodzenia w pełną
// wirtualizację (skomplikowaną przy responsywnej siatce 2/3/4 kolumn).
const BATCH_SIZE = 36;

// Ikona kanału: pokazuje prawdziwe logo (ch.logoUrl), a jeśli go nie ma —
// lub obrazek nie chce się załadować — spada do kolorowego kwadratu z literą.
//
// FIX (waga strony przy ~200 logotypach naraz): next/image zamiast
// surowego <img>. Next.js/Vercel automatycznie:
//  - przycina każdy obrazek do realnie wyświetlanego rozmiaru (40px/32px),
//    zamiast serwować oryginalny plik logotypu w pełnej rozdzielczości,
//  - konwertuje do WebP/AVIF (mniejsze pliki niż PNG/JPG przy tej samej
//    jakości wizualnej),
//  - domyślnie leniwie ładuje obrazki poza viewportem (jak wcześniej
//    loading="lazy", ale lepiej zintegrowane z resztą optymalizacji).
// `quality={60}` — przy tak małych ikonach (32-40px) różnica względem
// domyślnych 75 jest niezauważalna gołym okiem, a dodatkowo tnie wagę.
//
// UWAGA: jeśli ch.logoUrl wskazuje na zewnętrzną domenę (CDN spoza
// Twojej), next/image wymaga dopisania jej do `images.remotePatterns`
// w next.config.js — inaczej dostaniesz błąd w runtime. Jeśli logotypy
// leżą lokalnie w /public, nic dodatkowego nie trzeba konfigurować.
function ChannelIcon({ ch, size }: { ch: Channel; size: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(ch.logoUrl) && !failed;

  return (
    <span
      className="flex items-center justify-center shrink-0 rounded-xl overflow-hidden"
      style={{
        height: size,
        width: size,
        backgroundColor: showImage ? "transparent" : ch.color,
      }}
    >
      {showImage ? (
        <Image
          key={ch.logoUrl}
          src={ch.logoUrl!}
          alt={ch.alt ?? ch.name}
          width={size}
          height={size}
          quality={60}
          onError={() => setFailed(true)}
          className="max-h-full max-w-full w-auto h-auto object-contain"
        />
      ) : (
        <span
          className="text-white font-bold"
          style={{ fontSize: size * 0.35 }}
        >
          {ch.name.charAt(0)}
        </span>
      )}
    </span>
  );
}

export default function Wyszukiwarka({ tier, onTierChange }: Props) {
  const [query, setQuery] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kafelki" | "lista">("kafelki");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // WAŻNE: dla dodatków używamy channelsForAddon() zamiast bezpośredniego
    // filtrowania ADDON_CHANNELS. "canal-plus-select" nie ma własnych wpisów
    // w tablicy - jest wyliczany na bieżąco z "canal-plus-prestige" właśnie
    // przez tę funkcję. Filtrowanie samej tablicy zwróciłoby dla niego pustą listę.
    const source = selectedAddon
      ? channelsForAddon(selectedAddon)
      : CHANNELS.filter((ch) => TIER_ORDER[ch.tier] <= TIER_ORDER[tier]);

    return source
      .filter((ch) => q.length < 3 || ch.name.toLowerCase().includes(q))
      .sort((a, b) => a.number - b.number);
  }, [query, tier, selectedAddon]);

  // Ile wyników aktualnie renderujemy — resetuje się do BATCH_SIZE za
  // każdym razem, gdy zmienia się filtr (nowe wyszukiwanie/pakiet/dodatek),
  // żeby nie zostać z np. 180 wyrenderowanymi kaflami po zawężeniu wyników.
  const [showCount, setShowCount] = useState(BATCH_SIZE);
  useEffect(() => {
    setShowCount(BATCH_SIZE);
  }, [query, tier, selectedAddon]);

  const widoczneWyniki = useMemo(() => results.slice(0, showCount), [results, showCount]);
  const maWiecejWynikow = showCount < results.length;

  const handleDownload = async () => {
    const response = await fetch("/pdf/NETIA_Lista_Kanałów.pdf");
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "netialista-kanalow.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="w-full py-16 px-6 font-sans overflow-hidden scroll-mt-[50px]"
        id="wyszukiwarka"
      >
        <div className="max-w-5xl mx-auto">
          <m.div
            className="flex justify-center mb-5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Wyszukiwarka kanałów
            </span>
          </m.div>

          <m.h2
            className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            Szukaj Kanału
          </m.h2>

          <m.p
            className="text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base text-white/65"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          >
            Filtruj po nazwie kanału albo przełączaj pakiety, żeby zobaczyć, co w nich znajdziesz.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Wpisz minimum 3 znaki..."
                  aria-label="Szukaj kanału po nazwie"
                  className="w-full rounded-full bg-white/10 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-teal-400/60 transition-shadow"
                />
              </div>
              <button
                onClick={() => setQuery("")}
                aria-label="Wyczyść wyszukiwanie"
                className="flex items-center justify-center shrink-0 h-11 w-11 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-white/40 mb-7">Filtruj po nazwie. Możesz też przełączać pakiety.</p>

            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Pakiety główne</p>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {SELECTABLE_TIERS.map((t) => {
                const active = tier === t && !selectedAddon;
                return (
                  <m.button
                    key={t}
                    onClick={() => {
                      setSelectedAddon(null);
                      onTierChange(t);
                    }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? "border-teal-400/60 bg-teal-400/10 text-teal-300"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/[0.08]"
                    }`}
                  >
                    {TIER_LABELS[t]}
                  </m.button>
                );
              })}
            </div>
            <p className="text-xs text-white/40 mb-7">Wybierz jeden z pakietów głównych (S, M, L)</p>

            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Pakiety dodatkowe</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {ADDONS.map((a) => {
                const active = selectedAddon === a.key;
                return (
                  <m.button
                    key={a.key}
                    onClick={() => setSelectedAddon(active ? null : a.key)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "border-teal-400/60 bg-teal-400/10 text-teal-300"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/[0.08]"
                    }`}
                  >
                    {a.label}
                  </m.button>
                );
              })}
            </div>
            <p className="text-xs text-white/40 mb-8">Wybierz jeden z pakietów dodatkowych.</p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${viewMode === "kafelki" ? "text-white" : "text-white/40"}`}>
                  Kafelki
                </span>
                <button
                  onClick={() => setViewMode(viewMode === "kafelki" ? "lista" : "kafelki")}
                  aria-label="Przełącz widok"
                  className="relative w-11 h-6 rounded-full bg-white/15 transition-colors"
                >
                  <m.span
                    className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white"
                    animate={{ x: viewMode === "lista" ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className={`text-sm font-medium ${viewMode === "lista" ? "text-white" : "text-white/40"}`}>
                  Lista
                </span>
              </div>

              <m.button
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <FileDown size={16} />
                Pobierz listę kanałów (PDF)
              </m.button>
            </div>
          </m.div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/50" aria-live="polite">
              Znaleziono <span className="font-semibold text-white">{results.length}</span>{" "}
              {results.length === 1 ? "kanał" : "kanałów"}
            </p>
          </div>

          {/* Wyniki wyszukiwarki — full-bleed kropkowane tło pod spodem.
              Niższe opacity i mniejszy rozstaw niż gdzie indziej, bo kafelki
              kanałów są bardzo małe i gęsto upakowane — subtelniejszy wzór
              lepiej się komponuje i nie tworzy szumu między logotypami. */}
          <div className="relative">
            <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <DottedBackground variant="dots" size={20} opacity={0.08} />
            </div>

            <div className="relative">
              {/*
                FIX (TBT / Style & Layout): usunięty prop `layout` z kafelków
                i wierszy listy. `layout` w framer-motion włącza FLIP —
                przy KAŻDEJ zmianie wyników (czyli przy każdym wpisanym
                znaku w wyszukiwarce) biblioteka mierzy getBoundingClientRect
                dla WSZYSTKICH renderowanych elementów, żeby policzyć skąd
                dokąd mają się "przesunąć". Przy dziesiątkach/setkach
                kanałów naraz to jest bardzo drogie — stąd wysoki koszt
                Style & Layout w profilu wydajności. Zostaje proste
                opacity+scale "wjazd" nowych kafelków (tanie, kompozytowane),
                bez przeliczania pozycji istniejących.
              */}
              <AnimatePresence mode="wait">
                {viewMode === "kafelki" ? (
                  <m.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                  >
                    {/*
                      FIX (TBT — dalsze cięcie): kafelki NIE są już
                      m.div/framer-motion. Cały kontener siatki i tak
                      fejduje się jako jedna całość (patrz initial/animate
                      wyżej), więc każdy pojedynczy kafelek nie musi
                      dodatkowo sam zarządzać swoją animacją wejścia —
                      to był zbędny narzut frameworka (MotionValues,
                      subskrypcje) na 36+ elementach naraz. Hover to teraz
                      czysty CSS (transition-transform), zero JS.

                      `content-visibility: auto` + `contain-intrinsic-size`
                      to natywna optymalizacja przeglądarki: kafelki poza
                      viewportem w ogóle NIE są liczone do Style & Layout,
                      dopóki się nie zbliżą do ekranu przy scrollu — działa
                      jak "wirtualizacja" bez pisania własnej logiki
                      wirtualizacji. `contain-intrinsic-size` to przybliżona
                      wysokość kafelka, żeby przeglądarka zarezerwowała
                      miejsce i scrollbar się nie "trząsł".
                    */}
                    {widoczneWyniki.map((ch) => (
                      <div
                        key={channelId(ch)}
                        style={{ contentVisibility: "auto", containIntrinsicSize: "0 72px" }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 flex items-center gap-3 transition-[background-color,transform] duration-200 hover:-translate-y-[3px] hover:bg-white/[0.08]"
                      >
                        <ChannelIcon ch={ch} size={40} />
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{ch.name}</p>
                          <p className="text-xs text-white/40">Kanał {ch.number}</p>
                        </div>
                      </div>
                    ))}
                  </m.div>
                ) : (
                  <m.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    {widoczneWyniki.map((ch, i) => (
                      <div
                        key={channelId(ch)}
                        style={{ contentVisibility: "auto", containIntrinsicSize: "0 52px" }}
                        className={`flex items-center gap-4 px-5 py-3 ${i !== 0 ? "border-t border-white/5" : ""}`}
                      >
                        <span className="text-xs font-semibold text-white/40 w-8 shrink-0">{ch.number}</span>
                        <ChannelIcon ch={ch} size={32} />
                        <span className="font-medium text-white text-sm">{ch.name}</span>
                      </div>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>

              {maWiecejWynikow && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowCount((c) => c + BATCH_SIZE)}
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Pokaż więcej ({results.length - showCount} pozostało)
                  </button>
                </div>
              )}

              {results.length === 0 && (
                <div className="text-center py-16 text-white/40 text-sm">
                  Brak kanałów pasujących do wybranych filtrów.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}