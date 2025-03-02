import DynamicCounter from "../DynamicCounter";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const HeroHeading = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "Nyhetsbrev Hub er et fantastisk verktøy for markedsførere som ønsker å følge med på trender.",
      author: "Marc Andreessen",
      title: "Grunnlegger, Netscape",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    },
    {
      quote: "Nyhetsbrev Hub er en frisk åpenbaring i markedsføringslandskapet.",
      author: "Alexis Ohanian",
      title: "Grunnlegger, Reddit",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    },
    {
      quote: "Et uunnværlig verktøy for alle som jobber med digital markedsføring.",
      author: "Jens Nordvik",
      title: "Markedsdirektør, Norsk Bedrift",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-slide-down max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6">
        <span className="block text-white mb-2">Norges største database</span>
        <span className="block mt-2 text-white">
          av <span className="text-[#FF5722]">nyhetsbrev</span>
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Utforsk mer enn 
        <DynamicCounter 
          startValue={70350} 
          incrementAmount={7} 
          intervalMs={1000} 
          prefix=" " 
          suffix=" " 
        />
         nyhetsbrev fra 
        <DynamicCounter 
          startValue={1750} 
          incrementAmount={2} 
          intervalMs={1000} 
          prefix=" " 
          suffix=" " 
        />
        varemerker. 
        Laget for markedsførere
        <span className="smaller-text mx-1">og byråer</span>
        som ønsker å skape effektive
        og engasjerende nyhetsbrev.
      </p>
    </div>
  );
};

export default HeroHeading;
