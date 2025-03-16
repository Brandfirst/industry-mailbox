
import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import { toast } from 'sonner';

export const useSenderNewsletters = () => {
  const { senderSlug } = useParams<{ senderSlug: string }>();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false); // False to hide filters by default
  const [isFollowing, setIsFollowing] = useState(false);
  const [senderSearchQuery, setSenderSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Add light mode class
  useEffect(() => {
    // Add both classes to ensure proper styling
    document.body.classList.add('light-mode');
    document.documentElement.classList.add('light');
    
    return () => {
      document.body.classList.remove('light-mode');
      document.documentElement.classList.remove('light');
    };
  }, []);
  
  const {
    newsletters,
    categories,
    senderBrands,
    loading,
    searchQuery,
    selectedCategory,
    selectedBrands,
    dateRange,
    hasMore,
    setSearchQuery,
    setSelectedCategory,
    setSelectedBrands,
    setDateRange,
    handleLoadMore,
    handleSearch: originalHandleSearch,
    handleCategoryChange,
    handleBrandChange,
    applyFilters,
    handleNewsletterClick
  } = useSearchNewsletters();
  
  // Find the sender from the slug
  useEffect(() => {
    if (!senderSlug || !senderBrands.length) return;
    
    console.log("Finding sender with slug:", senderSlug);
    console.log("Available senders:", senderBrands.map(b => b.sender_name));
    
    // Try to match the slug to a sender from senderBrands array
    // Check in different ways to increase chance of matching
    let matchedSender = null;
    
    // Method 1: Check if slug matches email-based slug pattern
    const emailBasedSenderMatch = senderBrands.find(brand => {
      if (brand.sender_email) {
        const emailSlug = brand.sender_email.toLowerCase().replace('@', '-').replace(/\./g, '');
        return senderSlug === emailSlug;
      }
      return false;
    });
    
    if (emailBasedSenderMatch) {
      console.log("Found email-based sender match:", emailBasedSenderMatch.sender_name);
      matchedSender = emailBasedSenderMatch;
    } else {
      // Method 2: Check if slug matches name-based slug pattern
      matchedSender = senderBrands.find(brand => {
        const brandSlug = brand.sender_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return brandSlug === senderSlug;
      });
      
      if (matchedSender) {
        console.log("Found name-based sender match:", matchedSender.sender_name);
      } else {
        console.log("No sender match found for slug:", senderSlug);
      }
    }
    
    if (matchedSender) {
      setSelectedBrands([matchedSender.sender_email]);
      applyFilters();
    } else {
      // If no sender matches, redirect to search
      console.log("No sender found for slug, redirecting to search");
      navigate('/search');
    }
  }, [senderSlug, senderBrands, setSelectedBrands, applyFilters, navigate]);
  
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };
  
  const toggleDesktopFilters = () => {
    setIsDesktopFiltersOpen(!isDesktopFiltersOpen);
  };
  
  // Get the sender name to display in the header
  const senderName = senderBrands.find(brand => 
    selectedBrands.includes(brand.sender_email)
  )?.sender_name || senderSlug || '';

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`Du følger nå ${senderName}`);
    } else {
      toast.info(`Du følger ikke lenger ${senderName}`);
    }
  };

  // Create a wrapper function to handle the search properly
  const handleSenderSearch = (query: string) => {
    setSenderSearchQuery(query);
    setSearchQuery(query);
    
    // Create a synthetic form event to pass to originalHandleSearch
    const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    originalHandleSearch(syntheticEvent);
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
    handleSenderSearch
  };
};
