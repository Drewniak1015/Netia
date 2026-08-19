"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Tv,
  Maximize2,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  Phone,
  MessageCircle,
  Info,
} from "lucide-react";
import { trackContact } from "@/lib/meta-track";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ---------------------------------------------------------------------- */
/*  Lista kanałów — podgląd oryginalnej ulotki PDF.                        */
/*                                                                         */
/*  DLACZEGO OBRAZEK, A NIE <iframe src="...pdf">:                         */
/*  wbudowany podgląd PDF w iframe jest na telefonach nieprzewidywalny —   */
/*  Safari na iOS renderuje tylko pierwszy ekran bez przewijania, część    */
/*  przeglądarek na Androidzie pokazuje pustą ramkę albo od razu proponuje */
/*  pobranie pliku. Do tego ściąga cały plik (3,4 MB) zanim cokolwiek się  */
/*  pokaże. Zamiast tego strona 1 jest wyrenderowana do WebP w 300 dpi.    */
/*                                                                         */
/*  DWA PLIKI, NIE JEDEN:                                                  */
/*   • podgląd 1100 px (~255 KB) — ładowany od razu, na miniaturę,        */
/*   • pełny 1749×2481 (~455 KB) — pobierany DOPIERO po otwarciu          */
/*     powiększenia. Dzięki temu wejście na stronę nie kosztuje pół mega   */
/*     transferu u kogoś, kto tej sekcji w ogóle nie otworzy.              */
/*                                                                         */
/*  ZOOM PRZYCISKAMI, NIE GESTEM:                                          */
/*  pinch-to-zoom wewnątrz strony bywa przechwytywany przez zoom całego    */
/*  dokumentu i kończy się rozjechanym layoutem, z którego trudno wrócić.  */
/*  Przyciski + natywne przewijanie kontenera są przewidywalne wszędzie.   */
/*  Podwójne tapnięcie w obraz też przełącza zoom — to odruch, którego     */
/*  ludzie i tak spróbują.                                                 */
/*                                                                         */
/*  PLIKI DO WGRANIA (nazwy muszą się zgadzać ze stałymi niżej):           */
/*   /public/images/netia-lista-kanalow-podglad.webp                       */
/*   /public/images/netia-lista-kanalow-full.webp                          */
/*   /public/pliki/netia-lista-kanalow.pdf                                 */
/*                                                                         */
/*  PRZY AKTUALIZACJI CENNIKA: wyrenderuj stronę 1 nowego PDF-u ponownie   */
/*  (300 dpi) i podmień oba WebP. Jeśli tego nie zrobisz, podgląd pokaże   */
/*  starą listę, a link pobierze nową — czyli dwie różne oferty w jednej   */
/*  sekcji.                                                                */
/* ---------------------------------------------------------------------- */

const IMG_PODGLAD = "/images/netia-lista-kanalow-full.webp";
const IMG_FULL = "/images/netia-lista-kanalow-full.webp";
const PDF_HREF = "/pdf/NETIA_Lista_Kanałów.pdf";

/** Stan na dzień z ulotki. Jedno miejsce — używane w dwóch akapitach. */
const STAN_NA = "15.06.2026";

/* Treść SMS-a inna niż w Headerze i Hero: tutaj klient sprawdzał konkretne
   kanały, więc od razu prosimy o adres. Puste miejsce po dwukropku jest
   celowe — człowiek dopisuje adres i wysyła, bez zastanawiania się. */
const SMS_ADRES = encodeURIComponent(
  "Proszę o sprawdzenie dostępności usług pod adresem: "
);

const POZIOMY_ZOOM = [1, 2, 3, 4];

export default function ListaKanalow() {
  const [otwarty, setOtwarty] = useState(false);
  const [zoom, setZoom] = useState(1);

  const otworz = useCallback(() => {
    setZoom(1);
    setOtwarty(true);
  }, []);

  const zamknij = useCallback(() => setOtwarty(false), []);

  /* Blokada scrolla tła przy otwartym podglądzie + zamykanie Escape. */
  useEffect(() => {
    if (!otwarty) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") zamknij();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [otwarty, zamknij]);

  const zmienZoom = useCallback((kierunek: 1 | -1) => {
    setZoom((z) => {
      const i = POZIOMY_ZOOM.indexOf(z);
      const nowy = POZIOMY_ZOOM[Math.min(Math.max(i + kierunek, 0), POZIOMY_ZOOM.length - 1)];
      return nowy ?? z;
    });
  }, []);

  return (
    <section
      id="programy-tv"
      className="relative w-full overflow-x-hidden scroll-mt-[88px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      style={{ backgroundColor: "#0B2A3D" }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/70 sm:text-xs">
            <Tv size={13} className="shrink-0 text-teal-300" />
            233 kanały w ofercie
          </div>
          <h2 className="text-balance text-[28px] font-extrabold leading-[1.15] text-white sm:text-4xl">
            Pełna lista <span className="text-teal-400">kanałów TV</span>.
          </h2>
          <p className="mx-auto mt-3 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-slate-400">
            Pakiety XS, S, M i L wraz z numeracją i pakietami dodatkowymi. Tapnij, żeby
            powiększyć, albo pobierz PDF na telefon.
          </p>
        </div>

        {/* [PODGLĄD] Cała miniatura jest przyciskiem — na telefonie nikt nie
            celuje w małą ikonkę lupy w rogu, tylko tapie w to, co chce
            zobaczyć. Ikona w rogu zostaje jako sygnał, że da się powiększyć. */}
        <button
          type="button"
          onClick={otworz}
          aria-label="Powiększ listę kanałów"
          className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white transition-transform duration-150 active:scale-[0.99]"
        >
          <img
            src={IMG_PODGLAD}
            alt="Lista kanałów TV Netia — pakiety XS, S, M i L wraz z numeracją kanałów i pakietami dodatkowymi"
            width={1100}
            height={1560}
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#0B2A3D]/90 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm">
            <Maximize2 size={14} className="text-teal-300" />
            Powiększ
          </span>
        </button>

        <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={otworz}
            className="flex min-h-[52px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02]"
          >
            <Maximize2 size={16} className="shrink-0 text-teal-300" />
            POWIĘKSZ LISTĘ
          </button>
          <a
            href={PDF_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02]"
          >
            <Download size={16} className="shrink-0 text-teal-300" />
            POBIERZ PDF
          </a>
        </div>

        {/* [CTA] Sekcja kończy się pytaniem "czy mam to pod swoim adresem" —
            i tu jest jedyne sensowne miejsce, żeby odpowiedzieć. */}
        <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/[0.06] px-4 py-5 text-center sm:px-6">
          <h3 className="text-balance text-lg font-extrabold leading-tight text-white sm:text-xl">
            Sprawdź dostępność usług
          </h3>
          <p className="mx-auto mt-2 max-w-md text-pretty text-[0.9375rem] leading-relaxed text-white/70">
            Zadzwoń albo wyślij SMS z adresem — sprawdzimy, jaka technologia jest
            dostępna w Twoim budynku i które pakiety możesz zamówić.
          </p>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={`tel:${PHONE_HREF}`}
              onClick={() => trackContact("kanaly_phone_button")}
              className="flex min-h-[52px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl bg-teal-500 px-4 text-[13px] font-bold text-[#0a1a2b] transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02]"
            >
              <Phone size={16} className="shrink-0" />
              <span className="whitespace-nowrap tabular-nums">ZADZWOŃ {PHONE}</span>
            </a>
            <a
              href={`sms:${PHONE_HREF}?body=${SMS_ADRES}`}
              onClick={() => trackContact("kanaly_sms_button")}
              className="flex min-h-[52px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.97] sm:text-sm sm:hover:scale-[1.02]"
            >
              <MessageCircle size={16} className="shrink-0 text-teal-300" />
              WYŚLIJ SMS Z ADRESEM
            </a>
          </div>
        </div>

        {/* [STOPKA PRAWNA] Treść ze stopki ulotki, bez skracania. */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5">
          <p className="text-pretty text-[11px] leading-relaxed text-white/40 sm:text-xs">
            Do Pakietów S 4K i M 4K Abonent otrzymuje w ramach tymczasowego otwartego
            okna kanały Inultra 4K, MyZen 4K, Museum 4K, Love Nature 4K, TravelXP 4K
            oraz Tele 5 HD, Polonia 1, 4fun.TV, 4fun Dance, 4fun Kids, Stars TV HD. Do
            Pakietu M 4K Abonent otrzymuje promocyjnie na 24 Okresy Rozliczeniowe 6
            kanałów: Nick Jr., Nickelodeon Polska, Nicktoons, TeenNick, Cinemax HD,
            Cinemax 2 HD. Do Pakietu L 4K Abonent otrzymuje promocyjnie na 24 Okresy
            Rozliczeniowe 2 kanały: Cinemax HD, Cinemax 2 HD. Dostępność kanałów 4K
            tylko na odbiornikach 4K. Zestawienie prezentuje stan na {STAN_NA} r. i
            obejmuje kanały gwarantowane oraz niegwarantowane. Operator ma prawo
            zaprzestać udostępniania kanałów niegwarantowanych w każdym czasie, a
            Abonent nie ma z tego tytułu prawa do rezygnacji z umowy. Kanały
            gwarantowane są oznaczone „*”.
          </p>
          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-white/40 sm:text-xs">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>
              Nagrywarka z 7-dniową historią: w pakietach M i L za 0 zł, w pakiecie S
              za 5 zł.
            </span>
          </p>
        </div>
      </div>

      {/* --- PODGLĄD PEŁNOEKRANOWY -------------------------------------- */}
      {otwarty && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#06161f]"
          role="dialog"
          aria-modal="true"
          aria-label="Lista kanałów — podgląd"
        >
          {/* Pasek narzędzi. `pt-[env(safe-area-inset-top)]` trzyma przyciski
              poniżej notcha na iPhonie. */}
          <div
            className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2"
            style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
          >
            <span className="pl-2 text-sm font-bold text-white">Lista kanałów</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => zmienZoom(-1)}
                disabled={zoom === POZIOMY_ZOOM[0]}
                aria-label="Pomniejsz"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white disabled:opacity-30"
              >
                <ZoomOut size={18} />
              </button>
              <span className="w-10 text-center text-xs font-bold tabular-nums text-white/60">
                {zoom}×
              </span>
              <button
                type="button"
                onClick={() => zmienZoom(1)}
                disabled={zoom === POZIOMY_ZOOM[POZIOMY_ZOOM.length - 1]}
                aria-label="Powiększ"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white disabled:opacity-30"
              >
                <ZoomIn size={18} />
              </button>
              <button
                type="button"
                onClick={zamknij}
                aria-label="Zamknij podgląd"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-[#0a1a2b]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Kontener przewijany w dwóch osiach. Przy zoomie 1× obraz mieści
              się na szerokość, przy wyższych przewija się w bok — panning
              robi natywny scroll, nie własna obsługa gestów. */}
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-white">
            <img
              src={IMG_FULL}
              alt="Lista kanałów TV Netia — pakiety XS, S, M i L wraz z numeracją kanałów i pakietami dodatkowymi"
              width={1749}
              height={2481}
              onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
              className="h-auto max-w-none"
              style={{ width: `${zoom * 100}%` }}
            />
          </div>

          <div
            className="shrink-0 border-t border-white/10 px-3 py-2"
            style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
          >
            <a
              href={PDF_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-[13px] font-bold text-white"
            >
              <Download size={16} className="text-teal-300" />
              POBIERZ PDF
            </a>
          </div>
        </div>
      )}
    </section>
  );
}