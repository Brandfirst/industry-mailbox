
import { useEffect, useState } from "react";
import AnnouncementBar, { HomeHeader } from "./components/AnnouncementBar";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import NewsletterSubscriptionSection from "./components/NewsletterSubscriptionSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import { DebugEdgeFunction } from "@/components/DebugEdgeFunction";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { SectionManager, Section } from "@/components/SectionManager";
import { VisualEditorProvider } from "@/contexts/VisualEditorContext";

const HomePage = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  // Define sections for the SectionManager
  const [sections, setSections] = useState<Section[]>([
    { id: "heroSection", title: "Hero Section", component: <HeroSection /> },
    { id: "statsSection", title: "Stats Section", component: <StatsSection /> },
    { id: "featuresSection", title: "Features Section", component: <FeaturesSection /> },
    { id: "testimonialsSection", title: "Testimonials Section", component: <TestimonialsSection /> },
    { id: "pricingSection", title: "Pricing Section", component: <PricingSection /> },
    { id: "newsletterSubscriptionSection", title: "Newsletter Subscription", component: <NewsletterSubscriptionSection /> },
    { id: "faqSection", title: "FAQ Section", component: <FAQSection /> },
    { id: "ctaSection", title: "CTA Section", component: <CTASection /> },
    { id: "footerSection", title: "Footer Section", component: <FooterSection /> },
  ]);

  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
    
    // Check if debug mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    setIsDebugMode(urlParams.get('debug') === 'true');
  }, []);
  
  // Handle section reordering
  const handleSectionReorder = (reorderedSections: Section[]) => {
    setSections(reorderedSections);
  };
  
  // Handle section updates (for content and styles)
  const handleSectionUpdate = (sectionId: string, updates: any) => {
    console.log(`Updating section ${sectionId}:`, updates);
    
    // Update the section's properties
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            styles: {
              ...section.styles,
              ...updates.styles
            }
          };
        }
        return section;
      })
    );
  };
  
  return (
    <VisualEditorProvider>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Only render HomeHeader (null component) */}
        <HomeHeader />
        
        {/* Debug dialog (only visible in debug mode or with keyboard shortcut) */}
        {isDebugMode && (
          <div className="fixed bottom-4 right-4 z-50">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-black/50 border-[#FF5722]/20 hover:bg-black/70">
                  <Bug className="h-4 w-4 mr-2" />
                  Debug Tools
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Developer Debug Tools</DialogTitle>
                </DialogHeader>
                <DebugEdgeFunction />
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Main content sections - HeroSection contains the AnnouncementBar now */}
        <div className="relative">
          <AnnouncementBar />
          
          {/* Render sections based on their current order */}
          {sections.map((section) => (
            <div 
              key={section.id} 
              style={section.styles}
              className="section-container"
            >
              {section.component}
            </div>
          ))}
        </div>
        
        {/* Section Manager component */}
        <SectionManager 
          sections={sections} 
          onReorder={handleSectionReorder} 
          onUpdate={handleSectionUpdate}
        />
      </div>
    </VisualEditorProvider>
  );
};

export default HomePage;
