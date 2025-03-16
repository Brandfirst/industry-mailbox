
import { useState, useCallback } from "react";
import { FiltersState } from "../FilterToolbar";

export function useFilters() {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    sender: "",
    categoryId: "all", // Changed from empty string to "all"
    fromDate: undefined,
    toDate: undefined
  });

  const handleFiltersChange = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    return true; // Return true to indicate page reset is needed
  }, []);

  return {
    filters,
    setFilters,
    handleFiltersChange
  };
}
