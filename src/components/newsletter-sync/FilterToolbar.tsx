
import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterCategory } from "@/lib/supabase";

interface FiltersState {
  searchQuery: string;
  sender: string;
  categoryId: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

interface FilterToolbarProps {
  categories: NewsletterCategory[];
  onFiltersChange: (filters: FiltersState) => void;
}

export function FilterToolbar({ categories, onFiltersChange }: FilterToolbarProps) {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    sender: "",
    categoryId: "",
    fromDate: undefined,
    toDate: undefined
  });

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const resetState = {
      searchQuery: "",
      sender: "",
      categoryId: "",
      fromDate: undefined,
      toDate: undefined
    };
    setFilters(resetState);
    onFiltersChange(resetState);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search box */}
        <div className="flex-1">
          <Input
            placeholder="Search in newsletter content..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sender filter */}
        <div className="w-full md:w-64">
          <Input
            placeholder="Filter by sender..."
            value={filters.sender}
            onChange={(e) => handleFilterChange("sender", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-48">
          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleFilterChange("categoryId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date range */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {filters.fromDate ? format(filters.fromDate, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.fromDate}
                onSelect={(date) => handleFilterChange("fromDate", date)}
                disabled={(date) => filters.toDate ? date > filters.toDate : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {filters.toDate ? format(filters.toDate, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.toDate}
                onSelect={(date) => handleFilterChange("toDate", date)}
                disabled={(date) => filters.fromDate ? date < filters.fromDate : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetFilters} size="sm">Reset filters</Button>
      </div>
    </div>
  );
}

export type { FiltersState };
