
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "../SyncLogItem";

type LogsContentProps = {
  syncLogs: SyncLogEntry[];
  formatTimestamp: (timestamp: string) => string;
};

export function LogsContent({ syncLogs, formatTimestamp }: LogsContentProps) {
  // Calculate the total number of logs to use for reverse numbering
  const totalLogs = syncLogs.length;
  
  return (
    <div className="divide-y divide-border">
      {syncLogs.map((log, index) => (
        <SyncLogItem 
          key={log.id} 
          log={log} 
          formatTimestamp={formatTimestamp}
          itemNumber={totalLogs - index} // Reverse the numbering order
        />
      ))}
    </div>
  );
}
