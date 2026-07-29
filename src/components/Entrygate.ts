/**
 * Wspólny klucz sessionStorage i nazwa eventu współdzielone między
 * EntryGate.tsx (bramka wyboru: kupno vs awaria) i CookieConsent.tsx
 * (baner cookies czeka, aż EntryGate się zamknie, żeby oba okna nie
 * nakładały się na siebie na wejściu).
 *
 * Trzymanie tego w jednym miejscu chroni przed rozjazdem: wcześniej obie
 * nazwy (klucz + event) były zduplikowane jako osobne literały w dwóch
 * plikach, a EntryGate w ogóle nie wysyłał eventu "entry-gate-closed",
 * mimo że CookieConsent na niego czekał — przez co baner cookies zawsze
 * pojawiał się dopiero po 4s fallbacku, zamiast od razu po zamknięciu
 * bramki.
 */

export const ENTRY_GATE_SESSION_KEY = "netia_entry_gate_dismissed";
export const ENTRY_GATE_CLOSED_EVENT = "entry-gate-closed";

/** Czy bramka wejściowa została już zamknięta w tej sesji przeglądarki. */
export function isEntryGateDismissed(): boolean {
  try {
    return !!sessionStorage.getItem(ENTRY_GATE_SESSION_KEY);
  } catch {
    // sessionStorage niedostępny (np. tryb prywatny) — traktujemy jak
    // odrzucone, żeby nie blokować reszty strony.
    return true;
  }
}

/**
 * Zapisuje w sessionStorage, że bramka została zamknięta, i wysyła event
 * globalny, na który czeka CookieConsent (żeby pokazać się od razu, a nie
 * po fallbackowym opóźnieniu).
 */
export function dismissEntryGate(): void {
  try {
    sessionStorage.setItem(ENTRY_GATE_SESSION_KEY, "1");
  } catch {
    /* no-op */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ENTRY_GATE_CLOSED_EVENT));
  }
}