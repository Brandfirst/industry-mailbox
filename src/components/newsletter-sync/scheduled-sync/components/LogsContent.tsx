
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "../SyncLogItem";

type LogsContentProps = {
  syncLogs: SyncLogEntry[];
  formatTimestamp: (timestamp: string) => string;
};

export function LogsContent({ syncLogs, formatTimestamp }: LogsContentProps) {
  return (
    <div className="divide-y divide-border">
      {syncLogs.map((log) => (
        <SyncLogItem 
          key={log.id} 
          log={log} 
          formatTimestamp={formatTimestamp} 
        />
      ))}
    </div>
  );
}
