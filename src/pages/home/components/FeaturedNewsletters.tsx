
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFeaturedNewsletters } from '@/lib/supabase/newsletters';
import LogoSection from './LogoSection';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
        .limit(4); // Limit to 4 categories
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      
      try {
        const result = await getFeaturedNewsletters({
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          limit: 4
        });
        
        setNewsletters(result.data || []);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletters();
  }, [selectedCategory]);
  
  const handleSeeMoreClick = () => {
    navigate('/search');
  };
  
  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };
  
  return (
    <>
      <section className="py-12 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Utforskede nyhetsbrev</h2>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className={`${selectedCategory === 'all' ? 'bg-[#3a6ffb] text-white' : 'bg-black text-gray-300 border-gray-700 hover:bg-[#3a6ffb]/10'}`}
                onClick={() => setSelectedCategory('all')}
              >
                Alle kategorier
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`${selectedCategory === String(category.id) ? 'bg-[#3a6ffb] text-white' : 'bg-black text-gray-300 border-gray-700 hover:bg-[#3a6ffb]/10'}`}
                  onClick={() => setSelectedCategory(String(category.id))}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse h-[400px]">
                  <div className="h-full bg-muted/20"></div>
                </Card>
              ))}
            </div>
          ) : newsletters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newsletters.map((newsletter) => (
                <a 
                  key={newsletter.id} 
                  href={`/newsletter/${newsletter.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border flex flex-col h-[450px] hover:shadow-md transition-shadow"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/newsletter/${newsletter.id}`);
                  }}
                >
                  <div className="flex items-center p-3 border-b">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                      {newsletter.sender && (
                        <span className="text-sm font-semibold text-gray-700">
                          {newsletter.sender.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-sm truncate">{newsletter.sender || 'Unknown Sender'}</span>
                      <span className="text-gray-500 text-xs">
                        NO • {getFormattedDate(newsletter.published_at || '')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full overflow-hidden">
                    {newsletter.content ? (
                      <iframe
                        srcDoc={newsletter.content}
                        title={newsletter.title || "Newsletter Content"}
                        className="w-full h-full border-0"
                        sandbox="allow-same-origin"
                        style={{ 
                          transform: "scale(0.85)", 
                          transformOrigin: "top center", 
                          height: "450px",
                          width: "117.5%", // Compensate for the 0.85 scale to make it fill the width
                          marginLeft: "-8.75%" // Center the wider iframe
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">No content available</p>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-white">Ingen nyhetsbrev funnet</h3>
              <p className="text-muted-foreground mb-6">Prøv å endre kategori for å se flere nyhetsbrev</p>
            </div>
          )}
          
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
