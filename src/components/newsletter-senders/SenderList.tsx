
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import {
  SenderListHeader,
  SenderTableHeaders,
  SenderTableRow,
  EmptyTableRow,
  SenderActions
} from './components';
import { useSenderListSorting } from "./hooks";
import { useBrandInputValues } from "./hooks/useBrandInputValues";
import { useSelectedSenders } from "./hooks/useSelectedSenders";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  
  // Use our custom hooks
  const { sortField, sortDirection, toggleSort, sortSenders } = useSenderListSorting();
  const { brandInputValues, getBrandInputValue, setBrandInputValues } = useBrandInputValues(senders);
  const { selectedSenders, handleToggleSelect, handleSelectAll, setSelectedSenders } = useSelectedSenders(senders);

  // Filter senders based on search term
  const filteredSenders = senders
    .filter(sender => {
      const senderName = sender.sender_name?.toLowerCase() || "";
      const senderEmail = sender.sender_email?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      return senderName.includes(term) || senderEmail.includes(term);
    });
  
  // Apply sorting to filtered senders
  const sortedSenders = sortSenders(filteredSenders);

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

  // Handle delete senders with loading state
  const handleDeleteSenders = async (senderEmails: string[]) => {
    if (!onDeleteSenders || senderEmails.length === 0) return;
    
    setIsDeleting(true);
    try {
      await onDeleteSenders(senderEmails);
      setSelectedSenders([]);
    } catch (error) {
      console.error("Error deleting senders:", error);
    } finally {
      setIsDeleting(false);
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
          resultsCount={sortedSenders.length}
        />
        
        {onDeleteSenders && (
          <SenderActions 
            selectedSenders={selectedSenders}
            onDeleteSenders={handleDeleteSenders}
            isDeleting={isDeleting}
          />
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <SenderTableHeaders 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
            allSelected={selectedSenders.length === sortedSenders.length && sortedSenders.length > 0}
            onSelectAll={onDeleteSenders ? handleSelectAll : undefined}
          />
          <TableBody>
            {sortedSenders.length === 0 ? (
              <EmptyTableRow colSpan={onDeleteSenders ? 7 : 6} />
            ) : (
              sortedSenders.map((sender, index) => (
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
                  getCategoryNameById={getCategoryNameById}
                  getCategoryColorById={getCategoryColorById}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SenderList;
