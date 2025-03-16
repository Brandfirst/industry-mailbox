
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
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

export const useSenderListState = ({
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
}: UseSenderListStateProps) => {
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
  
  // Use provided sort functionality, or local implementation
  const [localSortField, setLocalSortField] = useState<SenderSortField>('name');
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const effectiveSortField = sortKey || localSortField;
  const effectiveSortDirection = sortAsc !== undefined ? (sortAsc ? 'asc' : 'desc') : localSortDirection;
  
  const localToggleSort = (key: SenderSortField) => {
    if (key === localSortField) {
      setLocalSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setLocalSortField(key);
      setLocalSortDirection('asc');
    }
  };
  
  const effectiveToggleSort = toggleSort || localToggleSort;
  
  const { getBrandInputValue, updateBrandInputValue } = useBrandInputValues(senders);
  const { selectedSenders, handleToggleSelect, handleSelectAll, setSelectedSenders } = useSelectedSenders(senders);
  
  const sendersWithLocalUpdates = senders.map(sender => {
    if (localCategoryUpdates[sender.sender_email] !== undefined) {
      return {
        ...sender,
        category_id: localCategoryUpdates[sender.sender_email]
      };
    }
    return sender;
  });
  
  // Sort senders based on effective sort field and direction
  const sortedSenders = [...sendersWithLocalUpdates].sort((a, b) => {
    let result = 0;
    
    switch (effectiveSortField) {
      case 'name':
        const nameA = a.sender_name?.toLowerCase() || a.sender_email.toLowerCase();
        const nameB = b.sender_name?.toLowerCase() || b.sender_email.toLowerCase();
        result = nameA.localeCompare(nameB);
        break;
      case 'brand':
        const brandA = a.brand_name?.toLowerCase() || '';
        const brandB = b.brand_name?.toLowerCase() || '';
        result = brandA.localeCompare(brandB);
        break;
      case 'category':
        const catA = a.category_id || 0;
        const catB = b.category_id || 0;
        result = catA - catB;
        break;
      case 'newsletters':
        const countA = a.newsletter_count || 0;
        const countB = b.newsletter_count || 0;
        result = countA - countB;
        break;
      case 'lastSync':
        const dateA = a.last_sync_date ? new Date(a.last_sync_date).getTime() : 0;
        const dateB = b.last_sync_date ? new Date(b.last_sync_date).getTime() : 0;
        result = dateA - dateB;
        break;
    }
    
    return effectiveSortDirection === 'asc' ? result : -result;
  });

  const handleCategoryChange = async (senderEmail: string, categoryId: string) => {
    if (!onCategoryChange) return;
    
    setUpdatingCategory(senderEmail);
    try {
      const parsedCategoryId = categoryId === "null" ? null : parseInt(categoryId);
      
      setLocalCategoryUpdates(prev => ({
        ...prev,
        [senderEmail]: parsedCategoryId
      }));
      
      await onCategoryChange(senderEmail, parsedCategoryId);
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
};
