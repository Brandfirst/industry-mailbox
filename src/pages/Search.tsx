
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import SearchForm from '@/components/search/SearchForm';
import NewsletterResults from '@/components/search/NewsletterResults';
import FilterSidebar from '@/components/search/FilterSidebar';

const SearchPage = () => {
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
  
  return (
    <div className="container py-12 px-4 md:px-6">
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
        />
        
        <div className="flex-1">
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
