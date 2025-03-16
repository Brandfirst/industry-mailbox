
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogsHeader, LogsTableHeader, LogsContent } from "./components";

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
      <LogsHeader
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        selectedAccount={selectedAccount}
        fetchSyncLogs={fetchSyncLogs}
      />
      
      {showLogs && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <LogsTableHeader />
          <div className="divide-y">
            <LogsContent
              isLoading={isLoading}
              syncLogs={syncLogs}
              selectedAccount={selectedAccount}
              formatTimestamp={formatTimestamp}
            />
          </div>
        </div>
      )}
    </div>
  );
}
