
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
          
          {/* Featured Newsletters Section - moved directly below the text */}
          <div className="mt-8">
            <FeaturedNewsletters />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
