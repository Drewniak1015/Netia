"use client"

import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Activity,
  Phone,
  MessageCircle,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { trackContact } from "@/lib/meta-track";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ------------------------------------------------------------------ */
/*  HERO — bez animacji wejścia.                                        */
/*                                                                      */
/*  ZMIANA W TEJ WERSJI: CTA -> TELEFON + SMS                          */
/*                                                                      */
/*  [A] Link do /konfigurator/InternetOrazTelewizja usunięty (strona    */
/*      jest one-page, ta podstrona nie istnieje). W jego miejsce dwa   */
/*      przyciski: `tel:` jako główny, `sms:` jako poboczny.            */
/*      Usunięte importy: Link, ChevronRight.                           */
/*                                                                      */
/*  [B] ROZJAZD OBIETNICY ROZWIĄZANY. W poprzedniej wersji pod          */
/*      "NIE ZMIENIAŁEM" stały dwie uwagi, które ta zmiana domyka:      */
/*        • CTA mówiło "Sprawdź dostępność", a prowadziło do            */
/*          konfiguratora oferty — teraz etykieta i akcja to to samo    */
/*          działanie ("Zadzwoń" -> dzwoni),                            */
/*        • brakowało ścieżki telefonicznej w hero, mimo że reszta      */
/*          strony mocno pcha "ZADZWOŃ" — teraz hero mówi tym samym     */
/*          głosem co karty ofert.                                      */
/*                                                                      */
/*  [C] JEDNO ŹRÓDŁO NUMERU. PHONE i PHONE_HREF importowane z           */
/*      Offersdata.ts, a nie przepisane lokalnie. W projekcie już raz   */
/*      zdarzyły się dwa różne numery w różnych miejscach strony (patrz */
/*      komentarz w Headerze) — każda kolejna kopia to kolejna okazja,  */
/*      żeby po zmianie numeru jedno miejsce zostało przy starym.       */
/*                                                                      */
/*  [D] MIKROCOPY przepisane. Mówiło "Sprawdzenie dostępności zajmuje   */
/*      3 minuty" — zdanie dopasowane do formularza, nie do rozmowy.    */
/*      Teraz zbija dwa realne opory przed tapnięciem w numer: że to    */
/*      długo i że ktoś zacznie sprzedawać. Zdanie stoi bezpośrednio    */
/*      pod przyciskami, bo tam działa.                                 */
/*                                                                      */
/*  [E] TAP TARGETY: oba CTA `min-h-[60px]`, na telefonie jedno pod     */
/*      drugim na pełną szerokość, od sm obok siebie (SMS węższy).      */
/*      `hover:scale` schowane za `sm:` — na dotyku hover przykleja się */
/*      po tapnięciu i przycisk zostaje powiększony.                    */
/*      Numer w przycisku ma `tabular-nums whitespace-nowrap`, żeby nie */
/*      łamał się w przypadkowym miejscu na wąskim ekranie.             */
/*                                                                      */
/*  [F] TREŚĆ SMS-a mówi wprost, czego klient oczekuje ("oddzwońcie"),  */
/*      więc nie musi nic wymyślać po otwarciu aplikacji. To samo       */
/*      brzmienie co w Headerze — spójność ułatwia rozpoznanie leada    */
/*      po stronie odbierającego.                                       */
/*                                                                      */
/*  ZACHOWANE z poprzedniej wersji: alt zgodny z obrazem, H1 wariant C  */
/*  bez terminu, podtytuł, <p> zamiast <h2>, kolejność order-* na       */
/*  mobile, `sizes` na obrazie LCP, pasek statystyk z monitoringiem,    */
/*  trust badges 2 kolumny na mobile.                                    */
/*                                                                      */
/*  NADAL DO DECYZJI: podtytuł upycha pięć obietnic w jedno zdanie.     */
/*  Przy 44 s średniego czasu na "/" (GA4) nikt tego nie doczyta —      */
/*  warto skrócić do dwóch, ale to zmiana w przekazie, nie w kodzie.    */
/* ------------------------------------------------------------------ */

/* Treść SMS-a — ta sama co w Headerze. */
const SMS_BODY = encodeURIComponent(
  "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
);

function Hero() {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden pt-28 font-sans sm:pt-18"
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

      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-6 px-5 py-4 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8 lg:px-8 lg:py-20">
        <div className="contents text-center lg:flex lg:flex-col lg:text-left">
          <h1 className="order-1 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:order-none lg:text-5xl xl:text-6xl">
            Odzyskaj spokojny wieczór w domu, z prędkością{" "}
            <span className="text-teal-300">mierzoną codziennie</span>.
          </h1>

          <p className="order-3 mx-auto mt-3 max-w-xl text-base font-normal leading-snug text-white/75 sm:mt-4 sm:text-lg lg:order-none lg:mx-0">
            Nie „do X Mb/s” w reklamie, tylko{" "}
            <span className="text-teal-300">
              realna prędkość sprawdzana w godzinach szczytu
            </span>{" "}
            i cena zapisana w umowie na cały okres. Technologię dostępną pod
            Twoim adresem podamy Ci{" "}
            <span className="text-teal-300">przed podpisaniem</span>, nie w dniu
            montażu.
          </p>

          <div className="order-6 mx-auto mt-4 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-6 lg:order-none lg:mx-0">
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <Users size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                2,4 mln
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                klientów sieci Netia
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <Activity size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                24/7
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                monitoring łącza, dzwonimy pierwsi
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
              <Clock size={18} className="text-teal-300" />
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                24h
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                serwisant na miejscu od zgłoszenia
              </span>
            </div>
          </div>

          <div className="order-7 mx-auto mt-3 grid max-w-xl grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 lg:order-none lg:mx-0">
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Umowa online w 5 min
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-white/90">
              <Zap size={14} className="shrink-0 text-teal-300" />
              Bez opłaty za router
            </span>
            <span className="col-span-2 flex items-center justify-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-center text-xs font-semibold text-white/90 sm:col-span-1">
              <ShieldCheck size={14} className="shrink-0 text-teal-300" />
              Rezygnacja w 14 dni
            </span>
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col">
          <div className="order-2 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 lg:order-none">
            <Image
              src="/images/MainHero.avif"
              alt="Porównanie przed i po: po lewej mężczyzna sfrustrowany zrywającą się wideorozmową, po prawej ten sam mężczyzna na stabilnym połączeniu"
              width={1600}
              height={900}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </div>

          {/* [A][E] CTA — telefon jako główny, SMS jako poboczny.
              SMS zostaje pełnoprawnym przyciskiem, nie linkiem — dla części
              osób napisanie wiadomości jest znacznie niższym progiem niż
              rozmowa, a to ten sam lead.

              [RÓWNE GUZIKI] Oba mają `flex-1` + `basis-0` i identyczny
              padding, więc dzielą szerokość dokładnie po połowie niezależnie
              od długości etykiet. Bez `basis-0` samo `flex-1` rozdziela
              nadmiar proporcjonalnie do treści i przycisk z numerem
              telefonu wychodziłby szerszy.

              [WYRÓWNANIE] Ikona i tekst startują od lewej krawędzi
              (`justify-start` + `text-left`), przy zachowanej równej
              szerokości obu przycisków. Dzięki temu ikony i pierwsze litery
              etykiet stoją w dwóch pionowych liniach — na telefonie, gdzie
              przyciski są jeden pod drugim, ta linia jest widoczna od razu.

              `px-5` zamiast `px-4`, bo przy wyrównaniu do lewej padding
              boczny przestaje być tylko odstępem, a staje się marginesem
              startu treści. */}
          <div className="order-4 mt-6 flex w-full flex-col gap-2.5 sm:mt-10 sm:flex-row lg:order-none">
            <a
              href={`tel:${PHONE_HREF}`}
              onClick={() => trackContact("hero_phone_button")}
              className="flex min-h-[60px] flex-1 basis-0 items-center justify-start gap-3 rounded-2xl bg-teal-500 px-5 py-3 text-black shadow-lg shadow-teal-500/20 outline-none transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D] sm:hover:scale-[1.02] sm:hover:shadow-teal-400/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10">
                <Phone size={16} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold leading-tight">Zadzwoń teraz</span>
                <span className="block whitespace-nowrap text-xs tabular-nums text-black/70">
                  {PHONE}
                </span>
              </span>
            </a>

            <a
              href={`sms:${PHONE_HREF}?body=${SMS_BODY}`}
              onClick={() => trackContact("hero_sms_button")}
              className="flex min-h-[60px] flex-1 basis-0 items-center justify-start gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-white outline-none transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D] sm:hover:scale-[1.02] sm:hover:bg-white/[0.08]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <MessageCircle size={16} className="text-teal-300" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold leading-tight">Wyślij SMS</span>
                <span className="block text-xs text-white/55">Oddzwonimy do Ciebie</span>
              </span>
            </a>
          </div>

          {/* [D] Mikrocopy dopasowane do rozmowy, nie do formularza.
              Stoi bezpośrednio pod przyciskami — zdanie zbijające opór
              przed kliknięciem musi być przy przycisku, nie na końcu
              sekcji. */}
          <div className="order-5 mx-auto mt-2 flex w-fit items-center justify-center sm:mt-3 sm:mx-0 lg:order-none">
            <span className="text-pretty text-xs font-medium leading-relaxed text-white/50 sm:text-sm">
              Rozmowa zajmuje 3 minuty i do niczego nie zobowiązuje. Sprawdzimy, co jest
              dostępne pod Twoim adresem, i podamy cenę od razu.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;