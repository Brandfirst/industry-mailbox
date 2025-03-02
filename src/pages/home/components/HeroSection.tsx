
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import FeaturedNewsletters from "./FeaturedNewsletters";

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
    // Start with a lower value (around 70% of the target)
    const startValue = Math.floor(endValue * 0.7);
    setCount(startValue);
    
    // Increment slightly faster - every second with higher increment value
    const incrementInterval = 100; // 100ms
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

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        {/* Provide space at the top for the announcement button */}
        <div className="pt-10"></div>
        
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6 text-white">
            <span className="block text-white mb-2">Norges største</span>
            <span className="block relative">
              <span className="hero-heading-span inline-block transform hover:scale-105 transition-transform duration-300">database</span>
              <img src="/lovable-uploads/9c18978d-5f8f-4ce3-9eab-aed71d4f66d3.png" alt="abstract pattern" className="absolute w-16 h-16 md:w-24 md:h-24 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 z-0" />
            </span>
            <span className="block mt-2">
              av <span className="hero-heading-span inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#3a6ffb] to-blue-400">nyhetsbrev</span>
            </span>
          </h1>
          
          {/* Creative paragraph with styled text */}
          <div className="creative-text-container relative mx-auto max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-[#3a6ffb]/20 mb-8">
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto relative z-10">
              <span className="highlight-word">Utforsk</span> mer enn 
              <span className="text-[#3a6ffb] font-bold mx-2 relative inline-block">
                <CountUpAnimation endValue={70350} />
                <span className="absolute -bottom-1 w-full h-0.5 bg-[#3a6ffb]/50"></span>
              </span>
              nyhetsbrev fra 
              <span className="text-[#3a6ffb] font-bold mx-2 relative inline-block">
                <CountUpAnimation endValue={1750} />
                <span className="absolute -bottom-1 w-full h-0.5 bg-[#3a6ffb]/50"></span>
              </span>
              <span className="hero-heading-span inline-block transform hover:scale-105 transition-transform duration-300 mx-1">varemerker</span>. 
              <span>Laget for</span>
              <span className="highlight-word mx-1">markedsførere</span>
              <span className="smaller-text mx-1">og byråer</span>
              <span>som ønsker å skape</span>
              <span className="hero-heading-span inline-block mx-1">effektive</span>
              <span>og</span>
              <span className="hero-heading-span inline-block mx-1">engasjerende</span>
              <span>nyhetsbrev.</span>
            </p>
            
            {/* Data visualization elements */}
            <div className="flex justify-center my-6 w-full">
              <div className="w-full max-w-2xl h-12 relative">
                {/* Animated data flow background */}
                <div className="absolute inset-0 bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full grid grid-cols-12 gap-0.5">
                    {Array(24).fill(null).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-[#3a6ffb]/10 h-3 opacity-30 animate-pulse" 
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          height: `${Math.floor(Math.random() * 20) + 5}px` 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Data points */}
                <div className="absolute top-1/2 left-0 w-full flex justify-between px-4 transform -translate-y-1/2">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-3 w-3 rounded-full bg-[#3a6ffb] z-10 pulse-glow"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Newsletters Section */}
          <div className="mt-8">
            <FeaturedNewsletters />
          </div>
        </div>
      </div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          {Array(72).fill(null).map((_, i) => (
            <div key={i} className="border-t border-l border-[#3a6ffb]/20"></div>
          ))}
        </div>
      </div>
      
      {/* Glowing accent */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-1/2 h-40 bg-[#3a6ffb]/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 right-0 w-40 h-40 bg-[#3a6ffb]/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
