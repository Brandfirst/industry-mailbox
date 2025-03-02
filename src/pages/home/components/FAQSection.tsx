
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const FAQSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FF5722]/20 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ofte stilte spørsmål</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Få svar på de vanligste spørsmålene om NewsletterHub.
          </p>
        </div>
        
        <div className="space-y-4">
          <Collapsible className="bg-[#FF5722]/10 rounded-lg border border-[#FF5722]/10">
            <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
              <span className="text-lg font-medium text-white">Hva er NewsletterHub?</span>
              <ChevronDown className="h-5 w-5 text-[#FF8A50] transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 text-gray-300">
              <p>NewsletterHub er Norges største database av nyhetsbrev. Vi samler inn, analyserer og kategoriserer nyhetsbrev fra tusenvis av norske merkevarer, slik at markedsførere og byråer kan finne inspirasjon, analysere trender og forbedre sine egne nyhetsbrev.</p>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="bg-[#FF5722]/10 rounded-lg border border-[#FF5722]/10">
            <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
              <span className="text-lg font-medium text-white">Hvordan fungerer tjenesten?</span>
              <ChevronDown className="h-5 w-5 text-[#FF8A50] transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 text-gray-300">
              <p>Etter registrering får du umiddelbart tilgang til vår omfattende database. Du kan søke basert på bransje, merkevare, emne og mer. Se nyhetsbrev i full størrelse, analyser elementene og få inspirasjon til dine egne kampanjer.</p>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="bg-[#FF5722]/10 rounded-lg border border-[#FF5722]/10">
            <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
              <span className="text-lg font-medium text-white">Hvor ofte oppdateres databasen?</span>
              <ChevronDown className="h-5 w-5 text-[#FF8A50] transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 text-gray-300">
              <p>Vår database oppdateres daglig med de nyeste nyhetsbrevene fra alle registrerte merkevarer. Det betyr at du alltid har tilgang til de siste trendene og kampanjene i markedet.</p>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="bg-[#FF5722]/10 rounded-lg border border-[#FF5722]/10">
            <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
              <span className="text-lg font-medium text-white">Kan jeg prøve tjenesten før jeg kjøper?</span>
              <ChevronDown className="h-5 w-5 text-[#FF8A50] transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 text-gray-300">
              <p>Ja, alle våre planer kommer med en 14-dagers gratis prøveperiode. Du trenger ikke å oppgi betalingsinformasjon for å starte prøveperioden, og du kan avbryte når som helst.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
