
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TimePeriodFilter, { TimePeriodOption } from "@/components/search/filters/TimePeriodFilter";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  onPeriodChange?: (period: TimePeriodOption) => void;
  selectedPeriod?: TimePeriodOption;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search newsletters...",
  onPeriodChange,
  selectedPeriod = "all"
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative w-full transition-all duration-300 transform ${isFocused ? "scale-[1.01]" : "scale-100"}`}>
      <div className="relative flex flex-col sm:flex-row items-center gap-2">
        {onPeriodChange && (
          <div className="w-full sm:w-auto mb-2 sm:mb-0">
            <TimePeriodFilter 
              selectedPeriod={selectedPeriod} 
              onPeriodChange={onPeriodChange}
            />
          </div>
        )}
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder={placeholder} 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onFocus={() => setIsFocused(true)} 
            onBlur={() => setIsFocused(false)} 
            className="pl-10 pr-24 py-6 bg-white border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all" 
          />
          {query && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={clearSearch} 
              className="absolute right-20 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-mint-dark text-orange-500"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
