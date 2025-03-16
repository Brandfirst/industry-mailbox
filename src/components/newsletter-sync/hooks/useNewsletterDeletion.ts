
import { useState } from "react";
import { toast } from "sonner";
import { deleteNewsletters } from "@/lib/supabase/newsletters";

interface NewsletterDeletionProps {
  onSuccess?: () => void;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
}

export function useNewsletterDeletion({ onSuccess, setTotalCount }: NewsletterDeletionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleDeleteNewsletters = async (ids: number[]) => {
    if (ids.length === 0) return;
    
    setSelectedIds(ids);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedIds.length === 0) {
      setIsConfirmOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteNewsletters(selectedIds);
      toast.success(`${selectedIds.length} newsletter(s) deleted successfully`);
      
      // Update the total count after deletion
      // We need to pass a function to setTotalCount to properly update based on previous state
      setTotalCount((prev) => prev - selectedIds.length);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      toast.error(`Failed to delete newsletters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedIds([]);
    }
  };

  return {
    isDeleting,
    isConfirmOpen,
    selectedIds,
    setIsConfirmOpen,
    handleDeleteNewsletters,
    confirmDelete,
  };
}
