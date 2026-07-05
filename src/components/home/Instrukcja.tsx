"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { Phone, MonitorSmartphone, PhoneCall, SearchCheck, Wrench } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  Icon: React.ElementType;
};

const steps: Step[] = [
  {
    number: "1",
    title: "Skontaktuj się z nami",
    description:
      "Zadzwoń, wyślij SMS lub skonfiguruj pakiet Internet Netia online w naszym konfiguratorze.",
    Icon: PhoneCall,
  },
  {
    number: "2",
    title: "Sprawdzimy dostępność",
    description:
      "Weryfikujemy technologię i dostępne prędkości Internetu Netia pod Twoim adresem.",
    Icon: SearchCheck,
  },
  {
    number: "3",
    title: "Instalacja i aktywacja",
    description:
      "Technik instaluje usługę — Internet Netia może działać nawet następnego dnia roboczego.",
    Icon: Wrench,
  },
];

// Nagłówek: prosty fade + slide-up, dwa elementy w kolejności (stagger).
const headerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Kroki: kontener steruje kolejnością (stagger), każdy krok wjeżdża osobno.
const stepsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const stepItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Linia łącząca kropki: rysuje się od lewej do prawej (scaleX) po tym,
// jak kroki zaczną się pojawiać — czysto dekoracyjny, "basic" efekt.
const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HowToOrderSection() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans"
      >
        <div className="relative z-10 mx-auto max-w-320 px-5 py-16 sm:px-6 lg:px-8">
          {/* Nagłówek */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headerVariants}
            className="text-center"
          >
            <m.h2
              variants={headerItemVariants}
              className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl"
            >
              Jak zamówić <span className="text-teal-300">Internet Netia</span>?
            </m.h2>
            <m.p
              variants={headerItemVariants}
              className="mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base"
            >
              Zamówienie Internetu Netia jest proste — wystarczą 3 kroki
            </m.p>
          </m.div>

          {/* Kroki */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stepsContainerVariants}
            className="relative mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6"
          >
            {/* linia łącząca kropki — tylko od sm w górę, rysuje się od lewej */}
            <m.div
              variants={lineVariants}
              style={{ transformOrigin: "left" }}
              className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t-2 border-dashed border-teal-400/40 sm:block"
            />
            {steps.map((step) => (
              <m.div
                key={step.number}
                variants={stepItemVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* krążek z ikoną jako głównym elementem */}
                <m.div
                  whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white ring-4 ring-[#0B2A3D]"
                >
                  <step.Icon size={26} strokeWidth={2.25} />
                </m.div>
                {/* numerek kroku pod ikoną */}
                <span className="relative z-10 mt-3 text-xs font-bold uppercase tracking-wide text-teal-300">
                  Krok {step.number}
                </span>
                <h3 className="relative z-10 mt-1 text-base font-bold text-white sm:text-lg">
                  {step.title}
                </h3>
                <p className="relative z-10 mt-2 max-w-[240px] text-sm text-white/65">
                  {step.description}
                </p>
              </m.div>
            ))}
          </m.div>

          {/* CTA */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={ctaVariants}
            className="mt-14 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <m.a
              href="tel:+48883334124"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-teal-400/40 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/5"
            >
              <Phone size={18} className="text-teal-300" />
              Skontaktuj się
            </m.a>
            <m.a
              href="/konfigurator"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400"
            >
              <MonitorSmartphone size={18} />
              Skonfiguruj online
            </m.a>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}