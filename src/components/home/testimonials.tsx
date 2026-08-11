"use client";

import Image from "next/image";
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
/*  klientów (imię, miasto, zdjęcie za zgodą). Publikacja fikcyjnych      */
/*  recenzji jako prawdziwych to ryzyko prawne (nieuczciwa praktyka       */
/*  rynkowa), nie tylko kwestia etyki.                                    */
/*                                                                        */
/*  Zdjęcia: testimonial-michal.webp / testimonial-ania.webp /            */
/*  testimonial-kasia.webp — wygenerowane AI, ten sam powód co wyżej:     */
/*  placeholder do podmiany, nie gotowa treść.                            */
/*                                                                        */
/*  Styl spójny z resztą strony: tło #0B2A3D, karty #0d1f31, akcent teal, */
/*  bez animacji.                                                        */
/* ---------------------------------------------------------------------- */

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  photo: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Przez rok miałem spadki z 600 do 40 Mb/s w każdy wieczór — dokładnie wtedy, gdy dzieciaki chciały oglądać bajkę. Tu monitoring pokazuje realną prędkość i faktycznie taka jest, nawet gdy cała rodzina jest online naraz.",
    name: "Michał K.",
    location: "Warszawa",
    photo: "/images/testimonial-michal.webp",
  },
  {
    quote:
      "Dekoder u poprzedniego dostawcy zawieszał się w połowie meczu, za każdym razem. Tutaj zgłosiłam awarię wieczorem, serwisant był u mnie następnego dnia rano — pierwszy raz w życiu ktoś dotrzymał słowa co do czasu naprawy.",
    name: "Ania W.",
    location: "Poznań",
    photo: "/images/testimonial-ania.webp",
  },
  {
    quote:
      "Najbardziej bałam się, że cena znowu wystrzeli po promocji jak u poprzedniego operatora. Minęło pół roku, płacę co do złotówki tyle, ile było w umowie — pierwszy raz nie czuję się oszukana przez dostawcę internetu.",
    name: "Kasia N.",
    location: "Szczecin",
    photo: "/images/testimonial-kasia.webp",
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
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#0d1f31] p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-teal-400 text-teal-400" />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm text-slate-200 leading-relaxed">
                „{t.quote}”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={t.photo}
                    alt={`${t.name}, ${t.location}`}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
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