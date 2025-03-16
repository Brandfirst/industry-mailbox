
import { useSenderData } from "./useSenderData";
import { useSenderOperations } from "./useSenderOperations";
import { useSenderSorting } from "./useSenderSorting";
import { useRefreshSenders } from "./useRefreshSenders";
import { UseNewsletterSendersResult } from "./types";
import { useEffect, useRef } from "react";

export function useNewsletterSenders(): UseNewsletterSendersResult {
  // Get base sender data
  const {
    senders,
    setSenders,
    categories,
    loading,
    frequencyData,
    setFrequencyData,
    loadingAnalytics,
    setLoadingAnalytics
  } = useSenderData();

  // Set up sender operations (category, brand changes, deletion)
  const {
    refreshing,
    setRefreshing,
    updatingCategory,
    updatingBrand,
    deleting,
    handleCategoryChange,
    handleBrandChange,
    handleDeleteSenders
  } = useSenderOperations(setSenders);

  // Set up sorting and filtering
  const {
    searchTerm,
    setSearchTerm,
    sortKey,
    sortAsc,
    toggleSort,
    filterSenders
  } = useSenderSorting();

  // Set up refresh functionality
  const { handleRefresh } = useRefreshSenders(
    setRefreshing,
    setLoadingAnalytics,
    setSenders,
    setFrequencyData
  );

  // Track whether we're in an operation and whether we've already refreshed
  const isOperationInProgress = useRef(false);
  const hasRefreshedAfterOperation = useRef(false);

  // Auto-refresh after operations
  useEffect(() => {
    // If any operation is in progress, mark our flag
    if ((updatingCategory || updatingBrand || deleting || refreshing) && 
        !isOperationInProgress.current) {
      console.log("Operation started - tracking for later refresh");
      isOperationInProgress.current = true;
      hasRefreshedAfterOperation.current = false;
    }
    
    // Only proceed if we were doing an operation, it's now completed, and we haven't refreshed yet
    if (isOperationInProgress.current && 
        !updatingCategory && !updatingBrand && !deleting && !refreshing && 
        !hasRefreshedAfterOperation.current) {
      console.log("Operations completed, triggering one-time refresh");
      
      // Mark that we've refreshed so we don't do it again
      hasRefreshedAfterOperation.current = true;
      
      // Reset the operation flag
      isOperationInProgress.current = false;
      
      // Trigger a single refresh
      handleRefresh();
    }
  }, [updatingCategory, updatingBrand, deleting, refreshing]);

  // Apply filters to get the final sender list
  const filteredSenders = filterSenders(senders);

  return {
    senders,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    sortKey,
    sortAsc,
    refreshing,
    updatingCategory,
    updatingBrand,
    deleting,
    frequencyData,
    loadingAnalytics,
    handleRefresh,
    handleCategoryChange,
    handleBrandChange,
    handleDeleteSenders,
    toggleSort,
    filteredSenders
  };
}
