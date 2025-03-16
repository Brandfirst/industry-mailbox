
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import NewsletterResults from '@/components/search/NewsletterResults';
import SearchLayout from '@/components/search/SearchLayout';
import FilterButtons from '@/components/search/FilterButtons';

const SenderNewsletters = () => {
  const { senderSlug } = useParams<{ senderSlug: string }>();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(true);
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
    handleSearch,
    handleCategoryChange,
    handleBrandChange,
    applyFilters,
    handleNewsletterClick
  } = useSearchNewsletters();
  
  // Find the sender from the slug
  useEffect(() => {
    if (!senderSlug || !senderBrands.length) return;
    
    // Try to find the sender that matches the slug
    const matchedSender = senderBrands.find(brand => {
      const brandSlug = brand.sender_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return brandSlug === senderSlug;
    });
    
    if (matchedSender) {
      setSelectedBrands([matchedSender.sender_email]);
      applyFilters();
    } else {
      // If no sender matches, redirect to search
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
  )?.sender_name || senderSlug;
  
  return (
    <div className="container py-8 md:py-12 px-4 md:px-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Nyhetsbrev fra {senderName}</h1>
        <p className="text-gray-600">Se alle nyhetsbrev fra denne avsenderen</p>
      </div>
      
      <SearchLayout
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        senderBrands={senderBrands}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApplyFilters={applyFilters}
        isMobileFiltersOpen={isMobileFiltersOpen}
        toggleMobileFilters={toggleMobileFilters}
        isDesktopFiltersOpen={isDesktopFiltersOpen}
        toggleDesktopFilters={toggleDesktopFilters}
      >
        <FilterButtons
          toggleMobileFilters={toggleMobileFilters}
          toggleDesktopFilters={toggleDesktopFilters}
          isDesktopFiltersOpen={isDesktopFiltersOpen}
        />
        
        <NewsletterResults
          newsletters={newsletters}
          loading={loading}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          handleNewsletterClick={handleNewsletterClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
        />
      </SearchLayout>
    </div>
  );
};

export default SenderNewsletters;
