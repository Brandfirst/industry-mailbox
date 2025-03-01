
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        query = query.eq('category_id', selectedCategory);
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
  
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Aktuelle nyhetsbrev
            </h2>
            <p className="mt-4 text-muted-foreground max-w-[700px]">
              Oppdateres daglig med de nyeste nyhetsbrevene i vår arkiv
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
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
              <Card key={newsletter.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-2">{newsletter.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{newsletter.sender}</p>
                    </div>
                    {newsletter.category_id && (
                      <div 
                        className="px-2 py-1 text-xs rounded-full font-medium"
                        style={{ 
                          backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                          color: newsletter.categories?.color || '#8B5CF6' 
                        }}
                      >
                        {newsletter.categories?.name || 'Ukategorisert'}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {newsletter.preview || 'Ingen forhåndsvisning tilgjengelig.'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    {newsletter.published_at ? format(new Date(newsletter.published_at), 'dd.MM.yyyy') : 'Ukjent dato'}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/newsletter/${newsletter.id}`)}>
                    Les mer
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
