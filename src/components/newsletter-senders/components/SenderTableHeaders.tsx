
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

type SenderTableHeadersProps = {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

const SenderTableHeaders = ({ 
  sortField, 
  sortDirection, 
  onSort 
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
        <TableHead 
          className="w-[250px] cursor-pointer" 
          onClick={() => onSort('name')}
        >
          <div className="flex items-center">
            Sender <SortIcon field="name" />
          </div>
        </TableHead>
        <TableHead className="w-[200px]">
          <div className="flex items-center">
            Brand
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('count')}
        >
          <div className="flex items-center">
            Newsletters <SortIcon field="count" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('last_sync')}
        >
          <div className="flex items-center">
            Last Synchronized <SortIcon field="last_sync" />
          </div>
        </TableHead>
        <TableHead>Category</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SenderTableHeaders;
