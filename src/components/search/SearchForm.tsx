
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  selectedCategory,
  handleCategoryChange,
  categories,
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
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Velg kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle kategorier</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit">Søk</Button>
      </form>
    </div>
  );
};

export default SearchForm;
