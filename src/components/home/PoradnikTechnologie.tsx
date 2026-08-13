"use client";

import DottedBackground from "../ui/DottedBackground";

/* [KOPIA] H1 na całą szerokość u góry, potem dwa akapity (stary
   sposób / Netia) obok siebie jako osobne kolumny z pionowym
   separatorem — bez list, bez kart, bez animacji. CTA wyśrodkowane
   pod spodem, na całą sekcję.

   [POPRAWKI KONWERSYJNE]:
   1. Dowód społeczny dodany PRZY kolumnie "Z Netią" — trzy najmocniejsze
      deklaracje w sekcji (monitoring, gwarancja, cena na stałe) wcześniej
      stały bez żadnego potwierdzenia z zewnątrz. Belief #5 z beliefes.docx:
      to musi być niesione przez coś poza głosem firmy.
   2. Mikrocopy pod CTA dodane — ten sam wzorzec (redukcja ryzyka + lekki
      urgency), który jest już w Hero.tsx i w kartach ofert. Wcześniej
      przycisk tutaj stał samotnie, niespójnie z resztą strony.
   3. "W najgorszym możliwym momencie" zamienione na konkretną scenę
      (call, mecz, bajka dzieci) — zgodnie z Offer_Brief (Discovery Story:
      "mid-work-call, mid-movie-night, mid-match") i Avatar_Sheet
      (scenario-based pain, nie ogólniki).

   [GWARANCJA PRĘDKOŚCI — POPRAWKA]:
   4. "prawną gwarancją minimum 50% deklarowanej prędkości" zamienione na
      "umownym minimum 50% deklarowanej prędkości, pokazanym przed
      podpisaniem". To ta sama liczba, ale przesunięty ciężar: z samego
      progu (który jest ustawowy i który ma każdy operator) na moment
      ujawnienia (który jest naszą realną przewagą). Bez tej zmiany kolumna
      "Z Netią" obiecuje w tym punkcie dokładnie to samo, co kolumna "Stary
      sposób" — czyli sama sobie zaprzecza.
   5. Usunięte "Każde łącze, światłowodowe, kablowe czy mobilne" jako
      OTWARCIE zdania. To przyznanie, że pod częścią adresów nie ma
      światłowodu, stało obok nagłówka "2 Gb/s światłowód" w sekcji obok
      i uruchamiało lęk przed hybrydą (odkrycie #19 z researchu). Teraz
      technologia jest zaadresowana wprost i jako atut przejrzystości,
      a nie jako wtrącenie w środku obietnicy. */

const sectionBgStyle = { backgroundColor: "#0B2A3D" } as const;

export default function PoradnikTechnologie() {
  return (
    <section className="py-20 px-8 relative" style={sectionBgStyle}>
      <DottedBackground variant="dots-accent" size={22} />
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow + H1 */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Skąd biorą się te problemy
        </span>

        <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          To nie przez pecha zwalnia Ci internet <span className="text-teal-400">wieczorem.</span>
        </h2>

        {/* Dwie kolumny tekstu: stary sposób | Netia */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 text-left">
          <div className="md:pr-10">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide text-white/50 mb-3">
              Stary sposób
            </p>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              Większość dostawców przez lata łata tę samą, starą infrastrukturę, zamiast w nią
              inwestować. Nikt nie monitoruje Twojego łącza, więc o awarii dowiadujesz się sam —
              w trakcie ważnego calla, w środku meczu, gdy dzieciaki akurat oglądają bajkę.
              Prędkość „do X Mb/s” to górny sufit, nie gwarancja, a cena rośnie w trakcie umowy,
              o czym dowiadujesz się z SMS-a.
            </p>
          </div>

          <div className="md:pl-10 md:border-l md:border-white/10">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide text-teal-400 mb-3">
              Z Netią
            </p>
            <p className="text-base md:text-lg text-white/85 leading-relaxed">
              Twoje łącze obejmujemy{" "}
              <span className="text-white font-semibold">monitoringiem 24/7</span> i dzwonimy
              pierwsi, gdy prędkość spada. W umowie stoi{" "}
              <span className="text-white font-semibold">
                minimum 50% deklarowanej prędkości
              </span>{" "}
              oraz <span className="text-white font-semibold">cena zapisana na cały okres</span> —
              oba zapisy pokazujemy Ci przed podpisaniem, razem z technologią dostępną pod Twoim
              adresem.
            </p>

            {/* [NOWE] Dowód społeczny — te trzy deklaracje wyżej nie stoją
                już same, tylko obok liczby klientów i oceny, poza głosem
                samej firmy. */}
            {/* [ATRYBUCJA + ŹRÓDŁO] Było: "4.8/5 od 2,4 mln klientów po zmianie
                dostawcy" — sklejenie dwóch niepowiązanych liczb, czytane jako
                "2,4 mln osób wystawiło ocenę 4.8". Ocena usunięta w całości,
                bo nie ma platformy, na którą można się powołać. Zostaje sama
                liczba klientów, podpisana operatorem. Patrz komentarz
                o ocenach w lib/guarantees.ts. */}
            <div className="mt-4 text-sm text-white/60">
              Ponad 2,4 mln klientów w sieci Netia
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="/oferty/NajlepszaCena#pakiety"
            className="inline-flex items-center justify-center rounded-full bg-teal-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#0a1a2b] transition-transform hover:-translate-y-0.5"
          >
            Sprawdź dostępność pod swoim adresem
          </a>
          {/* [NOWE] Mikrocopy pod CTA — ten sam wzorzec co w Hero.tsx
              i kartach ofert: redukcja ryzyka + lekki urgency. */}
          <p className="mt-3 text-xs text-white/50">
            Zajmuje 3 minuty, bez zobowiązań. 14 dni na zmianę zdania, gdyby
            jednak było gorzej niż teraz.
          </p>
        </div>
      </div>
    </section>
  );
}