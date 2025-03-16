import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { searchNewsletters } from '@/lib/supabase/newsletters';
import { toast } from 'sonner';
import { navigateToNewsletter } from '@/lib/utils/newsletterNavigation';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
  brand_name?: string; // Add brand_name field
}

export const useSenderNewsletters = () => {
  const { senderName: paramSenderName } = useParams();
  const navigate = useNavigate();
  const [senderName, setSenderName] = useState(paramSenderName || '');
  const [senderBrandName, setSenderBrandName] = useState<string | null>(null);
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
  const [hasMore, setHasMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
	const [timePeriod, setTimePeriod] = useState<string>('all');
  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (paramSenderName) {
      setSenderName(paramSenderName);
    }
  }, [paramSenderName]);

  useEffect(() => {
    document.title = `${senderName} | NewsletterHub`;
  }, [senderName]);

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
    const fetchSenderBrands = async () => {
      const { data, error } = await supabase
        .from('newsletters')
        .select('sender_email, sender')
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
              count: 0
            };
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

        const result = await searchNewsletters({
          searchQuery,
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          sender: [senderName], // Only search for the current sender
          fromDate,
          toDate,
          page,
          limit: ITEMS_PER_PAGE
        });

        if (page === 1) {
          setNewsletters(result.data || []);
        } else {
          setNewsletters(prev => [...prev, ...(result.data || [])]);
        }

        setHasMore(result.count ? result.count > page * ITEMS_PER_PAGE : false);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch newsletters only if senderName is available
    if (senderName) {
      fetchNewsletters();
    }
  }, [senderName, searchQuery, selectedCategory, dateRange, page]);

  // Fetch sender's brand name (if available)
  useEffect(() => {
    const fetchBrandName = async () => {
      if (!senderName) return;
      
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('brand_name, sender_email')
          .eq('sender', senderName)
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0 && data[0].brand_name) {
          setSenderBrandName(data[0].brand_name);
        }
      } catch (error) {
        console.error('Error fetching brand name:', error);
      }
    };
    
    fetchBrandName();
  }, [senderName]);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setPage(1);
  }, []);

  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brand]);
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
    setPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    setPage(1);
  }, []);

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const toggleDesktopFilters = () => {
    setIsDesktopFiltersOpen(!isDesktopFiltersOpen);
  };

  const handleNewsletterClick = useCallback((newsletter: Newsletter) => {
    console.log("Newsletter clicked:", newsletter.id, newsletter.title);
    navigateToNewsletter(newsletter, navigate);
  }, [navigate]);

  const handleFollow = () => {
    // Placeholder for follow functionality
    setIsFollowing(!isFollowing);
    toast.success(`You have ${isFollowing ? 'unfollowed' : 'followed'} ${senderName}`);
  };

  const handleSenderSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

	const handlePeriodChange = (period: string) => {
    setTimePeriod(period);
    const today = new Date();
    let fromDate: Date | undefined = undefined;

    if (period === 'last7days') {
      fromDate = new Date(today.setDate(today.getDate() - 7));
    } else if (period === 'last30days') {
      fromDate = new Date(today.setDate(today.getDate() - 30));
    } else if (period === 'last90days') {
      fromDate = new Date(today.setDate(today.getDate() - 90));
    }

    setDateRange({ from: fromDate, to: undefined });
    setPage(1);
  };

  return {
    senderName,
    newsletters,
    categories,
    senderBrands,
    loading,
    searchQuery,
    selectedCategory,
    selectedBrands,
    dateRange,
    hasMore,
    isFollowing,
    isMobileFiltersOpen,
    isDesktopFiltersOpen,
		timePeriod,
    setSearchQuery,
    setSelectedCategory,
    handleCategoryChange,
    handleBrandChange,
    setDateRange,
    applyFilters,
    toggleMobileFilters,
    toggleDesktopFilters,
    handleLoadMore,
    handleNewsletterClick,
    handleFollow,
    handleSenderSearch,
		handlePeriodChange
  };
};
