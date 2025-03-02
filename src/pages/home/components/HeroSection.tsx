
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BackgroundEffects from './hero/BackgroundEffects';
import HeroHeading from './hero/HeroHeading';
import HeroActions from './hero/HeroActions';
import NewsletterDisplay from './hero/NewsletterDisplay';
import CategoryFilter from './hero/CategoryFilter';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center pt-20 pb-16 md:pb-24 lg:pt-24 lg:pb-32">
      <BackgroundEffects />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8">
            <div 
              data-editable="true" 
              data-editable-type="text,color,fontSize,alignment"
              data-editable-id="hero-subtitle"
              className="text-[#3a6ffb] font-medium mb-2"
            >
              The Most Comprehensive Newsletter Platform
            </div>
            
            <h1 
              data-editable="true" 
              data-editable-type="text,color,fontSize,alignment"
              data-editable-id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            >
              Discover the best newsletters in your inbox
            </h1>
            
            <p 
              data-editable="true" 
              data-editable-type="text,color,fontSize,alignment,padding,margin"
              data-editable-id="hero-description"
              className="text-lg text-gray-300 max-w-xl"
            >
              Easily find, organize, and enjoy newsletters that matter to you. Save time with our smart filtering and content discovery tools.
            </p>
            
            <div 
              data-editable="true" 
              data-editable-type="padding,margin"
              data-editable-id="hero-action-container"
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button 
                onClick={() => navigate('/search')}
                size="lg" 
                className="bg-[#3a6ffb] hover:bg-[#3a6ffb]/90 text-white font-medium rounded-lg"
                data-editable="true"
                data-editable-type="color,background,padding,margin"
                data-editable-id="hero-button-primary"
              >
                Explore Newsletters <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => navigate('/auth?mode=signin')}
                variant="outline" 
                size="lg"
                className="border-gray-600 text-white hover:bg-white/10 rounded-lg"
                data-editable="true"
                data-editable-type="color,background,padding,margin"
                data-editable-id="hero-button-secondary"
              >
                Sign In
              </Button>
            </div>
            
            <div
              data-editable="true"
              data-editable-type="padding,margin"
              data-editable-id="category-container"
              className="pt-6"
            >
              <div
                data-editable="true"
                data-editable-type="text,color,fontSize,alignment"
                data-editable-id="category-heading"
                className="text-sm text-gray-400 mb-3"
              >
                Popular categories
              </div>
              <CategoryFilter />
            </div>
          </div>
          
          <div 
            className="hidden lg:block"
            data-editable="true"
            data-editable-type="padding,margin"
            data-editable-id="hero-display-container"
          >
            <NewsletterDisplay />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
