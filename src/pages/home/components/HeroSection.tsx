
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
    
    // Increment slightly faster - every 500ms with higher increment value
    const incrementInterval = 500; // 0.5 second
    const incrementValue = 3; // Increment by 3 each time
    
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
    <section className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-blue-950 to-slate-900">
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="animate-slide-down max-w-5xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            Norges største database av nyhetsbrev
            <span className="block text-blue-400 mt-4 relative">
              <div className="absolute -bottom-2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Utforsk mer enn <CountUpAnimation endValue={100000} suffix=" nyhetsbrev" /> fra <CountUpAnimation endValue={2000} suffix=" varemerker" />.
          </p>
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
