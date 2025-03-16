
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { updateSenderCategory, updateSenderBrand } from "@/lib/supabase/newsletters";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";

export function useSenderOperations(setSenders: React.Dispatch<React.SetStateAction<any[]>>) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [updatingBrand, setUpdatingBrand] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCategoryChange = useCallback(async (senderEmail: string, categoryId: number | null) => {
    if (!user) return;
    
    try {
      setUpdatingCategory(true);
      
      // Log the operation start
      console.log(`Starting category update for ${senderEmail} to ${categoryId}`);
      
      // Perform the update
      await updateSenderCategory(senderEmail, categoryId, user.id);
      
      // Update the UI state
      setSenders(prevSenders => {
        // Make a deep copy to ensure React detects the change
        const updatedSenders = prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, category_id: categoryId }
            : { ...sender }
        );
        
        console.log(`Updated local state for ${senderEmail}, new category_id: ${categoryId}`);
        return updatedSenders;
      });
      
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
      throw error;
    } finally {
      setUpdatingCategory(false);
    }
  }, [user, setSenders]);
  
  const handleBrandChange = useCallback(async (senderEmail: string, brandName: string) => {
    if (!user) return;
    
    try {
      setUpdatingBrand(true);
      await updateSenderBrand(senderEmail, brandName, user.id);
      
      // Update the local state to reflect the change - make sure this is reliable
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, brand_name: brandName }
            : sender
        )
      );
      
      // Show success toast
      toast.success(`Brand updated to "${brandName}"`);
      
      // Log successful update
      console.log(`Successfully updated brand to "${brandName}" for ${senderEmail}`);
      
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand name");
      throw error;
    } finally {
      setUpdatingBrand(false);
    }
  }, [user, setSenders]);

  const handleDeleteSenders = useCallback(async (senderEmails: string[]) => {
    if (!user || senderEmails.length === 0) return;
    
    try {
      setDeleting(true);
      
      // Delete all newsletters from these senders
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .in('sender_email', senderEmails);
      
      if (error) throw error;
      
      // Update the local state
      setSenders((prevSenders: NewsletterSenderStats[]) => 
        prevSenders.filter(sender => !senderEmails.includes(sender.sender_email))
      );
      
      toast.success(`${senderEmails.length} sender(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting senders:", error);
      toast.error("Failed to delete senders");
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [user, setSenders]);

  return {
    refreshing,
    setRefreshing,
    updatingCategory,
    updatingBrand,
    deleting,
    handleCategoryChange,
    handleBrandChange,
    handleDeleteSenders
  };
}
