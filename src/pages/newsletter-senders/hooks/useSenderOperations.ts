
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { 
  updateNewsletterSenderCategory, 
  updateNewsletterSenderBrand, 
  deleteNewsletterSenders 
} from "@/lib/supabase/newsletters";
import { toast } from "sonner";

export function useSenderOperations(
  setSenders: React.Dispatch<React.SetStateAction<NewsletterSenderStats[]>>,
  setBrandUpdates: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
  const [refreshing, setRefreshing] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCategoryChange = async (senderEmail: string, categoryId: number | null) => {
    try {
      setUpdatingCategory(senderEmail);
      
      await updateNewsletterSenderCategory(senderEmail, categoryId);
      
      // Update local sender's category
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail 
            ? { ...sender, category_id: categoryId } 
            : sender
        )
      );
      
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setUpdatingCategory(null);
    }
  };

  const handleBrandChange = async (senderEmail: string, brandName: string) => {
    try {
      setUpdatingBrand(senderEmail);
      
      await updateNewsletterSenderBrand(senderEmail, brandName);
      
      // Update local sender's brand
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail 
            ? { ...sender, brand_name: brandName } 
            : sender
        )
      );
      
      // Add to brand updates map to refresh analytics
      setBrandUpdates(prev => ({
        ...prev,
        [senderEmail]: brandName
      }));
      
      toast.success("Brand updated successfully");
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand");
    } finally {
      setUpdatingBrand(null);
    }
  };

  const handleDeleteSenders = async (senderEmails: string[]) => {
    if (!senderEmails.length) return;
    
    try {
      setDeleting(true);
      
      await deleteNewsletterSenders(senderEmails);
      
      // Remove deleted senders from local state
      setSenders(prevSenders => 
        prevSenders.filter(sender => !senderEmails.includes(sender.sender_email))
      );
      
      toast.success(`${senderEmails.length} sender(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting senders:", error);
      toast.error("Failed to delete senders");
    } finally {
      setDeleting(false);
    }
  };

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
