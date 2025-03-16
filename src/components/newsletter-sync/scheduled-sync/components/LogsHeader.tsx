
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RowCountSelect } from "./RowCountSelect";
import { MessageCountFilter } from "./MessageCountFilter";

interface LogsHeaderProps {
  showLogs: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  rowCount?: number;
  onRowCountChange?: (value: number) => void;
  minMessageCount?: number;
  onMinMessageCountChange?: (value: number) => void;
}

export function LogsHeader({ 
  showLogs, 
  onToggle, 
  onRefresh, 
  isRefreshing,
  rowCount = 10,
  onRowCountChange,
  minMessageCount = 0,
  onMinMessageCountChange
}: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
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
        
        {showLogs && onMinMessageCountChange && (
          <MessageCountFilter
            value={minMessageCount || 0}
            onChange={onMinMessageCountChange}
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
