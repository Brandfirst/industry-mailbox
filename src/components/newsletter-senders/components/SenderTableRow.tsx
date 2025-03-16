
import { TableRow } from "@/components/ui/table";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { NewsletterCategory } from "@/lib/supabase/types";
import {
  SenderInfoCell,
  BrandCell,
  CategoryCell,
  NewsletterCountCell,
  LastSyncCell,
  SelectCell
} from "./table-cells";

interface SenderTableRowProps {
  sender: NewsletterSenderStats;
  index: number;
  categories: NewsletterCategory[];
  isSelected?: boolean;
  updatingCategory: string | null;
  updatingBrand: string | null;
  brandInputValue: string;
  onCategoryChange: (senderEmail: string, categoryId: string) => Promise<void>;
  onBrandUpdate: (senderEmail: string, brandName: string) => Promise<void>;
  onToggleSelect?: (senderEmail: string) => void;
}

const SenderTableRow = ({
  sender,
  index,
  categories,
  isSelected = false,
  updatingCategory,
  updatingBrand,
  brandInputValue,
  onCategoryChange,
  onBrandUpdate,
  onToggleSelect
}: SenderTableRowProps) => {
  const isUpdatingCategory = updatingCategory === sender.sender_email;
  const isUpdatingBrand = updatingBrand === sender.sender_email;
  
  return (
    <TableRow className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      {onToggleSelect && (
        <SelectCell 
          isSelected={isSelected}
          senderEmail={sender.sender_email}
          onToggleSelect={onToggleSelect}
        />
      )}
      
      <SenderInfoCell sender={sender} />
      
      <BrandCell
        senderEmail={sender.sender_email}
        brandInputValue={brandInputValue}
        isUpdating={isUpdatingBrand}
        onBrandUpdate={onBrandUpdate}
      />
      
      <CategoryCell
        senderEmail={sender.sender_email}
        categoryId={sender.category_id}
        categories={categories}
        isUpdating={isUpdatingCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <NewsletterCountCell count={sender.newsletter_count || 0} />
      
      <LastSyncCell lastSyncDate={sender.last_sync_date} />
    </TableRow>
  );
};

export default SenderTableRow;
