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
      
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="relative px-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-white mb-4 text-left">
              Profesjonelle bruker Nyhetsbrev Hub for å oppnå mer, raskere.
            </h3>
            
            <div className="testimonial-slider w-full overflow-hidden">
              <div className="transition-all duration-500 flex"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="py-3 border-l-2 border-[#FF5722]/50 pl-4">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#FF5722]" fill="currentColor" />
                        ))}
                      </div>
                      <p className="testimonial-text">"{item.quote}"</p>
                      <div className="flex items-center">
                        <div className="testimonial-avatar">
                          <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                        </div>
                        <div className="testimonial-info">
                          <p className="testimonial-name">{item.author}</p>
                          <p className="testimonial-company">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <button 
                onClick={prevTestimonial}
                className="bg-transparent border border-[#FF5722]/30 rounded-full p-1 hover:bg-[#FF5722]/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="bg-transparent border border-[#FF5722]/30 rounded-full p-1 hover:bg-[#FF5722]/10 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterDisplay;
