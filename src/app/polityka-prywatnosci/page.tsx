import { pagesMetadata } from "@/lib/seo/pages-metadata";
import PolitykaClient from "./PolitykaClient";

export const metadata = pagesMetadata.politykaPrywatnosci;

export default function Page() {
  return <PolitykaClient />;
}