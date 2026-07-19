import OfertaMax from "@/components/SpecjalneOferty/Max";
import NetiaFAQ from "@/components/SpecjalneOferty/Faq";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyMax;

export default function OfertaMaxPage() {
  return <><OfertaMax /><NetiaFAQ /></>;
}