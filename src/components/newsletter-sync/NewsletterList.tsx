
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { CategorySelector } from "./CategorySelector";
import { NewsletterViewDialog } from "./NewsletterViewDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useState } from "react";
import { useNewsletterSelection } from "./useNewsletterSelection";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Get unique senders
  const uniqueSenders = Object.keys(senderGroups);

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
              <TableHead>Sender</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Category
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Categories are applied to all newsletters from the same sender</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueSenders.map((sender) => {
              // Get all newsletters for this sender
              const senderNewsletters = senderGroups[sender];
              
              // Check if all newsletters have the same category
              const categoryIds = new Set(senderNewsletters.map(n => n.category_id));
              const hasConsistentCategory = categoryIds.size === 1;
              
              // Take the first newsletter as representative for this sender group
              const representativeNewsletter = senderNewsletters[0];
              
              return senderNewsletters.map((newsletter, index) => {
                const isFirstInGroup = index === 0;
                const isRowSelected = isSelected(newsletter.id);
                
                return (
                  <TableRow 
                    key={newsletter.id}
                    isSelected={isRowSelected}
                    className={`${isRowSelected ? "bg-primary/10 transition-colors duration-200" : "transition-colors duration-200"} ${isFirstInGroup ? "border-t-2 border-t-muted" : ""}`}
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
                    <TableCell className={`font-medium ${isFirstInGroup ? "font-semibold" : ""}`}>
                      {isFirstInGroup && (
                        <div className="mb-1 text-sm px-2 py-1 rounded-md bg-muted/50 inline-block">
                          {sender}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
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
                      {newsletter.published_at
                        ? formatDistanceToNow(new Date(newsletter.published_at), { addSuffix: true })
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {isFirstInGroup ? (
                        <CategorySelector 
                          newsletter={representativeNewsletter}
                          categories={categories}
                          onCategoryChange={handleCategoryChange}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          ↑ Same as sender
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="transition-transform duration-200 hover:scale-105">
                        <NewsletterViewDialog newsletter={newsletter} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              });
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
