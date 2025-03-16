
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectCellProps {
  isSelected: boolean;
  senderEmail: string;
  onToggleSelect: (senderEmail: string) => void;
}

const SelectCell = ({ isSelected, senderEmail, onToggleSelect }: SelectCellProps) => {
  return (
    <TableCell className="p-2 pl-4">
      <Checkbox 
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(senderEmail)}
        aria-label={`Select ${senderEmail}`}
      />
    </TableCell>
  );
};

export default SelectCell;
