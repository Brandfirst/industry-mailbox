
import { useState } from "react";
import { Newsletter, NewsletterCategory, updateNewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { NewsletterSelectionState } from "@/components/email-connection/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [selection, setSelection] = useState<NewsletterSelectionState>({
    selectedIds: [],
    allSelected: false
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCategoryChange = async (newsletterId: number, categoryId: string) => {
    try {
      // Convert categoryId to number or null if empty string
      const numericCategoryId = categoryId ? parseInt(categoryId) : null;
      
      await updateNewsletterCategory(newsletterId, numericCategoryId);
      toast.success("Category updated successfully");
      
      // Update the local state to reflect the change
      const updatedNewsletters = newsletters.map(newsletter => 
        newsletter.id === newsletterId 
          ? { ...newsletter, category_id: numericCategoryId } 
          : newsletter
      );
      
      onCategoryChange(updatedNewsletters);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

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
                  <Select
                    value={newsletter.category_id?.toString() || "uncategorized"}
                    onValueChange={(value) => handleCategoryChange(newsletter.id, value)}
                  >
                    <SelectTrigger className="w-full max-w-[180px]">
                      <SelectValue placeholder="Categorize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedNewsletter(newsletter)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>{newsletter.title || "Untitled Newsletter"}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 overflow-auto h-full pb-6">
                        {newsletter.content ? (
                          <iframe
                            srcDoc={newsletter.content}
                            title={newsletter.title || "Newsletter Content"}
                            className="w-full h-full border-0"
                            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                          />
                        ) : (
                          <div className="text-center py-12">
                            <p>No content available for this newsletter.</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation dialog for delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected {selection.selectedIds.length} newsletter(s).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSelected} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
