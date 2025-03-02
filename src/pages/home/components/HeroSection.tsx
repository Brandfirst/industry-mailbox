
import { useState, useEffect } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getFeaturedNewsletters } from "@/lib/supabase/newsletters";

import HeroHeading from "./hero/HeroHeading";
import HeroActions from "./hero/HeroActions";
import CategoryFilter from "./hero/CategoryFilter";
import NewsletterDisplay from "./hero/NewsletterDisplay";
import BackgroundEffects from "./hero/BackgroundEffects";
import { useVisualEditor } from "@/contexts/VisualEditorContext";

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeSection, setSelectedElementId } = useVisualEditor();
  
  // Add a state to store section-specific styles
  const [sectionStyles, setSectionStyles] = useState({
    paddingTop: "16",
    paddingBottom: "24",
    textAlign: "center"
  });
  
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
  
  // Handle element selection for editing
  const handleElementSelect = (elementId: string) => {
    setSelectedElementId(elementId);
  };
  
  // Calculate dynamic styles based on section settings
  const containerStyle = {
    paddingTop: `${sectionStyles.paddingTop}px`,
    paddingBottom: `${sectionStyles.paddingBottom}px`,
    textAlign: sectionStyles.textAlign as "center" | "left" | "right"
  };
  
  return (
    <section 
      className={`py-16 lg:py-24 relative overflow-hidden bg-black ${activeSection?.id === 'heroSection' ? 'section-active' : ''}`}
      data-section-id="heroSection"
      style={containerStyle}
    >
      <BackgroundEffects />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="pt-10"></div>
        
        {/* Make heading editable */}
        <div 
          data-editable="heading" 
          id="hero-heading"
          onClick={() => handleElementSelect('hero-heading')}
        >
          <HeroHeading />
        </div>
        
        {/* Make actions editable */}
        <div 
          data-editable="buttons" 
          id="hero-actions"
          onClick={() => handleElementSelect('hero-actions')}
        >
          <HeroActions />
        </div>
        
        {/* Make category filter editable */}
        <div 
          data-editable="filter" 
          id="category-filter"
          onClick={() => handleElementSelect('category-filter')}
        >
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        </div>
        
        {/* Make newsletter display editable */}
        <div 
          data-editable="content" 
          id="newsletter-display"
          onClick={() => handleElementSelect('newsletter-display')}
        >
          <NewsletterDisplay 
            newsletters={newsletters}
            loading={loading}
            selectedCategory={selectedCategory}
            handleNewsletterClick={handleNewsletterClick}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
