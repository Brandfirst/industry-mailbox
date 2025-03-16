
import React from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { Button } from "@/components/ui/button";

export type LogsHeaderProps = {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAccount: string | null;
  fetchSyncLogs?: () => Promise<void>;
};

export function LogsHeader({ 
  showLogs, 
  setShowLogs, 
  selectedAccount,
  fetchSyncLogs
}: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center mt-6 mb-2">
      <div className="flex items-center space-x-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Sync History</h3>
      </div>
      
      {selectedAccount && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowLogs(!showLogs);
            if (!showLogs && fetchSyncLogs) {
              fetchSyncLogs();
            }
          }}
          className="text-xs p-1 h-auto"
          disabled={!selectedAccount}
        >
          {showLogs ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {showLogs ? "Hide Logs" : "Show Logs"}
        </Button>
      )}
    </div>
  );
}
