
import React from "react";
import { Button } from "@/components/ui/button";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "./SyncLogItem";

type SyncLogsListProps = {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  fetchSyncLogs: () => Promise<void>;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogsList({
  showLogs,
  setShowLogs,
  isLoading,
  syncLogs,
  selectedAccount,
  fetchSyncLogs,
  formatTimestamp
}: SyncLogsListProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Sync History</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setShowLogs(!showLogs);
            if (!showLogs && selectedAccount) {
              fetchSyncLogs();
            }
          }}
          className="text-xs"
        >
          {showLogs ? "Hide logs" : "Show logs"}
        </Button>
      </div>
      
      {showLogs && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-2 text-xs font-medium grid grid-cols-4 gap-2">
            <div>Time</div>
            <div>Status</div>
            <div>Messages</div>
            <div>Details</div>
          </div>
          <div className="divide-y">
            {isLoading ? (
              <div className="px-4 py-4 text-xs text-center text-muted-foreground">
                Loading sync logs...
              </div>
            ) : syncLogs.length > 0 ? (
              syncLogs.map((log, index) => (
                <SyncLogItem 
                  key={index} 
                  log={log} 
                  formatTimestamp={formatTimestamp} 
                />
              ))
            ) : (
              <div className="px-4 py-4 text-xs text-center text-muted-foreground">
                {selectedAccount ? "No sync logs available" : "Select an account to view sync logs"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
