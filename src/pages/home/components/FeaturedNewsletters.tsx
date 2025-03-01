
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { ArrowRight, Filter, ExternalLink } from 'lucide-react';

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
  
  // Get random time string for display
  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}pm`;
  };
  
  // Generate random country code (2 letters)
  const getRandomCountry = () => {
    const countries = ['US', 'GB', 'DE', 'AU', 'CA', 'NO', 'SE', 'DK', 'FR'];
    return countries[Math.floor(Math.random() * countries.length)];
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-3">
            Aktuelle nyhetsbrev
          </h2>
          <p className="text-muted-foreground max-w-[700px]">
            Oppdagelse av de nyeste og mest populære nyhetsbrevene i vår samling
          </p>
        </div>
        
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
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted h-32"></CardHeader>
                <CardContent className="pt-6">
                  <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-muted rounded mb-2 w-full"></div>
                  <div className="h-3 bg-muted rounded mb-2 w-5/6"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id} className="overflow-hidden transition-shadow hover:shadow-md border rounded-lg">
                {/* Header with sender info */}
                <div className="flex items-center p-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    {newsletter.sender && (
                      <span className="text-lg font-semibold text-gray-700">
                        {newsletter.sender.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{newsletter.sender || 'Unknown Sender'}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {getRandomCountry()} · {getRandomTime()}
                    </div>
                  </div>
                  {newsletter.category_id && (
                    <div 
                      className="px-2 py-1 text-xs rounded-full font-medium ml-2"
                      style={{ 
                        backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                        color: newsletter.categories?.color || '#8B5CF6' 
                      }}
                    >
                      {newsletter.categories?.name || 'Ukategorisert'}
                    </div>
                  )}
                </div>
                
                {/* Email content preview */}
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-3">{newsletter.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {newsletter.preview || 'Ingen forhåndsvisning tilgjengelig.'}
                  </p>
                  
                  {/* Mock email content - image placeholder */}
                  <div className="bg-gray-100 rounded-md h-40 mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Nyhetsbrev innhold</span>
                  </div>
                </div>
                
                {/* Footer */}
                <CardFooter className="flex justify-between border-t px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    {newsletter.published_at ? format(new Date(newsletter.published_at), 'dd.MM.yyyy') : 'Ukjent dato'}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/newsletter/${newsletter.id}`)} className="flex items-center gap-1 text-xs">
                    Les mer <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
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
