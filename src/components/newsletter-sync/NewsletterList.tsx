
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { CategorySelector } from "./CategorySelector";
import { NewsletterViewDialog } from "./NewsletterViewDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useState } from "react";
import { useNewsletterSelection } from "./useNewsletterSelection";
import { motion, AnimatePresence } from "framer-motion";

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
  const {
    selection,
    toggleSelectAll,
    toggleSelectNewsletter,
    clearSelection,
    isSelected
  } = useNewsletterSelection();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      clearSelection();
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
      <AnimatePresence>
        {selection.selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center py-2"
          >
            <span className="text-sm font-medium text-primary">
              {selection.selectedIds.length} newsletter{selection.selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selection.allSelected} 
                  onCheckedChange={() => toggleSelectAll(newsletters)}
                />
              </TableHead>
              <TableHead className="w-[60px] text-center">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsletters.map((newsletter, index) => {
              const isRowSelected = isSelected(newsletter.id);
              
              return (
                <TableRow 
                  key={newsletter.id}
                  isSelected={isRowSelected}
                  className={isRowSelected ? "bg-primary/10 transition-colors duration-200" : "transition-colors duration-200"}
                >
                  <TableCell>
                    <Checkbox 
                      checked={isRowSelected}
                      onCheckedChange={() => toggleSelectNewsletter(newsletter.id)}
                      className="transition-transform duration-200 data-[state=checked]:animate-scale-in"
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {isRowSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block mr-2 text-xs px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground font-medium"
                      >
                        Selected
                      </motion.span>
                    )}
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
                    <div className="transition-transform duration-200 hover:scale-105">
                      <NewsletterViewDialog newsletter={newsletter} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
