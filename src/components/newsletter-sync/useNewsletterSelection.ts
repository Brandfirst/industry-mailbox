
import { useState, useCallback } from "react";
import { Newsletter } from "@/lib/supabase";

export interface NewsletterSelectionState {
  selectedIds: number[];
  allSelected: boolean;
}

export interface UseNewsletterSelectionResult {
  selection: NewsletterSelectionState;
  toggleSelectAll: (newsletters: Newsletter[]) => void;
  toggleSelectNewsletter: (id: number) => void;
  clearSelection: () => void;
  isSelected: (id: number) => boolean;
}

export function useNewsletterSelection(): UseNewsletterSelectionResult {
  const [selection, setSelection] = useState<NewsletterSelectionState>({
    selectedIds: [],
    allSelected: false
  });

  const toggleSelectAll = useCallback((newsletters: Newsletter[]) => {
    if (selection.allSelected) {
      // Deselect all
      setSelection({ selectedIds: [], allSelected: false });
    } else {
      // Select all
      const allIds = newsletters.map(newsletter => newsletter.id);
      setSelection({ selectedIds: allIds, allSelected: true });
    }
  }, [selection.allSelected]);

  const toggleSelectNewsletter = useCallback((id: number) => {
    const isSelected = selection.selectedIds.includes(id);
    let newSelectedIds: number[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedIds = selection.selectedIds.filter(selectedId => selectedId !== id);
    } else {
      // Add to selection
      newSelectedIds = [...selection.selectedIds, id];
    }
    
    setSelection({ 
      selectedIds: newSelectedIds, 
      allSelected: false // Reset allSelected flag when manually toggling
    });
  }, [selection.selectedIds]);

  const clearSelection = useCallback(() => {
    setSelection({ selectedIds: [], allSelected: false });
  }, []);

  const isSelected = useCallback((id: number) => {
    return selection.selectedIds.includes(id);
  }, [selection.selectedIds]);

  return {
    selection,
    toggleSelectAll,
    toggleSelectNewsletter,
    clearSelection,
    isSelected
  };
}
