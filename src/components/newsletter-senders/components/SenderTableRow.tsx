
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail } from "lucide-react";
import { format } from "date-fns";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { NewsletterCategory } from "@/lib/supabase/types";
import BrandInput from "./BrandInput";
import CategorySelector from "./CategorySelector";
import { getCategoryNameById, getCategoryColorById } from "./utils/categoryUtils";

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
  
  // Format the date for display
  const formattedDate = sender.last_sync_date 
    ? format(new Date(sender.last_sync_date), 'MMM d, yyyy')
    : 'Never';
  
  return (
    <TableRow className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      {onToggleSelect && (
        <TableCell className="p-2 pl-4">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(sender.sender_email)}
            aria-label={`Select ${sender.sender_name || sender.sender_email}`}
          />
        </TableCell>
      )}
      
      <TableCell className="py-2 font-medium">
        <div className="flex items-center space-x-2">
          <div>
            <div className="text-sm font-medium">
              {sender.sender_name || sender.sender_email.split('@')[0]}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {sender.sender_email}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-2">
        <BrandInput
          senderEmail={sender.sender_email}
          initialValue={brandInputValue}
          isUpdating={isUpdatingBrand}
          onUpdate={onBrandUpdate}
        />
      </TableCell>
      
      <TableCell className="py-2">
        <CategorySelector
          senderEmail={sender.sender_email}
          categories={categories}
          currentCategoryId={sender.category_id}
          isUpdating={isUpdatingCategory}
          onChange={onCategoryChange}
        />
      </TableCell>
      
      <TableCell className="py-2">
        <Badge variant="outline" className="text-xs font-normal">
          {sender.newsletter_count || 0}
        </Badge>
      </TableCell>
      
      <TableCell className="py-2 text-gray-500">
        <div className="flex items-center text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SenderTableRow;
