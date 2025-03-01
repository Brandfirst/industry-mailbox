
import { useEffect, useState } from "react";
import { Search, Trash2, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { NewsletterCategory } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface FiltersState {
  searchQuery: string;
  sender: string;
  categoryId: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface FilterToolbarProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  categories: NewsletterCategory[];
}

export function FilterToolbar({ filters, onFiltersChange, categories }: FilterToolbarProps) {
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.sender) count++;
    if (filters.categoryId && filters.categoryId !== "all") count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    setActiveFilterCount(count);
  }, [filters]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      searchQuery: e.target.value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  const handleCategoryChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      categoryId: value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  const handleDateChange = (field: "fromDate" | "toDate", date?: Date) => {
    const newFilters = {
      ...localFilters,
      [field]: date,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      searchQuery: "",
      sender: "",
      categoryId: "all",
      fromDate: undefined,
      toDate: undefined,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };
  
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search newsletters..."
            value={localFilters.searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <Select
          value={localFilters.categoryId}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="uncategorized">Uncategorized</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
              {(localFilters.fromDate || localFilters.toDate) && (
                <Badge variant="secondary" className="ml-1 px-1.5 h-5">
                  {localFilters.fromDate &&
                    localFilters.toDate &&
                    `${format(localFilters.fromDate, "MMM d")} - ${format(
                      localFilters.toDate,
                      "MMM d"
                    )}`}
                  {localFilters.fromDate &&
                    !localFilters.toDate &&
                    `After ${format(localFilters.fromDate, "MMM d")}`}
                  {!localFilters.fromDate &&
                    localFilters.toDate &&
                    `Before ${format(localFilters.toDate, "MMM d")}`}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid gap-2 p-3">
              <div className="grid gap-1">
                <h4 className="font-medium text-sm">From Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={localFilters.fromDate}
                  onSelect={(date) => handleDateChange("fromDate", date)}
                  initialFocus
                  disabled={(date) =>
                    localFilters.toDate
                      ? date > localFilters.toDate
                      : false
                  }
                />
              </div>
              <div className="grid gap-1">
                <h4 className="font-medium text-sm">To Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={localFilters.toDate}
                  onSelect={(date) => handleDateChange("toDate", date)}
                  disabled={(date) =>
                    localFilters.fromDate
                      ? date < localFilters.fromDate
                      : false
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleDateChange("fromDate", undefined);
                    handleDateChange("toDate", undefined);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetFilters}
            title="Clear all filters"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>
            {activeFilterCount} filter{activeFilterCount !== 1 && "s"} applied
          </span>
        </div>
      )}
    </div>
  );
}
