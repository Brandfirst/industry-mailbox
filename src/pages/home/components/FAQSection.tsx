
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

const FAQSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 faq-header inline-block px-6 py-2 border rounded-lg border-[#FF5722]/30 text-white">Ofte stilte spørsmål</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Få svar på de vanligste spørsmålene om NewsletterHub.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium text-white">Hva er NewsletterHub?</AccordionTrigger>
            <AccordionContent className="text-gray-400">
              NewsletterHub er en plattform som samler og organiserer nyhetsbrev fra ulike kilder, slik at du enkelt kan søke, oppdage og lese relevant innhold.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium text-white">Hvordan søker jeg etter nyhetsbrev?</AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Du kan søke etter nyhetsbrev ved å bruke søkefeltet på forsiden eller navigere til "Utforsk" siden. Søk på emner, nøkkelord eller avsendere for å finne relevante nyhetsbrev.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium text-white">Koster det noe å bruke NewsletterHub?</AccordionTrigger>
            <AccordionContent className="text-gray-400">
              NewsletterHub tilbyr både gratis og betalte abonnementer. Med et gratis abonnement får du tilgang til et begrenset antall nyhetsbrev og funksjoner, mens et betalt abonnement gir deg full tilgang og flere fordeler.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium text-white">Kan jeg foreslå et nyhetsbrev som mangler?</AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Ja, du kan foreslå nyhetsbrev som mangler ved å bruke forslagsskjemaet på "Kontakt oss" siden. Vi vil vurdere forslaget ditt og legge til nyhetsbrevet hvis det passer inn i vår katalog.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium text-white">Hvordan melder jeg meg av et nyhetsbrev?</AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Du melder deg av et nyhetsbrev ved å bruke avmeldingslenken som finnes nederst i hvert nyhetsbrev. NewsletterHub er ikke ansvarlig for avmeldinger, da dette administreres av de enkelte avsenderne.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
