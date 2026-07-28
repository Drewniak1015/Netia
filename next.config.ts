import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // FIX (blokujące renderowanie CSS / FCP+LCP):
    // Stary `optimizeCss` (Critters) NIE działa z App Routerem — wymaga
    // pełnego, wyrenderowanego HTML-a, co jest niekompatybilne ze
    // streamingiem, którego App Router używa domyślnie. `inlineCss` to
    // odpowiednik dla App Routera: krytyczny CSS trafia bezpośrednio do
    // <head> jako <style> (zero blokującego żądania sieciowego), a reszta
    // dociera asynchronicznie. To bezpośrednio adresuje ostrzeżenie
    // Lighthouse o "…chunks/1g1vye5w8sztg.css" i "…chunks/1oa-9n2zm2_ap.css"
    // blokujących pierwsze renderowanie.
    inlineCss: true,

    // Bonus: te dwie biblioteki (lucide-react, framer-motion) eksportują
    // setki modułów. Bez tej flagi bundler może dociągać więcej niż
    // faktycznie importowane ikony/funkcje. Next automatycznie robi
    // tree-shaking per-import zamiast ładować cały pakiet.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;