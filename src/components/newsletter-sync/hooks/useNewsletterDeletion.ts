
import { useState } from "react";
import { Newsletter, deleteNewsletters } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type UseNewsletterDeletionProps = {
  newsletters: Newsletter[];
  page: number;
  setPage: (page: number) => void;
  setNewsletters: React.Dispatch<React.SetStateAction<Newsletter[]>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  deleteNewslettersBase: (ids: number[]) => Promise<void>;
};

export const useNewsletterDeletion = ({
  newsletters,
  page,
  setPage,
  setNewsletters,
  setTotalCount,
  deleteNewslettersBase
}: UseNewsletterDeletionProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleSelectNewsletter = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (newsletters: Newsletter[]) => {
    if (selectedIds.length === newsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(newsletters.map(n => n.id));
    }
  };

  // This function will be used by useNewsletterSync
  const handleDeleteNewsletters = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      setIsDeleting(true);
      await deleteNewslettersBase(selectedIds);
      
      // Adjust page if needed after deletion
      const remainingItems = newsletters.length - selectedIds.length;
      if (remainingItems === 0 && page > 1) {
        setPage(page - 1);
      }
      
      setTotalCount((prevCount: number) => prevCount - selectedIds.length);
      setSelectedIds([]);
      
      toast({
        title: "Newsletters deleted",
        description: `Successfully deleted ${selectedIds.length} newsletter${selectedIds.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the newsletters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    selectedIds,
    isDeleting,
    handleSelectNewsletter,
    handleSelectAll,
    handleDeleteNewsletters,
    setSelectedIds,
  };
};
