
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const CTASection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Klar til å forbedre dine nyhetsbrev?");
  const [sectionDescription, setSectionDescription] = useState(
    "Start 14-dagers gratis prøveperiode i dag og få tilgang til markedets beste nyhetsbrev-database."
  );
  const [primaryButtonText, setPrimaryButtonText] = useState("Start gratis prøveperiode");
  const [secondaryButtonText, setSecondaryButtonText] = useState("Se demoer");
  
  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#FF5722]/10">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="bg-gradient-to-br from-[#FF5722]/30 to-[#FF5722]/10 rounded-2xl border border-[#FF5722]/20 p-8 md:p-16">
          <EditableText 
            text={sectionTitle}
            onSave={setSectionTitle}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
            as="h2"
          />
          <EditableText 
            text={sectionDescription}
            onSave={setSectionDescription}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            as="p"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-button bg-[#FF5722] hover:bg-[#FF8A50] px-8 py-7 text-lg">
              <EditableText 
                text={primaryButtonText}
                onSave={setPrimaryButtonText}
                className="text-white"
                as="span"
              />
            </Button>
            <Button size="lg" variant="outline" className="glass-button border-[#FF5722]/30 text-white hover:bg-[#FF5722]/20 px-8 py-7 text-lg">
              <EditableText 
                text={secondaryButtonText}
                onSave={setSecondaryButtonText}
                className="text-white"
                as="span"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
