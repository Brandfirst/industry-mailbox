
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "../SyncLogItem";
import { LogsTableHeader } from "./LogsTableHeader";
import { LogsContent } from "./LogsContent";

interface LogEntriesDisplayProps {
  paginatedLogs: SyncLogEntry[];
  syncLogs: SyncLogEntry[];
  startIndex: number;
  totalEntriesText: string;
  formatTimestamp: (timestamp: string) => string;
}

export function LogEntriesDisplay({
  paginatedLogs,
  syncLogs,
  startIndex,
  totalEntriesText,
  formatTimestamp
}: LogEntriesDisplayProps) {
  return (
    <>
      <div className="text-xs text-muted-foreground p-2 font-medium">{totalEntriesText}</div>
      
      <LogsContent>
        <LogsTableHeader />
        {paginatedLogs.map((log, index) => {
          // Calculate display index for positioning
          const displayIndex = startIndex + index;
          
          // Use the original index to get the itemNumber
          const originalIndex = syncLogs.findIndex(item => item.id === log.id);
          const itemNumber = syncLogs.length - originalIndex;
          
          return (
            <SyncLogItem 
              key={log.id} 
              log={log} 
              formatTimestamp={formatTimestamp}
              itemNumber={itemNumber}
              totalItems={syncLogs.length}
            />
          );
        })}
      </LogsContent>
    </>
  );
}
