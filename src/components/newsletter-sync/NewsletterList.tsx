
import { useState } from "react";
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { NewsletterSelectionState } from "@/components/email-connection/types";
import { CategorySelector } from "./CategorySelector";
import { NewsletterViewDialog } from "./NewsletterViewDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

type NewsletterListProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  onCategoryChange: (newsletters: Newsletter[]) => void;
  onDeleteNewsletters?: (ids: number[]) => Promise<void>;
};

export function NewsletterList({ 
  newsletters, 
  categories, 
  onCategoryChange,
  onDeleteNewsletters 
}: NewsletterListProps) {
  const [selection, setSelection] = useState<NewsletterSelectionState>({
    selectedIds: [],
    allSelected: false
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selection.allSelected) {
      // Deselect all
      setSelection({ selectedIds: [], allSelected: false });
    } else {
      // Select all
      const allIds = newsletters.map(newsletter => newsletter.id);
      setSelection({ selectedIds: allIds, allSelected: true });
    }
  };

  const toggleSelectNewsletter = (id: number) => {
    const isSelected = selection.selectedIds.includes(id);
    let newSelectedIds: number[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedIds = selection.selectedIds.filter(selectedId => selectedId !== id);
    } else {
      // Add to selection
      newSelectedIds = [...selection.selectedIds, id];
    }
    
    // Check if all are now selected
    const allSelected = newSelectedIds.length === newsletters.length;
    
    setSelection({ 
      selectedIds: newSelectedIds, 
      allSelected
    });
  };

  const handleCategoryChange = (updatedNewsletter: Newsletter) => {
    // Update the local state to reflect the change
    const updatedNewsletters = newsletters.map(newsletter => 
      newsletter.id === updatedNewsletter.id ? updatedNewsletter : newsletter
    );
    
    onCategoryChange(updatedNewsletters);
  };

  const handleDeleteSelected = async () => {
    if (!onDeleteNewsletters || selection.selectedIds.length === 0) return;
    
    try {
      setIsDeleting(true);
      await onDeleteNewsletters(selection.selectedIds);
      toast.success(`Successfully deleted ${selection.selectedIds.length} newsletter(s)`);
      setSelection({ selectedIds: [], allSelected: false });
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      toast.error("Failed to delete newsletters");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {selection.selectedIds.length > 0 && (
        <div className="flex justify-between items-center py-2">
          <span className="text-sm">{selection.selectedIds.length} item(s) selected</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selection.allSelected} 
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsletters.map((newsletter) => (
              <TableRow key={newsletter.id}>
                <TableCell>
                  <Checkbox 
                    checked={selection.selectedIds.includes(newsletter.id)}
                    onCheckedChange={() => toggleSelectNewsletter(newsletter.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {newsletter.title || "Untitled"}
                </TableCell>
                <TableCell>
                  {newsletter.sender || newsletter.sender_email || "Unknown"}
                </TableCell>
                <TableCell>
                  {newsletter.published_at
                    ? formatDistanceToNow(new Date(newsletter.published_at), { addSuffix: true })
                    : "Unknown"}
                </TableCell>
                <TableCell>
                  <CategorySelector 
                    newsletter={newsletter}
                    categories={categories}
                    onCategoryChange={handleCategoryChange}
                  />
                </TableCell>
                <TableCell>
                  <NewsletterViewDialog newsletter={newsletter} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
