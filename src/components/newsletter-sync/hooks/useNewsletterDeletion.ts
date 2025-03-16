
import { useState } from "react";
import { Newsletter, deleteNewsletters } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useNewsletterDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      setIsDeleting(true);
      await deleteNewsletters(selectedIds);
      
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

  const updateTotalCount = (count: number) => {
    setTotalCount(count);
  };

  return {
    selectedIds,
    isDeleting,
    totalCount,
    handleSelectNewsletter,
    handleSelectAll,
    handleDeleteSelected,
    updateTotalCount,
    setSelectedIds,
  };
};
