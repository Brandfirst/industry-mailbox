
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Skeleton } from "@/components/ui/skeleton";

export interface LogsContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  syncLogs?: SyncLogEntry[];
  formatTimestamp?: (timestamp: string) => string;
}

export function LogsContainer({ 
  children,
  isLoading,
  syncLogs,
  formatTimestamp
}: LogsContainerProps) {
  return (
    <div className="mt-2 border rounded-md overflow-hidden">
      <div className="w-full overflow-x-auto" style={{ maxWidth: '100%' }}>
        {children}
      </div>
    </div>
  );
}
