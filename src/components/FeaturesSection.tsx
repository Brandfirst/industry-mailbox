import { useState } from "react";
import { Bot, Database, BarChart, Star, Award, Brain, LineChart, Search, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Avanserte verktøy for nyhetsbrev-analyse");
  const [sectionDescription, setSectionDescription] = useState(
    "Bruk kraften av AI til å få dyp innsikt i nyhetsbrev-strategi, innholdstyper og engasjementsnivåer."
  );
  
  const [featureTitle, setFeatureTitle] = useState("AI scanner nyhetsbrev for konkurransefortrinn");
  const [featureDescription, setFeatureDescription] = useState(
    "Vår avanserte AI-teknologi analyserer tusenvis av nyhetsbrev for å gi deg verdifull innsikt i " +
    "markedskampanjer, produkttilbud, emnelinjer, tonefall, bildebruk og plasseringer - alt for å " +
    "gi deg et konkurransefortrinn i din egen nyhetsbrev-strategi."
  );

  // Feature list for detailed section
  const [featuresList, setFeaturesList] = useState([
    {
      title: "AI-drevet innholdsanalyse",
      description: "Vår AI scanner nyhetsbrevene for å identifisere trender, tilbud, og språkbruk fra toppmerker.",
      icon: Brain,
      color: "blue-400"
    },
    {
      title: "Omfattende innsikt",
      description: "Få analyse av markedsføringskampanjer, produkttilbud, og emnelinjer for inspirasjon.",
      icon: Search,
      color: "blue-400"
    },
    {
      title: "Visuell overvåking",
      description: "Følg med på hvilke bilder og design-elementer som brukes i bransjen akkurat nå.",
      icon: Star,
      color: "blue-400"
    },
    {
      title: "Tone og språkanalyse",
      description: "Forstå hvordan merkevarer kommuniserer og engasjerer kundene sine.",
      icon: MessageSquare,
      color: "blue-400"
    }
  ]);

  const handleFeatureUpdate = (index: number, field: 'title' | 'description', value: string) => {
    const updatedFeatures = [...featuresList];
    updatedFeatures[index][field] = value;
    setFeaturesList(updatedFeatures);
  };

  const [ctaText, setCtaText] = useState("Utforsk alle funksjoner");

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
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
        
        {/* Main feature visualization */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block mb-4 p-2 bg-[#3a6ffb]/10 rounded-lg">
                <Bot className="h-8 w-8 text-[#3a6ffb]" />
              </div>
              <EditableText 
                text={featureTitle}
                onSave={setFeatureTitle}
                className="text-2xl font-bold mb-4 text-white"
                as="h3"
              />
              <EditableText 
                text={featureDescription}
                onSave={setFeatureDescription}
                className="text-gray-300 mb-6"
                as="p"
              />
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 rounded-full bg-[#3a6ffb]"></span>
                  <span className="text-white text-sm">Kampanjetyper</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 rounded-full bg-green-400"></span>
                  <span className="text-white text-sm">Produkttilbud</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 rounded-full bg-purple-400"></span>
                  <span className="text-white text-sm">Språkbruk</span>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Data visualization chart */}
              <div className="bg-[#090909] rounded-lg p-4 border border-gray-800 h-[280px] relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <h4 className="text-sm font-bold text-white mb-1">Nyhetsbrev-effektivitet</h4>
                  <p className="text-xs text-gray-400">Basert på AI-analyse av 5000+ nyhetsbrev</p>
                </div>
                
                {/* Chart background grid */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-5 gap-0">
                  {Array(30).fill(null).map((_, i) => (
                    <div key={i} className="border-t border-l border-gray-800"></div>
                  ))}
                </div>
                
                {/* Chart visualization */}
                <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 mt-16">
                  {/* Blue trend line */}
                  <path d="M0,40 C10,35 20,20 30,25 C40,30 50,10 60,15 C70,20 80,30 90,25 L100,20" 
                        fill="none" 
                        stroke="#3a6ffb" 
                        strokeWidth="2" />
                  
                  {/* Green trend line */}
                  <path d="M0,45 C10,40 20,45 30,35 C40,25 50,35 60,30 C70,25 80,35 90,30 L100,35" 
                        fill="none" 
                        stroke="#4ade80" 
                        strokeWidth="2" />
                        
                  {/* Purple trend line */}
                  <path d="M0,50 C10,45 20,40 30,45 C40,50 50,30 60,35 C70,40 80,45 90,40 L100,30" 
                        fill="none" 
                        stroke="#a78bfa" 
                        strokeWidth="2" />
                </svg>
                
                {/* Chart legend - positioned at bottom */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6 text-xs">
                  <div className="flex items-center">
                    <span className="h-1 w-4 bg-[#3a6ffb] mr-2"></span>
                    <span className="text-gray-400">Åpningsrate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-1 w-4 bg-[#4ade80] mr-2"></span>
                    <span className="text-gray-400">Klikk-rate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-1 w-4 bg-[#a78bfa] mr-2"></span>
                    <span className="text-gray-400">Konvertering</span>
                  </div>
                </div>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-[#3a6ffb]/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-[#3a6ffb]/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-[#0A0A0A] p-6 rounded-xl border border-[#3a6ffb]/10 hover:border-[#3a6ffb]/30"
            >
              <div className="w-12 h-12 bg-[#3a6ffb]/10 rounded-lg flex items-center justify-center mb-4">
                {/* Icon placeholder - we're using a div instead of dynamic icon rendering for simplicity */}
                <feature.icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <EditableText 
                text={feature.title}
                onSave={(newText) => handleFeatureUpdate(index, 'title', newText)}
                className="text-xl font-bold mb-2 text-white"
                as="h3"
              />
              <EditableText 
                text={feature.description}
                onSave={(newText) => handleFeatureUpdate(index, 'description', newText)}
                className="text-gray-300"
                as="p"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/search">
            <Button className="bg-[#3a6ffb] hover:bg-[#3a6ffb]/90 text-white px-8 py-3">
              <EditableText 
                text={ctaText}
                onSave={setCtaText}
                className="text-white"
                as="span"
              />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
