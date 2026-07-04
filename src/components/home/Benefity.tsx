"use client";

import { motion, type Variants } from "framer-motion";
import {
  Rocket,
  MonitorPlay,
  Tv,
  Wifi,
  Headset,
  ShieldCheck,
  Router,
  Gamepad2,
} from "lucide-react";  

const benefits = [
  {
    icon: Rocket,
    title: "Ekspresowy montaż – nawet w ciągu 24 godzin",
  },
  {
    icon: MonitorPlay,
    title: "Bogata oferta kanałów i pakietów tematycznych",
  },
  {
    icon: Tv,
    title: "Nowoczesne dekodery 4K z krystalicznym obrazem",
  },
  {
    icon: Wifi,
    title: "Błyskawiczny i stabilny internet Wi-Fi",
  },
  {
    icon: Headset,
    title: "Całodobowa pomoc techniczna – wsparcie 24/7",
  },
  {
    icon: ShieldCheck,
    title: "Niezawodna jakość usług potwierdzona przez klientów",
  },
];

const stats = [
  {
    icon: Router,
    text: "Router w cenie abonamentu",
    subtext: "w wybranych pakietach",
  },
  {
    icon: Tv,
    text: "200+ kanałów, HBO Max i Netflix",
    subtext: "w wybranych pakietach",
  },
  {
    icon: Gamepad2,
    text: "Gigagrywarka w wybranych pakietach",
    subtext: "rozrywka na najwyższym poziomie",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Benefity() {
  return (
    <section className="py-20 px-8" style={{ backgroundColor: "#0B2A3D" }}>
      <div className="mx-auto max-w-305">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-10">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-teal-400" />
              <span className="text-xs font-semibold tracking-widest text-teal-400 uppercase">
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
          </motion.div>

          {/* Right column - benefit cards */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {benefits.map(({ icon: Icon, title }) => (
              <motion.div
                key={title}
                variants={item}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-teal-400/40 transition-colors"
              >
                <Icon className="h-7 w-7 text-teal-400 mb-4" strokeWidth={1.75} />
                <p className="text-white font-semibold leading-snug mb-3">
                  {title}
                </p>
                <span className="block h-px w-6 bg-teal-400/60" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          {stats.map(({ icon: Icon, text, subtext }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon className="h-6 w-6 text-teal-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <p className="text-white text-sm font-medium leading-snug">
                  {text}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{subtext}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}