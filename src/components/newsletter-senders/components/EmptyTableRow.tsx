
import { TableRow, TableCell } from "@/components/ui/table";

type EmptyTableRowProps = {
  colSpan: number;
  message?: string;
};

const EmptyTableRow = ({ 
  colSpan, 
  message = "No senders found." 
}: EmptyTableRowProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {message}
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
