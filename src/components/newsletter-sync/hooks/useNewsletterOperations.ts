
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "@/lib/supabase";
import { toast } from "sonner";

export function useNewsletterOperations(
  selectedAccount: string | null,
  page: number,
  setNewsletters: (newsletters: Newsletter[]) => void,
  setTotalCount: (count: number) => void,
  setErrorMessage: (message: string | null) => void,
  setWarningMessage: (message: string | null) => void
) {
  const [isSyncing, setIsSyncing] = useState(false);

  // Function to sync the selected email account
  const handleSync = useCallback(async () => {
    if (!selectedAccount) {
      setErrorMessage("Please select an email account to sync");
      return;
    }

    try {
      setIsSyncing(true);
      setErrorMessage(null);
      setWarningMessage(null);

      // Call the sync-emails edge function
      const { data, error } = await supabase.functions.invoke("sync-emails", {
        body: { emailAccountId: selectedAccount },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Show feedback to the user
      if (data?.success) {
        if (data.newCount > 0) {
          toast.success(`Successfully synced ${data.newCount} new newsletters`);
        } else {
          toast.info("No new newsletters found");
        }

        // Refresh newsletter list if we're on page 1
        if (page === 1) {
          const { data: updatedData, count } = await supabase
            .from("newsletters")
            .select("*, categories(id, name, slug, color)", { count: "exact" })
            .eq("email_id", selectedAccount)
            .order("published_at", { ascending: false })
            .range(0, 9);

          if (updatedData) {
            setNewsletters(updatedData);
            if (count !== null) {
              setTotalCount(count);
            }
          }
        }

        // Show warning if some emails were skipped
        if (data.skippedCount > 0) {
          setWarningMessage(`${data.skippedCount} emails were skipped because they were not newsletters.`);
        }
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      setErrorMessage("Failed to sync emails. Please try again later.");
      toast.error("Failed to sync emails");
    } finally {
      setIsSyncing(false);
    }
  }, [selectedAccount, page, setNewsletters, setTotalCount, setErrorMessage, setWarningMessage]);

  // Function to update categories for one or multiple newsletters
  const handleCategoryChange = useCallback(async (updatedNewsletters: Newsletter[], applySenderWide: boolean) => {
    if (!updatedNewsletters.length) return;

    try {
      const updates = [];
      
      if (applySenderWide) {
        // Group newsletters by sender to make sender-wide updates
        const senderGroups: Record<string, Newsletter[]> = {};
        
        // Group all newsletters by sender
        updatedNewsletters.forEach(newsletter => {
          const sender = newsletter.sender || newsletter.sender_email || "unknown";
          if (!senderGroups[sender]) {
            senderGroups[sender] = [];
          }
          senderGroups[sender].push(newsletter);
        });
        
        // Create batch updates for each sender
        for (const sender in senderGroups) {
          const categoryId = senderGroups[sender][0].category_id;
          const senderKey = senderGroups[sender][0].sender ? "sender" : "sender_email";
          const senderValue = senderGroups[sender][0].sender || senderGroups[sender][0].sender_email;
          
          if (!senderValue) continue;
          
          // Create a batch update for all newsletters from this sender
          updates.push({
            table: "newsletters",
            query: { [senderKey]: senderValue, email_id: selectedAccount },
            values: { category_id: categoryId }
          });
        }
      } else {
        // Standard single-newsletter update (backward compatibility)
        updates.push(...updatedNewsletters.map(newsletter => ({
          table: "newsletters",
          query: { id: newsletter.id },
          values: { category_id: newsletter.category_id }
        })));
      }
      
      // Execute each update
      for (const update of updates) {
        const { error } = await supabase
          .from(update.table)
          .update(update.values)
          .match(update.query);
          
        if (error) {
          console.error(`Error updating ${update.table}:`, error);
          throw error;
        }
      }
      
      // Update UI with optimistic updates
      setNewsletters(prev => {
        const updatedIds = new Set(updatedNewsletters.map(n => n.id));
        return prev.map(n => updatedIds.has(n.id) ? 
          updatedNewsletters.find(u => u.id === n.id) || n : n);
      });
      
    } catch (error) {
      console.error("Error updating categories:", error);
      toast.error("Failed to update categories");
      throw error;
    }
  }, [selectedAccount, setNewsletters]);

  // Function to delete one or multiple newsletters
  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids.length) return;

    try {
      const { error } = await supabase
        .from("newsletters")
        .delete()
        .in("id", ids);

      if (error) {
        console.error("Error deleting newsletters:", error);
        throw error;
      }

      // We don't update the state here because the calling component should handle this
      // based on the result of this operation
    } catch (error) {
      console.error("Error in handleDeleteNewsletters:", error);
      toast.error("Failed to delete newsletters");
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
