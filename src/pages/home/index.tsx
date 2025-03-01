
import { useEffect } from "react";
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

const HomePage = () => {
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Only render AnnouncementBar, HomeHeader is a null component */}
      <HomeHeader />
      <AnnouncementBar />
      
      {/* Main content sections */}
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <NewsletterSubscriptionSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
