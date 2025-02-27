
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock industry data
const industries = [
  "Technology", "Finance", "Healthcare", "Marketing", 
  "Design", "Education", "Entertainment", "Business"
];

interface FilterBarProps {
  onFilterChange: (selectedIndustries: string[]) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
  };

  useEffect(() => {
    onFilterChange(selectedIndustries);
  }, [selectedIndustries, onFilterChange]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filter by Industry</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs"
        >
          {isOpen ? "Hide" : "Show"} filters
        </Button>
      </div>

      {isOpen && (
        <div className="p-4 mb-4 bg-white rounded-lg border border-border shadow-sm animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-3">
            {industries.map(industry => (
              <Badge 
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedIndustries.includes(industry) 
                    ? "bg-primary text-white hover:bg-mint-dark" 
                    : "hover:bg-secondary"
                }`}
                onClick={() => toggleFilter(industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
          {selectedIndustries.length > 0 && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      {!isOpen && selectedIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
          {selectedIndustries.map(industry => (
            <Badge 
              key={industry}
              variant="default"
              className="bg-primary text-white"
            >
              {industry}
              <button 
                className="ml-1 pl-1"
                onClick={() => toggleFilter(industry)}
              >
                ×
              </button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground h-6"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
