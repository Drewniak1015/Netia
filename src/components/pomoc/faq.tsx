import React from 'react';
import { Settings, Search, Phone, HelpCircle, Wifi, Tv } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Główny kontener z zaokrąglonymi rogami i gradientem w tle */}
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#06242c] via-[#021319] to-[#01090c] rounded-3xl p-8 md:p-16 text-center shadow-2xl border border-slate-800/50 overflow-hidden">
        
        {/* Subtelna poświata w lewym górnym rogu naśladująca obraz.png */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Górne ikony (Wi-Fi i TV) */}
        <div className="flex justify-center items-center gap-4 mb-6 text-slate-300">
          <Wifi className="w-8 h-8 stroke-[1.5]" />
          <Tv className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Główny Nagłówek */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-8">
          Netia – internet światłowodowy, telewizja IPTV i pełna oferta w jednym miejscu
        </h1>

        {/* Treść / Akapity */}
        <div className="space-y-6 text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12">
          <p>
            Jeśli wpisujesz w Google &quot;jaki internet wybrać?&quot;, &quot;internet Netia&quot;, &quot;światłowód Netia&quot; 
            albo &quot;tv Netia&quot; i chcesz znaleźć miejsce, w którym wszystko jest wyjaśnione po ludzku 
            <span className="text-slate-300"> — trafiłeś idealnie.</span>
          </p>
          
          <p>
            Tutaj znajdziesz konkrety: jak Netia dostarcza internet do mieszkania, jakie technologie stosuje, jak 
            działa telewizja IPTV, które routery instaluje technik, jakie pakiety TV są dostępne i jak 
            samodzielnie ułożyć własny zestaw usług.
          </p>
          
          <p className="italic text-xs md:text-sm text-slate-500 font-light pt-2">
            Bez marketingowych sloganów. Bez zbędnych skrótów. Po prostu realne informacje, które się przydają.
          </p>
        </div>

        {/* Dolna sekcja nawigacji / Przyciski */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          
          {/* Przycisk: Konfigurator */}
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group text-slate-300">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-medium tracking-wide">Konfigurator</span>
          </button>

          {/* Przycisk: Wyszukiwarka Kanałów */}
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group text-slate-300">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-medium tracking-wide">Wyszukiwarka Kanałów</span>
          </button>

          {/* Przycisk: Sprawdź zasięg */}
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group text-slate-300">
            <Phone className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-medium tracking-wide">Sprawdź zasięg</span>
          </button>

          {/* Przycisk: FAQ */}
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group text-slate-300">
            <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-medium tracking-wide">FAQ</span>
          </button>

        </div>

      </div>
    </div>
  );
}