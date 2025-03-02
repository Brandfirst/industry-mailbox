
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import SearchForm from '@/components/search/SearchForm';
import NewsletterResults from '@/components/search/NewsletterResults';
import FilterSidebar from '@/components/search/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(true);
  
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
  
  // Handle sender query parameter
  useEffect(() => {
    const senderParam = searchParams.get('sender');
    if (senderParam) {
      // Find the sender in the senderBrands list
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
  
  const toggleDesktopFilters = () => {
    setIsDesktopFiltersOpen(!isDesktopFiltersOpen);
  };
  
  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      <SearchHeader />
      
      <SearchForm 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        onSubmit={handleSearch}
      />
      
      <div className="flex flex-col md:flex-row gap-0 mt-8">
        <FilterSidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          senderBrands={senderBrands}
          selectedBrands={selectedBrands}
          handleBrandChange={handleBrandChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApplyFilters={applyFilters}
          isMobileOpen={isMobileFiltersOpen}
          toggleMobileFilters={toggleMobileFilters}
          isDesktopOpen={isDesktopFiltersOpen}
          toggleDesktopFilters={toggleDesktopFilters}
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="md:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMobileFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" /> Filtre
              </Button>
            </div>
            <div className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDesktopFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" /> {isDesktopFiltersOpen ? 'Skjul filtre' : 'Vis filtre'}
              </Button>
            </div>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
