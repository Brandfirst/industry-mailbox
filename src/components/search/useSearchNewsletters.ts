
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { searchNewsletters } from '@/lib/supabase/newsletters';
import { useNavigate } from 'react-router-dom';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
  brand_name?: string; // Add brand_name field
}

export const useSearchNewsletters = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [senderBrands, setSenderBrands] = useState<SenderBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
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
    const fetchSenderBrands = async () => {
      const { data, error } = await supabase
        .from('newsletters')
        .select('sender_email, sender, brand_name') // Also fetch brand_name
        .order('sender');
      
      if (error) {
        console.error('Error fetching sender brands:', error);
        return;
      }
      
      if (data) {
        const brandsMap = data.reduce((acc, newsletter) => {
          if (!newsletter.sender_email) return acc;
          
          if (!acc[newsletter.sender_email]) {
            acc[newsletter.sender_email] = {
              sender_email: newsletter.sender_email,
              sender_name: newsletter.sender || newsletter.sender_email,
              brand_name: newsletter.brand_name, // Include brand_name
              count: 0
            };
          }
          
          // Update brand_name if current newsletter has one and the accumulated one doesn't
          if (newsletter.brand_name && !acc[newsletter.sender_email].brand_name) {
            acc[newsletter.sender_email].brand_name = newsletter.brand_name;
          }
          
          acc[newsletter.sender_email].count += 1;
          return acc;
        }, {} as Record<string, SenderBrand>);
        
        const brandsArray = Object.values(brandsMap).sort((a, b) => b.count - a.count);
        setSenderBrands(brandsArray);
      }
    };
    
    fetchSenderBrands();
  }, []);
  
  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      
      try {
        const fromDate = dateRange.from ? dateRange.from.toISOString() : undefined;
        const toDate = dateRange.to ? dateRange.to.toISOString() : undefined;
        
        // Special handling for last30emails
        let limit = ITEMS_PER_PAGE;
        if (selectedBrands.length === 1 && !fromDate && !toDate) {
          // If we're looking at a specific sender with no date range specified,
          // we might want to apply the last30emails filter logic
          limit = 30; // Override limit for last30emails
        }
        
        const result = await searchNewsletters({
          searchQuery,
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          sender: selectedBrands.length > 0 ? selectedBrands : undefined,
          fromDate,
          toDate,
          page,
          limit
        });
        
        if (page === 1) {
          setNewsletters(result.data || []);
        } else {
          setNewsletters(prev => [...prev, ...(result.data || [])]);
        }
        
        setHasMore(result.count ? result.count > page * limit : false);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletters();
  }, [searchQuery, selectedCategory, selectedBrands, dateRange, page]);
  
  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
  }, [page]);
  
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset page when searching
  }, []);
  
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setPage(1); // Reset page when changing category
  }, []);
  
  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brand]);
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
    setPage(1); // Reset page when changing brand selection
  }, []);
  
  const applyFilters = useCallback(() => {
    setPage(1);
  }, []);

  const handleNewsletterClick = useCallback((newsletter: Newsletter) => {
    console.log("Newsletter clicked:", newsletter.id, newsletter.title);
    navigateToNewsletter(newsletter, navigate);
  }, [navigate]);

  return {
    newsletters,
    categories,
    senderBrands,
    loading,
    searchQuery,
    selectedCategory,
    selectedBrands,
    dateRange,
    page,
    hasMore,
    setSearchQuery,
    setSelectedCategory,
    setSelectedBrands,
    setDateRange,
    handleLoadMore,
    handleSearch,
    handleCategoryChange,
    handleBrandChange,
    applyFilters,
    handleNewsletterClick
  };
};
