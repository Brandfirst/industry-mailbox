
import { useState } from "react";
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { NewsletterListTable } from "./NewsletterListTable";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { NewsletterListActions } from "./NewsletterListActions";

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
  onDeleteNewsletters,
}: NewsletterListProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Group newsletters by sender for better display
  const senderGroups: Record<string, Newsletter[]> = {};
  newsletters.forEach(newsletter => {
    const senderKey = newsletter.sender_email || newsletter.sender || "Unknown";
    if (!senderGroups[senderKey]) {
      senderGroups[senderKey] = [];
    }
    senderGroups[senderKey].push(newsletter);
  });

  const handleCategoryChange = (newsletter: Newsletter, applySenderWide: boolean) => {
    // We only need to pass the one newsletter - the onCategoryChange function will handle
    // applying it to all newsletters from the same sender if applySenderWide is true
    onCategoryChange([newsletter], applySenderWide);
  };

  const handleDeleteConfirm = async () => {
    if (!onDeleteNewsletters) return;
    
    setIsDeleting(true);
    try {
      await onDeleteNewsletters(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting newsletters:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const toggleSelectNewsletter = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === newsletters.length) {
      // If all selected, deselect all
      setSelectedIds([]);
    } else {
      // Otherwise, select all
      setSelectedIds(newsletters.map(n => n.id));
    }
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const allSelected = newsletters.length > 0 && selectedIds.length === newsletters.length;

  return (
    <div className="space-y-4">
      {onDeleteNewsletters && (
        <NewsletterListActions
          selectedCount={selectedIds.length}
          onDelete={() => setShowDeleteDialog(true)}
          isDeleting={isDeleting}
        />
      )}
      
      <NewsletterListTable
        newsletters={newsletters}
        categories={categories}
        senderGroups={senderGroups}
        onCategoryChange={handleCategoryChange}
        isSelected={isSelected}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectNewsletter={toggleSelectNewsletter}
        allSelected={allSelected}
      />
      
      {onDeleteNewsletters && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          count={selectedIds.length}
        />
      )}
    </div>
  );
}
