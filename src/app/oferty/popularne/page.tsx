import PopularneOferty from "@/components/SpecjalneOferty/Popularne";
import { PopularneOfertySchema } from "@/components/SpecjalneOferty/Popularneofertyschema";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyPopularne;

export default function Page() {
  return (
    <main>
      <PopularneOfertySchema />
      <PopularneOferty />
    </main>
  );
}