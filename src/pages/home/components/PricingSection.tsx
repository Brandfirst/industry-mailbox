
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  // Pricing tiers
  const pricingTiers = [
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
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-white border-[#FF5722]/30 bg-[#FF5722]/5 px-3 py-1">
            Prisplaner
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 pricing-header inline-block px-6 py-2 border rounded-lg text-white">Finn den riktige planen for deg</h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Vi tilbyr fleksible prisplaner for å passe ethvert behov, fra enkeltpersoner til store byråer.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div key={index} className={`relative rounded-xl p-6 transition-all ${tier.popular ? 'bg-[#FF5722]/10 border border-[#FF5722]/30 shadow-xl' : 'bg-black border border-gray-800'}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-[#FF5722] text-xs font-bold rounded-full text-white">
                  Mest Populær
                </div>
              )}
              <h3 className="text-2xl font-bold mb-1 text-white">{tier.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-white mb-1">{tier.period}</span>
              </div>
              <p className="text-white mb-6">{tier.description}</p>
              <div className="mb-8">
                <div className="text-sm font-medium mb-4 text-white">Inkluderer:</div>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="text-green-400 w-5 h-5 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button className={`w-full ${tier.popular ? 'bg-[#FF5722] hover:bg-[#FF8A50] text-white border border-[#FF5722]' : 'border border-[#FF5722] text-white hover:bg-[#FF5722]/10'}`}>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 text-white max-w-2xl mx-auto">
          <p>Alle planer inkluderer 14 dagers gratis prøveperiode. Ingen kredittkortinformasjon nødvendig. Du kan avbryte når som helst.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
