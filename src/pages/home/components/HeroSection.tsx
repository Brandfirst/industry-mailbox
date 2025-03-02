import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import Spline from '@splinetool/react-spline';
import NewsletterItem from "@/components/search/NewsletterItem";
import { Newsletter } from "@/lib/supabase/types";
import { getFeaturedNewsletters } from "@/lib/supabase/newsletters";
import { motion, AnimatePresence } from "framer-motion";

const DynamicCounter = ({ 
  startValue, 
  incrementAmount,
  intervalMs = 1000,
  prefix = "", 
  suffix = "" 
}: { 
  startValue: number;
  incrementAmount: number;
  intervalMs?: number;
  prefix?: string; 
  suffix?: string; 
}) => {
  const [count, setCount] = useState(startValue);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + incrementAmount);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [incrementAmount, intervalMs]);

  return (
    <span className="text-[#FF5722] font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const result = await getFeaturedNewsletters({
          categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
          limit: 3
        });
        
        setNewsletters(result.data);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletters();
  }, [selectedCategory]);
  
  const handleNewsletterClick = (newsletter: Newsletter) => {
    console.log("Newsletter clicked:", newsletter.title);
  };
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 w-full h-full -top-20">
        <Spline 
          scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6">
            <span className="block text-white mb-2">Norges største</span>
            <span className="block text-white">database</span>
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
              suffix="" 
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
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/search">
              <Button size="lg" className="gradient-button">
                Utforsk nyhetsbrev <Search className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="glass-button">
                Prøv gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8 mt-16">
            <Button 
              variant="outline" 
              className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                selectedCategory === "all" 
                  ? "text-white border-[#FF5722] border-2" 
                  : "text-gray-300 border-gray-700"
              } hover:bg-[#FF5722]/10`}
              onClick={() => setSelectedCategory("all")}
            >
              Alle kategorier
            </Button>
            
            <Button 
              variant="outline" 
              className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                selectedCategory === "1" 
                  ? "text-white border-[#FF5722] border-2" 
                  : "text-gray-300 border-gray-700"
              } hover:bg-[#FF5722]/10`}
              onClick={() => setSelectedCategory("1")}
            >
              Business
            </Button>
            
            <Button 
              variant="outline" 
              className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                selectedCategory === "2" 
                  ? "text-white border-[#FF5722] border-2" 
                  : "text-gray-300 border-gray-700"
              } hover:bg-[#FF5722]/10`}
              onClick={() => setSelectedCategory("2")}
            >
              Education
            </Button>
            
            <Button 
              variant="outline" 
              className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                selectedCategory === "3" 
                  ? "text-white border-[#FF5722] border-2" 
                  : "text-gray-300 border-gray-700"
              } hover:bg-[#FF5722]/10`}
              onClick={() => setSelectedCategory("3")}
            >
              Finance
            </Button>
            
            <Button 
              variant="outline" 
              className={`bg-black/40 backdrop-blur-sm rounded-lg ${
                selectedCategory === "4" 
                  ? "text-white border-[#FF5722] border-2" 
                  : "text-gray-300 border-gray-700"
              } hover:bg-[#FF5722]/10`}
              onClick={() => setSelectedCategory("4")}
            >
              Health
            </Button>
          </div>
          
          <div className="mb-20">
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
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-1/2 h-40 bg-[#FF5722]/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 right-0 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
