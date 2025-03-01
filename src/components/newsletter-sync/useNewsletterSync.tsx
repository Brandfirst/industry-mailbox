
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  EmailAccount, 
  NewsletterCategory, 
  Newsletter,
  getUserEmailAccounts, 
  getNewslettersFromEmailAccount,
  syncEmailAccount,
  getAllCategories,
  deleteNewsletters
} from "@/lib/supabase";
import { FiltersState } from "./FilterToolbar";

export function useNewsletterSync(userId: string | undefined) {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    sender: "",
    categoryId: "",
    fromDate: undefined,
    toDate: undefined
  });
  const ITEMS_PER_PAGE = 10;

  // Load email accounts and categories
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      try {
        setErrorMessage(null);
        setWarningMessage(null);
        const accounts = await getUserEmailAccounts(userId);
        setEmailAccounts(accounts);
        
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
        }
        
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setErrorMessage("Failed to load email accounts or categories.");
        toast.error("Failed to load data");
      }
    };
    
    loadData();
  }, [userId]);

  // Load newsletters when account, page, or filters change
  useEffect(() => {
    const loadNewsletters = async () => {
      if (!selectedAccount) return;
      
      setIsLoading(true);
      setErrorMessage(null);
      setWarningMessage(null);
      
      try {
        // Prepare filter options
        const filterOptions: { 
          searchQuery?: string;
          sender?: string;
          categoryId?: number | string;
          fromDate?: string;
          toDate?: string;
          page?: number;
          limit?: number;
        } = {
          page,
          limit: ITEMS_PER_PAGE
        };

        if (filters.searchQuery) {
          filterOptions.searchQuery = filters.searchQuery;
        }

        if (filters.sender) {
          filterOptions.sender = filters.sender;
        }

        if (filters.categoryId) {
          filterOptions.categoryId = filters.categoryId;
        }

        if (filters.fromDate) {
          filterOptions.fromDate = filters.fromDate.toISOString();
        }

        if (filters.toDate) {
          filterOptions.toDate = filters.toDate.toISOString();
        }

        const { data, count } = await getNewslettersFromEmailAccount(selectedAccount, page, ITEMS_PER_PAGE, filterOptions);
        setNewsletters(data);
        setTotalCount(count || 0);
      } catch (error) {
        console.error("Error loading newsletters:", error);
        setErrorMessage("Failed to load newsletters. There may be a database issue or the account is not properly connected.");
        toast.error("Failed to load newsletters");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNewsletters();
  }, [selectedAccount, page, filters]);

  const handleSync = async () => {
    if (!selectedAccount) return;
    
    setIsSyncing(true);
    setErrorMessage(null);
    setWarningMessage(null);
    toast.info("Starting email sync...");
    
    try {
      console.log("Syncing account:", selectedAccount);
      const result = await syncEmailAccount(selectedAccount);
      console.log("Sync result:", result);
      
      if (result.success) {
        // Check if it was a partial success
        if (result.partial) {
          const warningMsg = `Synced ${result.count || 0} newsletters with some errors: ${result.warning || 'Some items failed'}`;
          setWarningMessage(warningMsg);
          toast.warning(warningMsg);
        } else {
          toast.success(`Successfully synced ${result.count || 0} newsletters`);
        }
        
        // Refresh the newsletter list
        const { data, count } = await getNewslettersFromEmailAccount(
          selectedAccount, 
          page, 
          ITEMS_PER_PAGE
        );
        setNewsletters(data);
        setTotalCount(count || 0);
      } else {
        console.error("Sync error details:", result);
        let errorMsg = result.error || "Unknown error occurred during sync";
        
        // More descriptive error messages for common failures
        if (errorMsg.includes("Edge Function") || result.statusCode === 500) {
          errorMsg = "Server error during sync. The edge function may have encountered an issue. Please check the logs or try again later.";
        } else if (result.statusCode === 401 || result.statusCode === 403) {
          errorMsg = "Authentication error. Your email account connection may need to be refreshed.";
        } else if (result.details) {
          // If we have more specific details, include them
          errorMsg += `: ${result.details}`;
        }
        
        setErrorMessage(`Failed to sync emails: ${errorMsg}`);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      setErrorMessage("An unexpected error occurred while syncing emails. Please check the console for more details and try again.");
      toast.error("An error occurred while syncing emails");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCategoryChange = (updatedNewsletters: Newsletter[]) => {
    setNewsletters(updatedNewsletters);
  };

  const handleDeleteNewsletters = async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      await deleteNewsletters(ids);
      
      // Update the local state to remove deleted newsletters
      const remainingNewsletters = newsletters.filter(
        newsletter => !ids.includes(newsletter.id)
      );
      
      setNewsletters(remainingNewsletters);
      
      // Update total count
      setTotalCount(prev => prev - ids.length);
      
      // If all newsletters on the current page were deleted and we're not on page 1,
      // go to the previous page
      if (remainingNewsletters.length === 0 && page > 1) {
        setPage(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      throw error; // Re-throw to let the component handle the error display
    }
  };

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters,
    handleFiltersChange
  };
}
