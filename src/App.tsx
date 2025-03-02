
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
import { EditModeProvider } from "./contexts/EditModeContext";
import EditModeToggle from "./components/EditModeToggle";

function App() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
    
    // Check if debug mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    setIsDebugMode(urlParams.get('debug') === 'true');
  }, []);
  
  return (
    <EditModeProvider>
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
      
      {/* Main content sections */}
      <div className="relative">
        <AnnouncementBar />
        <HeroSection />
      </div>
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <NewsletterSubscriptionSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
      <EditModeToggle />
    </EditModeProvider>
  );
}

export default App;
