
import { useSenderData } from "./useSenderData";
import { useSenderOperations } from "./useSenderOperations";
import { useSenderSorting } from "./useSenderSorting";
import { useRefreshSenders } from "./useRefreshSenders";
import { UseNewsletterSendersResult } from "./types";

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
