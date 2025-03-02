
import { useState, useEffect } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getFeaturedNewsletters } from "@/lib/supabase/newsletters";

import HeroHeading from "./hero/HeroHeading";
import HeroActions from "./hero/HeroActions";
import CategoryFilter from "./hero/CategoryFilter";
import NewsletterDisplay from "./hero/NewsletterDisplay";
import BackgroundEffects from "./hero/BackgroundEffects";
import { Section, SectionStyle, SectionManager } from "@/components/SectionManager";

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionStyles, setSectionStyles] = useState<Record<string, SectionStyle>>({});
  const [sectionContent, setSectionContent] = useState<Record<string, Record<string, string>>>({
    heading: {
      title: "Finn de beste nyhetsbrevene i Norge",
      subtitle: "En omfattende samling av de mest populære nyhetsbrevene fra norske merkenavn og byråer"
    },
    filter: {
      title: "Bla gjennom kategorier"
    }
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

  // Define sections for the section manager
  const sections: Section[] = [
    {
      id: "heading",
      title: "Hero Heading",
      component: <HeroHeading customTitle={sectionContent.heading?.title} customSubtitle={sectionContent.heading?.subtitle} />,
      style: sectionStyles.heading || {},
      editableContent: {
        title: sectionContent.heading?.title || "Finn de beste nyhetsbrevene i Norge",
        subtitle: sectionContent.heading?.subtitle || "En omfattende samling av de mest populære nyhetsbrevene fra norske merkenavn og byråer"
      }
    },
    {
      id: "actions",
      title: "Call to Actions",
      component: <HeroActions />,
      style: sectionStyles.actions || {}
    },
    {
      id: "filter",
      title: "Category Filter",
      component: (
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          customTitle={sectionContent.filter?.title}
        />
      ),
      style: sectionStyles.filter || {},
      editableContent: {
        title: sectionContent.filter?.title || "Bla gjennom kategorier"
      }
    },
    {
      id: "newsletters",
      title: "Newsletter Display",
      component: (
        <NewsletterDisplay 
          newsletters={newsletters}
          loading={loading}
          selectedCategory={selectedCategory}
          handleNewsletterClick={handleNewsletterClick}
        />
      ),
      style: sectionStyles.newsletters || {}
    }
  ];

  // Handle section reordering
  const handleSectionReorder = (reorderedSections: Section[]) => {
    // In a real implementation, you might want to save this to localStorage or a backend
    console.log("Sections reordered:", reorderedSections.map(s => s.id));
  };

  // Handle style updates
  const handleStyleUpdate = (sectionId: string, style: SectionStyle) => {
    setSectionStyles(prev => ({
      ...prev,
      [sectionId]: style
    }));
  };

  // Handle content updates
  const handleContentUpdate = (sectionId: string, content: Record<string, string>) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };

  // Apply styles to a component based on section ID
  const applySectionStyle = (sectionId: string) => {
    const style = sectionStyles[sectionId] || {};
    return {
      marginTop: style.marginTop || '',
      marginBottom: style.marginBottom || '',
      paddingTop: style.paddingTop || '',
      paddingBottom: style.paddingBottom || '',
      textAlign: style.textAlign || 'center'
    };
  };
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-black">
      <BackgroundEffects />
      
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="pt-10"></div>
        
        {/* Render sections based on their styles */}
        <div style={applySectionStyle("heading")}>
          <HeroHeading 
            customTitle={sectionContent.heading?.title} 
            customSubtitle={sectionContent.heading?.subtitle} 
          />
        </div>
        
        <div style={applySectionStyle("actions")}>
          <HeroActions />
        </div>
        
        <div style={applySectionStyle("filter")}>
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            customTitle={sectionContent.filter?.title}
          />
        </div>
        
        <div style={applySectionStyle("newsletters")}>
          <NewsletterDisplay 
            newsletters={newsletters}
            loading={loading}
            selectedCategory={selectedCategory}
            handleNewsletterClick={handleNewsletterClick}
          />
        </div>
      </div>

      {/* Section Manager */}
      <SectionManager 
        sections={sections} 
        onReorder={handleSectionReorder} 
        onStyleUpdate={handleStyleUpdate}
        onContentUpdate={handleContentUpdate}
      />
    </section>
  );
};

export default HeroSection;
