
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

      {/* Testimonials Section */}
      <div className="mt-12 mb-6 max-w-4xl mx-auto">
        <div 
          ref={testimonialContainerRef}
          className="relative bg-[#F5F5F0] rounded-xl p-6 text-gray-800"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-gray-600 mb-6 text-center">
              Profesjonelle bruker Nyhetsbrev Hub for å oppnå mer, raskere.
            </h3>
            
            <div className="testimonial-slider w-full overflow-hidden">
              <div className="transition-all duration-500 flex"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-4">"{item.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.author}</p>
                          <p className="text-sm text-gray-500">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between w-full mt-4">
              <button 
                onClick={prevTestimonial}
                className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Featured in logos */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">Som sett i</p>
            <div className="flex justify-center items-center space-x-8 flex-wrap">
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <svg width="120" viewBox="0 0 120 30" className="h-6">
                  <text x="0" y="20" fontSize="16" fontWeight="bold" fill="#333">TheVerge</text>
                </svg>
              </div>
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <svg width="120" viewBox="0 0 120 30" className="h-6">
                  <circle cx="15" cy="15" r="15" fill="#333" />
                  <text x="35" y="20" fontSize="14" fontWeight="bold" fill="#333">The Information</text>
                </svg>
              </div>
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <svg width="60" viewBox="0 0 60 30" className="h-6">
                  <text x="0" y="20" fontSize="16" fontWeight="bold" fill="#333">TechCrunch</text>
                </svg>
              </div>
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <svg width="60" viewBox="0 0 60 30" className="h-6">
                  <circle cx="15" cy="15" r="10" fill="#333" />
                  <text x="30" y="20" fontSize="12" fontWeight="bold" fill="#333">Product Hunt</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHeading;
