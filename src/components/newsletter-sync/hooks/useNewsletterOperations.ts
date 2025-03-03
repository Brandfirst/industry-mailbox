
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
  deleteNewsletters as deleteNewslettersApi,
  syncEmailAccount,
  getNewslettersFromEmailAccount,
  updateNewsletterCategories
} from "@/lib/supabase";

export function useNewsletterOperations(
  selectedAccount: string | null,
  page: number,
  setNewsletters: React.Dispatch<React.SetStateAction<any[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setWarningMessage: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync emails from the selected account
  const handleSync = useCallback(async () => {
    if (!selectedAccount) {
      toast.error("Please select an email account first");
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    setWarningMessage(null);
    
    try {
      console.log(`Starting sync for account ${selectedAccount}...`);
      const result = await syncEmailAccount(selectedAccount);
      
      console.log("Sync result:", result);
      
      if (result.success) {
        toast.success("Successfully synced emails");
        
        // Refresh the newsletters list - passing empty filters as third argument
        const { data, error, total } = await getNewslettersFromEmailAccount(selectedAccount, page, {});
        
        if (error) {
          console.error("Error refreshing emails after sync:", error);
          setWarningMessage("Sync completed, but there was an issue loading the updated list.");
        } else {
          console.log(`Refreshed emails: ${data?.length || 0} items loaded`);
          setNewsletters(data || []);
          setTotalCount(total || 0);
          
          if (data?.length === 0) {
            setWarningMessage("Sync completed, but no emails were found. This is likely because the demo version is using mock data.");
          }
        }
      } else {
        console.error("Sync failed:", result.error);
        setErrorMessage(`Failed to sync: ${result.error}`);
        toast.error("Failed to sync");
      }
    } catch (error) {
      console.error("Exception during sync:", error);
      setErrorMessage("An unexpected error occurred during sync");
      toast.error("An error occurred during sync");
    } finally {
      setIsSyncing(false);
    }
  }, [selectedAccount, page, setNewsletters, setTotalCount, setErrorMessage, setWarningMessage]);

  // Handle changing the category of a newsletter
  const handleCategoryChange = useCallback(async (newsletterId: number, categoryId: number | null) => {
    if (!selectedAccount) return;
    
    try {
      // Create the update object with the expected format
      const updates = [{ id: newsletterId, category_id: categoryId }];
      
      // Set the third parameter (applySenderWide) to false
      await updateNewsletterCategories(updates, false);
      
      // Update the newsletters list to reflect the change - passing empty filters as third argument
      const { data, total } = await getNewslettersFromEmailAccount(selectedAccount, page, {});
      setNewsletters(data || []);
      setTotalCount(total || 0);
      
      toast.success("Category updated");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  }, [selectedAccount, page, setNewsletters, setTotalCount]);

  // Handle deleting newsletters
  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids.length || !selectedAccount) return;
    
    try {
      // Delete the newsletters through the API
      await deleteNewslettersApi(ids);
      
      // Refresh the newsletters list after deletion
      const { data, total } = await getNewslettersFromEmailAccount(selectedAccount, page, {});
      setNewsletters(data || []);
      setTotalCount(total || 0);
      
      toast.success(`${ids.length} email(s) deleted`);
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast.error("Failed to delete emails");
      throw error;
    }
  }, [selectedAccount, page, setNewsletters, setTotalCount]);

  return {
    isSyncing,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters
  };
}
