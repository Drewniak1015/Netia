"use client";

import { Gauge, Lock, ShieldCheck } from "lucide-react";

/* [POWRÓT DO 2] Zamiast osobnych rzędów na instalację i rezygnację —
   wcisnąłem oba argumenty jako trzeci bullet w każdym z dwóch istniejących
   propów, żeby równanie Hormoziego (Dream Outcome × Prawdopodobieństwo)
   / (Czas × Wysiłek) było nadal pokryte w 4 punktach, tylko bez dokładania
   kolejnych sekcji na stronie:
   - Row 1 (prędkość) dostaje bullet o instalacji w 3 dni -> atakuje "Czas".
   - Row 2 (cena) dostaje bullet o 14 dniach na rezygnację -> atakuje
     "Wysiłek/Ryzyko".

   [TYPOGRAFIA POD TELEFONY] Oryginał skalował nagłówki tylko text-3xl ->
   md:text-4xl, więc na wąskich telefonach (< 375px) 3xl potrafi się łamać
   niekorzystnie w 2-3 linijki z ciasnym leading. Dodane pośrednie stopnie
   (text-2xl sm:text-3xl md:text-4xl), luźniejszy leading-tight na
   nagłówkach h2/h3, i zmniejszony padding sekcji na mobile
   (px-5 sm:px-8 zamiast sztywnego px-8). */

const valueProps = [
  {
    eyebrow: "Sieć światłowodowa Netii",
    icon: Gauge,
    title: "2 Gb/s, które nie spadają wieczorem.",
    body: "Większość dostawców łata mieszaną, przestarzałą infrastrukturę — dlatego prędkość zjeżdża, gdy cała ulica wraca z pracy. My korzystamy z sieci światłowodowej od podstaw, więc deklarowana prędkość to liczba, nie marketing.",
    bullets: [
      "Prawna gwarancja min. 50% deklarowanej prędkości",
      "Monitoring łącza 24/7, zanim zadzwonisz",
      "Instalacja w 3 dni, serwisant na miejscu w 24h",
    ],
    image: "/images/value-prop-siec.webp",
    imageAlt: "Technik instaluje światłowodowe łącze ONT w nowoczesnym mieszkaniu",
  },
  {
    eyebrow: "Cena zapisana w umowie",
    icon: Lock,
    title: "Rachunek, który wygląda tak samo za rok.",
    body: "Inni operatorzy podnoszą ceny w trakcie trwania umowy — zwykle po cichu, przez klauzule waloryzacyjne. Netia zapisuje cenę w umowie na cały jej okres, więc kwota, którą widzisz dziś, to kwota, którą zapłacisz za 12 i za 24 miesiące.",
    bullets: [
      "Zero klauzul waloryzacyjnych w trakcie umowy",
      "Pełna kwota po promocji widoczna od razu, bez ukrywania",
      "14 dni na rezygnację bez podania przyczyny",
    ],
    image: "/images/value-prop-cena.webp",
    imageAlt: "Osoba spokojnie sprawdza stały rachunek za internet przy porannej kawie",
  },
];

export default function Benefity() {
  return (
    <section
      className="relative overflow-hidden py-12 px-5 sm:py-16 sm:px-8"
      style={{ backgroundColor: "#0B2A3D" }}
    >
      <div className="relative mx-auto max-w-304">
        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-teal-400" />
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-teal-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Dlaczego Netia?
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Korzyści, które <span className="text-teal-400">faktycznie odczujesz</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Nie tylko liczby w reklamie — mechanizm, dzięki któremu te liczby są prawdziwe każdego dnia.
          </p>
        </div>

        {/* Value prop rows */}
        <div className="flex flex-col gap-8 sm:gap-10">
          {valueProps.map((vp, i) => {
            const Icon = vp.icon;
            const reversed = i % 2 === 1;
            return (
              <div
                key={vp.title}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
              >
                <div className={reversed ? "lg:order-2" : ""}>
                  <img
                    src={vp.image}
                    alt={vp.imageAlt}
                    className="w-full h-auto rounded-2xl border border-white/10 object-cover aspect-[4/3]"
                  />
                </div>

                <div className={reversed ? "lg:order-1" : ""}>
                  <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 text-teal-400" strokeWidth={2} />
                    <span className="text-sm font-semibold tracking-widest text-teal-400 uppercase">
                      {vp.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-snug">
                    {vp.title}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                    {vp.body}
                  </p>
                  <ul className="flex flex-col gap-2.5 sm:gap-3">
                    {vp.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                        <ShieldCheck className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}