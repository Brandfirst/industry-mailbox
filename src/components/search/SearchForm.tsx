
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Calendar } from 'lucide-react';
import { NewsletterCategory } from '@/lib/supabase/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  handleCategoryChange: (value: string) => void;
  categories: NewsletterCategory[];
  onSubmit: (e: React.FormEvent) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  onSubmit,
  dateRange,
  setDateRange
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
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Datoer</span>
                {(dateRange.from || dateRange.to) && (
                  <Badge variant="secondary" className="ml-1 px-1.5 h-5">
                    {dateRange.from && dateRange.to && 
                      `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`}
                    {dateRange.from && !dateRange.to && 
                      `Etter ${format(dateRange.from, "MMM d")}`}
                    {!dateRange.from && dateRange.to && 
                      `Før ${format(dateRange.to, "MMM d")}`}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="grid gap-2 p-3">
                <div className="grid gap-1">
                  <h4 className="font-medium text-sm">Fra dato</h4>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                    disabled={(date) => 
                      dateRange.to ? date > dateRange.to : false
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <h4 className="font-medium text-sm">Til dato</h4>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    disabled={(date) => 
                      dateRange.from ? date < dateRange.from : false
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                  >
                    Nullstill
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button type="submit">Søk</Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
