
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  Newsletter,
  getNewslettersFromEmailAccount
} from "@/lib/supabase";
import { FiltersState } from "../FilterToolbar";

// Constants
const ITEMS_PER_PAGE = 10;

export function useNewsletterFetching(
  selectedAccount: string | null,
  page: number,
  filters: FiltersState
) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Use refs to track previous values to prevent unnecessary re-renders
  const prevSelectedAccountRef = useRef<string | null>(null);
  const prevPageRef = useRef<number>(page);
  const prevFiltersRef = useRef<FiltersState>(filters);
  
  // Use a loading ref to prevent concurrent loads
  const isLoadingRef = useRef<boolean>(false);
  
  // Stringify filters to compare in a stable way
  const filtersKey = JSON.stringify(filters);

  // Load newsletters when account, page, or filters change
  useEffect(() => {
    // Skip effect if nothing relevant has changed to prevent loops
    const hasAccountChanged = prevSelectedAccountRef.current !== selectedAccount;
    const hasPageChanged = prevPageRef.current !== page;
    const hasFiltersChanged = JSON.stringify(prevFiltersRef.current) !== filtersKey;
    
    if (!hasAccountChanged && !hasPageChanged && !hasFiltersChanged) {
      return;
    }
    
    // Update refs to current values
    prevSelectedAccountRef.current = selectedAccount;
    prevPageRef.current = page;
    prevFiltersRef.current = filters;
    
    // Skip if no account is selected
    if (!selectedAccount) {
      setIsLoading(false);
      setNewsletters([]);
      setTotalCount(0);
      return;
    }
    
    // Skip if already loading (prevent concurrent loads)
    if (isLoadingRef.current) {
      return;
    }
    
    const loadNewsletters = async () => {
      setIsLoading(true);
      isLoadingRef.current = true;
      setErrorMessage(null);
      setWarningMessage(null);
      
      try {
        console.log(`Loading newsletters for account ${selectedAccount}`, { page, filters });
        
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

        // Only include categoryId filter if it's not "all"
        if (filters.categoryId && filters.categoryId !== "all") {
          // Handle "uncategorized" as a special case for null or empty category_id
          if (filters.categoryId === "uncategorized") {
            filterOptions.categoryId = "null"; // Special value to be handled by the backend
          } else {
            filterOptions.categoryId = filters.categoryId;
          }
        }

        if (filters.fromDate) {
          filterOptions.fromDate = filters.fromDate.toISOString();
        }

        if (filters.toDate) {
          filterOptions.toDate = filters.toDate.toISOString();
        }

        const { data, count } = await getNewslettersFromEmailAccount(selectedAccount, page, ITEMS_PER_PAGE, filterOptions);
        console.log(`Newsletter data loaded: ${data.length} items, total count: ${count}`);
        
        setNewsletters(data);
        setTotalCount(count || 0);
      } catch (error) {
        console.error("Error loading newsletters:", error);
        setNewsletters([]);
        setTotalCount(0);
        setErrorMessage("Failed to load newsletters. There may be a database issue or the account is not properly connected.");
        toast.error("Failed to load newsletters");
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };
    
    loadNewsletters();
  }, [selectedAccount, page, filtersKey]); // Use filtersKey instead of filters object for stable dependency

  return {
    newsletters,
    setNewsletters,
    isLoading,
    errorMessage,
    setErrorMessage,
    warningMessage,
    setWarningMessage,
    totalCount,
    setTotalCount,
    itemsPerPage: ITEMS_PER_PAGE
  };
}
