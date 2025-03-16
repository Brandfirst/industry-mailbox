
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
      await updateSenderCategory(senderEmail, categoryId, user.id);
      
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, category_id: categoryId }
            : sender
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
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
      
      // Update the local state to reflect the change
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, brand_name: brandName }
            : sender
        )
      );
      
      // Log successful update
      console.log(`Successfully updated brand to "${brandName}" for ${senderEmail}`);
      
    } catch (error) {
      console.error("Error updating brand:", error);
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
      
    } catch (error) {
      console.error("Error deleting senders:", error);
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
