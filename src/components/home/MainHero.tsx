"use client"

import Image from "next/image";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { trackContact } from "@/lib/meta-track";

/* ------------------------------------------------------------------ */
/*  HERO — [KOPIA] bez animacji wejścia. Sekcja renderuje się od razu   */
/*  w pełnej formie, co dodatkowo pomaga LCP (obraz hero i tak nie był  */
/*  animowany, ale teraz też otaczający go tekst/CTA nie czeka na       */
/*  żadne opóźnienia).                                                  */
/*                                                                      */
/*  UWAGA: tracking kliknięć w tel:/sms: (custom_id -> Google Sheets)   */
/*  jest obsługiwany GLOBALNIE przez AdIdCapture.tsx (listener na całym */
/*  dokumencie) - nie trzeba wywoływać trackPhoneClick/trackSmsClick    */
/*  ręcznie w tym pliku. trackContact (Meta) zostaje, bo to osobny,      */
/*  niezależny system.                                                  */
/*                                                                      */
/*  ZMIANY W TEJ WERSJI (copywriting deck):                             */
/*  1. H1 zamieniony na wariant #6 z decku ("Przestań sprawdzać, czy    */
/*     internet znowu zwolnił") — mocniej łączy przekonanie #1          */
/*     (to nie pech, to model biznesowy) z mechanizmem monitoringu.     */
/*  2. Subheadline zamieniony na Subheadline V2 z decku (pain point ->  */
/*     mechanizm -> korzyść z ramą czasową "od 3. dnia po instalacji"). */
/*  3. Mikrocopy pod CTA zaktualizowane pod CTA #1 z decku ("bez        */
/*     zobowiązań") — dokłada redukcję ryzyka do istniejącego urgency.  */
/*  Linia sceptycyzmu z poprzedniej iteracji zostaje bez zmian, bo dalej */
/*  robi swoją robotę przed obietnicą w subheadline.                    */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative mt-18 overflow-hidden font-sans"
    >
      <DottedBackground variant="dots-fade" focusY="25%" size={24} />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 z-0 h-[34rem] w-[34rem] rounded-full bg-teal-400/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 z-0 h-96 w-96 rounded-full bg-teal-500/5 blur-[100px]"
      />

      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-5 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8 lg:px-8 lg:py-20">
        {/* Kolumna tekstowa — zawsze pierwsza w porządku DOM i wizualnym */}
        <div className="relative z-10 order-1 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Przestań sprawdzać, czy internet{" "}
            <span className="text-teal-300">znowu zwolnił</span>.
          </h1>

          {/* Linia sceptycyzmu — przekonanie #2 z beliefes.docx, musi wylądować
              przed obietnicą poniżej, żeby "cena w umowie" nie zabrzmiała jak
              kolejny slogan konkurencji */}
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium italic text-white/45 sm:text-base lg:mx-0">
            „Do X Mb/s” i „gwarantowana cena” słyszałeś już wszędzie — i wiesz,
            ile są warte po sześciu miesiącach.
          </p>

          {/* Subheadline V2 z copywriting decku: pain point -> mechanizm ->
              korzyść z ramą czasową, prowadzi wprost do CTA */}
          <h2 className="mx-auto mt-3 max-w-xl text-base font-normal leading-snug text-white/75 sm:text-lg lg:mx-0">
            Jedyny dostawca, który{" "}
            <span className="font-semibold text-teal-300">
              monitoruje Twoje łącze 24/7
            </span>{" "}
            i zapisuje cenę w umowie na stałe, żeby zagwarantować realną
            prędkość, stabilne wideorozmowy i{" "}
            <span className="italic text-teal-200/85">
              spokojny wieczór już od 3. dnia po instalacji
            </span>
            .
          </h2>

          {/* Social proof — card ze zdjęciem klienta (zamiast ikony placeholder).
              Plik: /public/images/testimonial-avatar.jpg — patrz prompt do
              wygenerowania w komentarzu na końcu pliku. */}
          <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 lg:mx-0">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-teal-300/20">
              <Image
                src="/images/testimonial-avatar.webp"
                alt="Zadowolony klient po zmianie dostawcy internetu"
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="text-left">
              <span className="flex items-center gap-2">
                <span className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span className="text-xs font-medium text-white/50">
                  jeden z 2.4 mln klientów po zmianie dostawcy
                </span>
              </span>
              <p className="mt-1 text-sm italic leading-snug text-white/90 sm:text-base">
                „Nareszcie nie muszę myśleć o internecie”
              </p>
            </span>
          </div>

          {/* Trust badges + risk reversal */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/90 sm:text-sm">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Umowa online w 5 minut
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/90 sm:text-sm">
              <Zap size={14} className="shrink-0 text-teal-300" />
              Serwisant w 24h
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold text-white/90 sm:text-sm">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Rezygnacja bez kosztów w 14 dni
            </span>
          </div>
        </div>

        {/* Kolumna wizualna — na mobile pod tekstem (order-2), na desktopie druga kolumna grida */}
        <div className="order-2 flex flex-col">
          {/* Obraz LCP — renderuje się natychmiast po ściągnięciu */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/images/MainHero.avif"
              alt="Rodzina w salonie ogląda film bez przerywania dzięki stabilnemu połączeniu światłowodowemu"
              width={1600}
              height={900}
              priority
              fetchPriority="high"
              className="h-auto w-full"
            />
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center lg:justify-start">
            {/* CTA primary */}
            <a
              href="tel:+48887843260"
              onClick={() => trackContact("hero_phone_button")}
              className="flex min-h-[60px] items-center justify-between gap-4 rounded-2xl bg-teal-500 px-5 py-3 text-white shadow-lg shadow-teal-500/20 outline-none transition-all duration-150 hover:scale-[1.02] hover:shadow-teal-400/30 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D] sm:w-64"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">Sprawdź dostępność</span>
                  <span className="block text-xs text-white/85">+48 887 843 260</span>
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/70" />
            </a>

            {/* CTA secondary */}
            <a
              href={`sms:+48887843260?body=${encodeURIComponent(
                "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
              )}`}
              onClick={() => trackContact("hero_sms_button")}
              className="flex min-h-[60px] items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white outline-none transition-all duration-150 hover:scale-[1.02] hover:bg-white/[0.08] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D] sm:w-64"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={16} />
                </span>
                <span className="text-sm font-bold">Wyślij SMS</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/50" />
            </a>
          </div>

          {/* Mikrocopy pod CTA — oparte na CTA #1 z decku: urgency (3 minuty)
              plus redukcja ryzyka (bez zobowiązań), zamiast samego urgency */}
          <div className="mx-auto mt-4 flex w-fit items-center justify-center gap-1.5 sm:mx-0">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300/80" />
            <span className="text-xs font-medium text-white/50 sm:text-sm">
              Sprawdzenie dostępności zajmuje 3 minuty i jest bez zobowiązań,
              oddzwonimy zanim znów o tym zapomnisz.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

/* ------------------------------------------------------------------ */
/*  PROMPT DO WYGENEROWANIA ZDJĘCIA (testimonial-avatar.jpg)            */
/*  Wklej do Midjourney / DALL-E / Ideogram itp.                        */
/*                                                                      */
/*  "Photorealistic close-up portrait of a Polish woman in her early    */
/*  30s, sitting relaxed at home, natural warm smile, looking slightly  */
/*  off-camera, soft natural window light, casual home clothing (knit   */
/*  sweater), blurred cozy living room background, shot on 50mm lens,   */
/*  shallow depth of field, authentic candid feel, not overly polished, */
/*  looks like a real customer photo not a stock photo, square crop,    */
/*  even lighting on face, no text, no logos, no watermark"             */
/*                                                                      */
/*  Uwagi:                                                              */
/*  - Kwadratowy kadr (1:1), bo w karcie jest przycinane do koła 44px — */
/*    twarz musi być wycentrowana i wypełniać kadr.                     */
/*  - Warto wygenerować 2-3 warianty (różna płeć/wiek) i rotować je      */
/*    losowo albo A/B testować — dopasowane do różnych segmentów        */
/*    avatara (rodzic 28-45 vs młodszy singiel 20-30).                  */
/*  - Unikaj efektu "stockowego" — zbyt idealne, symetryczne, uśmiechy   */
/*    "korporacyjne" obniżają wiarygodność testimoniala bardziej niż    */
/*    ich brak.                                                         */
/*  - Skompresuj do WebP/AVIF przed wrzuceniem do /public/images, żeby  */
/*    nie obciążać LCP hero (sekcja jest priority-loaded).              */
/* ------------------------------------------------------------------ */