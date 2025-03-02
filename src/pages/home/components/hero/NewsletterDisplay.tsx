
import { Newsletter } from "@/lib/supabase/types";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const testimonialContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // For the swipeable cards
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);

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

  // Handle card swipe
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (newsletters.length <= 1) return;
    
    if (info.offset.x > 100) {
      // Swiped right - previous card
      setExitX(info.offset.x);
      setTimeout(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === 0 ? newsletters.length - 1 : prevIndex - 1
        );
        setExitX(null);
      }, 300);
    } else if (info.offset.x < -100) {
      // Swiped left - next card
      setExitX(info.offset.x);
      setTimeout(() => {
        setCurrentIndex(prevIndex => 
          (prevIndex + 1) % newsletters.length
        );
        setExitX(null);
      }, 300);
    }
  };

  const nextCard = () => {
    if (newsletters.length <= 1) return;
    setCurrentIndex(prevIndex => (prevIndex + 1) % newsletters.length);
  };

  const prevCard = () => {
    if (newsletters.length <= 1) return;
    setCurrentIndex(prevIndex => (prevIndex === 0 ? newsletters.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reset current index when category changes
    setCurrentIndex(0);
  }, [selectedCategory]);
  
  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={isMobile ? "my-8 px-4" : "grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto px-4"}
        >
          {loading ? (
            isMobile ? (
              <div className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden h-[400px] animate-pulse">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">Loading...</span>
                </div>
              </div>
            ) : (
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden h-[500px] animate-pulse">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Loading...</span>
                  </div>
                </div>
              ))
            )
          ) : newsletters.length > 0 ? (
            isMobile ? (
              // Mobile swipeable card
              <div className="relative h-[400px] mx-auto max-w-xs">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentIndex}
                    className="absolute w-full h-full"
                    initial={{ opacity: 0, x: exitX || (currentIndex > 0 ? 300 : -300) }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, x: exitX || (currentIndex > 0 ? -300 : 300), transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNewsletterClick(newsletters[currentIndex])}
                  >
                    <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                      <div className="h-full pb-4 flex flex-col">
                        <div className="h-3/4 bg-white overflow-hidden relative">
                          {/* Newsletter Preview Image */}
                          <div className="absolute inset-0 flex items-center justify-center p-2">
                            <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-inner">
                              <img 
                                src={newsletters[currentIndex].image_url || "/lovable-uploads/a7954af6-1040-47cf-8b66-afabd6d057a5.png"} 
                                alt={newsletters[currentIndex].title || ''} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex-1 flex flex-col">
                          {/* Title */}
                          <h3 className="font-bold text-black text-lg truncate">
                            {newsletters[currentIndex].title || 'Untitled Newsletter'}
                          </h3>
                          
                          {/* Sender */}
                          <div className="flex items-center mt-1">
                            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              <span className="text-xs font-semibold text-gray-700">
                                {(newsletters[currentIndex].sender || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 ml-1 truncate">
                              {newsletters[currentIndex].sender || 'Unknown Sender'}
                            </span>
                            {newsletters[currentIndex].categories?.name && (
                              <span 
                                className="px-1.5 py-0.5 text-xs rounded-full font-medium ml-auto"
                                style={{ 
                                  backgroundColor: newsletters[currentIndex].categories?.color ? `${newsletters[currentIndex].categories.color}20` : '#8B5CF620',
                                  color: newsletters[currentIndex].categories?.color || '#8B5CF6' 
                                }}
                              >
                                {newsletters[currentIndex].categories.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation arrows */}
                <div className="absolute inset-x-0 bottom-[-40px] flex justify-between">
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    className="bg-transparent border border-[#FF5722]/30 rounded-full p-2 hover:bg-[#FF5722]/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {newsletters.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-[#FF5722]' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    className="bg-transparent border border-[#FF5722]/30 rounded-full p-2 hover:bg-[#FF5722]/10 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              // Desktop grid
              newsletters.map((newsletter) => (
                <motion.div 
                  key={newsletter.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-glow"
                  onClick={() => handleNewsletterClick(newsletter)}
                >
                  <div className="h-full pb-4 flex flex-col">
                    <div className="h-3/4 bg-white overflow-hidden relative">
                      {/* Newsletter Preview Image */}
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-inner">
                          <img 
                            src={newsletter.image_url || "/lovable-uploads/a7954af6-1040-47cf-8b66-afabd6d057a5.png"} 
                            alt={newsletter.title || ''} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="font-bold text-white text-lg truncate">
                        {newsletter.title || 'Untitled Newsletter'}
                      </h3>
                      
                      {/* Sender */}
                      <div className="flex items-center mt-1">
                        <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          <span className="text-xs font-semibold text-white">
                            {(newsletter.sender || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-300 ml-1 truncate">
                          {newsletter.sender || 'Unknown Sender'}
                        </span>
                        {newsletter.categories?.name && (
                          <span 
                            className="px-1.5 py-0.5 text-xs rounded-full font-medium ml-auto"
                            style={{ 
                              backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                              color: newsletter.categories?.color || '#8B5CF6' 
                            }}
                          >
                            {newsletter.categories.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-400">No newsletters found. Try selecting a different category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Minimalistic Testimonials Section */}
      <div className="mt-12 mb-6 max-w-4xl mx-auto">
        <div 
          ref={testimonialContainerRef}
          className="relative p-6"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-white mb-6 text-center">
              Profesjonelle bruker Nyhetsbrev Hub for å oppnå mer, raskere.
            </h3>
            
            <div className="testimonial-slider w-full overflow-hidden">
              <div className="transition-all duration-500 flex"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="p-5 border-l-2 border-[#FF5722]/50">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#FF5722]" fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-white italic mb-4 text-lg">"{item.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-[#FF5722]/30">
                          <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.author}</p>
                          <p className="text-sm text-gray-400">{item.title}</p>
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
                className="bg-transparent border border-[#FF5722]/30 rounded-full p-2 hover:bg-[#FF5722]/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="bg-transparent border border-[#FF5722]/30 rounded-full p-2 hover:bg-[#FF5722]/10 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterDisplay;
