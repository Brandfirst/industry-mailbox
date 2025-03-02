
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import Spline from '@splinetool/react-spline';
import { Card } from "@/components/ui/card";
import NewsletterPreview from "@/components/search/NewsletterPreview";
import { Newsletter } from "@/lib/supabase/types";
import NewsletterItem from "@/components/search/NewsletterItem";

const CountUpAnimation = ({ 
  endValue, 
  duration = 2000, 
  prefix = "", 
  suffix = "" 
}: { 
  endValue: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startValue = Math.floor(endValue * 0.7);
    setCount(startValue);
    
    const incrementInterval = 100;
    const steps = 15;
    const increment = Math.ceil((endValue - startValue) / steps);
    
    const timer = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + increment;
        if (nextCount >= endValue) {
          clearInterval(timer);
          return endValue;
        }
        return nextCount;
      });
    }, incrementInterval);
    
    return () => clearInterval(timer);
  }, [endValue, duration]);

  return (
    <span className="animate-number-count">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Sample newsletter data
const sampleNewsletters = [
  {
    id: 1,
    title: "Ukentlig Markedsføringsbrev",
    content: `<div style="text-align: center; padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif;">
      <h2 style="color: #FF5722;">Ukentlig Markedsføring</h2>
      <p style="color: #333;">De beste tipsene for din bedrift</p>
    </div>`,
    sender: "MarkedsføringsEksperten",
    published_at: "2023-08-15T12:00:00Z",
    categories: { name: "Markedsføring", color: "#FF5722" }
  },
  {
    id: 2,
    title: "Tech Nyheter",
    content: `<div style="text-align: center; padding: 20px; background-color: #e6f7ff; font-family: Arial, sans-serif;">
      <h2 style="color: #0078D7;">Tech Nyheter</h2>
      <p style="color: #333;">Siste innovasjoner innen teknologi</p>
    </div>`,
    sender: "TechNorge",
    published_at: "2023-08-16T14:30:00Z",
    categories: { name: "Tech", color: "#0078D7" }
  },
  {
    id: 3,
    title: "Finansbrevet",
    content: `<div style="text-align: center; padding: 20px; background-color: #e6ffe6; font-family: Arial, sans-serif;">
      <h2 style="color: #006600;">Finansbrevet</h2>
      <p style="color: #333;">Økonomiske innsikter for deg</p>
    </div>`,
    sender: "Finansinnsikt",
    published_at: "2023-08-17T09:00:00Z",
    categories: { name: "Finans", color: "#006600" }
  }
];

// Convert sample newsletters to match Newsletter type
const typedSampleNewsletters: Newsletter[] = sampleNewsletters.map(newsletter => ({
  id: newsletter.id,
  title: newsletter.title,
  content: newsletter.content,
  sender: newsletter.sender,
  published_at: newsletter.published_at,
  categories: newsletter.categories
} as Newsletter));

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Alle kategorier");
  
  const handleNewsletterClick = (newsletter: Newsletter) => {
    // This would handle newsletter click in a real implementation
    console.log("Newsletter clicked:", newsletter.title);
  };
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-b from-black via-black to-transparent">
      <div className="absolute inset-0 z-0 w-full h-full -top-20">
        <Spline 
          scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6">
            <span className="block text-white mb-2">Norges største</span>
            <span className="block text-white">database</span>
            <span className="block mt-2 text-white">
              av <span className="text-[#FF5722]">nyhetsbrev</span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Utforsk mer enn 
            <span className="text-[#FF5722] font-bold mx-2">
              <CountUpAnimation endValue={70350} />
            </span>
            nyhetsbrev fra 
            <span className="text-[#FF5722] font-bold mx-2">
              <CountUpAnimation endValue={1750} />
            </span>
            varemerker. 
            Laget for markedsførere
            <span className="smaller-text mx-1">og byråer</span>
            som ønsker å skape effektive
            og engasjerende nyhetsbrev.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/search">
              <Button size="lg" className="gradient-button">
                Utforsk nyhetsbrev <Search className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="glass-button">
                Prøv gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Category Filter - Now above the cards */}
          <div className="mt-16">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button 
                variant="outline" 
                className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                  selectedCategory === "Alle kategorier" 
                    ? "text-white border-[#FF5722] border-2" 
                    : "text-gray-300 border-gray-700"
                } hover:bg-[#FF5722]/10`}
                onClick={() => setSelectedCategory("Alle kategorier")}
              >
                Alle kategorier
              </Button>
              
              <Button 
                variant="outline" 
                className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                  selectedCategory === "Business" 
                    ? "text-white border-[#FF5722] border-2" 
                    : "text-gray-300 border-gray-700"
                } hover:bg-[#FF5722]/10`}
                onClick={() => setSelectedCategory("Business")}
              >
                Business
              </Button>
              
              <Button 
                variant="outline" 
                className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                  selectedCategory === "Education" 
                    ? "text-white border-[#FF5722] border-2" 
                    : "text-gray-300 border-gray-700"
                } hover:bg-[#FF5722]/10`}
                onClick={() => setSelectedCategory("Education")}
              >
                Education
              </Button>
              
              <Button 
                variant="outline" 
                className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                  selectedCategory === "Finance" 
                    ? "text-white border-[#FF5722] border-2" 
                    : "text-gray-300 border-gray-700"
                } hover:bg-[#FF5722]/10`}
                onClick={() => setSelectedCategory("Finance")}
              >
                Finance
              </Button>
              
              <Button 
                variant="outline" 
                className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                  selectedCategory === "Health" 
                    ? "text-white border-[#FF5722] border-2" 
                    : "text-gray-300 border-gray-700"
                } hover:bg-[#FF5722]/10`}
                onClick={() => setSelectedCategory("Health")}
              >
                Health
              </Button>
            </div>
          </div>
          
          {/* Newsletter Preview Cards - Now using NewsletterItem component from search */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto px-4">
              {typedSampleNewsletters.map((newsletter) => (
                <div key={newsletter.id} className="bg-black/40 backdrop-blur-sm border-2 border-[#FF5722] rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-glow">
                  <NewsletterItem
                    newsletter={newsletter}
                    onClick={handleNewsletterClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          {Array(72).fill(null).map((_, i) => (
            <div key={i} className="border-t border-l border-[#FF5722]/20"></div>
          ))}
        </div>
      </div>
      
      {/* Gradient overlay at the bottom to blend with the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black z-10"></div>
      
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-1/2 h-40 bg-[#FF5722]/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 right-0 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
