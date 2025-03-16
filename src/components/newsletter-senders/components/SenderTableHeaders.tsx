
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

type SenderTableHeadersProps = {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  allSelected?: boolean;
  onSelectAll?: () => void;
};

const SenderTableHeaders = ({ 
  sortField, 
  sortDirection, 
  onSort,
  allSelected = false,
  onSelectAll
}: SenderTableHeadersProps) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <TableHeader>
      <TableRow>
        {onSelectAll && (
          <TableHead className="w-[40px]">
            <Checkbox 
              checked={allSelected} 
              onCheckedChange={onSelectAll}
              aria-label="Select all senders"
            />
          </TableHead>
        )}
        <TableHead className="w-[60px] text-center font-medium text-foreground">
          #
        </TableHead>
        <TableHead 
          className="w-[250px] cursor-pointer" 
          onClick={() => onSort('name')}
        >
          <div className="flex items-center font-medium text-foreground">
            Sender <SortIcon field="name" />
          </div>
        </TableHead>
        <TableHead className="w-[200px]">
          <div className="flex items-center font-medium text-foreground">
            Brand
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('count')}
        >
          <div className="flex items-center font-medium text-foreground">
            Newsletters <SortIcon field="count" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('last_sync')}
        >
          <div className="flex items-center font-medium text-foreground">
            Last Synchronized <SortIcon field="last_sync" />
          </div>
        </TableHead>
        <TableHead>
          <div className="font-medium text-foreground">
            Category
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SenderTableHeaders;
