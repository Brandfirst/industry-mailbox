
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import SearchForm from '@/components/search/SearchForm';
import NewsletterResults from '@/components/search/NewsletterResults';
import SearchLayout from '@/components/search/SearchLayout';
import FilterButtons from '@/components/search/FilterButtons';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Add light mode class for search page
  useEffect(() => {
    document.body.classList.add('light-mode');
    
    return () => {
      document.body.classList.remove('light-mode');
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

  useEffect(() => {
    const senderParam = searchParams.get('sender');
    if (senderParam) {
      const senderExists = senderBrands.some(brand => brand.sender_email === senderParam || brand.sender_name === senderParam);
      
      if (senderExists) {
        setSelectedBrands([senderParam]);
        applyFilters();
      }
    }
  }, [searchParams, senderBrands, setSelectedBrands, applyFilters]);

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6 bg-white text-gray-900">
      <SearchHeader />
      
      <SearchForm 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        onSubmit={handleSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      {/* Only show mobile filter button */}
      <div className="md:hidden mb-4">
        <FilterButtons
          toggleMobileFilters={toggleMobileFilters}
          showDesktopFilterButton={false}
        />
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
      >
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

export default SearchPage;
