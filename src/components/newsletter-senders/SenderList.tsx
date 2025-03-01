
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
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
};

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

const SenderList = ({ 
  senders, 
  categories, 
  loading = false, 
  onCategoryChange,
  onBrandChange
}: SenderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const [updatingBrand, setUpdatingBrand] = useState<string | null>(null);
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SenderListHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredSenders.length}
      />

      <div className="rounded-md border">
        <Table>
          <SenderTableHeaders 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {filteredSenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No senders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSenders.map((sender) => (
                <SenderTableRow
                  key={sender.sender_email}
                  sender={sender}
                  categories={categories}
                  updatingCategory={updatingCategory}
                  updatingBrand={updatingBrand}
                  brandInputValue={getBrandInputValue(sender)}
                  onCategoryChange={handleCategoryChange}
                  onBrandUpdate={handleBrandUpdate}
                  getCategoryNameById={getCategoryNameByIdWrapper}
                  getCategoryColorById={getCategoryColorByIdWrapper}
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
