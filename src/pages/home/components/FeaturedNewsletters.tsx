
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import LogoSection from './LogoSection';
import CategoryFilter from './newsletter/CategoryFilter';
import { useNewsletters } from './newsletter/useNewsletters';
import { Newsletter } from '@/lib/supabase/types';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';
import NewsletterItem from '@/components/search/NewsletterItem';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const { newsletters, categories, loading, selectedCategory, setSelectedCategory } = useNewsletters();
  
  // State for animated newsletters
  const [visibleNewsletters, setVisibleNewsletters] = useState<Newsletter[]>([]);
  const [animatingRow, setAnimatingRow] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Setup newsletter rotation
  useEffect(() => {
    // Only setup animation when we have newsletters loaded
    if (!loading && newsletters.length > 0) {
      // Initialize with the current newsletters
      setVisibleNewsletters([...newsletters]);
      
      // Set up rotation interval (every 8 seconds)
      intervalRef.current = window.setInterval(() => {
        // Animate the entire row
        setAnimatingRow(true);
        
        // After animation completes, swap all newsletters
        setTimeout(() => {
          setVisibleNewsletters(prev => {
            // Get random newsletters that aren't already visible
            const availableNewsletters = newsletters.filter(
              nl => !prev.some(visible => visible.id === nl.id)
            );
            
            if (availableNewsletters.length < 4) {
              // If we don't have enough newsletters, just return the current list
              return prev;
            }
            
            // Create a new array with 4 random newsletters
            const randomNewsletters = [];
            const tempAvailable = [...availableNewsletters];
            
            for (let i = 0; i < 4; i++) {
              if (tempAvailable.length === 0) break;
              const randomIndex = Math.floor(Math.random() * tempAvailable.length);
              randomNewsletters.push(tempAvailable[randomIndex]);
              tempAvailable.splice(randomIndex, 1);
            }
            
            // If we didn't get enough random newsletters, fill with the current ones
            if (randomNewsletters.length < 4) {
              return prev;
            }
            
            return randomNewsletters;
          });
          
          // Reset the animating state after new newsletters are set
          setTimeout(() => {
            setAnimatingRow(false);
          }, 100);
        }, 600); // Match the animation duration
      }, 8000); // Rotate every 8 seconds (more time to read)
    }
    
    // Cleanup interval on unmount or when newsletters change
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [loading, newsletters]);

  const handleSeeMoreClick = () => {
    navigate('/search');
  };

  const handleNewsletterClick = (newsletter: Newsletter) => {
    navigateToNewsletter(newsletter, navigate);
  };
  
  return (
    <>
      <section className="py-12 bg-black overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Utforskede nyhetsbrev</h2>
            
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              // Loading state
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/20 h-24 md:h-[400px] rounded-lg"></div>
              ))
            ) : visibleNewsletters.length > 0 ? (
              // Animated newsletters with right-to-left animation
              visibleNewsletters.slice(0, 4).map((newsletter, index) => (
                <div 
                  key={newsletter.id} 
                  className={`transition-all duration-500 ${
                    animatingRow 
                      ? 'opacity-0' 
                      : 'animate-slide-from-right'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="h-full">
                    <NewsletterItem
                      newsletter={newsletter}
                      onClick={() => handleNewsletterClick(newsletter)}
                    />
                  </div>
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
            <Button onClick={handleSeeMoreClick} className="gap-2 bg-[#3a6ffb] hover:bg-[#3a6ffb]/90">
              Se flere nyhetsbrev <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <LogoSection />
    </>
  );
};

export default FeaturedNewsletters;
