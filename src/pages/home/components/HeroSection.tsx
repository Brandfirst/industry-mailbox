
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import FeaturedNewsletters from "./FeaturedNewsletters";

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            For <span className="smaller-text">byråer</span> og markedsførere
            <span className="block text-blue-400 mt-4 relative">
              Norges største database av nyhetsbrev
              <div className="absolute -bottom-2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. 
            Ideelt for markedsførere, byråer og bransjefolk.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/search">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6">
                Start Søket
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-blue-900/20 px-8 py-6">
                Opprett Konto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Newsletters Section - directly below the hero */}
      <div className="mt-8">
        <FeaturedNewsletters />
      </div>
    </section>
  );
};

export default HeroSection;
