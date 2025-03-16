
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

export interface LogsHeaderProps {
  showLogs: boolean;
  onToggle: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export function LogsHeader({ 
  showLogs, 
  onToggle, 
  onRefresh, 
  isRefreshing 
}: LogsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <h3 className="text-sm font-medium">Sync History</h3>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-7 w-7 ml-1"
          onClick={onToggle}
        >
          {showLogs ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showLogs && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw 
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          <span className="sr-only">Refresh</span>
        </Button>
      )}
    </div>
  );
}
