
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import NewsletterCard from "@/components/NewsletterCard";

// Mock newsletter data
const mockNewsletters = [
  {
    id: "1",
    title: "The Future of AI in Marketing: Trends to Watch",
    sender: "MarketingWeekly",
    industry: "Marketing",
    preview: "AI is transforming how marketers connect with their audiences. Here are the key trends to watch in the coming year...",
    date: new Date(2023, 4, 15)
  },
  {
    id: "2",
    title: "Decoding the Latest Tech IPOs",
    sender: "TechInsider",
    industry: "Technology",
    preview: "This week saw several major tech companies go public. We break down what this means for the industry and investors...",
    date: new Date(2023, 5, 20)
  },
  {
    id: "3",
    title: "Healthcare Innovation Report: Q2 2023",
    sender: "HealthTech Today",
    industry: "Healthcare",
    preview: "Our quarterly report on innovations in healthcare technology, including breakthroughs in telemedicine and AI diagnostics...",
    date: new Date(2023, 6, 5)
  },
  {
    id: "4",
    title: "Financial Markets: Mid-Year Overview",
    sender: "Finance Daily",
    industry: "Finance",
    preview: "A comprehensive look at the financial markets halfway through the year, with projections for the remainder of 2023...",
    date: new Date(2023, 6, 15)
  },
  {
    id: "5",
    title: "UX Design Principles for SaaS Products",
    sender: "Design Weekly",
    industry: "Design",
    preview: "Learn the key UX design principles that are driving success for leading SaaS products in today's competitive market...",
    date: new Date(2023, 7, 1)
  },
  {
    id: "6",
    title: "Education Technology Trends for 2023",
    sender: "EduTech Review",
    industry: "Education",
    preview: "From AI-powered tutoring to immersive learning experiences, these are the edtech trends reshaping education in 2023...",
    date: new Date(2023, 7, 10)
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState(mockNewsletters);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Search Newsletters | NewsletterHub";
  }, []);

  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let results = [...mockNewsletters];
      
      // Filter by search query
      if (searchQuery) {
        results = results.filter(
          newsletter => 
            newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            newsletter.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
            newsletter.sender.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by selected industries
      if (selectedIndustries.length > 0) {
        results = results.filter(newsletter => 
          selectedIndustries.includes(newsletter.industry)
        );
      }
      
      setFilteredNewsletters(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedIndustries]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (industries: string[]) => {
    setSelectedIndustries(industries);
  };

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
          ) : filteredNewsletters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNewsletters.map(newsletter => (
                <NewsletterCard
                  key={newsletter.id}
                  id={newsletter.id}
                  title={newsletter.title}
                  sender={newsletter.sender}
                  industry={newsletter.industry}
                  preview={newsletter.preview}
                  date={newsletter.date}
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
