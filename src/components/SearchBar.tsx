
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search newsletters..." }: SearchBarProps) => {
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
    <form 
      onSubmit={handleSearch} 
      className={`relative w-full transition-all duration-300 transform ${
        isFocused ? "scale-[1.01]" : "scale-100"
      }`}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 py-6 bg-white border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
        />
        {query && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={clearSearch}
            className="absolute right-10 hover:bg-transparent"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
        <Button 
          type="submit" 
          className="absolute right-2 bg-primary text-white hover:bg-mint-dark"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
