
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

export interface LogsContentProps {
  children?: React.ReactNode;
  syncLogs?: SyncLogEntry[];
  formatTimestamp?: (timestamp: string) => string;
}

export function LogsContent({ children }: LogsContentProps) {
  return (
    <div className="p-4 text-center">
      {children}
    </div>
  );
}
