
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
import { SenderSortField } from "./components/SenderTableHeaders";

type SenderListProps = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading?: boolean;
  sortKey?: SenderSortField;
  sortAsc?: boolean;
  toggleSort?: (key: SenderSortField) => void;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
  onBrandChange?: (senderEmail: string, brandName: string) => Promise<void>;
  onDeleteSenders?: (senderEmails: string[]) => Promise<void>;
  updatingCategory?: string | null;
  updatingBrand?: string | null;
  deleting?: boolean;
  loadingAnalytics?: boolean;
};

const SenderList = ({
  senders,
  categories,
  loading = false,
  sortKey,
  sortAsc,
  toggleSort,
  onCategoryChange,
  onBrandChange,
  onDeleteSenders,
  updatingCategory: externalUpdatingCategory,
  updatingBrand: externalUpdatingBrand,
  deleting: externalDeleting,
  loadingAnalytics
}: SenderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [localCategoryUpdates, setLocalCategoryUpdates] = useState<Record<string, number | null>>({});
  
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
            isDeleting={effectiveDeleting}
          />
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <SenderTableHeaders 
            sortField={effectiveSortField}
            sortDirection={effectiveSortDirection}
            onSort={effectiveToggleSort}
            allSelected={selectedSenders.length === sortedSenders.length && sortedSenders.length > 0}
            onSelectAll={onDeleteSenders ? handleSelectAll : undefined}
          />
          <TableBody>
            {sortedSenders.length === 0 ? (
              <EmptyTableRow colSpan={onDeleteSenders ? 7 : 6} />
            ) : (
              sortedSenders.map((sender, index) => {
                const effectiveCategoryId = localCategoryUpdates[sender.sender_email] !== undefined 
                  ? localCategoryUpdates[sender.sender_email] 
                  : sender.category_id;
                
                return (
                  <SenderTableRow
                    key={sender.sender_email}
                    sender={{
                      ...sender,
                      category_id: effectiveCategoryId
                    }}
                    index={index}
                    categories={categories}
                    isSelected={selectedSenders.includes(sender.sender_email)}
                    updatingCategory={effectiveUpdatingCategory}
                    updatingBrand={effectiveUpdatingBrand}
                    brandInputValue={getBrandInputValue(sender)}
                    onCategoryChange={handleCategoryChange}
                    onBrandUpdate={handleBrandUpdate}
                    onToggleSelect={onDeleteSenders ? handleToggleSelect : undefined}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SenderList;
