
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
    <div className="text-xs hover:bg-muted/20">
      <LogItemRow 
        log={log} 
        formatTimestamp={formatTimestamp} 
        itemNumber={itemNumber}
        totalItems={totalItems}
      />
    </div>
  );
}
