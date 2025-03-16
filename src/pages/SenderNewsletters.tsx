
import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchNewsletters } from '@/components/search/useSearchNewsletters';
import NewsletterResults from '@/components/search/NewsletterResults';
import SearchLayout from '@/components/search/SearchLayout';
import FilterButtons from '@/components/search/FilterButtons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SearchBar from '@/components/SearchBar';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const SenderNewsletters = () => {
  const { senderSlug } = useParams<{ senderSlug: string }>();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false); // Changed to false to hide filters by default
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
  )?.sender_name || senderSlug;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`Du følger nå ${senderName}`);
    } else {
      toast.info(`Du følger ikke lenger ${senderName}`);
    }
  };

  // Fixed: Create a wrapper function to handle the search properly
  const handleSenderSearch = (query: string) => {
    setSenderSearchQuery(query);
    setSearchQuery(query);
    
    // Create a synthetic form event to pass to originalHandleSearch
    const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    originalHandleSearch(syntheticEvent);
  };

  // Get random cover image
  const coverImageId = Math.floor(Math.random() * 6) + 1;
  const coverImage = `/unsplash/photo-${coverImageId}.jpg`;

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Cover image section */}
      <div 
        className="h-60 w-full relative bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=400&q=80)`,
          backgroundPosition: '50% 50%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      {/* Profile header */}
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 mb-8">
          <Avatar className="w-32 h-32 border-4 border-white rounded-full shadow-lg bg-white">
            <AvatarFallback className="text-4xl font-bold bg-orange-500 text-white">
              {senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col md:flex-row flex-1 gap-4 md:items-end">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-gray-900">{senderName}</h1>
              <p className="text-gray-600">
                {newsletters.length} nyhetsbrev
              </p>
            </div>
            
            <Button 
              onClick={handleFollow} 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "bg-white text-gray-700" : "bg-orange-500 hover:bg-orange-600 text-white"}
            >
              {isFollowing ? (
                <><BellOff className="mr-2 h-4 w-4" /> Følger</>
              ) : (
                <><Bell className="mr-2 h-4 w-4" /> Følg</>
              )}
            </Button>
          </div>
        </div>

        {/* Search within sender */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSenderSearch}
            placeholder={`Søk i nyhetsbrev fra ${senderName}...`}
          />
        </div>
      </div>
      
      {/* Newsletter content */}
      <div className="container py-2 px-4 md:px-6 flex-1">
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
    </div>
  );
};

export default SenderNewsletters;
