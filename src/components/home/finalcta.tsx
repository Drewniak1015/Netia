"use client";

import { Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/components/home/Offersdata";

/* ---------------------------------------------------------------------- */
/*  Final CTA — zdjęcie w tle jako overlay (jak na screenie), białe CTA   */
/*  na ciemnym tle dla kontrastu z resztą strony.                        */
/*                                                                        */
/*  Treść oparta na belief #6 z beliefes.docx (urgency): "jeśli nie       */
/*  zadziałam teraz, utknę z tą samą frustracją przy kolejnej awarii/     */
/*  podwyżce" — to ostatni argument tuż przed konwersją.                 */
/*                                                                        */
/*  UWAGA: <div style={{ backgroundImage: ... }}> wskazuje na             */
/*  /images/final-cta.jpg — placeholder, podmień na docelowe zdjęcie.     */
/*  Bez animacji, zgodnie z wcześniejszymi ustaleniami.                  */
/* ---------------------------------------------------------------------- */
export default function FinalCTA() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/final-cta.jpg)" }}
      />
      <div className="absolute inset-0 bg-[#0B2A3D]/85" />

      <div className="relative max-w-305 mx-auto px-8 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl md:text-5xl font-extrabold leading-tight text-white">
          Nie czekaj na kolejną awarię, żeby to zmienić
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-200">
          Realna prędkość, cena zapisana w umowie i serwisant w 24h — sprawdź
          dostępność pod swoim adresem, zanim znowu zabraknie Ci internetu.
        </p>

        <a
          href={`tel:${PHONE_HREF}`}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#0B2A3D] hover:bg-slate-100"
        >
          <Phone className="h-5 w-5" />
          SPRAWDŹ DOSTĘPNOŚĆ — {PHONE}
        </a>
      </div>
    </section>
  );
}