import { pagesMetadata } from "@/lib/seo/pages-metadata";
import AwarieClient from "@/app/pomoc/awarie/NetiaZglaszanieAwariiPomocPage";

export const metadata = pagesMetadata.pomocAwarie;

export default function Page() {
  return <AwarieClient />;
}