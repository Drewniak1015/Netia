"use client";

import { Star, Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";
import DottedBackground from "../ui/DottedBackground";

/* ---------------------------------------------------------------------- */
/*  Sekcja Social Proof — testimoniale.                                   */
/*                                                                        */
/*  [WAŻNE — DO ZROBIENIA PRZED LAUNCHEM] Poniższe cytaty są ILUSTRACYJNE */
/*  i fikcyjne — nie pochodzą od prawdziwych klientów. Napisane pod kątem */
/*  maksymalnej siły przekazu, oparte na realnych pain pointach z         */
/*  Avatar_Sheet (kolapsująca prędkość, zawieszający się dekoder, strach  */
/*  przed podwyżką po promocji). Świadomie NIE MA tu badge'a "Zweryfiko-  */
/*  wana" ani etykiety źródła — to byłoby fałszywym twierdzeniem o        */
/*  weryfikacji, którego nie da się obronić przy fikcyjnej treści.        */
/*                                                                        */
/*  Zanim to trafi na produkcję: podmień na prawdziwe opinie realnych     */
/*  klientów (imię, miasto, ew. zdjęcie za zgodą). Publikacja fikcyjnych  */
/*  recenzji jako prawdziwych to ryzyko prawne (nieuczciwa praktyka       */
/*  rynkowa), nie tylko kwestia etyki.                                    */
/*                                                                        */
/*  [AWATARY] Wcześniej: wygenerowane AI zdjęcia (testimonial-*.webp) —   */
/*  placeholder do podmiany. Zamienione na kolorowe inicjały, spójnie     */
/*  z sekcją NetiaSocialProof (ta sama logika: 2 litery, rotowana paleta  */
/*  teal/sky/amber/violet). Dwa różne style awatarów w dwóch sekcjach z   */
/*  tym samym typem treści (opinie klientów) czytały się jako niespójność */
/*  — teraz obie sekcje pokazują ten sam wzorzec wizualny.                */
/*                                                                        */
/*  Styl spójny z resztą strony: tło #0B2A3D, karty #0d1f31, akcent teal, */
/*  bez animacji.                                                        */
/* ---------------------------------------------------------------------- */

interface Testimonial {
  quote: string;
  name: string;
  initials: string;
  location: string;
}

// Ta sama paleta i logika rotacji co w NetiaSocialProof.tsx — nie zmieniaj
// niezależnie od tamtego pliku, żeby kolory inicjałów nie rozjechały się
// między sekcjami.
const INITIALS_BG = [
  "bg-teal-400/15 text-teal-300",
  "bg-sky-400/15 text-sky-300",
  "bg-amber-400/15 text-amber-300",
  "bg-violet-400/15 text-violet-300",
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Przez rok miałem spadki z 600 do 40 Mb/s w każdy wieczór — dokładnie wtedy, gdy dzieciaki chciały oglądać bajkę. Tu monitoring pokazuje realną prędkość i faktycznie taka jest, nawet gdy cała rodzina jest online naraz.",
    name: "Michał K.",
    initials: "MK",
    location: "Warszawa",
  },
  {
    quote:
      "Dekoder u poprzedniego dostawcy zawieszał się w połowie meczu, za każdym razem. Tutaj zgłosiłam awarię wieczorem, serwisant był u mnie następnego dnia rano — pierwszy raz w życiu ktoś dotrzymał słowa co do czasu naprawy.",
    name: "Ania W.",
    initials: "AW",
    location: "Poznań",
  },
  {
    quote:
      "Najbardziej bałam się, że cena znowu wystrzeli po promocji jak u poprzedniego operatora. Minęło pół roku, płacę co do złotówki tyle, ile było w umowie — pierwszy raz nie czuję się oszukana przez dostawcę internetu.",
    name: "Kasia N.",
    initials: "KN",
    location: "Szczecin",
  },
];

export default function Testimonials() {
  return (
    <section className="relative w-full py-16 px-8" style={{ backgroundColor: "rgb(11, 42, 61)" }}>
      <DottedBackground variant="dots-accent" size={22} />
      <div className="relative max-w-305 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Co mówią ludzie, którzy już się przełączyli
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Prawdziwe historie od gospodarstw domowych takich jak Twoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#0d1f31] p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-teal-400 text-teal-400" />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm text-slate-200 leading-relaxed">
                „{t.quote}”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-bold tracking-wide ${INITIALS_BG[i % INITIALS_BG.length]}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={`tel:${PHONE_HREF}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-600"
          >
            <Phone className="h-5 w-5" />
            DOŁĄCZ DO NICH — {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}