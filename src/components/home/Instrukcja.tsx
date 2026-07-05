import { Phone, MonitorSmartphone } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "1",
    title: "Skontaktuj się z nami",
    description:
      "Zadzwoń, wyślij SMS lub skonfiguruj pakiet Internet Netia online w naszym konfiguratorze.",
  },
  {
    number: "2",
    title: "Sprawdzimy dostępność",
    description:
      "Weryfikujemy technologię i dostępne prędkości Internetu Netia pod Twoim adresem.",
  },
  {
    number: "3",
    title: "Instalacja i aktywacja",
    description:
      "Technik instaluje usługę — Internet Netia może działać nawet następnego dnia roboczego.",
  },
];

export default function HowToOrderSection() {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto max-w-320 px-5 py-16 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Jak zamówić <span className="text-teal-300">Internet Netia</span>?
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base">
            Zamówienie Internetu Netia jest proste — wystarczą 3 kroki
          </p>
        </div>

        {/* Kroki */}
        <div className="relative mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6">
          {/* linia łącząca kropki — tylko od sm w górę */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t border-dashed border-white/15 sm:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* numerowany krążek */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white ring-4 ring-[#0B2A3D]">
                {step.number}
              </div>

              <h3 className="mt-5 text-base font-bold text-white sm:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[240px] text-sm text-white/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="tel:+48883334124"
            className="flex items-center justify-center gap-2 rounded-xl border border-teal-400/40 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/5"
          >
            <Phone size={18} className="text-teal-300" />
            Skontaktuj się
          </a>
          <a
            href="/konfigurator"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400"
          >
            <MonitorSmartphone size={18} />
            Skonfiguruj online
          </a>
        </div>
      </div>
    </section>
  );
}