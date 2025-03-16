
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  Newsletter,
  // Import getNewslettersFromEmailAccount from newsletters which gets it from fetch.ts
  getNewslettersFromEmailAccount
} from "@/lib/supabase";
import { FiltersState } from "../FilterToolbar";
import { sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

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
        console.log(`Loading emails for account ${selectedAccount}`, { page, filters });
        
        // Convert filters from FiltersState to NewsletterFilters
        const newsLetterFilters = {
          category: filters.categoryId !== "all" ? filters.categoryId : undefined,
          fromDate: filters.fromDate ? filters.fromDate.toISOString() : undefined,
          toDate: filters.toDate ? filters.toDate.toISOString() : undefined,
          searchQuery: filters.searchQuery,
          sender: filters.sender
        };

        const { data, error, total } = await getNewslettersFromEmailAccount(
          selectedAccount, 
          page,
          newsLetterFilters
        );
        
        console.log(`Email data loaded: ${data?.length || 0} items, total count: ${total || 0}`);
        
        if (error) {
          console.error("Error fetching emails:", error);
          setErrorMessage(`Failed to load emails: ${error.message}`);
          setNewsletters([]);
          setTotalCount(0);
        } else {
          // Process and sanitize the newsletter content before setting it
          const processedNewsletters = data ? data.map(newsletter => {
            if (newsletter.content) {
              // Apply content sanitization to ensure proper display
              newsletter.content = sanitizeNewsletterContent(newsletter.content);
            }
            return newsletter;
          }) : [];
          
          setNewsletters(processedNewsletters);
          setTotalCount(total || 0);
          
          // Add a warning message if no newsletters found
          if ((!data || data.length === 0) && page === 1) {
            setWarningMessage("No emails found. You may need to sync this account first by clicking the 'Sync' button.");
          }
        }
      } catch (error) {
        console.error("Exception loading emails:", error);
        setNewsletters([]);
        setTotalCount(0);
        setErrorMessage("Failed to load emails. There may be a database issue or the account is not properly connected.");
        toast.error("Failed to load emails");
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
