
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { StatusBadge } from "./StatusBadge";
import { SyncDetailsPopover } from "./SyncDetailsPopover";

interface StatusColumnProps {
  log: SyncLogEntry;
  isDetailsOpen: boolean;
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function StatusColumn({ 
  log, 
  isDetailsOpen, 
  setIsDetailsOpen 
}: StatusColumnProps) {
  return (
    <div className="flex items-center space-x-1">
      <StatusBadge status={log.status} />
      <SyncDetailsPopover 
        log={log} 
        isDetailsOpen={isDetailsOpen} 
        setIsDetailsOpen={setIsDetailsOpen} 
      />
    </div>
  );
}
