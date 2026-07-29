"use client";

import {
  Rocket,
  MonitorPlay,
  Tv,
  Wifi,
  Headset,
  ShieldCheck,
} from "lucide-react";
import { useRevealOnScroll } from "@/hooks/Userevealonscroll";

const benefits = [
  { icon: Rocket, title: "Internet gotowy już następnego dnia" },
  { icon: MonitorPlay, title: "238 kanałów zawsze pod ręką" },
  { icon: Tv, title: "Obraz w jakości 4K, bez zacięć" },
  { icon: Wifi, title: "Stabilne połączenie bez przerw" },
  { icon: Headset, title: "Pomoc techniczna 24/7, bez automatów" },
  { icon: ShieldCheck, title: "Ocena 4,8/5 od 2,4 mln klientów" },
];

/* [OPTYMALIZACJA] Bez framer-motion — wejście na scroll to
   IntersectionObserver + CSS @keyframes (useRevealOnScroll), stagger
   przez animation-delay per karta, hover to Tailwind
   (hover:-translate-y-1) zamiast whileHover ze springiem. */
export default function Benefity() {
  const [leftRef, leftVisible] = useRevealOnScroll<HTMLDivElement>();
  const [gridRef, gridVisible] = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="py-16 px-8" style={{ backgroundColor: "#0B2A3D" }}>
      <style>{`
        @keyframes benefityFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .benefity-reveal { opacity: 0; }
        .benefity-reveal.in-view {
          animation: benefityFadeUp 0.5s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .benefity-reveal { opacity: 1; animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-304">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-10">
          {/* Left column */}
          <div
            ref={leftRef}
            className={`benefity-reveal flex flex-col justify-center ${
              leftVisible ? "in-view" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-teal-400" />
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-teal-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Dlaczego Netia?
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Korzyści <span className="text-teal-400">dla Ciebie</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              W Netii zyskujesz szybki internet światłowodowy oraz telewizję
              z bogatą ofertą 238 kanałów w atrakcyjnych pakietach. Do tego
              dochodzą nowoczesne urządzenia – dekodery 4K i ultraszybkie
              Wi-Fi 7, a także całodobowe wsparcie techniczne, dzięki czemu
              korzystanie z usług jest wygodne i bezproblemowe.
            </p>
          </div>

          {/* Right column - benefit cards */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {benefits.map(({ icon: Icon, title }, i) => (
              <div
                key={title}
                className={`benefity-reveal rounded-xl border border-white/10 bg-[#0d1f31] p-6 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-teal-400/40 ${
                  gridVisible ? "in-view" : ""
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Icon className="h-7 w-7 text-teal-400 mb-4" strokeWidth={1.75} />
                <p className="text-white font-semibold leading-snug mb-3">{title}</p>
                <span className="block h-px w-6 bg-teal-400/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}