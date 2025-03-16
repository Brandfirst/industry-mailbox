
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SenderSortField = "name" | "brand" | "category" | "newsletters" | "lastSync";

interface SenderTableHeadersProps {
  sortField: SenderSortField | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SenderSortField) => void;
  allSelected: boolean;
  onSelectAll?: () => void;
}

const SenderTableHeaders = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  allSelected, 
  onSelectAll 
}: SenderTableHeadersProps) => {
  // Helper for sort indicator
  const SortIndicator = ({ field }: { field: SenderSortField }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
      : <ArrowDownIcon className="ml-1 h-4 w-4" />;
  };
  
  // Create sortable column headers
  const SortableHeader = ({ field, label }: { field: SenderSortField, label: string }) => (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center p-0 font-medium"
      onClick={() => onSort(field)}
    >
      {label}
      <SortIndicator field={field} />
    </Button>
  );
  
  return (
    <TableHeader>
      <TableRow className="border-b">
        {onSelectAll && (
          <TableHead className="w-[40px] p-2 pl-4">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
        )}
        
        <TableHead className="w-[250px]">
          <SortableHeader field="name" label="Sender" />
        </TableHead>
        
        <TableHead>
          <SortableHeader field="brand" label="Brand" />
        </TableHead>
        
        <TableHead>
          <SortableHeader field="category" label="Category" />
        </TableHead>
        
        <TableHead className="w-[120px]">
          <SortableHeader field="newsletters" label="Newsletters" />
        </TableHead>
        
        <TableHead className="w-[140px]">
          <SortableHeader field="lastSync" label="Last Sync" />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SenderTableHeaders;
