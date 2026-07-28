"use client";

// src/components/MetaPixel.tsx
//
// Ładuje Meta Pixel (Facebook/Instagram Ads) WYŁĄCZNIE gdy użytkownik
// wyraził zgodę na kategorię "marketing" w bannerze cookies.
//
// Podłącz w layout.tsx: <MetaPixel pixelId="TWÓJ_PIXEL_ID" />
// Podmień TWÓJ_PIXEL_ID na ID pobrane z Meta Business Suite
// (Ustawienia firmy → Źródła danych → Zestawy danych i piksele).

import { useEffect, useState } from "react";
import { hasConsent, onConsentChange } from "@/lib/cookie-consent";

// UWAGA: celowo NIE deklarujemy tu `declare global { interface Window { fbq... } }`.
// Jeśli w projekcie istnieje już gdziekolwiek inna deklaracja typu dla
// window.fbq (np. z innego pliku albo paczki npm), TypeScript scala oba typy
// w jeden — a przy niezgodnych sygnaturach funkcji scalenie potrafi wyjść
// jako `never`, co dawało błąd "This expression is not callable. Type
// 'never' has no call signatures.". Zamiast tego rzutujemy window na `any`
// tylko w tych kilku miejscach, gdzie faktycznie wołamy fbq — to lokalne,
// nieszkodliwe obejście specyficzne dla integracji zewnętrznego skryptu.

interface MetaPixelProps {
  pixelId: string;
}

function loadPixelScript(pixelId: string) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.fbq) return; // już załadowany

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  w.fbq?.("init", pixelId);
  w.fbq?.("track", "PageView");
}

const MetaPixel: React.FC<MetaPixelProps> = ({ pixelId }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Sprawdź od razu przy montowaniu (np. gdy zgoda już była wcześniej zapisana)
    if (hasConsent("marketing") && !loaded) {
      loadPixelScript(pixelId);
      setLoaded(true);
    }

    // Nasłuchuj na zmianę zgody na żywo (np. użytkownik dopiero co kliknął "Akceptuję")
    const unsubscribe = onConsentChange((state) => {
      if (state.marketing && !loaded) {
        loadPixelScript(pixelId);
        setLoaded(true);
      }
      // Uwaga: Meta Pixel nie ma oficjalnego mechanizmu "odładowania" skryptu
      // po cofnięciu zgody w tej samej sesji — zgodnie z dobrą praktyką,
      // cofnięcie zgody obowiązuje od następnego załadowania strony.
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixelId]);

  return null; // ten komponent nic nie renderuje, tylko ładuje skrypt
};

export default MetaPixel;