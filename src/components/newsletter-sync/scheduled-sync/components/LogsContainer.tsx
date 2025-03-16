
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogsContent, LogsTableHeader } from ".";
import { Skeleton } from "@/components/ui/skeleton";

interface LogsContainerProps {
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  formatTimestamp: (timestamp: string) => string;
}

export function LogsContainer({ isLoading, syncLogs, formatTimestamp }: LogsContainerProps) {
  return (
    <div className="mt-2 border rounded-md overflow-hidden">
      <div className="bg-muted/40">
        <LogsTableHeader />
      </div>
      
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : syncLogs.length > 0 ? (
        <LogsContent
          syncLogs={syncLogs}
          formatTimestamp={formatTimestamp}
        />
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          No sync logs found for this account.
        </div>
      )}
    </div>
  );
}
