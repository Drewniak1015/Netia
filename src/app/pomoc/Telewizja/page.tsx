import { pagesMetadata } from "@/lib/seo/pages-metadata";
import TelewizjaClient from "./TelewizjaClient";

export const metadata = pagesMetadata.pomocTelewizja;

export default function Page() {
  return <TelewizjaClient />;
}