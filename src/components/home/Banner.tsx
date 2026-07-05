"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MaxxBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="px-8 py-6" style={{ backgroundColor: "#0B2A3D" }}>
        <m.a
          href="/oferty/max"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className="mx-auto flex max-w-310 items-center gap-5 rounded-2xl border border-pink-500/20 bg-[#0d1f31] p-4 sm:p-5 md:pr-6 transition-colors hover:border-pink-500/40"
        >
          {/* Ikona */}
          <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white transition-colors">
            <Sparkles className="h-6 w-6" />
          </span>

          {/* Treść środkowa */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-white">
                Oferta Max — rok za 0 zł
              </p>
              <span className="shrink-0 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Nowość
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">
              Internet Max 1000 lub 2000 + TV L 4K + Bezpieczny Internet Ultra.
            </p>
          </div>

          {/* Strzałka */}
          <m.span
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600"
          >
            <ArrowRight className="h-5 w-5" />
          </m.span>
        </m.a>
      </section>
    </LazyMotion>
  );
}