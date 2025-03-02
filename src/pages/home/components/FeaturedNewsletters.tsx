
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import LogoSection from './LogoSection';
import CategoryFilter from './newsletter/CategoryFilter';
import NewsletterGrid from './newsletter/NewsletterGrid';
import { useNewsletters } from './newsletter/useNewsletters';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const { newsletters, categories, loading, selectedCategory, setSelectedCategory } = useNewsletters();
  
  const handleSeeMoreClick = () => {
    navigate('/search');
  };

  const handleNewsletterClick = (newsletter: any) => {
    if (!newsletter) return;
    
    const senderSlug = newsletter.sender 
      ? newsletter.sender.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'unknown';
    
    const titleSlug = newsletter.title 
      ? newsletter.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'untitled';
    
    const titleId = `${titleSlug}-${newsletter.id}`;
    
    navigate(`/${senderSlug}/${titleId}`);
  };
  
  return (
    <>
      <section className="py-12 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Utforskede nyhetsbrev</h2>
            
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          <NewsletterGrid 
            newsletters={newsletters}
            loading={loading}
            onNewsletterClick={handleNewsletterClick}
          />
          
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
