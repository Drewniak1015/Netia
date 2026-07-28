// src/lib/cookie-consent.ts
//
// Własna, w pełni darmowa implementacja zarządzania zgodą na cookies
// (bez zewnętrznych usług SaaS typu CookieYes/Cookiebot — zero kosztów,
// zero limitów czasowych, pełna kontrola nad kodem).
//
// Kategorie zgody:
//   - necessary:  zawsze true, nie da się wyłączyć (wymagane do działania strony)
//   - analytics:  Google Analytics, Microsoft Clarity itp.
//   - marketing:  Meta Pixel (Facebook/Instagram Ads) i inne narzędzia reklamowe
//
// Zgoda zapisywana jest w localStorage (nazwa klucza: COOKIE_CONSENT_KEY)
// oraz w cookie o tej samej nazwie (na wypadek gdyby w przyszłości trzeba
// było odczytać ją po stronie serwera / w Server Component).

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: true; // zawsze true
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO date — kiedy zgoda została zapisana
}

const COOKIE_CONSENT_KEY = "netia_cookie_consent";
const CONSENT_EVENT = "cookie-consent-updated";
const CONSENT_MAX_AGE_DAYS = 180; // zgodnie z opisem w Polityce Prywatności

/** Odczytuje aktualny stan zgody. Zwraca null, jeśli użytkownik jeszcze nie zdecydował. */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

/** Sprawdza czy dana kategoria ma zgodę użytkownika. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const consent = getConsent();
  return consent ? consent[category] === true : false;
}

/** Zapisuje decyzję użytkownika (localStorage + cookie) i emituje event dla innych komponentów. */
export function setConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;

  const state: ConsentState = {
    necessary: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));

  // Dodatkowo zapis w cookie (przydatne np. gdyby middleware/SSR miało kiedyś
  // czytać zgodę). maxAge w sekundach.
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(
    JSON.stringify(state)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;

  // Powiadamiamy resztę aplikacji (np. MetaPixel.tsx) że zgoda się zmieniła,
  // żeby mogła natychmiast zareagować bez przeładowania strony.
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

/** Akceptuj wszystko naraz — przycisk "Akceptuję wszystkie". */
export function acceptAll(): void {
  setConsent(true, true);
}

/** Odrzuć wszystko poza niezbędnymi — przycisk "Odrzuć". */
export function rejectAll(): void {
  setConsent(false, false);
}

/** Subskrybuj zmiany zgody. Zwraca funkcję do odsubskrybowania (cleanup w useEffect). */
export function onConsentChange(
  callback: (state: ConsentState) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<ConsentState>;
    callback(custom.detail);
  };

  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}