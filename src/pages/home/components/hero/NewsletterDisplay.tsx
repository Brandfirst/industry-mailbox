import { Newsletter } from "@/lib/supabase/types";
import NewsletterItem from "@/components/search/NewsletterItem";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NewsletterDisplayProps {
  newsletters: Newsletter[];
  loading: boolean;
  selectedCategory: string;
  handleNewsletterClick: (newsletter: Newsletter) => void;
}

const NewsletterDisplay = ({ 
  newsletters, 
  loading, 
  selectedCategory,
  handleNewsletterClick 
}: NewsletterDisplayProps) => {
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
    <div className="mb-8">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto px-4"
        >
          {loading ? (
            Array(3).fill(null).map((_, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden h-[500px] animate-pulse">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">Loading...</span>
                </div>
              </div>
            ))
          ) : newsletters.length > 0 ? (
            newsletters.map((newsletter) => (
              <motion.div 
                key={newsletter.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-glow"
              >
                <NewsletterItem
                  newsletter={newsletter}
                  onClick={() => handleNewsletterClick(newsletter)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-400">No newsletters found. Try selecting a different category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Testimonials Section - Now positioned right under the newsletter cards */}
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
          
          {/* Updated branded logos section */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-sm text-white text-center mb-4 bg-transparent">Loved by 5,000+ Brands & Agencies</p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-bold tracking-wide">TRUE CLASSIC</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-light">AGI</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium">VAYNERMEDIA</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-bold">THE RIDGE</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-light italic">PARAMOUNT</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium tracking-wide">TUBESCIENCE</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-bold tracking-widest">JONES ROAD</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-light italic">JAMBYS</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium">KETTLE & FIRE</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-bold">BACARDI</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium">MAGIC SPOON</span>
              <span className="text-white opacity-80 hover:opacity-100 transition-opacity font-bold tracking-wider">HEXCLAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterDisplay;
