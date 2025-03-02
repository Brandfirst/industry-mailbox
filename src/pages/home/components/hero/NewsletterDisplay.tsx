
import { Newsletter } from "@/lib/supabase/types";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import NewsletterPreview from "@/components/search/NewsletterPreview";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  
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
  
  // Card swipe functionality
  const swipeCard = (direction: number) => {
    if (newsletters.length === 0) return;
    
    // Next card becomes visible
    setCurrentIndex((prevIndex) => 
      direction > 0 
        ? (prevIndex + 1) % newsletters.length 
        : (prevIndex - 1 + newsletters.length) % newsletters.length
    );
  };
  
  const renderNewsletterCards = () => {
    if (loading) {
      return (
        <div className="w-full flex justify-center">
          <div className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden h-[500px] animate-pulse w-full max-w-sm">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Loading...</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (newsletters.length === 0) {
      return (
        <div className="col-span-3 text-center py-10">
          <p className="text-gray-400">No newsletters found. Try selecting a different category.</p>
        </div>
      );
    }
    
    return (
      <div className="relative w-full flex justify-center h-[500px]">
        {newsletters.map((newsletter, index) => {
          // Calculate if this card should be visible based on index
          const isCurrentCard = index === currentIndex;
          const isPreviousCard = index === (currentIndex + 1) % newsletters.length;
          const isNextCard = index === (currentIndex - 1 + newsletters.length) % newsletters.length;
          
          // Only render current card and adjacent cards for performance
          if (!isCurrentCard && !isPreviousCard && !isNextCard && newsletters.length > 3) {
            return null;
          }
          
          // Determine z-index and position
          const zIndex = newsletters.length - index;
          const offset = isCurrentCard ? 0 : (isPreviousCard ? -5 : 5);
          const scale = isCurrentCard ? 1 : 0.95;
          const opacity = isCurrentCard ? 1 : 0.7;
          
          return (
            <motion.div
              key={newsletter.id}
              className="absolute w-full max-w-sm h-[500px] bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale,
                opacity,
                x: offset,
                y: isCurrentCard ? 0 : 10,
                zIndex: isCurrentCard ? 30 : (isPreviousCard ? 20 : 10)
              }}
              transition={{ duration: 0.3 }}
              drag={isCurrentCard ? "x" : false}
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                  swipeCard(offset.x > 0 ? 1 : -1);
                }
              }}
              onClick={() => isCurrentCard && handleNewsletterClick(newsletter)}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center p-3 border-b border-gray-700">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                    {newsletter.sender && (
                      <span className="text-sm font-semibold text-gray-700">
                        {newsletter.sender.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm truncate text-white">
                      {newsletter.sender || 'Unknown Sender'}
                    </span>
                    <span className="text-gray-300 text-xs">
                      {new Date(newsletter.published_at || '').toLocaleDateString('no-NO')}
                    </span>
                  </div>
                  {newsletter.categories?.name && (
                    <div 
                      className="px-2 py-1 text-xs rounded-full font-medium ml-auto"
                      style={{ 
                        backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                        color: newsletter.categories?.color || '#8B5CF6' 
                      }}
                    >
                      {newsletter.categories.name}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden bg-white">
                  <NewsletterPreview 
                    content={newsletter.content} 
                    title={newsletter.title}
                    isMobile={false}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Navigation arrows for card swiping */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-40">
          <button 
            onClick={() => swipeCard(-1)}
            className="bg-transparent border border-[#FF5722]/50 rounded-full p-2 hover:bg-[#FF5722]/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => swipeCard(1)}
            className="bg-transparent border border-[#FF5722]/50 rounded-full p-2 hover:bg-[#FF5722]/20 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 max-w-5xl mx-auto px-4"
        >
          {renderNewsletterCards()}
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
