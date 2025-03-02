
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
  
  // State for displayed newsletters
  const [visibleNewsletters, setVisibleNewsletters] = useState<Newsletter[]>([]);
  const [changingIndex, setChangingIndex] = useState<number | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Setup newsletter rotation
  useEffect(() => {
    // Only setup animation when we have newsletters loaded
    if (!loading && newsletters.length > 0) {
      // Initialize with the current newsletters
      setVisibleNewsletters(newsletters.slice(0, 4));
      
      // Set up rotation interval (every 5 seconds)
      intervalRef.current = window.setInterval(() => {
        // Pick a random index to change (0-3)
        const indexToChange = Math.floor(Math.random() * 4);
        setChangingIndex(indexToChange);
        
        // Start fade out
        setFadeOut(true);
        
        // After fade out completes, swap the newsletter
        setTimeout(() => {
          setVisibleNewsletters(prev => {
            // Find a newsletter that isn't currently visible
            const availableNewsletters = newsletters.filter(
              nl => !prev.some(visible => visible.id === nl.id)
            );
            
            if (availableNewsletters.length === 0) {
              return prev;
            }
            
            // Pick a random newsletter from available ones
            const randomIndex = Math.floor(Math.random() * availableNewsletters.length);
            const newNewsletter = availableNewsletters[randomIndex];
            
            // Create a new array with the updated newsletter at the changing index
            const newNewsletters = [...prev];
            newNewsletters[indexToChange] = newNewsletter;
            
            return newNewsletters;
          });
          
          // Start fade in
          setFadeOut(false);
        }, 300); // Fade out duration
      }, 5000); // Change one newsletter every 5 seconds
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
              // Display newsletters with subtle transition for the changing one
              visibleNewsletters.map((newsletter, index) => (
                <div 
                  key={newsletter.id} 
                  className={`transition-opacity duration-300 ${
                    changingIndex === index && fadeOut ? 'opacity-0' : 'opacity-100'
                  }`}
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
