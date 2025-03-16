
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { 
  updateSenderCategory, 
  updateSenderBrand, 
  deleteNewsletters 
} from "@/lib/supabase/newsletters";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

export function useSenderOperations(
  setSenders: React.Dispatch<React.SetStateAction<NewsletterSenderStats[]>>,
  setBrandUpdates: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCategoryChange = async (senderEmail: string, categoryId: number | null) => {
    if (!user) {
      toast.error("You must be logged in to update categories");
      return;
    }
    
    try {
      setUpdatingCategory(senderEmail);
      
      await updateSenderCategory(senderEmail, categoryId, user.id);
      
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
    if (!user) {
      toast.error("You must be logged in to update brands");
      return;
    }
    
    try {
      setUpdatingBrand(senderEmail);
      
      await updateSenderBrand(senderEmail, brandName, user.id);
      
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
      
      // Need to convert the API to accept string IDs instead of numbers
      // This is a temporary fix to make the types match
      const newsletterIds = senderEmails.map(email => parseInt(email, 10) || 0);
      
      await deleteNewsletters(newsletterIds);
      
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
