
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
    const incrementInterval = 1000; // 1 second
    const incrementValue = 2; // Increment by 2 each time
    
    const timer = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + incrementValue;
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
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden bg-black">
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        {/* Provide space at the top for the announcement button */}
        <div className="pt-10"></div>
        
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6 text-white">
            Norges største database<br />av nyhetsbrev
            <span className="block text-[#3a6ffb] mt-4 relative">
              <div className="absolute -bottom-2 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3a6ffb] to-transparent"></div>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Utforsk mer enn <CountUpAnimation endValue={100000} suffix=" nyhetsbrev" /> fra <CountUpAnimation endValue={2000} suffix=" varemerker" />. 
            Laget for markedsførere og byråer som ønsker å skape effektive og engasjerende nyhetsbrev.
          </p>
          
          {/* Data visualization elements */}
          <div className="hidden md:flex justify-center my-8 w-full">
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
                    className="h-3 w-3 rounded-full bg-[#3a6ffb] z-10 shadow-glow animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Featured Newsletters Section - moved directly below the text */}
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
