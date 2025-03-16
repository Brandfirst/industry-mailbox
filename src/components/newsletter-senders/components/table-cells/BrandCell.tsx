
import { TableCell } from "@/components/ui/table";
import BrandInput from "../BrandInput";

interface BrandCellProps {
  senderEmail: string;
  brandInputValue: string;
  isUpdating: boolean;
  onBrandUpdate: (senderEmail: string, brandName: string) => Promise<void>;
}

const BrandCell = ({ 
  senderEmail, 
  brandInputValue, 
  isUpdating, 
  onBrandUpdate 
}: BrandCellProps) => {
  return (
    <TableCell className="py-2">
      <BrandInput
        senderEmail={senderEmail}
        initialValue={brandInputValue}
        isUpdating={isUpdating}
        onUpdate={onBrandUpdate}
      />
    </TableCell>
  );
};

export default BrandCell;
