
import { useState, useEffect } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getFeaturedNewsletters } from "@/lib/supabase/newsletters";

import HeroHeading from "./hero/HeroHeading";
import HeroActions from "./hero/HeroActions";
import CategoryFilter from "./hero/CategoryFilter";
import NewsletterDisplay from "./hero/NewsletterDisplay";
import BackgroundEffects from "./hero/BackgroundEffects";

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
      <BackgroundEffects />
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        <HeroHeading />
        
        <HeroActions />
        
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        
        <NewsletterDisplay 
          newsletters={newsletters}
          loading={loading}
          selectedCategory={selectedCategory}
          handleNewsletterClick={handleNewsletterClick}
        />
      </div>
    </section>
  );
};

export default HeroSection;
