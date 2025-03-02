
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
  
  // Get section styles if available
  const sectionStyles = activeSection?.styles || {};
  
  return (
    <section 
      className={`relative overflow-hidden bg-black ${activeSection?.id === 'heroSection' ? 'section-active' : ''}`}
      data-section-id="heroSection"
      style={{
        paddingTop: sectionStyles.paddingTop ? `${sectionStyles.paddingTop}px` : '64px',
        paddingBottom: sectionStyles.paddingBottom ? `${sectionStyles.paddingBottom}px` : '96px',
        textAlign: sectionStyles.textAlign as "center" | "left" | "right" || 'center',
        minHeight: sectionStyles.height ? `${sectionStyles.height}px` : 'auto'
      }}
    >
      <BackgroundEffects />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="pt-10"></div>
        
        {/* Make heading editable */}
        <div 
          data-editable="heading" 
          id="hero-heading"
          onClick={() => handleElementSelect('hero-heading')}
          className={activeSection?.selectedElementId === 'hero-heading' ? 'active' : ''}
        >
          <HeroHeading />
        </div>
        
        {/* Make actions editable */}
        <div 
          data-editable="buttons" 
          id="hero-actions"
          onClick={() => handleElementSelect('hero-actions')}
          className={activeSection?.selectedElementId === 'hero-actions' ? 'active' : ''}
        >
          <HeroActions />
        </div>
        
        {/* Make category filter editable */}
        <div 
          data-editable="filter" 
          id="category-filter"
          onClick={() => handleElementSelect('category-filter')}
          className={activeSection?.selectedElementId === 'category-filter' ? 'active' : ''}
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
          className={activeSection?.selectedElementId === 'newsletter-display' ? 'active' : ''}
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
