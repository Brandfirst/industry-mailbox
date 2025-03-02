
import React from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import PricingSection from './components/PricingSection';
import CTASection from './components/CTASection';
import NewsletterSubscriptionSection from './components/NewsletterSubscriptionSection';
import FooterSection from './components/FooterSection';
import { ContentEditorProvider } from '@/contexts/ContentEditorContext'; 
import ContentEditor from '@/components/visual-editor/ContentEditor';

const HomePage = () => {
  return (
    <ContentEditorProvider>
      <ContentEditor>
        <div className="min-h-screen bg-black text-white">
          <AnnouncementBar />
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
          <TestimonialsSection />
          <FAQSection />
          <PricingSection />
          <CTASection />
          <NewsletterSubscriptionSection />
          <FooterSection />
        </div>
      </ContentEditor>
    </ContentEditorProvider>
  );
};

export default HomePage;
