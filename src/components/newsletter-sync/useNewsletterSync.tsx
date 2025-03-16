import { useState, useEffect, useCallback } from "react";
import { useEmailAccounts } from "@/lib/supabase";
import { getNewslettersFromEmailAccount, getCategories } from "@/lib/supabase";
import { useNewsletterOperations } from "./hooks/useNewsletterOperations";

export function useNewsletterSync(userId: string | undefined) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  
  const { emailAccounts, status } = useEmailAccounts(userId);
  
  const {
    isSyncing,
    handleSync,
    handleDeleteNewsletters
  } = useNewsletterOperations(
    selectedAccount,
    page,
    setNewsletters,
    setTotalCount,
    setErrorMessage,
    setWarningMessage
  );

  // Fetch newsletters from the selected account
  useEffect(() => {
    if (!selectedAccount) {
      setNewsletters([]);
      setTotalCount(0);
      return;
    }

    const fetchNewsletters = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        const { data, error, total } = await getNewslettersFromEmailAccount(selectedAccount, page, filters);
        
        if (error) {
          console.error("Error fetching newsletters:", error);
          setErrorMessage("Failed to load newsletters");
        } else {
          setNewsletters(data || []);
          setTotalCount(total || 0);
        }
      } catch (error) {
        console.error("Exception while fetching newsletters:", error);
        setErrorMessage("An unexpected error occurred while loading newsletters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, [selectedAccount, page, filters]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getCategories();
        if (error) {
          console.error("Error fetching categories:", error);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Exception while fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters: any) => {
    setPage(1); // Reset to the first page when filters change
    setFilters(newFilters);
  }, [setFilters, setPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / 10);

  // Calculate display range
  const startIndex = (page - 1) * 10 + 1;
  const endIndex = Math.min(startIndex + 9, totalCount);
  const displayRange = `Displaying ${startIndex}-${endIndex} of ${totalCount}`;

  const deletionData = {
    selectedAccount,
    status,
    errorMessage,
    warningMessage,
    isSyncing,
    isLoading,
    emailAccounts,
    categories,
    page,
    setPage,
    totalPages,
    displayRange,
    filters,
    handleSync,
    handleFiltersChange
  };

  return {
    ...deletionData,
    selectedAccount,
    status,
    errorMessage,
    warningMessage,
    isSyncing,
    isLoading,
    emailAccounts,
    categories,
    page,
    setPage,
    totalPages,
    displayRange,
    filters,
    handleSync,
    handleFiltersChange
  };
}
