
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
  Newsletter,
  syncEmailAccountNewsletters,
  updateNewsletterCategories,
  deleteNewsletters as apiDeleteNewsletters
} from "@/lib/supabase";

export function useNewsletterOperations(
  selectedAccount: string | null,
  currentPage: number,
  setNewsletters: React.Dispatch<React.SetStateAction<Newsletter[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  setErrorMessage: (message: string | null) => void,
  setWarningMessage: (message: string | null) => void
) {
  const [isSyncing, setIsSyncing] = useState(false);

  // Function to sync newsletters from selected email account
  const handleSync = useCallback(async () => {
    if (!selectedAccount) {
      toast.error("No email account selected");
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    setWarningMessage(null);

    try {
      const result = await syncEmailAccountNewsletters(selectedAccount);
      console.log("Sync result:", result);

      if (result.success) {
        // If we're on page 1, refresh the data
        if (currentPage === 1) {
          // We'll let the useEffect in the parent component handle the refresh
          // This is to make sure we have the latest filters applied
        }
        
        toast.success(
          result.count > 0
            ? `Successfully synced ${result.count} newsletter(s)`
            : "No new newsletters found"
        );
        
        if (result.count > 0) {
          // Increment total count
          setTotalCount(prevCount => prevCount + result.count);
        }
        
        if (result.warnings && result.warnings.length > 0) {
          setWarningMessage(result.warnings.join(". "));
        }
      } else {
        toast.error("Failed to sync newsletters");
        setErrorMessage(result.error || "An unknown error occurred");
      }
    } catch (error) {
      console.error("Error syncing newsletters:", error);
      toast.error("Error syncing newsletters");
      setErrorMessage("Failed to sync newsletters. Please try again later.");
    } finally {
      setIsSyncing(false);
    }
  }, [selectedAccount, currentPage, setErrorMessage, setWarningMessage, setTotalCount]);

  // Function to update newsletter categories
  const handleCategoryChange = useCallback(async (updatedNewsletters: Newsletter[], applySenderWide: boolean) => {
    if (!updatedNewsletters || updatedNewsletters.length === 0) return;

    try {
      // Update local state immediately for UI responsiveness
      setNewsletters(prevNewsletters => {
        const updatedIds = new Set(updatedNewsletters.map(n => n.id));
        return prevNewsletters.map(newsletter => 
          updatedIds.has(newsletter.id) 
            ? updatedNewsletters.find(n => n.id === newsletter.id) || newsletter 
            : newsletter
        );
      });

      // Map the updates for the API call
      const updates = updatedNewsletters.map(newsletter => ({
        id: newsletter.id,
        category_id: newsletter.category_id
      }));

      // Send updates to API
      await updateNewsletterCategories(updates, applySenderWide);
    } catch (error) {
      console.error("Error updating newsletter categories:", error);
      toast.error("Failed to update categories");
      
      // Revert the local state change on error
      // This would require fetching fresh data from the server
      // For simplicity, we'll just show an error message
    }
  }, [setNewsletters]);

  // Function to delete newsletters
  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids || ids.length === 0) return;

    try {
      const result = await apiDeleteNewsletters(ids);
      
      if (result.success) {
        return result;
      } else {
        throw new Error("Failed to delete newsletters");
      }
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      throw error;
    }
  }, []);

  return {
    isSyncing,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters
  };
}
