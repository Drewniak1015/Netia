import KonfiguratorFAQ from "@/components/Konfigurator/Faq";
import Konfigurator from "@/components/Konfigurator/konfigurator";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.konfigurator;

export default function Page() {
  return (
    <main>
      <Konfigurator />
      <KonfiguratorFAQ />
    </main>
  );
}