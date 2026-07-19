import { pagesMetadata } from "@/lib/seo/pages-metadata";
import PodsumowanieClient from "@/app/konfigurator/podsumowanie/PodsumowanieClient";

export const metadata = pagesMetadata.konfiguratorPodsumowanie;

export default function Page() {
  return <PodsumowanieClient />;
}