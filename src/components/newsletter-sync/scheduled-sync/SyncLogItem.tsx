
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogItemRow } from "./components/LogItemRow";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
  itemNumber: number;
  totalItems: number;
};

export function SyncLogItem({ log, formatTimestamp, itemNumber, totalItems }: SyncLogItemProps) {
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-muted/20">
      <LogItemRow 
        log={log} 
        formatTimestamp={formatTimestamp} 
        itemNumber={itemNumber}
        totalItems={totalItems}
      />
    </div>
  );
}
