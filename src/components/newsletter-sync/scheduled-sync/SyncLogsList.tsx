
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogsHeader, LogsContainer } from "./components";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { useLogsFetching } from "./hooks/useLogsFetching";

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
  // Use custom hooks for better organization
  const realtimeChannelRef = useRealtimeSync(selectedAccount, showLogs, setSyncLogs);
  const { isRefreshing, handleRefresh } = useLogsFetching(selectedAccount, showLogs, fetchSyncLogs);
  
  if (!selectedAccount) return null;
  
  return (
    <div className="mt-6">
      <LogsHeader 
        showLogs={showLogs} 
        setShowLogs={setShowLogs} 
        selectedAccount={selectedAccount}
        fetchSyncLogs={fetchSyncLogs}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      
      {showLogs && (
        <LogsContainer
          isLoading={isLoading}
          syncLogs={syncLogs}
          formatTimestamp={formatTimestamp}
        />
      )}
    </div>
  );
}
