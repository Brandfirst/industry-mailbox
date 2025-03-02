import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';
import { searchNewsletters } from '@/lib/supabase/newsletters';

const SearchPage = () => {
  const navigate = useNavigate();
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
      
      try {
        const result = await searchNewsletters({
          searchQuery,
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          page,
          limit: ITEMS_PER_PAGE
        });
        
        setNewsletters(result.data || []);
        setHasMore(result.count ? result.count > page * ITEMS_PER_PAGE : false);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
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

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };

  const handleNewsletterClick = (newsletter: Newsletter) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse h-[500px]">
              <div className="h-full bg-muted/20"></div>
            </Card>
          ))}
        </div>
      ) : newsletters.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newsletters.map((newsletter) => (
              <div 
                key={newsletter.id} 
                onClick={() => handleNewsletterClick(newsletter)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border flex flex-col h-[500px] hover:shadow-md transition-shadow"
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
                    <span className="font-medium text-sm truncate text-black">{newsletter.sender || 'Unknown Sender'}</span>
                    <span className="text-black text-xs">
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
                
                <div className="relative flex-1 w-full overflow-hidden">
                  {newsletter.content ? (
                    <div 
                      className="absolute inset-0"
                      style={{ pointerEvents: 'none' }}
                    >
                      <iframe
                        srcDoc={`
                          <html>
                            <head>
                              <style>
                                html, body {
                                  margin: 0;
                                  padding: 0;
                                  overflow: hidden;
                                  height: 100%;
                                  width: 100%;
                                }
                                body {
                                  zoom: 0.5;
                                  -moz-transform: scale(0.5);
                                  -moz-transform-origin: 0 0;
                                  -o-transform: scale(0.5);
                                  -o-transform-origin: 0 0;
                                  -webkit-transform: scale(0.5);
                                  -webkit-transform-origin: 0 0;
                                  transform: scale(0.5);
                                  transform-origin: 0 0;
                                }
                                a {
                                  pointer-events: none;
                                }
                                * {
                                  max-width: 100%;
                                  box-sizing: border-box;
                                }
                              </style>
                            </head>
                            <body>${newsletter.content}</body>
                          </html>
                        `}
                        title={newsletter.title || "Newsletter Content"}
                        className="w-full h-full border-0"
                        sandbox="allow-same-origin"
                        style={{ 
                          height: "200%",
                          width: "200%",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">No content available</p>
                    </div>
                  )}
                </div>
              </div>
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
