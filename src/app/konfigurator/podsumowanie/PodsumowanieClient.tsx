"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, MessageCircle, Pencil, Wifi, Tv, Smartphone, Gift, ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { useKonfigurator } from "@/components/Konfigurator/konfigurator";

// Subtelne kropkowane tło całej strony — ten sam wzorzec co na stronach
// Pomocy (Awaria/Internet/TV/Mobilne).
const dottedPageStyle = {
  backgroundColor: "#0B2A3D",
  backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
} as const;

/* ======================================================================
   OPTYMALIZACJA WYDAJNOŚCI (Lighthouse 66 -> cel: znacznie wyżej)
   ====================================================================== */
// Ta strona to checkout — ludzie tu przychodzą, żeby SZYBKO dokończyć
// zamówienie, a nie oglądać animacje wejścia. Poprzednia wersja owijała
// KAŻDY element (nagłówek, opis, plakietkę, każdą pozycję, CTA) w
// framer-motion z `layout` + stagger reveal + AnimatePresence. To
// oznaczało:
//   1. Cały bundle framer-motion (nawet z domAnimation) musi się pobrać,
//      sparsować i wykonać zanim strona stanie się w pełni interaktywna
//      -> bezpośrednio podbija Total Blocking Time (TBT), jeden z
//      najcięższych czynników w Lighthouse Performance.
//   2. Animacje `layout` wymuszają dodatkowe przeliczenia geometrii przy
//      KAŻDYM renderze (nawet tam, gdzie nic nie zmienia rozmiaru) -> co
//      podbija Total Blocking Time i czasem CLS.
//   3. Stagger na starcie (kontener/wiersz) opóźnia moment, w którym
//      treść wygląda na "gotową".
//
// Rozwiązanie: usunięcie framer-motion z tej strony całkowicie.
//   - Wejście elementów: zwykłe CSS keyframes (`@keyframes podsumowanie-in`)
//     z opóźnieniami przez inline `animationDelay` — brak JS w ogóle.
//   - Usuwanie pozycji (X): zamiast AnimatePresence + layout, prosta
//     tranzycja CSS (opacity + max-height) sterowana lokalnym stanem
//     "znika" przed faktycznym wywołaniem onUsun (setTimeout na czas
//     trwania animacji).
//   - Hover/tap na przyciskach: czyste klasy Tailwind (hover:scale-*,
//     active:scale-*), zero JS.
//   - Podświetlenie sumy przy zmianie: CSS animation retriggerowana przez
//     `key` (ten sam trik co poprzednio, ale bez frameworka animacji).
//
// Efekt: ta trasa nie importuje już w ogóle framer-motion, więc jej JS
// bundle jest dużo mniejszy, a strona jest interaktywna szybciej.

export default function PodsumowaniePage() {
  const { pakiet, tv, uslugi5g, dodatki, suma, maWybor, setTv, setUslugi5g, toggleDodatek } =
    useKonfigurator();

  if (!maWybor) {
    return (
      <section
        style={dottedPageStyle}
        className="min-h-[60vh] py-24 text-center font-sans"
      >
        <p className="text-white/70">Nie masz jeszcze skonfigurowanej oferty.</p>
        <Link
          href="/konfigurator"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] hover:bg-teal-400"
        >
          <ArrowLeft size={16} />
          Przejdź do konfiguratora
        </Link>
      </section>
    );
  }

  const pozycje = [
    { etykieta: "Internet", ikona: <Wifi size={16} className="text-teal-300" />, dana: pakiet, onUsun: null as (() => void) | null, promoKolor: "orange" as const },
    { etykieta: "Telewizja", ikona: <Tv size={16} className="text-teal-300" />, dana: tv, onUsun: () => setTv(null), promoKolor: "lime" as const },
    { etykieta: "Usługi 5G", ikona: <Smartphone size={16} className="text-teal-300" />, dana: uslugi5g, onUsun: () => setUslugi5g(null), promoKolor: null },
  ].filter((p) => p.dana !== null);

  const promoKlasy: Record<"orange" | "lime", string> = {
    orange: "border border-orange-400/30 bg-orange-400/10 text-orange-300",
    lime: "border border-lime-400/30 bg-lime-400/10 text-lime-300",
  };

  const opisKonfiguracji = [
    pakiet && `Internet: ${pakiet.nazwa} (${pakiet.cena} zł)`,
    tv && `TV: ${tv.nazwa} (+${tv.cena} zł)`,
    uslugi5g && `5G: ${uslugi5g.nazwa} (+${uslugi5g.cena} zł)`,
    ...dodatki.map((d) => `Dodatek: ${d.nazwa} (+${d.cena} zł)`),
  ]
    .filter(Boolean)
    .join(", ");

  const smsBody = encodeURIComponent(
    `Dzwonię ws. skonfigurowanej oferty: ${opisKonfiguracji}. Łącznie: ${suma} zł/mies. (pierwsze 3 miesiące gratis na internet${tv ? " i TV" : ""}) + 79 zł aktywacji internetu${tv ? " i 2 zł aktywacji telewizji" : ""} jednorazowo.`
  );

  return (
    <section style={dottedPageStyle} className="min-h-screen py-16 font-sans sm:py-20">
      <style>{`
        @keyframes podsumowanie-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-in {
          opacity: 0;
          animation: podsumowanie-in 0.35s ease-out forwards;
        }
        @keyframes podsumowanie-sum-highlight {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-sum {
          animation: podsumowanie-sum-highlight 0.25s ease-out;
        }
        .ps-remove-item {
          transition: opacity 0.25s ease-out, max-height 0.25s ease-out, margin 0.25s ease-out, padding 0.25s ease-out;
          overflow: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-in { animation: none; opacity: 1; }
          .ps-sum { animation: none; }
          .ps-remove-item { transition: none; }
        }
      `}</style>

      <div className="mx-auto max-w-2xl px-5 sm:px-6 mt-15">
        <div className="ps-in">
          <Link
            href="/konfigurator"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={15} />
            Wróć i edytuj
          </Link>
        </div>

        <h1 className="ps-in mt-4 text-3xl font-extrabold text-white sm:text-4xl" style={{ animationDelay: "40ms" }}>
          Twoje podsumowanie
        </h1>
        <p className="ps-in mt-2 text-sm text-white/60" style={{ animationDelay: "80ms" }}>
          Sprawdź szczegóły wybranej oferty przed kontaktem z konsultantem.
        </p>

        {/* Plakietka promocyjna — 3 miesiące gratis */}
        <div
          className="ps-in mt-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300"
          style={{ animationDelay: "120ms" }}
        >
          <Sparkles size={14} />
          Promocja: 3 miesiące gratis na internet{tv ? " i telewizję" : ""}
        </div>

        {/* Rozbicie na pozycje */}
        <div className="ps-in mt-8 overflow-hidden rounded-2xl border border-white/10" style={{ animationDelay: "160ms" }}>
          {pozycje.map((pozycja) => (
            <PozycjaRow
              key={pozycja.etykieta}
              etykieta={pozycja.etykieta}
              ikona={pozycja.ikona}
              nazwa={pozycja.dana?.nazwa}
              cena={pozycja.dana?.cena}
              onUsun={pozycja.onUsun}
              promoKlasa={pozycja.promoKolor ? promoKlasy[pozycja.promoKolor] : null}
            />
          ))}

          {dodatki.length > 0 && (
            <div className="border-b border-white/10 px-5 py-4 last:border-none">
              <div className="flex items-center gap-3">
                <Gift size={16} className="text-teal-300" />
                <p className="text-sm font-semibold text-white">Usługi dodatkowe</p>
              </div>
              <div className="mt-2 space-y-1.5 pl-7">
                {dodatki.map((d) => (
                  <DodatekRow key={d.id} nazwa={d.nazwa} cena={d.cena} onUsun={() => toggleDodatek(d)} />
                ))}
              </div>
            </div>
          )}

          {/* Stała pozycja — jednorazowa opłata aktywacyjna internetu */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 last:border-none sm:grid sm:grid-cols-[11rem_1fr_6.5rem] sm:items-center sm:gap-3 sm:px-5 md:grid-cols-[13rem_1fr_6.5rem]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Aktywacja</p>
                <p className="text-xs text-white/50">Opłata jednorazowa, na pierwszej fakturze</p>
              </div>
            </div>
            <div className="hidden sm:block" />
            <div className="flex items-center justify-end gap-3">
              <span className="text-sm font-bold text-white">79 zł</span>
              <div className="hidden h-7 w-7 shrink-0 sm:block" aria-hidden="true" />
            </div>
          </div>

          {/* Aktywacja telewizji — tylko gdy TV jest w konfiguracji */}
          {tv && (
            <div className="border-b border-white/10 px-4 py-4 last:border-none sm:grid sm:grid-cols-[11rem_1fr_6.5rem] sm:items-center sm:gap-3 sm:px-5 md:grid-cols-[13rem_1fr_6.5rem]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Aktywacja telewizji</p>
                  <p className="text-xs text-white/50">Opłata jednorazowa, na pierwszej fakturze</p>
                </div>
              </div>
              <div className="hidden sm:block" />
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm font-bold text-white">2 zł</span>
                <div className="hidden h-7 w-7 shrink-0 sm:block" aria-hidden="true" />
              </div>
            </div>
          )}

          <div className="bg-teal-400/10 px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Razem miesięcznie</span>
              <span key={suma} className="ps-sum text-2xl font-extrabold text-teal-300">
                {suma} zł/mies.
              </span>
            </div>
            <p className="mt-1 text-xs text-white/45">
              + jednorazowa aktywacja 79 zł{tv ? " (internet) + 2 zł (telewizja)" : ""} na pierwszej fakturze
            </p>
          </div>
        </div>

        {/* Zaufanie / co dalej */}
        <div className="ps-in mt-6 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4" style={{ animationDelay: "200ms" }}>
          {[
            `Pierwsze 3 miesiące ${tv ? "internetu i telewizji" : "internetu"} bez opłat`,
            "Router w cenie, montaż przez technika",
            "Bez ukrytych opłat — cena zgodna z powyższym rozbiciem",
            "Umowa i warunki potwierdzone podczas rozmowy z konsultantem",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 text-xs text-white/70">
              <Check size={14} className="mt-0.5 shrink-0 text-teal-300" />
              {t}
            </div>
          ))}
        </div>

        {/* CTA finalne */}
        <div className="ps-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
          <a
            href="tel:+48883334124"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-4 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] hover:bg-teal-400"
          >
            <Phone size={17} />
            Zadzwoń i dokończ zamówienie
          </a>
          <a
            href={`sms:+48883334124?body=${smsBody}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] hover:bg-white/10"
          >
            <MessageCircle size={17} />
            Wyślij SMS z podsumowaniem
          </a>
        </div>

        <div className="ps-in" style={{ animationDelay: "280ms" }}>
          <Link
            href="/konfigurator"
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <Pencil size={12} />
            Zmień wybór
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ======================================================================
   Wiersz pozycji (Internet / Telewizja / 5G) z opcjonalnym usuwaniem.
   Usuwanie: zamiast framer-motion AnimatePresence + layout, prosta
   dwuetapowa animacja CSS — ustawiamy stan "znika", odczekujemy czas
   trwania tranzycji (250ms), dopiero wtedy wywołujemy realny onUsun,
   który usuwa element z danych rodzica.
   ====================================================================== */

function PozycjaRow({
  etykieta,
  ikona,
  nazwa,
  cena,
  onUsun,
  promoKlasa,
}: {
  etykieta: string;
  ikona: React.ReactNode;
  nazwa?: string;
  cena?: number;
  onUsun: (() => void) | null;
  promoKlasa: string | null;
}) {
  const [znika, setZnika] = useState(false);

  function handleUsun() {
    if (!onUsun) return;
    setZnika(true);
    window.setTimeout(onUsun, 250);
  }

  return (
    <div
      className={`ps-remove-item grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-b border-white/10 px-4 py-4 last:border-none [grid-template-areas:'name_price'_'badge_badge'] sm:grid-cols-[11rem_1fr_6.5rem] sm:items-center sm:gap-3 sm:px-5 sm:[grid-template-areas:'name_badge_price'] md:grid-cols-[13rem_1fr_6.5rem] ${
        znika ? "max-h-0 opacity-0 !py-0 !border-none" : "max-h-40 opacity-100"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3 [grid-area:name]">
        {ikona}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{etykieta}</p>
          <p className="truncate text-xs text-white/50">{nazwa}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 [grid-area:price]">
        <span className="text-sm font-bold text-white">{cena} zł</span>
        {onUsun ? (
          <button
            type="button"
            onClick={handleUsun}
            aria-label={`Usuń: ${etykieta}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/30 transition-all duration-150 hover:scale-110 hover:bg-white/10 hover:text-white/70 active:scale-90"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="h-11 w-11 shrink-0" aria-hidden="true" />
        )}
      </div>

      {promoKlasa && (
        <div className="flex justify-start [grid-area:badge] sm:justify-center">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${promoKlasa}`}>
            <Gift size={13} />
            3 mies. gratis
          </span>
        </div>
      )}
    </div>
  );
}

function DodatekRow({ nazwa, cena, onUsun }: { nazwa: string; cena: number; onUsun: () => void }) {
  const [znika, setZnika] = useState(false);

  function handleUsun() {
    setZnika(true);
    window.setTimeout(onUsun, 250);
  }

  return (
    <div className={`ps-remove-item flex items-center justify-between text-xs ${znika ? "max-h-0 opacity-0" : "max-h-10 opacity-100"}`}>
      <span className="text-white/60">{nazwa}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white">+{cena} zł</span>
        <button
          type="button"
          onClick={handleUsun}
          aria-label={`Usuń: ${nazwa}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/30 transition-all duration-150 hover:scale-110 hover:bg-white/10 hover:text-white/70 active:scale-90"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}