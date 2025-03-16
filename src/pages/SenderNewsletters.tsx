
import React from 'react';
import { useSenderNewsletters } from '@/components/sender-newsletters/useSenderNewsletters';
import SenderHeader from '@/components/sender-newsletters/SenderHeader';
import SenderSearch from '@/components/sender-newsletters/SenderSearch';
import SenderContent from '@/components/sender-newsletters/SenderContent';

const SenderNewsletters = () => {
  const {
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
  } = useSenderNewsletters();

  // Create a wrapper function that handles the string input
  const onSearch = (query: string) => {
    handleSenderSearch(query);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <SenderHeader 
        senderName={senderName}
        newsletterCount={newsletters.length}
        isFollowing={isFollowing}
        onFollowToggle={handleFollow}
      />
      
      <SenderSearch 
        senderName={senderName}
        onSearch={onSearch}
        onPeriodChange={handlePeriodChange}
        selectedPeriod={timePeriod as any} // Fix the type error by casting
      />
      
      <SenderContent 
        newsletters={newsletters}
        categories={categories}
        senderBrands={senderBrands}
        loading={loading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedBrands={selectedBrands}
        dateRange={dateRange}
        hasMore={hasMore}
        isMobileFiltersOpen={isMobileFiltersOpen}
        isDesktopFiltersOpen={isDesktopFiltersOpen}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        handleCategoryChange={handleCategoryChange}
        handleBrandChange={handleBrandChange}
        setDateRange={setDateRange}
        applyFilters={applyFilters}
        toggleMobileFilters={toggleMobileFilters}
        toggleDesktopFilters={toggleDesktopFilters}
        handleLoadMore={handleLoadMore}
        handleNewsletterClick={handleNewsletterClick}
      />
    </div>
  );
};

export default SenderNewsletters;
