
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
          // Check if there are failed items to display
          if (result.failed && result.failed.length > 0) {
            // Get database schema errors
            const schemaErrors = result.failed.filter(item => 
              item.error?.includes('gmail_message_id') || 
              item.details?.includes('gmail_message_id')
            );
            
            if (schemaErrors.length > 0) {
              // This is definitely a database schema issue
              const errorDetails = "Newsletter sync failed due to missing database column.";
              const dbError = "The database is missing the 'gmail_message_id' column in the newsletters table. This needs to be added to the database schema.";
              setErrorMessage(`${errorDetails} ${dbError}`);
              
              // Log detailed info for debugging
              console.error("Database schema errors:", schemaErrors);
              toast.error("Database schema issue detected. See console for details.");
              
              // Show a more specific error in the UI
              setWarningMessage("To fix this issue, add the 'gmail_message_id' column to the newsletters table. Contact developer for assistance.");
            } else {
              // Format the failed items for display
              const failedDetails = result.failed.slice(0, 3).map(item => {
                return item.error || item.details || "Unknown error";
              }).join("; ");
              
              const remainingCount = Math.max(0, result.failed.length - 3);
              const additionalText = remainingCount > 0 ? ` and ${remainingCount} more` : '';
              
              const warningMsg = `Sync issues: ${failedDetails}${additionalText}. Check logs for details.`;
              setWarningMessage(warningMsg);
              
              // Log all failures for debugging
              console.error("Failed newsletter syncs:", result.failed);
              toast.warning(warningMsg);
            }
          } else if (result.count > 0 || result.synced?.length > 0) {
            const warningMsg = `Synced ${result.count || 0} newsletters with some errors: ${result.warning || 'Some items failed'}`;
            setWarningMessage(warningMsg);
            toast.warning(warningMsg);
          } else {
            // No newsletters synced at all, so it's more of an error
            const errorDetails = result.details || 
                              "Failed to sync newsletters. There may be a database schema issue.";
            const dbError = "The database might be missing required columns. Check the logs for 'gmail_message_id' errors.";
            setErrorMessage(`${errorDetails} ${dbError}`);
            toast.error(errorDetails);
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
