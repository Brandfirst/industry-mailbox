
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';

const SearchPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  
  useEffect(() => {
    document.title = "Søk i nyhetsbrev | NewsletterHub";
    
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
        .select('*, categories(name, color)', { count: 'exact' })
        .order('published_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching newsletters:', error);
        setLoading(false);
        return;
      }
      
      setNewsletters(data || []);
      setHasMore(count ? count > page * ITEMS_PER_PAGE : false);
      setLoading(false);
    };
    
    fetchNewsletters();
  }, [searchQuery, selectedCategory, page]);
  
  const handleLoadMore = () => {
    setPage(page + 1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset page when searching
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1); // Reset page when changing category
  };
  
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Søk i nyhetsbrev</h1>
        <p className="mt-4 text-muted-foreground max-w-[700px] mx-auto">
          Finn relevante nyhetsbrev fra vårt arkiv med over 10,000 nyhetsbrev fra hele Norge
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Søk etter nyhetsbrev..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
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
          
          <Button type="submit">Søk</Button>
        </form>
      </div>
      
      {loading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <Button variant="ghost" size="sm">
                    Les mer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={handleLoadMore} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Laster...' : 'Last inn flere'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">Ingen nyhetsbrev funnet</h3>
          <p className="text-muted-foreground mb-6">Prøv å endre søk eller filtre for å se flere nyhetsbrev</p>
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
            Tilbakestill søk
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
