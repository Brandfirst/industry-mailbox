
import React, { useState } from "react";
import { LogsHeader } from "./components/LogsHeader";
import { LogsContainer } from "./components/LogsContainer";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { useLogsFetching } from "./hooks/useLogsFetching";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { usePaginatedLogs } from "./hooks/usePaginatedLogs";
import { LogsStateDisplay } from "./components/LogsStateDisplay";
import { LogEntriesDisplay } from "./components/LogEntriesDisplay";
import { LogsPagination } from "./components/LogsPagination";

interface SyncLogsListProps {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  fetchSyncLogs: () => void;
  formatTimestamp: (timestamp: string) => string;
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLogEntry[]>>;
}

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
  const [rowCount, setRowCount] = useState<string>("10");
  const [messageCountFilter, setMessageCountFilter] = useState<string>("1"); // Set default to "1" (≥ 1)
  
  // Use our custom hooks for log fetching and refreshing
  const { isRefreshing, handleRefresh } = useLogsFetching(
    selectedAccount, 
    showLogs, 
    fetchSyncLogs
  );
  
  // Use realtime sync for live updates
  useRealtimeSync(selectedAccount, showLogs, setSyncLogs);

  // Use our pagination hook
  const {
    filteredLogs,
    paginatedLogs,
    currentPage,
    setCurrentPage,
    totalPages,
    getPageRange,
    totalEntriesText,
    startIndex
  } = usePaginatedLogs({
    syncLogs,
    rowCount,
    messageCountFilter
  });
  
  if (!showLogs) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <LogsHeader 
          title="Sync History" 
          onToggle={() => setShowLogs(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          showLogs={false}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <LogsHeader 
        title="Sync History" 
        onToggle={() => setShowLogs(false)}
        rowCount={rowCount}
        onRowCountChange={setRowCount}
        messageCountFilter={messageCountFilter}
        onMessageCountFilterChange={setMessageCountFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <LogsContainer>
        <LogsStateDisplay 
          selectedAccount={selectedAccount}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          hasLogs={syncLogs.length > 0}
          hasFilteredLogs={filteredLogs.length > 0}
        />
        
        {filteredLogs.length > 0 && (
          <>
            <LogEntriesDisplay 
              paginatedLogs={paginatedLogs}
              syncLogs={syncLogs}
              startIndex={startIndex}
              totalEntriesText={totalEntriesText}
              formatTimestamp={formatTimestamp}
            />
            
            <LogsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              pageRange={getPageRange()}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </LogsContainer>
    </div>
  );
}
