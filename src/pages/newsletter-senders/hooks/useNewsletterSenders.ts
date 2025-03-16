
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

  // Track whether we're in an operation
  const isOperationInProgress = useRef(false);

  // Auto-refresh after operations
  useEffect(() => {
    // Only proceed if we were doing an operation and now it's completed
    if (isOperationInProgress.current && 
        !updatingCategory && !updatingBrand && !deleting && !refreshing) {
      console.log("Operations completed, refreshing sender data");
      
      // Reset the operation flag
      isOperationInProgress.current = false;
      
      // Trigger a single refresh
      handleRefresh();
    }
    
    // Set the flag if we're currently in an operation
    if ((updatingCategory || updatingBrand || deleting || refreshing) && 
        !isOperationInProgress.current) {
      isOperationInProgress.current = true;
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
