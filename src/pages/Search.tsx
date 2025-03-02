
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import SearchHeader from '@/components/search/SearchHeader';
import SearchForm from '@/components/search/SearchForm';
import NewsletterResults from '@/components/search/NewsletterResults';

const SearchPage = () => {
  const {
    newsletters,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    hasMore,
    setSearchQuery,
    setSelectedCategory,
    handleLoadMore,
    handleSearch,
    handleCategoryChange,
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
  );
};

export default SearchPage;
