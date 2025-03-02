
import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const PricingSection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Finn den riktige planen for deg");
  const [sectionDescription, setSectionDescription] = useState(
    "Vi tilbyr fleksible prisplaner for å passe ethvert behov, fra enkeltpersoner til store byråer."
  );
  
  // Pricing tiers
  const [pricingTiers, setPricingTiers] = useState([
    {
      name: "Basis",
      price: "499 kr",
      period: "per måned",
      description: "Perfekt for enkeltpersoner og små team",
      features: [
        "500 nyhetsbrev per måned",
        "Grunnleggende analyse",
        "5 lagrede søk",
        "E-post support"
      ],
      cta: "Prøv gratis"
    },
    {
      name: "Pro",
      price: "999 kr",
      period: "per måned",
      description: "For profesjonelle markedsførere",
      features: [
        "Ubegrenset nyhetsbrev",
        "Avansert analyse og innsikt",
        "Ubegrensede lagrede søk",
        "Prioritert support",
        "API-tilgang"
      ],
      cta: "Få tilgang nå",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Kontakt oss",
      period: "skreddersydd",
      description: "For større byråer med spesielle behov",
      features: [
        "Alt i Pro-pakken",
        "Dedikert supportkontakt",
        "Skreddersydde rapporter",
        "Teamopplæring",
        "White-label muligheter"
      ],
      cta: "Kontakt salg"
    }
  ]);

  const handleTierUpdate = (tierIndex: number, field: string, value: string) => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], [field]: value };
    setPricingTiers(updatedTiers);
  };

  const handleFeatureUpdate = (tierIndex: number, featureIndex: number, value: string) => {
    const updatedTiers = [...pricingTiers];
    const updatedFeatures = [...updatedTiers[tierIndex].features];
    updatedFeatures[featureIndex] = value;
    updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], features: updatedFeatures };
    setPricingTiers(updatedTiers);
  };

  const [disclaimerText, setDisclaimerText] = useState(
    "Alle planer inkluderer 14 dagers gratis prøveperiode. Ingen kredittkortinformasjon nødvendig. Du kan avbryte når som helst."
  );

  return (
    <section className="py-20 bg-gradient-to-b from-[#FF5722]/20 to-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#FF8A50] border-[#FF5722]/30 bg-[#FF5722]/5 px-3 py-1">
            Prisplaner
          </Badge>
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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, tierIndex) => (
            <div key={tierIndex} className={`relative rounded-xl p-6 transition-all ${tier.popular ? 'bg-gradient-to-b from-[#FF5722]/30 to-[#FF5722]/10 border border-[#FF5722]/30 shadow-xl' : 'bg-[#FF5722]/10 border border-gray-800'}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-[#FF5722] text-xs font-bold rounded-full text-white">
                  Mest Populær
                </div>
              )}
              <EditableText 
                text={tier.name}
                onSave={(value) => handleTierUpdate(tierIndex, 'name', value)}
                className="text-2xl font-bold mb-1 text-white"
                as="h3"
              />
              <div className="flex items-end gap-1 mb-2">
                <EditableText 
                  text={tier.price}
                  onSave={(value) => handleTierUpdate(tierIndex, 'price', value)}
                  className="text-3xl font-bold text-white"
                  as="span"
                />
                <EditableText 
                  text={tier.period}
                  onSave={(value) => handleTierUpdate(tierIndex, 'period', value)}
                  className="text-gray-400 mb-1"
                  as="span"
                />
              </div>
              <EditableText 
                text={tier.description}
                onSave={(value) => handleTierUpdate(tierIndex, 'description', value)}
                className="text-gray-300 mb-6"
                as="p"
              />
              <div className="mb-8">
                <div className="text-sm font-medium mb-4 text-white">Inkluderer:</div>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="text-green-400 w-5 h-5 mr-2 shrink-0 mt-0.5" />
                      <EditableText 
                        text={feature}
                        onSave={(value) => handleFeatureUpdate(tierIndex, featureIndex, value)}
                        className="text-sm text-gray-300"
                        as="span"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <Button className={`w-full ${tier.popular ? 'bg-[#FF5722] hover:bg-[#FF8A50] text-white' : 'border border-[#FF5722]/30 text-[#FF8A50] hover:bg-[#FF5722]/10'}`}>
                <EditableText 
                  text={tier.cta}
                  onSave={(value) => handleTierUpdate(tierIndex, 'cta', value)}
                  className={tier.popular ? 'text-white' : 'text-[#FF8A50]'}
                  as="span"
                />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 text-gray-400 max-w-2xl mx-auto">
          <EditableText 
            text={disclaimerText}
            onSave={setDisclaimerText}
            className="text-gray-400"
            as="p"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
