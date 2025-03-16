
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "./SyncLogItem";
import { LogsHeader, LogsContent, LogsTableHeader } from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";

type SyncLogsListProps = {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
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
  // Force fetch logs when component mounts if logs should be shown
  useEffect(() => {
    if (selectedAccount && showLogs) {
      fetchSyncLogs();
    }
  }, [selectedAccount, showLogs, fetchSyncLogs]);
  
  if (!selectedAccount) return null;
  
  return (
    <div className="mt-6">
      <LogsHeader 
        showLogs={showLogs} 
        setShowLogs={setShowLogs} 
        selectedAccount={selectedAccount}
        fetchSyncLogs={fetchSyncLogs}
      />
      
      {showLogs && (
        <div className="mt-2 border rounded-md">
          <div className="flex justify-between items-center p-2 bg-muted/40">
            <LogsTableHeader />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchSyncLogs}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : syncLogs.length > 0 ? (
            <LogsContent
              syncLogs={syncLogs}
              formatTimestamp={formatTimestamp}
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No sync logs found for this account.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
