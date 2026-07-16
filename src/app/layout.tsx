import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { KonfiguratorProvider } from '@/components/Konfigurator/konfigurator';
import './globals.css';

export const metadata = {
  title: 'Netia - Internet Światłowodowy',
  description: '...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
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