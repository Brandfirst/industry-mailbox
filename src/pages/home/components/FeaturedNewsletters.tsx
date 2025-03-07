
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from 'lucide-react';
import CategoryFilter from './newsletter/CategoryFilter';
import { useNewsletters } from './newsletter/useNewsletters';
import { Newsletter } from '@/lib/supabase/types';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';
import NewsletterItem from '@/components/search/NewsletterItem';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const { newsletters, categories, loading, selectedCategory, setSelectedCategory } = useNewsletters();
  
  // State for displayed newsletters
  const [visibleNewsletters, setVisibleNewsletters] = useState<Newsletter[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Setup newsletter display
  useEffect(() => {
    if (!loading && newsletters.length > 0) {
      // When animation completes, show the newsletters
      if (animationComplete) {
        setVisibleNewsletters(newsletters.slice(0, 4));
      }
    }
  }, [loading, newsletters, animationComplete]);

  // Start animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animationStarted) {
        setAnimationStarted(true);
        // After the animation duration, set animation complete
        setTimeout(() => {
          setAnimationComplete(true);
        }, 1500); // Animation takes 1.5 seconds
      }
    }, { threshold: 0.2 });
    
    const section = document.getElementById('featured-newsletters-section');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [animationStarted]);

  const handleSeeMoreClick = () => {
    navigate('/search');
  };

  const handleNewsletterClick = (newsletter: Newsletter) => {
    navigateToNewsletter(newsletter, navigate);
  };
  
  return (
    <section id="featured-newsletters-section" className="py-12 bg-transparent overflow-hidden relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Utforskede nyhetsbrev</h2>
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        {animationStarted && !animationComplete && (
          <div className="newsletter-data-stream">
            <Mail className="data-stream-icon" />
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 ${animationComplete ? 'fade-in-grid' : 'opacity-0'}`}>
          {loading ? (
            // Loading state
            Array(4).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted/20 h-24 md:h-[400px] rounded-lg"></div>
            ))
          ) : visibleNewsletters.length > 0 ? (
            // Display newsletters
            visibleNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="h-full">
                <NewsletterItem
                  newsletter={newsletter}
                  onClick={() => handleNewsletterClick(newsletter)}
                />
              </div>
            ))
          ) : (
            // No newsletters found
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-white">Ingen nyhetsbrev funnet</h3>
              <p className="text-muted-foreground mb-6">Prøv å endre kategori for å se flere nyhetsbrev</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button onClick={handleSeeMoreClick} className="gap-2 bg-gradient-to-r from-[#FF5722] to-[#FF8A50] hover:from-[#FF8A50] hover:to-[#FF5722] text-white transition-all backdrop-blur-sm bg-opacity-20 border border-white/10 shadow-md">
            Se flere nyhetsbrev <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsletters;
