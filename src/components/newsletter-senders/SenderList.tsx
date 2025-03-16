
import { useState } from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import {
  SenderListHeader,
  SenderTableHeaders,
  SenderTableRow,
  EmptyTableRow,
} from './components';

type SenderListProps = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading?: boolean;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
  onBrandChange?: (senderEmail: string, brandName: string) => Promise<void>;
  onDeleteSenders?: (senderEmails: string[]) => Promise<void>;
};

const SenderList = ({
  senders,
  categories,
  loading = false,
  onCategoryChange,
  onBrandChange,
  onDeleteSenders
}: SenderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});

  // Filter senders based on search term
  const filteredSenders = senders.filter(sender => {
    const senderName = sender.sender_name?.toLowerCase() || "";
    const senderEmail = sender.sender_email?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return senderName.includes(term) || senderEmail.includes(term);
  });

  // Handle category change
  const handleCategoryChange = async (senderEmail: string, categoryId: string) => {
    if (!onCategoryChange) return;
    
    setUpdatingCategory(senderEmail);
    try {
      // Convert empty string to null, otherwise parse as number
      const parsedCategoryId = categoryId === "null" ? null : parseInt(categoryId);
      await onCategoryChange(senderEmail, parsedCategoryId);
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setUpdatingCategory(null);
    }
  };

  // Handle brand update
  const handleBrandUpdate = async (senderEmail: string, brandName: string) => {
    if (!onBrandChange) return;
    
    setUpdatingBrand(senderEmail);
    try {
      await onBrandChange(senderEmail, brandName);
      // Update the brand input values state
      setBrandInputValues(prev => ({
        ...prev,
        [senderEmail]: brandName
      }));
    } catch (error) {
      console.error("Error updating brand:", error);
    } finally {
      setUpdatingBrand(null);
    }
  };

  // Get brand input value
  const getBrandInputValue = (sender: NewsletterSenderStats) => {
    if (brandInputValues[sender.sender_email] !== undefined) {
      return brandInputValues[sender.sender_email];
    }
    return sender.brand_name || "";
  };

  // Selection handlers
  const handleToggleSelect = (senderEmail: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderEmail)
        ? prev.filter(email => email !== senderEmail)
        : [...prev, senderEmail]
    );
  };

  const handleSelectAll = () => {
    if (selectedSenders.length === filteredSenders.length) {
      setSelectedSenders([]);
    } else {
      setSelectedSenders(filteredSenders.map(sender => sender.sender_email));
    }
  };

  // Delete handlers
  const handleDeleteSenders = async () => {
    if (!onDeleteSenders || selectedSenders.length === 0) return;
    
    setIsDeleting(true);
    try {
      await onDeleteSenders(selectedSenders);
      setSelectedSenders([]);
    } catch (error) {
      console.error("Error deleting senders:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Get category utility functions
  const getCategoryNameById = (categoryId: number | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getCategoryColorById = (categoryId: number | null) => {
    if (!categoryId) return "#666666";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : "#666666";
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
            sortField="name"
            sortDirection="asc"
            onSort={() => {}}
            allSelected={selectedSenders.length === filteredSenders.length && filteredSenders.length > 0}
            onSelectAll={onDeleteSenders ? handleSelectAll : undefined}
          />
          <TableBody>
            {filteredSenders.length === 0 ? (
              <EmptyTableRow colSpan={onDeleteSenders ? 7 : 6} />
            ) : (
              filteredSenders.map((sender, index) => (
                <SenderTableRow
                  key={sender.sender_email}
                  sender={sender}
                  index={index}
                  categories={categories}
                  isSelected={selectedSenders.includes(sender.sender_email)}
                  updatingCategory={updatingCategory}
                  updatingBrand={updatingBrand === sender.sender_email ? sender.sender_email : null}
                  brandInputValue={getBrandInputValue(sender)}
                  onCategoryChange={handleCategoryChange}
                  onBrandUpdate={handleBrandUpdate}
                  onToggleSelect={onDeleteSenders ? handleToggleSelect : undefined}
                  getCategoryNameById={getCategoryNameById}
                  getCategoryColorById={getCategoryColorById}
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
