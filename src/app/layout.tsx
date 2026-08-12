import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { KonfiguratorProvider } from '@/components/Konfigurator/konfigurator';
import CookieConsent from '@/components/CookieConsent';
import AdIdCapture from '@/components/AdIdCapture';
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

export const metadata = {
  metadataBase: new URL("https://www.swiatlowod-netia-oferta.pl"),
  title: 'Netia - Internet Światłowodowy',
  description: '...',
};

const META_PIXEL_ID = "2143913536525465";
const GA_MEASUREMENT_ID = "G-6YND0DQLWL";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={geistSans.variable}>
      <body>
        <AdIdCapture />

        <KonfiguratorProvider>
          <Header />
          {children}
          <Footer />
        </KonfiguratorProvider>

        <CookieConsent />

        {/* Meta Pixel — Netia-Oferta-Pixel (Meta Business Suite) */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* Śledzenie kliknięć w numery telefonu (tel:) — GA4 + Meta Pixel */}
        <Script
          id="phone-click-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('click', function (e) {
                var link = e.target.closest('a[href^="tel:"]');
                if (!link) return;

                var phoneNumber = link.getAttribute('href').replace('tel:', '');

                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'phone_call_click', {
                    event_category: 'contact',
                    event_label: phoneNumber,
                    phone_number: phoneNumber,
                    value: 1
                  });
                } else if (Array.isArray(window.dataLayer)) {
                  window.dataLayer.push({
                    event: 'phone_call_click',
                    event_category: 'contact',
                    event_label: phoneNumber,
                    phone_number: phoneNumber
                  });
                }

                if (typeof window.fbq === 'function') {
                  window.fbq('trackCustom', 'PhoneCallClick', { phone: phoneNumber });
                }
              }, true);
            `,
          }}
        />

        <Analytics />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}