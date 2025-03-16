
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RowCountSelect } from "./RowCountSelect";
import { MessageCountFilter } from "./MessageCountFilter";

interface LogsHeaderProps {
  title?: string;
  onToggle: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  rowCount?: string;
  onRowCountChange?: (value: string) => void;
  messageCountFilter?: string;
  onMessageCountFilterChange?: (value: string) => void;
  showLogs?: boolean;
}

export function LogsHeader({ 
  title = "Sync History",
  onToggle, 
  onRefresh, 
  isRefreshing = false,
  rowCount = "10",
  onRowCountChange,
  messageCountFilter = "1",
  onMessageCountFilterChange,
  showLogs = true
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
              Hide {title}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show {title}
            </>
          )}
        </Button>
        
        {showLogs && onRowCountChange && (
          <RowCountSelect 
            value={rowCount} 
            onChange={onRowCountChange} 
          />
        )}
        
        {showLogs && onMessageCountFilterChange && (
          <MessageCountFilter
            value={messageCountFilter}
            onChange={onMessageCountFilterChange}
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
