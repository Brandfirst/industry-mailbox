
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { ArrowRight, Filter } from 'lucide-react';

const FeaturedNewsletters = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
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
      
      let query = supabase
        .from('newsletters')
        .select('*, categories(name, color)')
        .order('published_at', { ascending: false })
        .limit(3); // Only fetch 3 newsletters for the feature section
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        // Convert the string to a number for the category_id comparison
        query = query.eq('category_id', parseInt(selectedCategory));
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching newsletters:', error);
        setLoading(false);
        return;
      }
      
      setNewsletters(data || []);
      setLoading(false);
    };
    
    fetchNewsletters();
  }, [searchQuery, selectedCategory]);
  
  const handleSeeMoreClick = () => {
    navigate('/search');
  };
  
  // Get formatted date
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-[400px]">
                <div className="h-full bg-muted/20"></div>
              </Card>
            ))}
          </div>
        ) : newsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <div 
                key={newsletter.id} 
                className="shadow-sm overflow-hidden rounded-xl bg-white border w-full flex flex-col h-full group"
                onClick={() => navigate(`/newsletter/${newsletter.id}`)}
              >
                {/* Image Section */}
                <div className="w-full h-48 border-gray-200 group-hover:opacity-75 order-2">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    {newsletter.content ? (
                      <div 
                        className="w-full h-full object-cover" 
                        dangerouslySetInnerHTML={{ 
                          __html: newsletter.content.length > 500 
                            ? newsletter.content.substring(0, 500) + '...' 
                            : newsletter.content 
                        }} 
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">Nyhetsbrev innhold</span>
                    )}
                  </div>
                </div>
                
                {/* Header with sender info */}
                <div className="flex items-center p-4 border-b order-1">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    {newsletter.sender && (
                      <span className="text-lg font-semibold text-gray-700">
                        {newsletter.sender.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{newsletter.sender || 'Unknown Sender'}</span>
                    <span className="text-gray-500 text-sm">
                      NO • {getFormattedDate(newsletter.published_at || '')}
                    </span>
                  </div>
                  {newsletter.category_id && (
                    <div 
                      className="px-2 py-1 text-xs rounded-full font-medium ml-auto"
                      style={{ 
                        backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                        color: newsletter.categories?.color || '#8B5CF6' 
                      }}
                    >
                      {newsletter.categories?.name || 'Ukategorisert'}
                    </div>
                  )}
                </div>
                
                {/* Content Preview */}
                <div className="flex flex-col gap-2 grow p-4 min-h-[80px] order-3">
                  <div className="text-base leading-6 line-clamp-2 font-medium text-gray-900">
                    {newsletter.title || 'Untitled Newsletter'}
                  </div>
                  <div className="text-sm font-light text-gray-500 line-clamp-3">
                    {newsletter.preview || 'Ingen forhåndsvisning tilgjengelig.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Ingen nyhetsbrev funnet</h3>
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
