import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { searchNewsletters } from '@/lib/supabase/newsletters';
import { useNavigate } from 'react-router-dom';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';

export const useSearchNewsletters = () => {
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

  const handleNewsletterClick = (newsletter: Newsletter) => {
    navigateToNewsletter(newsletter, navigate);
  };

  return {
    newsletters,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    page,
    hasMore,
    setSearchQuery,
    setSelectedCategory,
    handleLoadMore,
    handleSearch,
    handleCategoryChange,
    handleNewsletterClick
  };
};
