
import { useCallback } from "react";
import { useNewsletterData } from "./hooks/useNewsletterData";
import { useNewsletterFetching } from "./hooks/useNewsletterFetching";
import { useNewsletterOperations } from "./hooks/useNewsletterOperations";
import { usePagination } from "./hooks/usePagination";
import { useFilters } from "./hooks/useFilters";
import { useDisplayRange } from "./hooks/useDisplayRange";
import { useNewsletterDeletion } from "./hooks/useNewsletterDeletion";
import { FiltersState } from "./FilterToolbar";

export function useNewsletterSync(userId: string | undefined) {
  // Get accounts and categories data
  const {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    categories,
    errorMessage: dataErrorMessage,
    setErrorMessage: setDataErrorMessage
  } = useNewsletterData(userId);

  // Set up pagination
  const { page, setPage } = usePagination(selectedAccount);

  // Set up filters
  const { filters, handleFiltersChange: handleFiltersChangeBase } = useFilters();

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
    setTotalCount,
    setFetchErrorMessage,
    setWarningMessage
  );

  // Calculate display range and total pages
  const { displayRange, totalPages } = useDisplayRange(
    page,
    itemsPerPage,
    totalCount,
    isLoading
  );

  // Set up newsletter deletion
  const { 
    selectedIds,
    isDeleting,
    handleSelectNewsletter,
    handleSelectAll,
    handleDeleteNewsletters,
    setSelectedIds
  } = useNewsletterDeletion({
    newsletters,
    page,
    setPage,
    setNewsletters,
    setTotalCount,
    deleteNewslettersBase
  });

  // Handle filter changes and reset page
  const handleFiltersChange = useCallback((newFilters: FiltersState) => {
    const shouldResetPage = handleFiltersChangeBase(newFilters);
    if (shouldResetPage) {
      setPage(1);
    }
  }, [handleFiltersChangeBase, setPage]);

  // Combine error messages from different sources
  const errorMessage = dataErrorMessage || fetchErrorMessage;

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
    totalPages,
    displayRange,
    filters,
    selectedIds,
    isDeleting,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters,
    handleFiltersChange,
    handleSelectNewsletter,
    handleSelectAll,
    setSelectedIds
  };
}
