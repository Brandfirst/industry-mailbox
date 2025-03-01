
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { NewsletterCategory } from "@/lib/supabase";

export type FiltersState = {
  searchQuery: string;
  sender: string;
  categoryId: string;
  fromDate?: Date;
  toDate?: Date;
};

interface FilterToolbarProps {
  categories: NewsletterCategory[];
  onFiltersChange: (filters: FiltersState) => void;
}

export function FilterToolbar({ categories, onFiltersChange }: FilterToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sender, setSender] = useState("");
  const [categoryId, setCategoryId] = useState("all"); // Changed from empty string to "all"
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters when any filter value changes
  useEffect(() => {
    onFiltersChange({
      searchQuery,
      sender,
      categoryId,
      fromDate,
      toDate
    });
  }, [searchQuery, sender, categoryId, fromDate, toDate, onFiltersChange]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSender("");
    setCategoryId("all"); // Reset to "all" instead of empty string
    setFromDate(undefined);
    setToDate(undefined);
    setShowFilters(false);
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    sender !== "" || 
    categoryId !== "all" || // Check against "all" instead of empty string
    fromDate !== undefined || 
    toDate !== undefined;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search newsletters..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={showFilters ? "default" : "outline"} 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="whitespace-nowrap"
          >
            {hasActiveFilters ? "Filters Active" : "Filters"}
            {hasActiveFilters && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs text-primary">
                {[
                  sender !== "", 
                  categoryId !== "all", // Check against "all" instead of empty string
                  fromDate !== undefined,
                  toDate !== undefined
                ].filter(Boolean).length + (searchQuery !== "" ? 1 : 0)}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClearFilters}
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-md">
          <div className="space-y-2">
            <Label htmlFor="sender">Sender</Label>
            <Input
              id="sender"
              placeholder="Filter by sender..."
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
