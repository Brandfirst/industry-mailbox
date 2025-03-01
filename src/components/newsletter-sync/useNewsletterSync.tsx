
import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Newsletter,
  getNewslettersFromEmailAccount
} from "@/lib/supabase";
import { FiltersState } from "./FilterToolbar";
import { useNewsletterData } from "./hooks/useNewsletterData";
import { useNewsletterFetching } from "./hooks/useNewsletterFetching";
import { useNewsletterOperations } from "./hooks/useNewsletterOperations";

export function useNewsletterSync(userId: string | undefined) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    sender: "",
    categoryId: "all", // Changed from empty string to "all"
    fromDate: undefined,
    toDate: undefined
  });

  // Get accounts and categories data
  const {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    categories,
    errorMessage: dataErrorMessage,
    setErrorMessage: setDataErrorMessage
  } = useNewsletterData(userId);

  // Track account changes to prevent page reset issues
  const prevSelectedAccountRef = useRef<string | null>(null);
  
  // Reset page when account changes
  useEffect(() => {
    if (prevSelectedAccountRef.current !== selectedAccount) {
      prevSelectedAccountRef.current = selectedAccount;
      setPage(1); // Reset to first page when account changes
    }
  }, [selectedAccount]);

  // Get newsletters based on current filters
  const {
    newsletters,
    setNewsletters,
    isLoading,
    errorMessage: fetchErrorMessage,
    setErrorMessage: setFetchErrorMessage,
    warningMessage,
    setWarningMessage,
    totalCount,
    setTotalCount,
    itemsPerPage
  } = useNewsletterFetching(selectedAccount, page, filters);

  // Get operations for newsletters
  const {
    isSyncing,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters: deleteNewslettersBase
  } = useNewsletterOperations(
    selectedAccount,
    page,
    setNewsletters,
    setTotalCount,  // Pass setTotalCount from useNewsletterFetching
    setFetchErrorMessage,
    setWarningMessage
  );

  // Combine error messages from different sources
  const errorMessage = dataErrorMessage || fetchErrorMessage;

  // Handle deleting newsletters and update UI accordingly
  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      await deleteNewslettersBase(ids);
      
      // Update the local state to remove deleted newsletters
      const remainingNewsletters = newsletters.filter(
        newsletter => !ids.includes(newsletter.id)
      );
      
      setNewsletters(remainingNewsletters);
      
      // Decrease total count
      setTotalCount(prevCount => prevCount - ids.length);
      
      // If all newsletters on the current page were deleted and we're not on page 1,
      // go to the previous page
      if (remainingNewsletters.length === 0 && page > 1) {
        setPage(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      throw error; // Re-throw to let the component handle the error display
    }
  }, [deleteNewslettersBase, newsletters, page, setNewsletters, setTotalCount]);

  const handleFiltersChange = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPage(1);
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Calculate displayed range (e.g., "Showing 1-10 of 50")
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalCount);
  const displayRange = isLoading 
    ? "Loading..."
    : totalCount > 0 
      ? `Showing ${startItem}-${endItem} of ${totalCount}`
      : "No newsletters found";

  return {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    newsletters,
    categories,
    isSyncing,
    isLoading,
    errorMessage,
    warningMessage,
    page,
    setPage,
    totalCount,
    filters,
    totalPages,
    displayRange,
    itemsPerPage,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters,
    handleFiltersChange
  };
}
