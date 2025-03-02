
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import LogoSection from './LogoSection';
import CategoryFilter from './newsletter/CategoryFilter';
import NewsletterGrid from './newsletter/NewsletterGrid';
import { useNewsletters } from './newsletter/useNewsletters';
import { Newsletter } from '@/lib/supabase/types';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const { newsletters, categories, loading, selectedCategory, setSelectedCategory } = useNewsletters();
  
  // State for animated newsletters
  const [visibleNewsletters, setVisibleNewsletters] = useState<Newsletter[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Setup newsletter rotation
  useEffect(() => {
    // Only setup animation when we have newsletters loaded
    if (!loading && newsletters.length > 0) {
      // Initialize with the current newsletters
      setVisibleNewsletters([...newsletters]);
      
      // Set up rotation interval (every 5 seconds)
      intervalRef.current = window.setInterval(() => {
        // Choose a random index to rotate
        const randomIndex = Math.floor(Math.random() * Math.min(newsletters.length, 4));
        setAnimatingIndex(randomIndex);
        
        // After animation out completes, swap the newsletter
        setTimeout(() => {
          setVisibleNewsletters(prev => {
            // Get a random newsletter that's not already visible
            const availableNewsletters = newsletters.filter(
              nl => !prev.some(visible => visible.id === nl.id)
            );
            
            if (availableNewsletters.length === 0) {
              // If all newsletters are visible, just return the current list
              return prev;
            }
            
            // Get a random newsletter from available ones
            const randomNewsletter = availableNewsletters[
              Math.floor(Math.random() * availableNewsletters.length)
            ];
            
            // Create a new array with the random newsletter replacing the one at randomIndex
            const updated = [...prev];
            updated[randomIndex] = randomNewsletter;
            return updated;
          });
          
          // Reset the animating index after the new newsletter is set
          setTimeout(() => {
            setAnimatingIndex(null);
          }, 500); // Match the fade-in duration
        }, 500); // Match the fade-out duration
      }, 5000); // Rotate every 5 seconds
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
              // Animated newsletters
              visibleNewsletters.slice(0, 4).map((newsletter, index) => (
                <div 
                  key={newsletter.id} 
                  className={`transition-all duration-500 relative ${
                    animatingIndex === index 
                      ? 'opacity-0 transform scale-95' 
                      : 'opacity-100 transform scale-100 animate-float'
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="h-full">
                    <NewsletterCard 
                      newsletter={newsletter} 
                      onClick={handleNewsletterClick} 
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

// Helper component to maintain the same structure
const NewsletterCard = ({ newsletter, onClick }: { newsletter: Newsletter, onClick: (newsletter: Newsletter) => void }) => {
  return (
    <div 
      onClick={() => onClick(newsletter)} 
      className="h-full cursor-pointer rounded-lg overflow-hidden bg-dark-300 border border-dark-500 hover:border-blue/50 transition-all duration-300 glow-effect"
    >
      {newsletter.image_url ? (
        <div className="h-40 bg-dark-400 overflow-hidden">
          <img 
            src={newsletter.image_url} 
            alt={newsletter.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-dark-400 to-dark-500 flex items-center justify-center">
          <div className="text-4xl text-blue-light opacity-30">{newsletter.title.charAt(0)}</div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-medium text-white mb-2 line-clamp-2 h-12">{newsletter.title}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{newsletter.sender_name || newsletter.sender_email}</p>
            
            {newsletter.categories && (
              <span 
                className="inline-block px-2 py-1 text-xs rounded-full" 
                style={{ 
                  backgroundColor: newsletter.categories.color || '#3a6ffb',
                  color: 'white'
                }}
              >
                {newsletter.categories.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsletters;
