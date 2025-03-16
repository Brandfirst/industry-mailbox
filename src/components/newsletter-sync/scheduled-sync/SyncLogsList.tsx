
import React, { useState, useEffect } from "react";
import { SyncLogItem } from "./SyncLogItem";
import { LogsHeader } from "./components/LogsHeader";
import { LogsContainer } from "./components/LogsContainer";
import { LogsContent } from "./components/LogsContent";
import { LogsTableHeader } from "./components/LogsTableHeader";
import { AccountNotice } from "./components/AccountNotice";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

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
  const [filteredLogs, setFilteredLogs] = useState<SyncLogEntry[]>([]);
  const [messageCountFilter, setMessageCountFilter] = useState<string>("1"); // Set default to "1" (≥ 1)

  // Filter logs based on selected criteria
  useEffect(() => {
    if (!syncLogs) {
      setFilteredLogs([]);
      return;
    }

    let filtered = [...syncLogs];
    
    // Apply message count filter if not "all"
    if (messageCountFilter !== "all") {
      const minCount = parseInt(messageCountFilter, 10);
      filtered = filtered.filter(log => {
        // Include logs with message_count >= minCount
        return log.message_count && log.message_count >= minCount;
      });
    }
    
    // Limit to the selected row count
    const limit = parseInt(rowCount, 10);
    filtered = filtered.slice(0, limit);
    
    setFilteredLogs(filtered);
  }, [syncLogs, rowCount, messageCountFilter]);

  // Handle refresh button click
  const handleRefresh = () => {
    if (selectedAccount) {
      fetchSyncLogs();
    }
  };
  
  if (!showLogs) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowLogs(true)}
        >
          Show Sync History
        </Button>
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
      />
      
      <LogsContainer>
        {!selectedAccount ? (
          <AccountNotice />
        ) : isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {syncLogs.length > 0 
              ? "No sync logs match your current filters"
              : "No sync history available yet"}
          </div>
        ) : (
          <LogsContent>
            <LogsTableHeader />
            {filteredLogs.map((log, index) => (
              <SyncLogItem 
                key={log.id} 
                log={log} 
                formatTimestamp={formatTimestamp}
                itemNumber={index + 1}
                totalItems={filteredLogs.length}
              />
            ))}
          </LogsContent>
        )}
      </LogsContainer>
    </div>
  );
}
