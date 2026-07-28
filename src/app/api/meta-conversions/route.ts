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

import { NextRequest, NextResponse } from "next/server";

const GRAPH_API_VERSION = "v21.0";

interface ConversionEventPayload {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const pixelId = process.env.META_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error("Brak META_CAPI_ACCESS_TOKEN lub META_PIXEL_ID w zmiennych środowiskowych.");
      return NextResponse.json(
        { error: "Konfiguracja serwera niekompletna." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ConversionEventPayload;

    if (!body.event_name) {
      return NextResponse.json({ error: "Brak event_name." }, { status: 400 });
    }

    // Dane potrzebne do dopasowania zdarzenia do użytkownika przez Meta —
    // adres IP i User-Agent pobrane z samego żądania (serwer je zna
    // niezależnie od tego, czy przeglądarka blokuje cookies).
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // fbp / fbc — cookies pierwszo-firmowe ustawiane przez sam Pixel
    // (jeśli są dostępne), pomagają Meta połączyć zdarzenie serwerowe
    // z tą samą sesją przeglądarki co zdarzenie z Pixela.
    const cookieHeader = request.headers.get("cookie") ?? "";
    const fbp = cookieHeader.match(/_fbp=([^;]+)/)?.[1];
    const fbc = cookieHeader.match(/_fbc=([^;]+)/)?.[1];

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
    };

    const graphUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

    const metaResponse = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error("Błąd Meta Conversions API:", metaResult);
      return NextResponse.json({ error: metaResult }, { status: metaResponse.status });
    }

    return NextResponse.json({ success: true, result: metaResult });
  } catch (error) {
    console.error("Błąd wysyłania zdarzenia CAPI:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera." }, { status: 500 });
  }
}