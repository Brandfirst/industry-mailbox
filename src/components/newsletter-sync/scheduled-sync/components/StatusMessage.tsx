
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

interface StatusMessageProps {
  log: SyncLogEntry;
}

export function StatusMessage({ log }: StatusMessageProps) {
  // Generate appropriate message based on status
  const getMessage = () => {
    if (log.error_message) return log.error_message;
    
    const totalEmails = log.message_count || 0;
    
    switch(log.status?.toLowerCase()) {
      case 'success':
        return totalEmails > 0 
          ? "Completed successfully" 
          : "Completed successfully (no new emails)";
      case 'scheduled':
        return "Sync scheduled";
      case 'processing':
        return "Sync in progress";
      case 'partial':
        return "Some emails failed to sync";
      case 'failed':
        if (!log.error_message) return "Sync failed";
        return log.error_message;
      default:
        return log.status || "";
    }
  };
  
  return (
    <span className="text-muted-foreground truncate">
      {getMessage()}
    </span>
  );
}
