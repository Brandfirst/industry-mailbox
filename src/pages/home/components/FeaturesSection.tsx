
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bell, Globe, Mail, RefreshCw, Search, ShieldCheck } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-[#FF5722]" />,
      title: "Søk & Filtrer",
      description: "Finn raskt relevante nyhetsbrev med avansert søk og filtrering basert på bransje, emne og mer."
    },
    {
      icon: <Globe className="h-6 w-6 text-[#FF5722]" />,
      title: "Global Dekning",
      description: "Tilgang til nyhetsbrev fra hele verden, oversatt og kategorisert for enkel tilgang."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-[#FF5722]" />,
      title: "Dybdeanalyse",
      description: "Forstå trender og mønstre i markedsføring via nyhetsbrev med våre analytiske verktøy."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#FF5722]" />,
      title: "Sikkerhet",
      description: "All data er kryptert og lagret sikkert med høyeste personvernstandarder."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#FF5722]" />,
      title: "Automatisk Synkronisering",
      description: "Hold arkivet ditt oppdatert med automatisk synkronisering av nye nyhetsbrev."
    },
    {
      icon: <Bell className="h-6 w-6 text-[#FF5722]" />,
      title: "Varsler",
      description: "Få varsler når nye nyhetsbrev som matcher dine interesser blir lagt til."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="features">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-[#FF5722] bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
            Funksjoner
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Alt du trenger for å mestre nyhetsbrevmarkedsføring
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Utforsk verktøyene du trenger for å bli inspirert og skape effektive nyhetsbrev-kampanjer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 inline-block rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/features">
            <Button className="bg-[#FF5722] hover:bg-orange-600 text-white font-medium rounded-lg">
              Se alle funksjoner <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
