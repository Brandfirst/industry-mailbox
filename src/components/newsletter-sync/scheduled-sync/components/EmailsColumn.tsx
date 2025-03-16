
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleDetails } from "./ScheduleDetails";

interface EmailsColumnProps {
  log: SyncLogEntry;
  totalEmails: number;
}

export function EmailsColumn({ log, totalEmails }: EmailsColumnProps) {
  const scheduleDetails = log.status === 'scheduled' && log.details;
  
  return (
    <div className="flex items-center">
      {log.status !== 'scheduled' ? (
        <span>{totalEmails} email{totalEmails !== 1 ? 's' : ''}</span>
      ) : scheduleDetails && (
        <ScheduleDetails 
          scheduleType={log.details.schedule_type} 
          hour={log.details.hour} 
        />
      )}
    </div>
  );
}
