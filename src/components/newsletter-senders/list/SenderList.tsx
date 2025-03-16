
import { Table, TableBody } from "@/components/ui/table";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import { useSenderListState } from "./hooks/useSenderListState";
import SenderListHeader from "./SenderListHeader";
import SenderTableHeaders from "./SenderTableHeaders";
import SenderTableRows from "./SenderTableRows";
import SenderActions from "./SenderActions";
import { SenderSortField } from "../components/SenderTableHeaders";

export type SenderListProps = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading?: boolean;
  sortKey?: SenderSortField;
  sortAsc?: boolean;
  toggleSort?: (key: SenderSortField) => void;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
  onBrandChange?: (senderEmail: string, brandName: string) => Promise<void>;
  onDeleteSenders?: (senderEmails: string[]) => Promise<void>;
  onDelete?: (senderEmails: string[]) => Promise<void>; // For backward compatibility
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
  onDelete, // For backward compatibility
  updatingCategory: externalUpdatingCategory,
  updatingBrand: externalUpdatingBrand,
  deleting: externalDeleting,
  loadingAnalytics
}: SenderListProps) => {
  const {
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
  } = useSenderListState({
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
  });

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
        
        {effectiveDeleteFunction && (
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
            onSelectAll={effectiveDeleteFunction ? handleSelectAll : undefined}
          />
          <TableBody>
            <SenderTableRows
              senders={sortedSenders}
              categories={categories}
              selectedSenders={selectedSenders}
              effectiveUpdatingCategory={effectiveUpdatingCategory}
              effectiveUpdatingBrand={effectiveUpdatingBrand}
              getBrandInputValue={getBrandInputValue}
              onCategoryChange={handleCategoryChange}
              onBrandUpdate={handleBrandUpdate}
              onToggleSelect={effectiveDeleteFunction ? handleToggleSelect : undefined}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SenderList;
