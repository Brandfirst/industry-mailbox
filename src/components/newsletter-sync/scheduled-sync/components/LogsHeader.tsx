
import React from 'react';
import { ChevronDown, ChevronUp, History, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

export type LogsHeaderProps = {
  showLogs: boolean;
  onToggle: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
};

export function LogsHeader({ 
  showLogs, 
  onToggle, 
  isRefreshing,
  onRefresh
}: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center mt-6 mb-2">
      <div className="flex items-center space-x-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Sync History</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-xs p-1 h-auto"
        >
          {showLogs ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {showLogs ? "Hide Logs" : "Show Logs"}
        </Button>
        
        {showLogs && onRefresh && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs p-1 h-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>
    </div>
  );
}
