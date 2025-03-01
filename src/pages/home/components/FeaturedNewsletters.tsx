
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { ArrowRight, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFeaturedNewsletters } from '@/lib/supabase/newsletters';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
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
          searchQuery, 
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
  }, [searchQuery, selectedCategory]);
  
  const handleSeeMoreClick = () => {
    navigate('/search');
  };
  
  // Get formatted date
  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };
  
  return (
    <section className="py-12 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Utforskede nyhetsbrev</h2>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Søk etter nyhetsbrev..."
                className="pr-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Velg kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle kategorier</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                {/* Header with sender logo and info */}
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
                
                {/* Content Preview using iframe - Improved to fit the entire container */}
                <div className="flex-1 w-full overflow-hidden relative">
                  {newsletter.content ? (
                    <iframe
                      srcDoc={newsletter.content}
                      title={newsletter.title || "Newsletter Content"}
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin"
                      style={{ transform: "scale(0.97)", transformOrigin: "top center" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Ingen innhold tilgjengelig</span>
                    </div>
                  )}
                </div>
                
                {/* Title at bottom */}
                <div className="p-3 border-t min-h-[60px] flex items-center">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {newsletter.title || 'Untitled Newsletter'}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2 text-white">Ingen nyhetsbrev funnet</h3>
            <p className="text-muted-foreground mb-6">Prøv å endre søk eller filtre for å se flere nyhetsbrev</p>
          </div>
        )}
        
        <div className="flex justify-center mt-12">
          <Button onClick={handleSeeMoreClick} className="gap-2">
            Se flere nyhetsbrev <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsletters;
