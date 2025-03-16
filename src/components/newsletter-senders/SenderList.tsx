
import { useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import {
  SenderListHeader,
  SenderTableHeaders,
  SenderTableRow,
  filterAndSortSenders,
  getCategoryNameById,
  getCategoryColorById
} from './components';

type SenderListProps = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading?: boolean;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
  onBrandChange?: (senderEmail: string, brandName: string) => Promise<void>;
  onDeleteSenders?: (senderEmails: string[]) => Promise<void>;
};

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

const SenderList = ({ 
  senders, 
  categories, 
  loading = false, 
  onCategoryChange,
  onBrandChange,
  onDeleteSenders
}: SenderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort senders
  const filteredSenders = filterAndSortSenders(senders, searchTerm, sortField, sortDirection);

  // Handle category change
  const handleCategoryChange = async (senderEmail: string, categoryId: string) => {
    if (!onCategoryChange) return;
    
    setUpdatingCategory(senderEmail);
    try {
      // Convert empty string to null, otherwise parse as number
      const parsedCategoryId = categoryId === "null" ? null : parseInt(categoryId);
      await onCategoryChange(senderEmail, parsedCategoryId);
      toast.success(`Category updated for all newsletters from ${senderEmail}`);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setUpdatingCategory(null);
    }
  };

  // Handle brand update
  const handleBrandUpdate = async (senderEmail: string, brandName: string) => {
    if (!onBrandChange) return;
    
    setBrandInputValues(prev => ({
      ...prev,
      [senderEmail]: brandName
    }));
    
    setUpdatingBrand(senderEmail);
    try {
      await onBrandChange(senderEmail, brandName);
      toast.success(`Brand updated for ${senderEmail}`);
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand");
    } finally {
      setUpdatingBrand(null);
    }
  };

  // Initialize brand input value if not set
  const getBrandInputValue = (sender: NewsletterSenderStats) => {
    if (brandInputValues[sender.sender_email] !== undefined) {
      return brandInputValues[sender.sender_email];
    }
    return sender.brand_name || "";
  };

  // Get category name by ID wrapper
  const getCategoryNameByIdWrapper = (categoryId: number | null) => {
    return getCategoryNameById(categoryId, categories);
  };

  // Get category color by ID wrapper
  const getCategoryColorByIdWrapper = (categoryId: number | null) => {
    return getCategoryColorById(categoryId, categories);
  };

  // Selection handlers
  const handleToggleSelect = useCallback((senderEmail: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderEmail)
        ? prev.filter(email => email !== senderEmail)
        : [...prev, senderEmail]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedSenders.length === filteredSenders.length) {
      setSelectedSenders([]);
    } else {
      setSelectedSenders(filteredSenders.map(sender => sender.sender_email));
    }
  }, [filteredSenders, selectedSenders.length]);

  // Delete handlers
  const handleDeleteSenders = async () => {
    if (!onDeleteSenders || selectedSenders.length === 0) return;
    
    setIsDeleting(true);
    try {
      await onDeleteSenders(selectedSenders);
      toast.success(`Successfully deleted ${selectedSenders.length} sender(s)`);
      setSelectedSenders([]);
    } catch (error) {
      console.error("Error deleting senders:", error);
      toast.error("Failed to delete senders");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SenderListHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resultsCount={filteredSenders.length}
        />
        
        {selectedSenders.length > 0 && onDeleteSenders && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete {selectedSenders.length} selected
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <SenderTableHeaders 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            allSelected={selectedSenders.length === filteredSenders.length && filteredSenders.length > 0}
            onSelectAll={onDeleteSenders ? handleSelectAll : undefined}
          />
          <TableBody>
            {filteredSenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onDeleteSenders ? 7 : 6} className="h-24 text-center">
                  No senders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSenders.map((sender, index) => (
                <SenderTableRow
                  key={sender.sender_email}
                  sender={sender}
                  index={index}
                  categories={categories}
                  isSelected={selectedSenders.includes(sender.sender_email)}
                  updatingCategory={updatingCategory}
                  updatingBrand={updatingBrand}
                  brandInputValue={getBrandInputValue(sender)}
                  onCategoryChange={handleCategoryChange}
                  onBrandUpdate={handleBrandUpdate}
                  onToggleSelect={onDeleteSenders ? handleToggleSelect : undefined}
                  getCategoryNameById={getCategoryNameByIdWrapper}
                  getCategoryColorById={getCategoryColorByIdWrapper}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedSenders.length} sender(s) and all their newsletters.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSenders}
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
};

export default SenderList;
