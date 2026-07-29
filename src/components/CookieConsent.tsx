"use client";

// src/components/CookieConsent.tsx
//
// WERSJA 3 — zmiany:
//  - Klucz sessionStorage i nazwa eventu EntryGate są teraz importowane
//    z @/lib/entry-gate zamiast trzymane jako osobny literał string w tym
//    pliku. Wcześniej EntryGate.tsx w ogóle NIE wysyłał eventu
//    "entry-gate-closed", mimo że ten komponent na niego nasłuchiwał —
//    w efekcie baner cookies zawsze czekał pełne 4s (fallback timeout)
//    zamiast pojawić się od razu po zamknięciu bramki. To naprawione po
//    stronie EntryGate.tsx; ten plik teraz po prostu importuje tę samą
//    stałą, więc obie strony zawsze się zgadzają.
//  - Dodana subtelna animacja wejścia czystym CSS (@keyframes), żeby baner
//    nie pojawiał się nagle — bez żadnej biblioteki JS, tylko keyframe
//    odgrywany naturalnie przy zamontowaniu elementu.
//
// Zmiany z WERSJI 2 (bez zmian funkcjonalnych, zachowane):
//  - Tło karty: białe — wyraźnie odróżnia się od ciemnego motywu reszty
//    strony.
//  - Floating card w lewym dolnym rogu, kompaktowa na telefonie
//    (max-w-[320px]), zamiast pełnej szerokości ekranu.
//  - Przyciski w kolumnie na wąskich ekranach.
//  - env(safe-area-inset-bottom) dla iPhone z paskiem gestów.

import React, { useEffect, useState } from "react";
import { getConsent, acceptAll, rejectAll, setConsent } from "@/lib/cookie-consent";
import {
  ENTRY_GATE_CLOSED_EVENT,
  isEntryGateDismissed,
} from "@/components/Entrygate";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const existing = getConsent();
    if (existing) return; // zgoda już podjęta wcześniej — nic nie pokazujemy

    // Jeśli EntryGate jeszcze nie został zamknięty w tej sesji, czekamy na
    // jego event (wysyłany teraz poprawnie przez dismissEntryGate() w
    // @/lib/entry-gate), zamiast pokazywać się od razu — inaczej oba okna
    // nakładałyby się na siebie na wejściu.
    if (isEntryGateDismissed()) {
      setVisible(true);
      return;
    }

    const handleEntryGateClosed = () => {
      // Użytkownik mógł już podjąć decyzję (np. przez inną ścieżkę) zanim
      // ten event doszedł — sprawdzamy jeszcze raz, żeby nie pokazać
      // bannera na siłę.
      if (!getConsent()) setVisible(true);
    };
    window.addEventListener(ENTRY_GATE_CLOSED_EVENT, handleEntryGateClosed);

    // Zabezpieczenie: gdyby EntryGate nie istniał na danej podstronie (np.
    // strona bez tego komponentu), event nigdy nie nadejdzie — po 4s
    // pokazujemy baner mimo wszystko, żeby nie "zgubić" zgody na stałe.
    //
    // [POPRAWKA] Ten efekt odpala się raz na starcie i nie odmontowuje się
    // przy zamknięciu bannera (przyciski tylko wołają setVisible(false)),
    // więc clearTimeout w funkcji czyszczącej poniżej NIE anulował tego
    // zegara, jeśli użytkownik kliknął "Akceptuję/Odrzuć/Zapisz" przed
    // upływem 4s — baner wracał mimo zapisanej już zgody. Sprawdzamy więc
    // getConsent() dopiero w momencie, gdy fallback faktycznie strzela.
    const fallback = setTimeout(() => {
      if (!getConsent()) setVisible(true);
    }, 4000);

    return () => {
      window.removeEventListener(ENTRY_GATE_CLOSED_EVENT, handleEntryGateClosed);
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    acceptAll();
    setVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setVisible(false);
  };

  const handleSavePreferences = () => {
    setConsent(analytics, marketing);
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-3 sm:p-5"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-modal="true"
      aria-label="Zgoda na pliki cookie"
    >
      <style>{`
        @keyframes cookieConsentFadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cookie-consent-card {
          animation: cookieConsentFadeInUp 300ms ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cookie-consent-card {
            animation: none !important;
          }
        }
      `}</style>

      <div className="cookie-consent-card w-full max-w-[320px] rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        {!showDetails ? (
          <>
            <p className="mb-1 text-[12px] font-bold text-slate-900">
              🍪 Ta strona korzysta z cookies
            </p>
            <p className="mb-2.5 text-[11px] leading-snug text-slate-600">
              Marketing (Meta Pixel) tylko za zgodą.{" "}
              <a
                href="/polityka-prywatnosci"
                className="font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:decoration-teal-700"
              >
                Polityka Prywatności
              </a>
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full rounded-full bg-teal-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Akceptuję wszystkie
              </button>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="flex-1 rounded-full border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Odrzuć
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="flex-1 rounded-full border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Ustawienia
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Ustawienia cookies
            </p>

            <div className="mb-1.5 flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
              <div>
                <p className="text-[11.5px] font-semibold text-slate-900">Niezbędne</p>
                <p className="text-[10px] text-slate-500">
                  Wymagane do działania strony.
                </p>
              </div>
              <span className="mt-0.5 flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-teal-600 px-0.5">
                <span className="ml-auto h-3 w-3 rounded-full bg-white" />
              </span>
            </div>

            <label className="mb-1.5 flex cursor-pointer items-start justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-2">
              <div>
                <p className="text-[11.5px] font-semibold text-slate-900">Analityka</p>
                <p className="text-[10px] text-slate-500">
                  GA4, Microsoft Clarity.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-3.5 w-3.5 flex-shrink-0 accent-teal-600"
              />
            </label>

            <label className="mb-3 flex cursor-pointer items-start justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-2">
              <div>
                <p className="text-[11.5px] font-semibold text-slate-900">Marketing</p>
                <p className="text-[10px] text-slate-500">
                  Meta Pixel (FB, Instagram).
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 h-3.5 w-3.5 flex-shrink-0 accent-teal-600"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full rounded-full bg-teal-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Zapisz ustawienia
              </button>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="w-full rounded-full px-3 py-1 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-700"
              >
                Wróć
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;