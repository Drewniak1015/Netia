import { pagesMetadata } from "@/lib/seo/pages-metadata";
import AwarieClient from "@/app/pomoc/awarie/NetiaZglaszanieAwariiPomocPage";
import { AwarieSchema } from "@/app/pomoc/awarie/AwarieSchema";

export const metadata = pagesMetadata.pomocAwarie;

export default function Page() {
  return (
    <>
      <AwarieSchema />
      <AwarieClient />
    </>
  );
}