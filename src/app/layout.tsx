import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}