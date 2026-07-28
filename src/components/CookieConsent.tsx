"use client";

// src/components/CookieConsent.tsx
//
// WERSJA 2 — zmiany na prośbę: jasne (białe) tło dla kontrastu z ciemnym
// motywem reszty strony, oraz kompaktowa forma na telefonie.
//
// Co się zmieniło względem wersji 1:
//  - Tło karty: białe (zamiast ciemnego rgb(19,55,78)) — wyraźnie odróżnia
//    się od reszty strony, łatwiej to zauważyć i przeczytać.
//  - Pozycja: floating card w lewym dolnym rogu (nie pełna szerokość ekranu
//    jak wcześniej) — na telefonie to była szeroka belka na całą szerokość
//    z dużym paddingiem, przez co zasłaniała spory kawałek treści i
//    "rozjeżdżała" layout. Teraz to zwarta karta z ograniczoną szerokością
//    (max-w-[380px]), więc na telefonie zajmuje tylko fragment ekranu, nie
//    cały dolny pas.
//  - Tekst skrócony (mobile najpierw): jedno krótkie zdanie zamiast akapitu.
//  - Przyciski w kolumnie na wąskich ekranach (łatwiej trafić palcem, nie
//    ściskają się w jednej linii).
//  - Dodany env(safe-area-inset-bottom) — na iPhone z paskiem gestów karta
//    nie chowa się częściowo pod systemowym paskiem na dole.
//  - Panel "Ustawienia" też przeprojektowany na jasne tło, spójnie z resztą.

import React, { useEffect, useState } from "react";
import { getConsent, acceptAll, rejectAll, setConsent } from "@/lib/cookie-consent";

// [DODANO] Nazwa musi być identyczna jak SESSION_KEY w EntryGate.tsx —
// dzięki temu wiemy, czy EntryGate już się pokazał/zamknął w tej sesji,
// zanim w ogóle zdążymy odmontować nasz baner.
const ENTRY_GATE_SESSION_KEY = "netia_entry_gate_dismissed";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const existing = getConsent();
    if (existing) return; // zgoda już podjęta wcześniej — nic nie pokazujemy

    // [DODANO] Jeśli EntryGate jeszcze nie został zamknięty w tej sesji,
    // czekamy na jego event "entry-gate-closed", zamiast pokazywać się
    // od razu — inaczej oba okna nakładałyby się na siebie na wejściu.
    let entryGateDismissed = false;
    try {
      entryGateDismissed = !!sessionStorage.getItem(ENTRY_GATE_SESSION_KEY);
    } catch {
      entryGateDismissed = true; // sessionStorage niedostępny — nie blokujemy bannera
    }

    if (entryGateDismissed) {
      setVisible(true);
      return;
    }

    const handleEntryGateClosed = () => setVisible(true);
    window.addEventListener("entry-gate-closed", handleEntryGateClosed);

    // Zabezpieczenie: gdyby EntryGate nie istniał na danej podstronie (np.
    // strona bez tego komponentu), event nigdy nie nadejdzie — po 4s
    // pokazujemy baner mimo wszystko, żeby nie "zgubić" zgody na stałe.
    const fallback = setTimeout(() => setVisible(true), 4000);

    return () => {
      window.removeEventListener("entry-gate-closed", handleEntryGateClosed);
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
      <div className="w-full max-w-[320px] rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
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