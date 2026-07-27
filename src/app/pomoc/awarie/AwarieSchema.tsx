// AwarieSchema.tsx
//
// JSON-LD schema.org dla strony /pomoc/awarie: HowTo (6 kroków naprawczych)
// + ContactPoint (numery infolinii jako część Organization). Renderuje
// wyłącznie tagi <script>, bez widocznego UI.
//
// Umieść w tym samym folderze co page.tsx tej trasy i importuj obok
// <AwarieClient /> — patrz przykład na dole tego komentarza.
//
// import AwarieClient from "./NetiaZglaszanieAwariiPomocPage";
// import { AwarieSchema } from "./AwarieSchema";
//
// export default function Page() {
//   return (
//     <>
//       <AwarieSchema />
//       <AwarieClient />
//     </>
//   );
// }

import { AWARIE_STEPS, AWARIE_CONTACTS } from "./awarie-schema-data";

export function AwarieSchema() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Jak naprawić awarię Internetu lub Telewizji Netia",
    description:
      "Instrukcja krok po kroku pozwalająca samodzielnie zdiagnozować i często rozwiązać problem z Internetem lub Telewizją Netia przed zgłoszeniem awarii.",
    step: AWARIE_STEPS.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Netia S.A.",
    url: "https://netia.vercel.app",
    contactPoint: AWARIE_CONTACTS.map((contact) => ({
      "@type": "ContactPoint",
      contactType: contact.contactType,
      telephone: contact.telephone,
      areaServed: contact.areaServed,
      availableLanguage: contact.availableLanguage,
      hoursAvailable: contact.hoursAvailable,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </>
  );
}