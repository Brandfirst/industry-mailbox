
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const HeroSection = () => {
  const { isEditMode } = useEditMode();
  const [headline, setHeadline] = useState("Norges største database av nyhetsbrev");
  const [subheadline, setSubheadline] = useState("Få innsikt, inspirasjon og konkurransefortrinn ved å følge med på de beste nyhetsbrevene i markedet.");
  const [ctaText, setCtaText] = useState("Start gratis prøveperiode");
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF5722]/10 to-black/0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/hero-pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        <div className="max-w-4xl mx-auto mb-8">
          <EditableText 
            text={headline}
            onSave={setHeadline}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            as="h1"
          />
          <EditableText 
            text={subheadline}
            onSave={setSubheadline}
            className="text-xl text-gray-300 mb-8"
            as="p"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#FF5722] hover:bg-[#FF8A50] text-white px-8">
              <EditableText 
                text={ctaText}
                onSave={setCtaText}
                className="text-white"
                as="span"
              />
            </Button>
            <Button size="lg" variant="outline" className="border-[#FF5722]/40 text-white hover:bg-[#FF5722]/10 px-8">
              <Search className="h-5 w-5 mr-2" />
              Søk i databasen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
