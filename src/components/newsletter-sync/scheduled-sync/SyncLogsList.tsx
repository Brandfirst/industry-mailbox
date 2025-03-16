
import React from "react";
import { 
  LogsHeader, 
  LogsContainer, 
  LogsContent, 
  LogsTableHeader, 
  AccountNotice 
} from "./components";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { SyncLogItem } from "./SyncLogItem";
import { useLogsFetching } from "./hooks/useLogsFetching";
import { useRealtimeSync } from "./hooks/useRealtimeSync";

type SyncLogsListProps = {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  fetchSyncLogs: () => Promise<void>;
  formatTimestamp: (timestamp: string) => string;
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLogEntry[]>>;
};

export function SyncLogsList({ 
  showLogs, 
  setShowLogs, 
  isLoading, 
  syncLogs, 
  selectedAccount, 
  fetchSyncLogs, 
  formatTimestamp,
  setSyncLogs
}: SyncLogsListProps) {
  
  // Set up logs fetching
  const { isRefreshing, handleRefresh } = useLogsFetching(
    selectedAccount,
    showLogs,
    fetchSyncLogs
  );
  
  // Set up real-time subscription for sync logs
  const channelRef = useRealtimeSync(
    selectedAccount,
    showLogs,
    setSyncLogs
  );
  
  // For enhanced debug logging
  React.useEffect(() => {
    if (syncLogs.length > 0) {
      console.log("Logs with account info:", syncLogs);
    }
  }, [syncLogs]);
  
  const handleToggleLogs = () => {
    if (!showLogs && !isLoading) {
      // Fetch logs when showing them
      fetchSyncLogs();
    }
    setShowLogs(!showLogs);
  };
  
  return (
    <div className="mt-6">
      <LogsHeader 
        showLogs={showLogs} 
        onToggle={handleToggleLogs} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
      />
      
      {showLogs && (
        <LogsContainer 
          isLoading={isLoading} 
          syncLogs={syncLogs} 
          formatTimestamp={formatTimestamp}
        >
          {!selectedAccount ? (
            <AccountNotice selectedAccount={selectedAccount} />
          ) : isLoading ? (
            <div className="space-y-2 py-4 px-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : syncLogs.length === 0 ? (
            <LogsContent 
              syncLogs={syncLogs} 
              formatTimestamp={formatTimestamp}
            >
              <span>No sync logs found for this account</span>
            </LogsContent>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="min-w-[800px]">
                <LogsTableHeader />
                <div className="max-h-96 overflow-y-auto">
                  {syncLogs.map((log, index) => (
                    <SyncLogItem 
                      key={log.id} 
                      log={log} 
                      formatTimestamp={formatTimestamp}
                      itemNumber={index + 1}
                      totalItems={syncLogs.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </LogsContainer>
      )}
    </div>
  );
}
