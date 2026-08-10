"use client";

/* [KOPIA] H1 na całą szerokość u góry, potem dwa akapity (stary
   sposób / Netia) obok siebie jako osobne kolumny z pionowym
   separatorem — bez list, bez kart, bez animacji. CTA wyśrodkowane
   pod spodem, na całą sekcję. */

const sectionBgStyle = { backgroundColor: "#0B2A3D" } as const;

export default function PoradnikTechnologie() {
  return (
    <section className="py-20 px-8" style={sectionBgStyle}>
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
              inwestować. Nikt nie monitoruje Twojego łącza, więc o awarii dowiadujesz się sam,
              zwykle w najgorszym możliwym momencie. Prędkość „do X Mb/s” to górny sufit, nie
              gwarancja, a cena rośnie w trakcie umowy, o czym dowiadujesz się z SMS-a.
            </p>
          </div>

          <div className="md:pl-10 md:border-l md:border-white/10">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide text-teal-400 mb-3">
              Z Netią
            </p>
            <p className="text-base md:text-lg text-white/85 leading-relaxed">
              Każde łącze, światłowodowe, kablowe czy mobilne, obejmujemy{" "}
              <span className="text-white font-semibold">tym samym monitoringiem 24/7</span>,{" "}
              <span className="text-white font-semibold">
                prawną gwarancją minimum 50% deklarowanej prędkości
              </span>{" "}
              i <span className="text-white font-semibold">ceną zapisaną w umowie na stałe</span>.
            </p>
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
        </div>
      </div>
    </section>
  );
}