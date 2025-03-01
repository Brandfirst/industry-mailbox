
import { Link } from "react-router-dom";
import { Database, BarChart, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  // Feature list for detailed section
  const featuresList = [
    {
      title: "Omfattende Database",
      description: "Få tilgang til over 5000 nyhetsbrev fra ledende norske merkevarer.",
      icon: Database
    },
    {
      title: "Konkurranseanalyse",
      description: "Analyser hva konkurrentene dine sender til sine abonnenter.",
      icon: BarChart
    },
    {
      title: "Inspirasjonsbibliotek",
      description: "Finn inspirasjon til dine egne nyhetsbrev fra de beste i bransjen.",
      icon: Star
    },
    {
      title: "Trendrapporter",
      description: "Ukentlige rapporter om trender i nyhetsbrev på tvers av bransjer.",
      icon: Award
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-950/30 to-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Alt du trenger for å skape bedre nyhetsbrev</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            NewsletterHub gir deg verktøyene du trenger for å analysere, sammenligne og få inspirasjon til dine egne nyhetsbrev.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <div key={index} className="feature-card bg-blue-950/20 p-6 rounded-xl border border-blue-500/10 hover:border-blue-500/30">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/search">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">Utforsk alle funksjoner</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
