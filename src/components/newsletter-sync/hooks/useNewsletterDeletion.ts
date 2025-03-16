
import { useCallback } from "react";
import { Newsletter } from "@/lib/supabase";

interface NewsletterDeletionProps {
  newsletters: Newsletter[];
  page: number;
  setPage: (page: number) => void;
  setNewsletters: (newsletters: Newsletter[]) => void;
  setTotalCount: (count: number | ((prevCount: number) => number)) => void;
  deleteNewslettersBase: (ids: number[]) => Promise<void>;
}

export function useNewsletterDeletion({
  newsletters,
  page,
  setPage,
  setNewsletters,
  setTotalCount,
  deleteNewslettersBase
}: NewsletterDeletionProps) {
  
  const handleDeleteNewsletters = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      await deleteNewslettersBase(ids);
      
      // Update the local state to remove deleted newsletters
      const remainingNewsletters = newsletters.filter(
        newsletter => !ids.includes(newsletter.id)
      );
      
      setNewsletters(remainingNewsletters);
      
      // Decrease total count
      setTotalCount(prevCount => prevCount - ids.length);
      
      // If all newsletters on the current page were deleted and we're not on page 1,
      // go to the previous page
      if (remainingNewsletters.length === 0 && page > 1) {
        setPage(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      throw error; // Re-throw to let the component handle the error display
    }
  }, [deleteNewslettersBase, newsletters, page, setNewsletters, setTotalCount, setPage]);

  return { handleDeleteNewsletters };
}
