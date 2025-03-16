
import { TableCell } from "@/components/ui/table";
import CategorySelector from "../CategorySelector";
import { NewsletterCategory } from "@/lib/supabase/types";

interface CategoryCellProps {
  senderEmail: string;
  categoryId: number | null;
  categories: NewsletterCategory[];
  isUpdating: boolean;
  onCategoryChange: (senderEmail: string, categoryId: string) => Promise<void>;
}

const CategoryCell = ({ 
  senderEmail, 
  categoryId, 
  categories, 
  isUpdating, 
  onCategoryChange 
}: CategoryCellProps) => {
  return (
    <TableCell className="py-2">
      <CategorySelector
        senderEmail={senderEmail}
        categories={categories}
        currentCategoryId={categoryId}
        isUpdating={isUpdating}
        onChange={onCategoryChange}
      />
    </TableCell>
  );
};

export default CategoryCell;
