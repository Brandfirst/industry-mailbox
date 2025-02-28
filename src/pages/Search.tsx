
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import NewsletterCard from "@/components/NewsletterCard";
import { getNewsletters, Newsletter } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Search Newsletters | NewsletterHub";
  }, []);

  const { data: newsletterData, isLoading, error } = useQuery({
    queryKey: ['newsletters', searchQuery, selectedIndustries],
    queryFn: () => getNewsletters({ 
      searchQuery, 
      industries: selectedIndustries 
    }),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (industries: string[]) => {
    setSelectedIndustries(industries);
  };

  // Extract the newsletter data for easier rendering
  const newsletters = newsletterData?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Search Newsletters</h1>
            <p className="text-muted-foreground">
              Find newsletters across all industries and topics
            </p>
          </div>
          
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="mb-6">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 h-[220px] animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-lg border border-border">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error loading newsletters</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "Something went wrong. Please try again."}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-primary hover:text-mint-dark underline"
              >
                Refresh page
              </button>
            </div>
          ) : newsletters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((newsletter: Newsletter) => (
                <NewsletterCard
                  key={newsletter.id}
                  id={newsletter.id}
                  title={newsletter.title}
                  sender={newsletter.sender}
                  industry={newsletter.industry}
                  preview={newsletter.preview}
                  date={new Date(newsletter.published_at)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-border">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No newsletters found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustries([]);
                }}
                className="text-primary hover:text-mint-dark underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm font-medium">NewsletterHub</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NewsletterHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Search;
