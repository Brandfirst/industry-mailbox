
import { formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import BrandInput from "./BrandInput";
import CategorySelector from "./CategorySelector";

type SenderTableRowProps = {
  sender: NewsletterSenderStats;
  categories: NewsletterCategory[];
  updatingCategory: string | null;
  updatingBrand: string | null;
  brandInputValue: string;
  index: number;
  isSelected?: boolean;
  onCategoryChange?: (senderEmail: string, categoryId: string) => Promise<void>;
  onBrandUpdate: (senderEmail: string, brandName: string) => Promise<void>;
  onToggleSelect?: (senderEmail: string) => void;
  getCategoryNameById: (categoryId: number | null) => string;
  getCategoryColorById: (categoryId: number | null) => string;
};

const SenderTableRow = ({
  sender,
  categories,
  updatingCategory,
  updatingBrand,
  brandInputValue,
  index,
  isSelected = false,
  onCategoryChange,
  onBrandUpdate,
  onToggleSelect,
  getCategoryNameById,
  getCategoryColorById
}: SenderTableRowProps) => {
  // Format the last sync date
  const formatLastSync = (date: string | null) => {
    if (!date) return "Never";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <TableRow>
      {onToggleSelect && (
        <TableCell>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(sender.sender_email)}
            aria-label={`Select ${sender.sender_name}`}
          />
        </TableCell>
      )}
      <TableCell className="text-center font-medium text-muted-foreground">
        {index + 1}
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <div>{sender.sender_name}</div>
          <div className="text-sm text-muted-foreground">{sender.sender_email}</div>
        </div>
      </TableCell>
      <TableCell>
        <BrandInput
          senderEmail={sender.sender_email}
          initialValue={brandInputValue}
          isUpdating={updatingBrand === sender.sender_email}
          onUpdate={onBrandUpdate}
        />
      </TableCell>
      <TableCell>
        <Badge variant="outline">{sender.newsletter_count}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {formatLastSync(sender.last_sync_date)}
        </div>
      </TableCell>
      <TableCell>
        {onCategoryChange ? (
          <CategorySelector
            senderEmail={sender.sender_email}
            categoryId={sender.category_id}
            categories={categories}
            isUpdating={updatingCategory === sender.sender_email}
            onCategoryChange={onCategoryChange}
            getCategoryNameById={getCategoryNameById}
            getCategoryColorById={getCategoryColorById}
          />
        ) : (
          <div className="flex items-center">
            <span>{getCategoryNameById(sender.category_id)}</span>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default SenderTableRow;
