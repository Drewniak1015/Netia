import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { KonfiguratorProvider } from '@/components/Konfigurator/konfigurator';
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // FIX (CLS, mobile-only): "swap" podmienia font zastępczy na Geist gdy
  // tylko się doładuje — na wolnym łączu (Lighthouse Mobile throttling)
  // to okno jest długo widoczne, a na wąskim viewporcie mobilnym nawet
  // drobna różnica w szerokości znaków potrafi przełamać tekst na inną
  // liczbę linii (na desktopie zwykle nie, bo jest więcej "luzu" w wierszu).
  // "optional" mówi przeglądarce: jeśli font nie zdąży w ~100ms, zostań
  // przy foncie zastępczym na cały ten load — zero ryzyka shiftu z fonta.
  // Font i tak trafia do cache, więc kolejne wizyty i tak go użyją od razu.
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
});

export const metadata = {
  // FIX (SEO — "URL nie jest bezwzględny"): bez metadataBase Next.js nie
  // wie jak zamienić względne ścieżki (np. w alternates.canonical na
  // poszczególnych stronach) na pełne, bezwzględne URL-e — więc albo
  // canonical w ogóle się nie generuje, albo generuje się jako ścieżka
  // względna, dokładnie to co zgłosił Lighthouse. metadataBase ustawia
  // domenę-bazę dla WSZYSTKICH stron w apce naraz (canonical, Open Graph
  // images, itd.) — nie trzeba tego powtarzać na każdej podstronie.
  //
  // PODMIEŃ na docelową domenę produkcyjną, jeśli inna niż netia.vercel.app
  // (np. po podpięciu własnej domeny netia.pl) — inaczej canonical i tak
  // będzie wskazywał na adres Vercela zamiast na finalną domenę.
  metadataBase: new URL("https://netia.vercel.app"),
  title: 'Netia - Internet Światłowodowy',
  description: '...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <KonfiguratorProvider>
          <Header />
          {children}
          <Footer />
        </KonfiguratorProvider>
      </body>
    </html>
  );
}