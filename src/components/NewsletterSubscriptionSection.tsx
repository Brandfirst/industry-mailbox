
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const NewsletterSubscriptionSection = () => {
  const { isEditMode } = useEditMode();
  const [email, setEmail] = useState("");
  const [sectionTitle, setSectionTitle] = useState("Få eksklusive markedsføringstips");
  const [sectionDescription, setSectionDescription] = useState(
    "Registrer deg for vårt ukentlige nyhetsbrev og få eksklusive innsikter og tips om nyhetsbrev-markedsføring."
  );
  const [buttonText, setButtonText] = useState("Abonner");
  const [disclaimerText, setDisclaimerText] = useState(
    "Ved å registrere deg godtar du våre vilkår og personvernerklæring. Du kan når som helst melde deg av."
  );
  
  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#FF5722]/10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-gradient-to-br from-[#FF5722]/20 to-[#FF5722]/10 rounded-2xl border border-[#FF5722]/20 p-8 md:p-12 text-center">
          <EditableText 
            text={sectionTitle}
            onSave={setSectionTitle}
            className="text-2xl md:text-3xl font-bold mb-4 text-white"
            as="h2"
          />
          <EditableText 
            text={sectionDescription}
            onSave={setSectionDescription}
            className="text-gray-300 mb-8 max-w-xl mx-auto"
            as="p"
          />
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Din e-postadresse" 
              className="bg-black/30 backdrop-blur-sm border-[#FF5722]/20 text-white rounded-xl" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="gradient-button bg-[#FF5722] hover:bg-[#FF8A50]">
              <EditableText 
                text={buttonText}
                onSave={setButtonText}
                className="text-white"
                as="span"
              />
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <EditableText 
            text={disclaimerText}
            onSave={setDisclaimerText}
            className="text-xs text-gray-400 mt-4"
            as="p"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscriptionSection;
