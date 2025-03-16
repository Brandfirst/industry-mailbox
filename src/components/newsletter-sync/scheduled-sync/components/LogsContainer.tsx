
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Skeleton } from "@/components/ui/skeleton";

export interface LogsContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  syncLogs?: SyncLogEntry[];
  formatTimestamp?: (timestamp: string) => string;
}

export function LogsContainer({ children }: LogsContainerProps) {
  return (
    <div className="mt-2 border rounded-md overflow-hidden">
      {children}
    </div>
  );
}
