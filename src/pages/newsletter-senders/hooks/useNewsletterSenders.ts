
import { useSenderData } from "./useSenderData";
import { useSenderOperations } from "./useSenderOperations";
import { useSenderSorting } from "./useSenderSorting";
import { useRefreshSenders } from "./useRefreshSenders";
import { UseNewsletterSendersResult } from "./types";
import { useEffect, useRef, useState } from "react";

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

  // State to track if we need to trigger a refresh
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  // Track the previous operation states
  const prevOperationState = useRef({
    updatingCategory: false,
    updatingBrand: false,
    deleting: false,
    refreshing: false
  });

  // This effect detects when operations complete
  useEffect(() => {
    const currentlyOperating = updatingCategory || updatingBrand || deleting || refreshing;
    const wasOperating = 
      prevOperationState.current.updatingCategory || 
      prevOperationState.current.updatingBrand || 
      prevOperationState.current.deleting ||
      prevOperationState.current.refreshing;
    
    // If we were operating but now we're not, schedule a refresh
    if (wasOperating && !currentlyOperating) {
      console.log("Operation completed, scheduling a single refresh");
      setShouldRefresh(true);
    }
    
    // Update the previous state
    prevOperationState.current = {
      updatingCategory,
      updatingBrand,
      deleting,
      refreshing
    };
  }, [updatingCategory, updatingBrand, deleting, refreshing]);

  // Handle the refresh when shouldRefresh changes to true
  useEffect(() => {
    if (shouldRefresh) {
      // Reset the flag immediately to prevent further refreshes
      setShouldRefresh(false);
      
      // Use setTimeout to ensure this runs after the current render cycle
      const timeoutId = setTimeout(() => {
        console.log("Executing the scheduled refresh");
        handleRefresh();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shouldRefresh, handleRefresh]);

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
