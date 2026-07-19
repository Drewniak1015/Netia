import PopularneOferty from "@/components/SpecjalneOferty/Popularne";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyPopularne;
export default function Page() {
  return (
    <main>
      <PopularneOferty />
    </main>
  );
}