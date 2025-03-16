
import { TableCell } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface LastSyncCellProps {
  lastSyncDate: string | null;
}

const LastSyncCell = ({ lastSyncDate }: LastSyncCellProps) => {
  // Format the date for display
  const formattedDate = lastSyncDate 
    ? format(new Date(lastSyncDate), 'MMM d, yyyy')
    : 'Never';
    
  return (
    <TableCell className="py-2 text-gray-500">
      <div className="flex items-center text-xs">
        <Calendar className="h-3 w-3 mr-1" />
        {formattedDate}
      </div>
    </TableCell>
  );
};

export default LastSyncCell;
