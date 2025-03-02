
import { useState } from 'react';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import SearchForm from '@/components/search/SearchForm';
import NewsletterResults from '@/components/search/NewsletterResults';
import FilterSidebar from '@/components/search/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const SearchPage = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
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
    setDateRange,
    handleLoadMore,
    handleSearch,
    handleCategoryChange,
    handleBrandChange,
    applyFilters,
    handleNewsletterClick
  } = useSearchNewsletters();
  
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
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
      
      <div className="flex flex-col md:flex-row gap-6 mt-8">
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
        />
        
        <div className="flex-1">
          <div className="flex justify-end mb-4 md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleMobileFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> Filtre
            </Button>
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
