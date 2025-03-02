
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  handleCategoryChange: (value: string) => void;
  categories: any[];
  onSubmit: (e: React.FormEvent) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  onSubmit
}: SearchFormProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Søk etter nyhetsbrev..."
              className="w-full pl-10 bg-black/30 backdrop-blur-sm border-[#FF5722]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="bg-gradient-to-r from-[#FF5722] to-[#FF8A50] hover:from-[#FF8A50] hover:to-[#FF5722]">Søk</Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
