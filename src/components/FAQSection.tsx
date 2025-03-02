
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const FAQSection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Ofte stilte spørsmål");
  const [sectionDescription, setSectionDescription] = useState(
    "Få svar på de vanligste spørsmålene om NewsletterHub."
  );
  
  const [faqs, setFaqs] = useState([
    {
      question: "Hva er NewsletterHub?",
      answer: "NewsletterHub er Norges største database av nyhetsbrev. Vi samler inn, analyserer og kategoriserer nyhetsbrev fra tusenvis av norske merkevarer, slik at markedsførere og byråer kan finne inspirasjon, analysere trender og forbedre sine egne nyhetsbrev."
    },
    {
      question: "Hvordan fungerer tjenesten?",
      answer: "Etter registrering får du umiddelbart tilgang til vår omfattende database. Du kan søke basert på bransje, merkevare, emne og mer. Se nyhetsbrev i full størrelse, analyser elementene og få inspirasjon til dine egne kampanjer."
    },
    {
      question: "Hvor ofte oppdateres databasen?",
      answer: "Vår database oppdateres daglig med de nyeste nyhetsbrevene fra alle registrerte merkevarer. Det betyr at du alltid har tilgang til de siste trendene og kampanjene i markedet."
    },
    {
      question: "Kan jeg prøve tjenesten før jeg kjøper?",
      answer: "Ja, alle våre planer kommer med en 14-dagers gratis prøveperiode. Du trenger ikke å oppgi betalingsinformasjon for å starte prøveperioden, og du kan avbryte når som helst."
    }
  ]);

  const handleFaqUpdate = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FF5722]/20 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <EditableText 
            text={sectionTitle}
            onSave={setSectionTitle}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            as="h2"
          />
          <EditableText 
            text={sectionDescription}
            onSave={setSectionDescription}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            as="p"
          />
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} className="bg-[#FF5722]/10 rounded-lg border border-[#FF5722]/10">
              <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
                <EditableText 
                  text={faq.question}
                  onSave={(value) => handleFaqUpdate(index, 'question', value)}
                  className="text-lg font-medium text-white text-left"
                  as="span"
                />
                <ChevronDown className="h-5 w-5 text-[#FF8A50] transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-gray-300">
                <EditableText 
                  text={faq.answer}
                  onSave={(value) => handleFaqUpdate(index, 'answer', value)}
                  className="text-gray-300"
                  as="p"
                />
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
