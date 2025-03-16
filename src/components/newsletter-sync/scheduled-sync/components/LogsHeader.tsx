
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RowCountSelect } from "./RowCountSelect";

interface LogsHeaderProps {
  showLogs: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  rowCount?: number;
  onRowCountChange?: (value: number) => void;
}

export function LogsHeader({ 
  showLogs, 
  onToggle, 
  onRefresh, 
  isRefreshing,
  rowCount = 10,
  onRowCountChange
}: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="text-xs h-8"
        >
          {showLogs ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Sync History
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Sync History
            </>
          )}
        </Button>
        
        {showLogs && onRowCountChange && (
          <RowCountSelect 
            value={rowCount} 
            onChange={onRowCountChange} 
          />
        )}
      </div>
      
      {showLogs && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-xs h-8"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      )}
    </div>
  );
}
