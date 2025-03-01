import { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
  Newsletter,
  syncEmailAccount,
  deleteNewsletters,
  getNewslettersFromEmailAccount
} from "@/lib/supabase";

// Constants
const ITEMS_PER_PAGE = 10;

export function useNewsletterOperations(
  selectedAccount: string | null,
  page: number,
  setNewsletters: (newsletters: Newsletter[]) => void,
  setTotalCount: (count: number) => void,
  setErrorMessage: (message: string | null) => void,
  setWarningMessage: (message: string | null) => void
) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = useCallback(async () => {
    if (!selectedAccount) return;
    
    if (isSyncing) {
      // Prevent multiple sync attempts
      toast.info("Sync already in progress");
      return;
    }
    
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
          // Only show warning if we have actual failures
          if (result.count > 0 || result.synced?.length > 0) {
            const warningMsg = `Synced ${result.count || 0} newsletters with some errors: ${result.warning || 'Some items failed'}`;
            setWarningMessage(warningMsg);
            toast.warning(warningMsg);
          } else {
            // No newsletters synced at all, so it's more of an error
            const errorMsg = result.details || 
                           "Failed to sync newsletters. The Gmail API returned an error.";
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
          }
        } else if (result.count === 0) {
          // Success but no newsletters found
          toast.info("No new newsletters found to sync");
        } else {
          toast.success(`Successfully synced ${result.count || 0} newsletters`);
        }
        
        // Refresh the newsletter list regardless of the outcome
        try {
          const { data, count } = await getNewslettersFromEmailAccount(
            selectedAccount, 
            page, 
            ITEMS_PER_PAGE
          );
          setNewsletters(data);
          setTotalCount(count || 0);
        } catch (refreshError) {
          console.error("Error refreshing newsletters after sync:", refreshError);
          // Don't set error message here, as we want to keep the sync result message
        }
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
  }, [selectedAccount, page, setNewsletters, setTotalCount, setErrorMessage, setWarningMessage, isSyncing]);

  const handleCategoryChange = useCallback((updatedNewsletters: Newsletter[]) => {
    setNewsletters(updatedNewsletters);
  }, [setNewsletters]);

  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      await deleteNewsletters(ids);
      
      // Update local state handled in the main hook
      return true;
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      throw error; // Re-throw to let the component handle the error display
    }
  }, []);

  return {
    isSyncing,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters
  };
}
