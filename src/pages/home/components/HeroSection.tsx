
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import FeaturedNewsletters from "./FeaturedNewsletters";
import Spline from '@splinetool/react-spline';

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

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 w-full h-full -top-16">
        <Spline 
          scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6 text-white">
            <span className="block text-white mb-2">Norges største</span>
            <span className="block">database</span>
            <span className="block mt-2">
              av <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8A50] to-[#FF5722]">nyhetsbrev</span>
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
          
          <div className="mt-8">
            <FeaturedNewsletters />
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
      
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-1/2 h-40 bg-[#FF5722]/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 right-0 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
