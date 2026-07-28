// src/lib/meta-track.ts
//
// Nowa, zalecana funkcja do trackingu zdarzeń Meta — zastępuje docelowo
// lokalne funkcje `trackContact()` powtórzone w wielu plikach. Ta wersja
// wysyła każde zdarzenie DWOMA kanałami jednocześnie:
//   1. Meta Pixel (przeglądarka) — jak dotychczas przez window.fbq
//   2. Conversions API (serwer) — przez nasz endpoint /api/meta-conversions
//
// Obie wysyłki dostają ten sam `event_id` (losowy identyfikator), dzięki
// czemu Meta automatycznie je deduplikuje i liczy jako JEDNO zdarzenie —
// a nie podwaja Twoich statystyk.
//
// Dlaczego to ważne: zdarzenie wysłane z serwera NIE zależy od tego, czy
// przeglądarka blokuje cookies stron trzecich (Safari ITP, Firefox ETP,
// tryby prywatne itd.) — to bezpośrednio adresuje warning widoczny w Meta
// Pixel Helper o blokowanych cookies innych firm.

function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback dla starszych przeglądarek bez crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface TrackOptions {
  /** Nazwa standardowego zdarzenia Meta, np. "Contact", "PageView", "ViewContent" */
  eventName: string;
  /** Nasz własny identyfikator miejsca kliknięcia, np. "hero_phone_button" */
  contentName: string;
}

/**
 * Wysyła zdarzenie do Meta jednocześnie przez Pixel i Conversions API.
 * Używaj tego zamiast starych, lokalnych funkcji trackContact() rozsianych
 * po komponentach — docelowo wszystkie powinny zostać podmienione na import
 * z tego pliku: `import { trackMetaEvent } from "@/lib/meta-track"`.
 */
export function trackMetaEvent({ eventName, contentName }: TrackOptions): void {
  if (typeof window === "undefined") return;

  const eventId = generateEventId();
  const eventSourceUrl = window.location.href;

  // 1) Pixel (przeglądarka) — z tym samym event_id do deduplikacji
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", eventName, { content_name: contentName }, { eventID: eventId });
  }

  // 2) Conversions API (serwer) — "fire and forget", nie blokujemy UI
  // ani nie pokazujemy błędu użytkownikowi, jeśli się nie uda; to tylko
  // uzupełnienie danych, nie krytyczna ścieżka działania strony.
  fetch("/api/meta-conversions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: eventSourceUrl,
      custom_data: { content_name: contentName },
    }),
    keepalive: true, // pozwala dokończyć wysyłkę nawet gdy user zaraz opuści stronę (np. po kliknięciu tel:)
  }).catch(() => {
    // Celowo ciche niepowodzenie — brak połączenia z /api nie powinien
    // przerywać niczego dla użytkownika.
  });
}

/** Skrót dla najczęstszego przypadku — zdarzenie "Contact" (telefon/SMS). */
export function trackContact(contentName: string): void {
  trackMetaEvent({ eventName: "Contact", contentName });
}

/** Skrót dla zdarzenia "ViewContent" (np. kliknięcie w konfigurator). */
export function trackViewContent(contentName: string): void {
  trackMetaEvent({ eventName: "ViewContent", contentName });
}