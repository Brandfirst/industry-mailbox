
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";
import { useNewsletterSelection } from "../useNewsletterSelection";
import { AnimatePresence } from "framer-motion";
import { NewsletterListActions } from "./NewsletterListActions";
import { NewsletterListTable } from "./NewsletterListTable";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

type NewsletterListProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  onCategoryChange: (newsletters: Newsletter[], applySenderWide: boolean) => void;
  onDeleteNewsletters?: (ids: number[]) => Promise<void>;
};

export function NewsletterList({ 
  newsletters, 
  categories, 
  onCategoryChange,
  onDeleteNewsletters 
}: NewsletterListProps) {
  const {
    selection,
    toggleSelectAll,
    toggleSelectNewsletter,
    clearSelection,
    isSelected
  } = useNewsletterSelection();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCategoryChange = (updatedNewsletter: Newsletter, applySenderWide: boolean) => {
    // Find all newsletters with the same sender if applySenderWide is true
    if (applySenderWide) {
      const sender = updatedNewsletter.sender || updatedNewsletter.sender_email;
      const updatedNewsletters = newsletters.map(newsletter => {
        const newsletterSender = newsletter.sender || newsletter.sender_email;
        // Apply the same category to all newsletters with the same sender
        if (newsletterSender === sender) {
          return {
            ...newsletter,
            category_id: updatedNewsletter.category_id
          };
        }
        return newsletter;
      });
      
      onCategoryChange(updatedNewsletters, true);
    } else {
      // Update just this newsletter for backward compatibility
      const updatedNewsletters = newsletters.map(newsletter => 
        newsletter.id === updatedNewsletter.id ? updatedNewsletter : newsletter
      );
      
      onCategoryChange(updatedNewsletters, false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!onDeleteNewsletters || selection.selectedIds.length === 0) return;
    
    try {
      setIsDeleting(true);
      await onDeleteNewsletters(selection.selectedIds);
      toast.success(`Successfully deleted ${selection.selectedIds.length} newsletter(s)`);
      clearSelection();
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      toast.error("Failed to delete newsletters");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Group newsletters by sender for visual clarity
  const senderGroups = newsletters.reduce((groups, newsletter) => {
    const sender = newsletter.sender || newsletter.sender_email || "Unknown";
    if (!groups[sender]) {
      groups[sender] = [];
    }
    groups[sender].push(newsletter);
    return groups;
  }, {} as Record<string, Newsletter[]>);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        <NewsletterListActions 
          selectedCount={selection.selectedIds.length}
          onDelete={() => setDeleteDialogOpen(true)} 
          isDeleting={isDeleting}
        />
      </AnimatePresence>
      
      <NewsletterListTable 
        newsletters={newsletters}
        categories={categories}
        senderGroups={senderGroups}
        onCategoryChange={handleCategoryChange}
        isSelected={isSelected}
        onToggleSelectAll={() => toggleSelectAll(newsletters)}
        onToggleSelectNewsletter={toggleSelectNewsletter}
        allSelected={selection.allSelected}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteSelected}
        isDeleting={isDeleting}
        count={selection.selectedIds.length}
      />
    </div>
  );
}
