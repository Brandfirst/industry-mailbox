
import { useState } from "react";
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { NewsletterListTable } from "./NewsletterListTable";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { NewsletterListActions } from "./NewsletterListActions";

type NewsletterListProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  selectedIds?: number[];
  isDeleting?: boolean;
  onDeleteNewsletters?: () => Promise<void>;
  onSelectNewsletter?: (id: number) => void;
  onSelectAll?: (newsletters: Newsletter[]) => void;
  allSelected?: boolean;
};

export function NewsletterList({
  newsletters,
  categories,
  selectedIds = [],
  isDeleting = false,
  onDeleteNewsletters,
  onSelectNewsletter,
  onSelectAll,
  allSelected = false,
}: NewsletterListProps) {
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

  const handleDeleteConfirm = async () => {
    if (!onDeleteNewsletters) return;
    
    try {
      await onDeleteNewsletters();
    } catch (error) {
      console.error("Error deleting newsletters:", error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const handleToggleSelectAll = (newsletters: Newsletter[]) => {
    if (onSelectAll) {
      onSelectAll(newsletters);
    }
  };

  const handleToggleSelectNewsletter = (id: number) => {
    if (onSelectNewsletter) {
      onSelectNewsletter(id);
    }
  };

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
        isSelected={isSelected}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectNewsletter={handleToggleSelectNewsletter}
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
