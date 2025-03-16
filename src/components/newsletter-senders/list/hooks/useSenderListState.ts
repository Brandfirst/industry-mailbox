
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { useSenderListSorting } from "../../hooks/useSenderListSorting";
import { useBrandInputValues } from "../../hooks/useBrandInputValues";
import { useSelectedSenders } from "../../hooks/useSelectedSenders"; 
import { SenderSortField } from "../../components/SenderTableHeaders";

interface UseSenderListStateProps {
  senders: NewsletterSenderStats[];
  sortKey?: SenderSortField;
  sortAsc?: boolean;
  toggleSort?: (key: SenderSortField) => void;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
  onBrandChange?: (senderEmail: string, brandName: string) => Promise<void>;
  onDeleteSenders?: (senderEmails: string[]) => Promise<void>;
  onDelete?: (senderEmails: string[]) => Promise<void>; // For backward compatibility
  externalUpdatingCategory?: string | null;
  externalUpdatingBrand?: string | null;
  externalDeleting?: boolean;
}

export function useSenderListState({
  senders,
  sortKey,
  sortAsc,
  toggleSort,
  onCategoryChange,
  onBrandChange,
  onDeleteSenders,
  onDelete,
  externalUpdatingCategory,
  externalUpdatingBrand,
  externalDeleting
}: UseSenderListStateProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [localCategoryUpdates, setLocalCategoryUpdates] = useState<Record<string, number | null>>({});
  
  // Use either onDeleteSenders or onDelete for backward compatibility
  const effectiveDeleteFunction = onDeleteSenders || onDelete;
  
  // Use external state if provided, otherwise use local state
  const effectiveUpdatingCategory = externalUpdatingCategory !== undefined ? externalUpdatingCategory : updatingCategory;
  const effectiveUpdatingBrand = externalUpdatingBrand !== undefined ? externalUpdatingBrand : updatingBrand;
  const effectiveDeleting = externalDeleting !== undefined ? externalDeleting : isDeleting;
  
  // Use provided sort functionality, or local implementation if not provided
  const localSorting = useSenderListSorting();
  const effectiveSortField = sortKey || localSorting.sortField;
  const effectiveSortDirection = sortAsc !== undefined ? (sortAsc ? 'asc' : 'desc') : localSorting.sortDirection;
  const effectiveToggleSort = toggleSort || localSorting.toggleSort;
  
  const { getBrandInputValue, updateBrandInputValue } = useBrandInputValues(senders);
  const { selectedSenders, handleToggleSelect, handleSelectAll, setSelectedSenders } = useSelectedSenders(senders);

  const filteredSenders = senders
    .filter(sender => {
      const senderName = sender.sender_name?.toLowerCase() || "";
      const senderEmail = sender.sender_email?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      return senderName.includes(term) || senderEmail.includes(term);
    });
  
  const sendersWithLocalUpdates = filteredSenders.map(sender => {
    if (localCategoryUpdates[sender.sender_email] !== undefined) {
      return {
        ...sender,
        category_id: localCategoryUpdates[sender.sender_email]
      };
    }
    return sender;
  });
  
  // Sort senders based on effective sort field and direction
  const sortedSenders = localSorting.sortSenders(sendersWithLocalUpdates);

  const handleCategoryChange = async (senderEmail: string, categoryId: string) => {
    if (!onCategoryChange) return;
    
    setUpdatingCategory(senderEmail);
    try {
      const parsedCategoryId = categoryId === "null" ? null : parseInt(categoryId);
      
      setLocalCategoryUpdates(prev => ({
        ...prev,
        [senderEmail]: parsedCategoryId
      }));
      
      console.log(`Updating category for ${senderEmail} to ${parsedCategoryId}`);
      
      await onCategoryChange(senderEmail, parsedCategoryId);
      
      console.log(`Category update completed for ${senderEmail}`);
    } catch (error) {
      console.error("Error updating category:", error);
      
      setLocalCategoryUpdates(prev => {
        const updated = { ...prev };
        delete updated[senderEmail];
        return updated;
      });
    } finally {
      setUpdatingCategory(null);
    }
  };

  const handleBrandUpdate = async (senderEmail: string, brandName: string) => {
    if (!onBrandChange) return;
    
    setUpdatingBrand(senderEmail);
    try {
      await onBrandChange(senderEmail, brandName);
      updateBrandInputValue(senderEmail, brandName);
      
      console.log(`Brand update completed. Value now: ${brandName} for ${senderEmail}`);
    } catch (error) {
      console.error("Error updating brand:", error);
    } finally {
      setUpdatingBrand(null);
    }
  };

  const handleDeleteSenders = async (senderEmails: string[]) => {
    if (!effectiveDeleteFunction || senderEmails.length === 0) return;
    
    setIsDeleting(true);
    try {
      await effectiveDeleteFunction(senderEmails);
      setSelectedSenders([]);
    } catch (error) {
      console.error("Error deleting senders:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortedSenders,
    effectiveToggleSort,
    effectiveSortField,
    effectiveSortDirection,
    effectiveUpdatingCategory,
    effectiveUpdatingBrand,
    effectiveDeleting,
    selectedSenders,
    handleToggleSelect,
    handleSelectAll,
    handleCategoryChange,
    handleBrandUpdate,
    handleDeleteSenders,
    getBrandInputValue,
    effectiveDeleteFunction
  };
}
