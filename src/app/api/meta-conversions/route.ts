// src/app/api/meta-conversions/route.ts
//
// Endpoint Conversions API (CAPI) — wysyła zdarzenia do Meta bezpośrednio
// z serwera, niezależnie od cookies przeglądarki. To uzupełnienie (nie
// zastąpienie) zwykłego Meta Pixel po stronie klienta: oba wysyłają to samo
// zdarzenie z tym samym `event_id`, a Meta automatycznie je deduplikuje
// (liczy jako jedno zdarzenie, nie dwa).
//
// Token dostępu i Pixel ID są w zmiennych środowiskowych (.env.local
// lokalnie, oraz w ustawieniach projektu w Vercel na produkcji) —
// nigdy nie trzymamy ich wprost w kodzie źródłowym.
//
// [PIXEL ID] Czytamy NEXT_PUBLIC_META_PIXEL_ID, czyli DOKŁADNIE tę samą
// zmienną, którą dostaje <MetaPixel /> w layout.tsx. Zmienne z prefiksem
// NEXT_PUBLIC_ są dostępne również po stronie serwera, więc osobna
// META_PIXEL_ID byłaby drugim miejscem trzymającym tę samą wartość — a
// rozjechane ID to zdarzenia w dwóch różnych zestawach danych i martwa
// deduplikacja, widoczna w Events Managerze jako "brak dopasowania
// serwer/przeglądarka", nie jako literówka w .env.

import { NextRequest, NextResponse } from "next/server";

const GRAPH_API_VERSION = process.env.META_API_VERSION ?? "v21.0";

interface ConversionEventPayload {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
  /** Zapas na wypadek, gdyby cookie jeszcze nie istniało — patrz niżej. */
  fbp?: string;
  fbc?: string;
}

/** Wyciąga cookie po nazwie z nagłówka Cookie.
 *  `(?:^|;\s*)` chroni przed dopasowaniem do cookie o nazwie zawierającej
 *  szukaną jako sufiks (np. `custom_fbp` przy szukaniu `_fbp`). */
function readCookie(header: string, name: string): string | undefined {
  const match = header.match(
    new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`)
  );
  return match?.[1];
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error(
        "Brak META_CAPI_ACCESS_TOKEN lub NEXT_PUBLIC_META_PIXEL_ID w zmiennych środowiskowych."
      );
      return NextResponse.json(
        { error: "Konfiguracja serwera niekompletna." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ConversionEventPayload;

    if (!body.event_name) {
      return NextResponse.json({ error: "Brak event_name." }, { status: 400 });
    }

    // Bez event_id Meta nie ma po czym scalić zdarzenia serwerowego z tym
    // z Pixela i policzy je podwójnie. Nie blokujemy wysyłki, ale zostawiamy
    // ślad w logach — inaczej zdublowane konwersje wyglądają jak wzrost.
    if (!body.event_id) {
      console.warn(
        `[meta-conversions] Zdarzenie "${body.event_name}" bez event_id — deduplikacja nie zadziała.`
      );
    }

    // Dane potrzebne do dopasowania zdarzenia do użytkownika przez Meta —
    // adres IP i User-Agent pobrane z samego żądania (serwer je zna
    // niezależnie od tego, czy przeglądarka blokuje cookies).
    //
    // x-forwarded-for zawiera łańcuch adresów: pierwszy to użytkownik,
    // kolejne to proxy po drodze (na Vercel zawsze jakieś są).
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // fbp / fbc — cookies pierwszej strony ustawiane przez sam Pixel.
    // Lecą automatycznie z każdym fetchem na naszą domenę, więc czytamy je
    // z nagłówka zamiast ufać temu, co przyśle klient.
    //
    // FALLBACK Z BODY: `_fbc` powstaje dopiero wtedy, gdy Pixel się załaduje,
    // czyli u kogoś, kto akceptuje cookies po kilku sekundach, w momencie
    // kliknięcia w numer może go jeszcze nie być. meta-track.ts trzyma wtedy
    // fbclid przechwycony z adresu URL w sessionStorage i dosyła go tutaj.
    // Cookie ma pierwszeństwo, bo jest świeższe i pewniejsze.
    const cookieHeader = request.headers.get("cookie") ?? "";
    const fbp = readCookie(cookieHeader, "_fbp") ?? body.fbp;
    const fbc = readCookie(cookieHeader, "_fbc") ?? body.fbc;

    const eventPayload = {
      data: [
        {
          event_name: body.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.event_id,
          event_source_url: body.event_source_url,
          action_source: "website",
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            fbp: fbp,
            fbc: fbc,
          },
          custom_data: body.custom_data ?? {},
        },
      ],
      // TYLKO NA CZAS TESTÓW. Kod z Events Manager → Test Events. Zdarzenia
      // z tym kodem widać na żywo w tej zakładce, ale NIE są liczone do
      // optymalizacji kampanii — zakomentuj zmienną przed publikacją.
      ...(process.env.META_TEST_EVENT_CODE
        ? { test_event_code: process.env.META_TEST_EVENT_CODE }
        : {}),
    };

    const graphUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

    const metaResponse = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      // Pełna treść błędu idzie do logów serwera (Meta mówi konkretnie,
      // które pole odrzuciła). Do przeglądarki wraca sam kod statusu —
      // klient i tak tej odpowiedzi nie czyta, a szczegóły konfiguracji
      // naszego zestawu danych nie mają po co wychodzić na zewnątrz.
      console.error("Błąd Meta Conversions API:", metaResult);
      return NextResponse.json(
        { error: "Zdarzenie odrzucone przez Meta." },
        { status: metaResponse.status }
      );
    }

    return NextResponse.json({ success: true, result: metaResult });
  } catch (error) {
    console.error("Błąd wysyłania zdarzenia CAPI:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera." }, { status: 500 });
  }
}