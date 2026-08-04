/**
 * lib/adTracking.ts
 *
 * Odpowiada za:
 * 1. Odczytanie custom_id z URL przy wejściu na stronę i zapisanie go w localStorage
 *    (żeby "przeżyło" nawigację między podstronami)
 * 2. Wysłanie eventu do Google Apps Script w momencie kliknięcia w numer telefonu / SMS
 */

const STORAGE_KEY = 'ad_custom_id';

// URL wygenerowany przy wdrożeniu Google Apps Script (kończy się na /exec)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKZBsipJQEjPqtGZRS6paIHNO7uqbb5pcCTrQmNChhKyvrEHN1tEy5Y2EOt6QrhUdrig/exec';

/**
 * Wywołaj tę funkcję raz, przy wejściu na stronę (np. w layout.tsx).
 * Odczytuje ?custom_id=... z URL i zapisuje w localStorage, jeśli jest obecny.
 * Jeśli użytkownik wejdzie bez parametru (np. bezpośrednio na podstronę), zachowuje poprzednio zapisaną wartość.
 */
export function captureCustomId() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const customId = params.get('custom_id');

  if (customId) {
    localStorage.setItem(STORAGE_KEY, customId);
  }
}

/**
 * Zwraca aktualnie zapisany custom_id (lub null, jeśli użytkownik nie przyszedł z oznaczonej reklamy).
 */
export function getCustomId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Wywołaj tę funkcję w onClick linku "tel:".
 * Wysyła dane do Google Sheets w tle (nie blokuje otwarcia dialera telefonu).
 */
export function trackPhoneClick() {
  if (typeof window === 'undefined') return;

  const customId = getCustomId();

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Apps Script Web App nie zwraca poprawnych nagłówków CORS - no-cors wystarczy do samego wysłania
    headers: { 'Content-Type': 'text/plain' }, // text/plain omija tzw. CORS preflight
    body: JSON.stringify({
      customId: customId || 'brak_custom_id',
      pageUrl: window.location.href,
      actionType: 'phone',
    }),
  }).catch(() => {
    // celowo cichy fail - nie chcemy przerywać użytkownikowi próby zadzwonienia
  });
}

/**
 * Wywołaj tę funkcję w onClick linku "sms:".
 * Działa identycznie jak trackPhoneClick, ale oznacza wpis jako SMS.
 */
export function trackSmsClick() {
  if (typeof window === 'undefined') return;

  const customId = getCustomId();

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      customId: customId || 'brak_custom_id',
      pageUrl: window.location.href,
      actionType: 'sms',
    }),
  }).catch(() => {
    // celowo cichy fail
  });
}