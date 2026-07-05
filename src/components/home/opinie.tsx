"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  initials: string;
  name: string;
  city: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    initials: "MK",
    name: "Marta K.",
    city: "Warszawa",
    quote:
      "Montaż był naprawdę w 24 godziny, tak jak obiecywali. Internet działa stabilnie nawet wieczorami, kiedy cała rodzina siedzi online.",
  },
  {
    initials: "PS",
    name: "Piotr S.",
    city: "Kraków",
    quote:
      "Przesiadka z innego operatora zajęła mi 10 minut przez telefon. Zero ukrytych opłat — cena taka, jaką podali od razu.",
  },
  {
    initials: "AN",
    name: "Anna N.",
    city: "Wrocław",
    quote:
      "Pracuję zdalnie i to pierwszy dostawca, przy którym połączenie na wideokonferencjach się nie zrywa. Wsparcie techniczne odebrało od razu.",
  },
];

const sectionBgStyle = { backgroundColor: "#0B2A3D" } as const;
const AUTO_ADVANCE_MS = 5500;

// Slide direction is passed in as the `custom` prop, so enter/exit sides
// depend on whether we're moving forward or backward through the list.
const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

const Stars = memo(function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-teal-400 text-teal-400`} />
      ))}
    </div>
  );
});

export default function Opinie() {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setState(([current]) => {
      const len = testimonials.length;
      const dir = next > current || (current === len - 1 && next === 0) ? 1 : -1;
      return [((next % len) + len) % len, dir];
    });
  }, []);

  const advance = useCallback(() => {
    setState(([current]) => [(current + 1) % testimonials.length, 1]);
  }, []);

  // Auto-advance, paused when the user prefers reduced motion. Restarts
  // the timer whenever `index` changes (manual nav resets the countdown too).
  useEffect(() => {
    if (reduceMotion) return;
    timerRef.current = setInterval(advance, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index, reduceMotion, advance]);

  const item = testimonials[index];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-16 px-8" style={sectionBgStyle}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              OPINIE KLIENTÓW
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-white">
              Zaufało nam <span className="text-teal-400">2,4 mln klientów</span>
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Stars />
              <span className="text-sm text-slate-400">4.8/5 z ponad 1200 opinii</span>
            </div>
          </div>

          <div
            className="relative rounded-2xl border border-white/10 bg-[#0d1f31] p-8 md:p-10"
            onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
            onMouseLeave={() => {
              if (!reduceMotion) timerRef.current = setInterval(advance, AUTO_ADVANCE_MS);
            }}
          >
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Poprzednia opinia"
              className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0B2A3D] text-slate-400 hover:text-teal-300 hover:border-teal-400/30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Następna opinia"
              className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0B2A3D] text-slate-400 hover:text-teal-300 hover:border-teal-400/30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="min-h-[160px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <m.div
                  key={item.name}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-center max-w-xl"
                >
                  <div className="flex justify-center mb-4">
                    <Stars />
                  </div>
                  <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                    “{item.quote}”
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-xs font-bold text-teal-300">
                      {item.initials}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.city}</p>
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Pokaż opinię ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-teal-400" : "w-1.5 bg-white/20 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}