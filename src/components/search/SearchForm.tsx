
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from 'lucide-react';
import { NewsletterCategory } from '@/lib/supabase/types';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  handleCategoryChange: (value: string) => void;
  categories: NewsletterCategory[];
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  onSubmit
}: SearchFormProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Søk etter nyhetsbrev..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button type="submit">Søk</Button>
      </form>
    </div>
  );
};

export default SearchForm;
