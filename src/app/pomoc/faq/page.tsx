import { pagesMetadata } from "@/lib/seo/pages-metadata";
import FaqClient from "@/app/pomoc/faq/FaqClient";

export const metadata = pagesMetadata.pomocFaq;

export default function Page() {
  return <FaqClient />;
}