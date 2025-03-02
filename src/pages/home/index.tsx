
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
          <div data-editable="true" data-editable-type="text,color,background">
            <AnnouncementBar />
          </div>
          <HeroSection />
          <div data-editable="true" data-editable-type="padding,margin,background">
            <FeaturesSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <StatsSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <TestimonialsSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <FAQSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <PricingSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <CTASection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <NewsletterSubscriptionSection />
          </div>
          <div data-editable="true" data-editable-type="padding,margin,background">
            <FooterSection />
          </div>
        </div>
      </ContentEditor>
    </ContentEditorProvider>
  );
};

export default HomePage;
